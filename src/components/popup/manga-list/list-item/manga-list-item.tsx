import { useEffect, useState } from "react"
import { Grid, Checkbox, IconButton, ListItem, ListItemButton, ListItemIcon, Divider } from '@mui/material';
import OptionsMenu from "./options-menu";
import Manga from '../../../../types/manga';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Checkboxbutton from './../../buttons/checkboxButton';
TimeAgo.addDefaultLocale(en)

interface MListItemProps {
    data: Manga
    showAll: boolean,
    idx: number,
    checked: any,
    handleToggle: Function,
    handleDelete: (value: number) => void,
}
const MListItem = (props: MListItemProps) => {
    // popup list title , edit button current chapter, time ago seen, delete button
    // const [props.editing, setEditing] = useState(true)
    const title = capitalizeTitle(props.data.title)
    const [url, setUrl] = useState('');
    const [latestUrl, setLatestUrl] = useState('');
    const [currentSource, setCurrentSource] = useState(props.data.current_source);
    const getLatestLink = () => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            mangaList.forEach((res: Manga) => {
                if (res.title === props.data.title) {
                    const link = res.sources[currentSource].latest_link
                    setLatestUrl(link)
                    setUrl(res.sources[currentSource].url)
                }
            }
            )
        })
    }

    useEffect(() => {
        getLatestLink()
        if (props.data.current_source) {
            setCurrentSource(props.data.current_source)
            // console.log('in', props.data, '\n', currentSource, props.data.current_source)
        }
    }, [title])
    // const [latestUrl, setLatestUrl] = useState(props.data.latestLink);
    const timeAgo = new TimeAgo('en-US')
    const currentTime = new Date().getTime() / 1000
    let timeago: any = '0'
    try {
        const timeDelta = currentTime - props.data['sources'][props.data.current_source].time_updated
        timeago = timeAgo.format(Date.now() - timeDelta * 1000)
    } catch {
        console.log('%c error', 'color: red', props.data, currentSource)
    }

    const updateUrl = (key: string) => {
        console.log(props.data.sources, 'k', key, props.data.sources[key])
        setUrl(props.data.sources[key].url)
        setCurrentSource(key || 'any')
        setLatestUrl(props.data.sources[key].latest_link)
        chrome.storage.local.get('manga-list', (res) => {
            try {
                res['manga-list'].forEach((element: Manga) => {
                    if (element.title === props.data.title) {
                        element.current_source = key
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
                    <Checkboxbutton checked={props.checked} handleToggle={props.handleToggle} idx={props.idx} title={title} />
                </Grid>
                <Grid item xs={5} sm={5} md={5}>
                    {+props.data['latest'] - +props.data['chapter'] <= 1 ? (
                        <a href={latestUrl} rel='noreferrer' target='_blank'>
                            <p className="series-title">{capitalizeTitle(title)}</p>
                        </a>
                    ) : (
                        <a href={url} rel='noreferrer' target='_blank'>
                            <p className="series-title">{capitalizeTitle(title)}</p>
                        </a>
                    )}
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                    <p className='list-item-text' id='chapter-text' >
                        <a href={url} rel='noreferrer' target='_blank'>
                            {props.data['chapter']}
                        </a>
                        /
                        <a href={latestUrl} rel='noreferrer' target='_blank'>
                            {props.data['latest'] || 100}
                        </a>
                    </p>
                    <p className="text-small">{timeago}</p>
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


export default MListItem