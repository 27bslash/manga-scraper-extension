import { useEffect, useState } from "react"
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import OptionsMenu from "./options-menu";
import Manga from '../../../../types/manga';

interface MListItemProps {
    data: Manga
    showAll: boolean,
    idx: number,
    checked: number[],
    handleToggle: Function,
    handleDelete: (value: number) => void,
}
const MListItem = (props: MListItemProps) => {
    // popup list title , edit button current chapter, time ago seen, delete button
    const timeAgo = '1 day ago'
    // const [props.editing, setEditing] = useState(true)
    const title = capitalizeTitle(props.data.title)
    const [tempValue, setTempValue] = useState(title);
    const [url, setUrl] = useState('');
    const [latestUrl, setLatestUrl] = useState('');
    const [currentSource, setCurrentSource] = useState('any');
    const getLatestLink = () => {
        chrome.storage.sync.get('manga-list', (res) => {
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
        if (props.data.current_source) {
            console.log('in')
            setCurrentSource(props.data.current_source)
        }
    }, [])
    useEffect(() => {
        getLatestLink()
    }, [currentSource])
    // const [latestUrl, setLatestUrl] = useState(props.data.latestLink);
    const updateUrl = (key: string) => {
        console.log(props.data.sources, 'k', key, props.data.sources[key])
        setUrl(props.data.sources[key].url)
        setCurrentSource(key || 'any')
        setLatestUrl(props.data.sources[key].latest_link)
        chrome.storage.sync.get('manga-list', (res) => {
            try {
                res['manga-list'].forEach((element: Manga) => {
                    if (element.title === props.data.title) {
                        element.current_source = key
                    }
                })
                chrome.storage.sync.set({ 'manga-list': res['manga-list'] }, () => {
                    console.log('updated')
                })
            } catch (e) {
                console.log(e, 'set current source')
            }
        }
        )
    }
    let edit = false

    // console.log('mlist current source', currentSource)
    return (
        <Grid className="list-item" key={props.idx} sx={{ borderBottom: 1, borderColor: 'divider' }} container rowSpacing={0} columnSpacing={{ md: 4 }}>
            <ListItem
                disableGutters
                secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                    </IconButton>
                }
                disablePadding={true}

            >
                <Grid item xs={2} sm={2} md={2}>
                    <ListItemButton role={undefined} onClick={props.handleToggle(props.idx)}
                        sx={{
                            ml: 1,
                            "&.MuiListItemButton-root:hover": {
                                bgcolor: "transparent"
                            },
                            bgColor: props.checked.includes(props.idx) ? "primary.light" : "transparent"
                        }}
                        disableRipple
                        dense>
                        <ListItemIcon>
                            <Checkbox
                                edge="end"
                                checked={props.checked.indexOf(props.idx) !== -1}
                                tabIndex={-1}
                                disableRipple={true}
                                // inputProps={{ 'aria-labelledby': labelId }}
                                sx={{
                                    width: 20,
                                    padding: 0
                                }}
                            />
                        </ListItemIcon>
                    </ListItemButton>

                </Grid>
                <Grid item xs={5} sm={5} md={5}>
                    <a href={url} rel='noreferrer' target='_blank'>
                        <p className="series-title">{title}</p>
                    </a>
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
                    <p className="text-small">{timeAgo}</p>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                    <OptionsMenu currentSource={currentSource} sources={props.data.sources} updateUrl={updateUrl} />
                    {/* <p className='list-item-text' >{props.data['scansite']} </p> */}
                </Grid>
            </ListItem>
            <Divider variant='middle' />
        </Grid >
    )
}
const updatePopup = (updateList: Function, idx: number) => {
    console.log('clikced')
    updateList(idx)
}
const capitalizeTitle = (title: string) => {
    // capitalize first letter of each word
    return title.split('-').map(word => {
        return word !== 'of' && word !== 'a' ? word.charAt(0).toUpperCase() + word.slice(1) : word
    }
    ).join(' ')
}

export default MListItem