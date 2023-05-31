import { MouseEvent, useEffect, useState } from "react"
import { Grid, Checkbox, IconButton, ListItem, ListItemButton, ListItemIcon, Divider } from '@mui/material';
import OptionsMenu from "./options-menu";
import Manga from '../../../../types/manga';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Checkboxbutton from './../../buttons/checkboxButton';
TimeAgo.addDefaultLocale(en)

interface MListItemProps {
    data: Manga
    idx: number,
    checked: any,
    handleToggle: Function,
}
const MListItem = (props: MListItemProps) => {
    // const [props.editing, setEditing] = useState(true)
    props.data.title = props.data.title.replace(/\s/g, '-').toLowerCase()
    const title = capitalizeTitle(props.data.title)
    const [url, setUrl] = useState('');
    const [latestUrl, setLatestUrl] = useState('');
    const [currentSource, setCurrentSource] = useState(props.data.current_source);
    const [chapter, setChapter] = useState('')
    const [latest, setLatest] = useState(props.data.latest);
    const [timeAgo, setTimeAgo] = useState('')
    const [scansite, setScansite] = useState('')
    useEffect(() => {
        setCurrentSource(props.data.current_source)


    }, [props.data.current_source])
    const getLatestLink = () => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            const mangaListItem: Manga = mangaList.filter((res: Manga) => res.title === props.data.title)[0]
            console.log(mangaListItem)
            // console.log('latestlink', props.data.title)
            const currSource = mangaListItem.current_source
            if (currSource !== currentSource) {
                // console.log(currSource, currentSource, title)
            }
            const link = mangaListItem.sources[currSource].latest_link
            const chapterNum = mangaListItem.sources[currSource].chapter || props.data.chapter
            setChapter(chapterNum)
            setLatestUrl(link)
            setLatest(mangaListItem.sources[currSource].latest)
            setScansite(mangaListItem['scansite'])
            if (+mangaListItem.sources[currSource].latest - +chapterNum > 1 && currentSource !== 'mangadex') {
                setUrl(link.replace(latest, String(+chapterNum + 1)))
            } else {
                // console.log('notam', title)
                setUrl(mangaListItem.sources[currSource].url || props.data.link)
            }
        }
        )
    }
    useEffect(() => {
        getLatestLink()
    }, [props.data, currentSource])
    // const [latestUrl, setLatestUrl] = useState(props.data.latestLink);

    const updateUrl = (key: string) => {
        // console.log(props.data.title, 'k', key, props.data.sources[key])
        chrome.storage.local.get('manga-list', (res) => {
            try {
                res['manga-list'].forEach((element: Manga) => {
                    if (element.title === props.data.title) {
                        // console.log('updated', props.data.title)
                        element.current_source = key
                        setCurrentSource(key)
                    }
                })
                chrome.storage.local.set({ 'manga-list': res['manga-list'] }, () => {
                    console.log('updated')
                })
                chrome.runtime.sendMessage({ type: 'update', data: res['manga-list'] })
            } catch (e) {
                console.log(e, 'set current source')
            }
        }
        )
    }
    useEffect(() => {
        try {
            setUrl(props.data.sources[currentSource].url)
            setLatestUrl(props.data.sources[currentSource].latest_link)
            setLatest(props.data.sources[currentSource].latest)
            const timeAgo = new TimeAgo('en-US')
            const currentTime = new Date().getTime() / 1000
            let timeago: any = '0'
            const timeDelta = currentTime - props.data['sources'][currentSource].time_updated
            timeago = timeAgo.format(Date.now() - timeDelta * 1000)
            setTimeAgo(timeago)
        } catch {
            console.log('%c error', 'color: red', props.data, currentSource)
        }
    }, [currentSource])
    const updateFu = () => {

    }
    // console.log('mlist current source', currentSource)
    const updateRead = () => {
        chrome.storage.local.get('manga-list', (res) => {
            res['manga-list'].forEach((element: Manga) => {
                if (element.title === props.data.title) {
                    element.read = true
                    element.chapter = element.latest
                    element.sources[currentSource]['chapter'] = element.sources[currentSource]['latest']
                }
            })
            chrome.storage.local.set({ 'manga-list': res['manga-list'] }, () => {
                console.log('updated')
            })
            chrome.runtime.sendMessage({ type: 'update', data: res['manga-list'] })
        })
    }
    return (
        <Grid className="manga-updater-list-item" key={props.idx} sx={{ borderBottom: 1, borderColor: 'primary.main' }} container rowSpacing={0} columnSpacing={{ md: 4 }}>
            <ListItem
                disableGutters
                secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                    </IconButton>
                }
                disablePadding={true}
            >
                <Grid item xs={2} sm={2} md={2}>
                    <Checkboxbutton checked={props.checked} handleToggle={props.handleToggle} idx={props.idx} title={title} />
                </Grid>
                <Grid item xs={5} sm={5} md={5}>
                    {+latest - +props.data['chapter'] <= 1 ? (
                        <TitleElement url={latestUrl} updateRead={updateRead} title={title} />
                    ) : (
                        <TitleElement url={url} updateRead={updateRead} title={title} source={scansite} />
                    )}
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                    <p className='list-item-text' id='chapter-text' >
                        <a href={url} rel='noreferrer' target='_blank'>
                            {chapter}
                        </a>
                        /
                        <a href={latestUrl} rel='noreferrer' target='_blank' onClick={() => updateRead()}>
                            {latest || 100}
                        </a>
                    </p>
                    <p className="text-small">{timeAgo}</p>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                    <OptionsMenu currentSource={currentSource} sources={props.data.sources} updateUrl={updateUrl} />
                </Grid>
            </ListItem>
            <Divider light />
        </Grid >
    )
}

const capitalizeTitle = (title: string) => {
    // capitalize first letter of each word
    let split = ' '
    if (title.includes('-')) {
        split = '-'
    }
    return title.split(split).map((word: string, i: number) => {
        if (i === 0 && !(/^(.)\1+$/.test(word))) {
            return word.charAt(0).toUpperCase() + word.slice(1)
        }
        else if (/^(.)\1+$/.test(word)) {
            // if word is all the same character
            return word.toUpperCase()
        }
        else if (word !== 'of' && word !== 'a') {
            return word.charAt(0).toUpperCase() + word.slice(1)
        }
        else {
            return word
        }
    })
        .join(' ')
};

const TitleElement = (props: { url: string; updateRead: () => void; title: string, source?: string }) => {
    const sources = [
        "asurascans",
        "slayerscans",
        "mangaplus",
        "mangasushi",
        "kouhai",
        "realmscans",
        "comikey",
        "danke.moe",
        "kireicake",
        "setsuscans",
        "luminousscans",
        "reaperscans",
        "mangadex",
        "dynasty-scans",
        "guya.moe",
        "flamescans",
        "viewer.heros-web",
        "gdstmp.site",
        "webtoons",
        "mm-scans",
        "leviatanscans",
        "onepiecechapters",
        "alpha-scans",
        "sensescans",
        "cosmicscans"
    ]

    const handleClick = () => {
        if (!props.source || !sources.includes(props.source)) {
            props.updateRead()
        }
    }
    return (
        <a href={props.url} rel='noreferrer' target='_blank' onClick={() => handleClick()}>
            <p className="series-title">{capitalizeTitle(props.title)}</p>
        </a>
    )
}
export default MListItem