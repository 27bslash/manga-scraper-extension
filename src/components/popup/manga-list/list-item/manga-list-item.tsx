import { MouseEvent, useEffect, useState } from "react"
import { Grid, Checkbox, IconButton, ListItem, ListItemButton, ListItemIcon, Divider } from '@mui/material';
import OptionsMenu from "./options-menu";
import Manga from '../../../../types/manga';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Checkboxbutton from './../../buttons/checkboxButton';
import { GridItem } from "./gridItem";
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
    const [currentUrl, setCurrentUrl] = useState('');
    const [latestUrl, setLatestUrl] = useState('');
    const [currentSource, setCurrentSource] = useState(props.data.current_source);
    const [chapter, setChapter] = useState('')
    const [latest, setLatest] = useState(props.data.latest);
    const [timeAgo, setTimeAgo] = useState('')
    const [scansite, setScansite] = useState('')
    const [updateReadStatus, setUpdateReadStatus] = useState(false)
    useEffect(() => {
        setCurrentSource(props.data.current_source)


    }, [props.data.current_source])
    const getLatestLink = () => {
        const badSources = ['mangadex', 'reaperscans']
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            const mangaListItem: Manga = mangaList.filter((res: Manga) => res.title === props.data.title)[0]
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
            setCurrentUrl(mangaListItem.sources[currSource].url || props.data.link)
            if (checkUrl(link) && +mangaListItem.sources[currSource].latest - +chapterNum > 1 && !badSources.includes(currSource)) {
                setUrl(link.replace(mangaListItem.sources[currSource].latest, String(+chapterNum + 1)))
            } else {
                setUrl(mangaListItem.sources[currSource].url || props.data.link)
                // console.log('notam', title)
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
    }, [currentSource, props.data])
    const updateFu = () => {

    }
    // console.log('mlist current source', currentSource)

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
                    <Checkboxbutton checked={props.checked} handleToggle={props.handleToggle} idx={props.idx} title={props.data.title} />
                </Grid>
                <GridItem
                    title={props.data.title}
                    currentSource={currentSource}
                    latest={latest}
                    url={url}
                    updateReadStatus={updateReadStatus}
                    scansite={scansite}
                    currentUrl={currentUrl}
                    timeAgo={timeAgo}
                    chapter={chapter}
                    latestUrl={latestUrl}
                    sources={props.data.sources}
                    updateUrl={updateUrl}
                ></GridItem>
            </ListItem>
            <Divider light />
        </Grid >
    )
}
const checkUrlInManifest = (targetUrl: string) => {
    const manifest = chrome.runtime.getManifest()
    const contentScripts = manifest.content_scripts
    if (contentScripts) {
        const urlMatches = contentScripts[0].matches
        if (!urlMatches) {
            console.log('manifest err')
            return
        }
        const parsedUrls = urlMatches.map((x) => x.match(/\/\/.*(?=\/\*)/gm)![0])
        if (!parsedUrls) {
            return
        }
        const filteredUrls = parsedUrls.find((x: string) => targetUrl.includes(x))
        return filteredUrls
    }
}

export default MListItem