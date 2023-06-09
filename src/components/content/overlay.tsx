import { useState, useEffect } from 'react';
import Manga from './../../types/manga';
import { IconButton, Snackbar, SnackbarContent } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const Overlay = (props: { title: string }) => {
    const [data, setData] = useState<any>(extractTitle(document.title))
    useEffect(() => {
        if (props.title && !(/\d+/.test(document.title))) {
            const titleData = extractTitle(document.title)
            setData(titleData)
        }
        if (!(/\d+/.test(document.title)) && !data.domain.includes('chrome-extension')) {
            const interval = setInterval(() => {
                const titleData = extractTitle(document.title)
                setData(titleData)
                if (titleData.chapter) {
                    console.log(titleData, 'title: ', document.title)
                    clearInterval(interval)
                }
            }, 1000);
        }
    }, [props.title])
    const [showPrompt, setShowPrompt] = useState(true)
    const [confirmationPrompt, setConfirmationPrompt] = useState(false)
    const getLatest = (source: {
        [x: string]: {
            url: string;
            latest: string;
            latest_link: string,
            time_updated: number;
        };
    }, key: string, chapter: string) => {
        let timeUpdated = Date.now() / 1000;
        console.log(source[key], source, key)
        if (source[key] && 'time_updated' in source[key]) {
            timeUpdated = source[key].time_updated
        }
        if (source[key]) {
            if ('latest' in source[key]) {
                return { 'url': data['link'], 'latest': source[key].latest, 'chapter': chapter, 'latest_link': source[key].latest_link || data['link'], time_updated: timeUpdated }
            }
        }
        return { 'url': data['link'], 'latest': chapter, 'chapter': chapter, 'latest_link': data['link'], time_updated: timeUpdated }
    }

    useEffect(() => {
        chrome.storage.local.get('manga-list', (result) => {
            result['manga-list'].forEach((x: Manga) => {
                // console.log(data.title, x['title'])
                if (titleSimilarity(data.title, x)) {
                    // update chapter
                    console.log('title is similar', x['title'])
                    setShowPrompt(false)
                    if (data['chapter'] >= x['chapter']) {
                        console.log('update chapter')
                        x['chapter'] = data['chapter']
                        x['scansite'] = data['scansite']
                        x['link'] = data['link']
                        if (!('sources' in x)) {
                            x['sources'] = {}
                        }
                        x['sources'][data['scansite']] = getLatest(x['sources'], data['scansite'], data['chapter'])
                        x['sources']['any'] = x['sources'][data['scansite']]
                        x['read'] = +x['chapter'] >= +x['latest']
                        console.log('updated series info:', x)
                        updateManga(x, updatePrompt)
                    }
                }
            })
        })
    }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

    const updatePrompt = (b: boolean) => {
        setShowPrompt(b)
        setConfirmationPrompt(!b)
    }
    const [open, setOpen] = useState(true);
    const addToBlackList = (title: string) => {
        console.log('add to black list: ', title)
        chrome.storage.local.get('blacklist', (result) => {
            if (!result['blacklist']) {
                result['blacklist'] = []
            }
            const blacklist: [{ 'title': string, 'chapter': string }] = result['blacklist']
            const filtered = blacklist.filter((x: any) =>
                x['title'] === data['title']
            );
            if (filtered.length === 0) {
                blacklist.push({ title: title, chapter: data['chapter'] })
            }
            chrome.storage.local.set({ 'blacklist': blacklist }, () => {
                setOpen(false)
            })
        })
    }
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (event) {
            let target = event.target as HTMLElement
            if (target.tagName === 'path') {
                const parent = target.parentElement
                if (parent) {
                    target = parent
                }
            }
            if (target.tagName === 'svg') {
                if (target.classList.contains('close-icon-mu')) {
                    setOpen(false)
                    addToBlackList(data['title'])
                    return
                }
                else if (target.classList.contains('add-icon-mu')) {
                    setConfirmationPrompt(true)
                    setOpen(false)
                    return
                }
            }
            if (reason === 'clickaway') {
                setOpen(false)
                console.log('reason', reason)
                return
            }
        }
        if (reason === 'timeout' || reason === 'clickaway') {
            console.log('close', reason)
            setOpen(false)
            addNewManga(data, updatePrompt)
            setConfirmationPrompt(false)
            return
        }
        else {
            setConfirmationPrompt(false)
            setOpen(false)
            return
        }

    };

    const vertical = 'top';
    const horizontal = 'center';
    const action = (
        <>
            <IconButton
                aria-label="open"
                onClick={handleClose}

            >
                <DoneIcon color='secondary' fontSize='medium' className='add-icon-mu' />
            </IconButton>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon color='secondary' fontSize="medium" className='close-icon-mu' />
            </IconButton>
        </>
    );
    const checkOpen = () => {
        chrome.storage.local.get('blacklist', (result) => {
            const blacklist = result['blacklist']
            const filtered = blacklist.filter((x: any) => x['title'] === data['title'] && data['chapter'] - 5 <= +x['chapter']);
            if (filtered && filtered.length > 0) {
                setOpen(false)
                return false
            } else {
                return true
            }
        }
        )
        return true
    }
    const handleClickAway = () => {
        addNewManga(data, updatePrompt)
        setConfirmationPrompt(false)
    }

    return (
        <div className="manga-overlay">

            {+data['chapter'] > 10 && showPrompt && checkOpen() && (
                <Snackbar
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical, horizontal }}
                >
                    <SnackbarContent
                        message="Start Reading? "
                        action={action}
                        sx={{
                            display: 'grid', minWidth: '100px !important', textAlign: 'center',
                            ".MuiSnackbarContent-action": {
                                paddingLeft: '0',
                                display: 'block',
                                marginLeft: '0',
                                marginRight: '0',
                            }
                        }}
                    />
                </Snackbar>
            )}
            {confirmationPrompt && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        open={!open}
                        onClose={handleClose}
                        message={data['title'].replace(/-/g, ' ') + ' ' + data['chapter']}
                        autoHideDuration={3000}
                        sx={{ textTransform: 'capitalize', color: 'secondary !important' }}
                        action={
                            <>
                                <p onClick={handleClose} className='undo-button-mu'>
                                    undo
                                </p>
                            </>}
                    />
                </ClickAwayListener>
            )}
        </div>
    )
}
const titleSimilarity = (title: string, manga: Manga) => {
    const titleWords = title.split('-')
    const mangaWords = manga['title'].split('-')
    const len = titleWords.length > mangaWords.length ? titleWords.length : mangaWords.length
    let similarity = 0
    titleWords.forEach((x) => {
        if (mangaWords.includes(x)) {
            similarity++
        }
    })
    // console.log('similarity: ', similarity / len, title)
    return similarity / len >= 0.75
}
const addNewManga = (data: any, updatePrompt: Function) => {
    chrome.storage.local.get('blacklist', (result) => {
        const blacklist = result['blacklist']
        const filtered = blacklist.filter((x: any) => x['title'] !== data['title']);
        chrome.storage.local.set({ 'blacklist': filtered || [] })
    })
    chrome.runtime.sendMessage({
        type: 'insert', data: data
    }, (response) => {
        console.log('response', response)
    }
    )
    updatePrompt(false)

}

const updateManga = (data: any, updatePrompt: Function) => {
    // console.log(url)
    chrome.storage.local.get('manga-list', (result) => {
        let list = result['manga-list']
        for (let i = 0; i < list.length; i++) {
            if (list[i]['title'] === data['title']) {
                console.log('in db', list[i]['title'])
                const currentSource = list[i]['current_source']
                list[i] = data
                list[i]['sources'][currentSource].url = data['link']
                list[i]['sources'][currentSource].chapter = data['chapter']
                console.log('list', list)
                break
            }
        }
        chrome.storage.local.set({ 'manga-list': list })
        chrome.runtime.sendMessage({ type: 'update', data: list }, (response) => {
            console.log('updated')
        })
    })
    updatePrompt(false)
}
const extractTitle = (title: string) => {
    let chapterNum = "",
        scanSite = "";
    const scanRegex = /\w+\s?-?\w+$/gim;
    const chapterRegex = /(?<=episode\s|chapter\s|#|- |ep. )\d+\.?\d*/im;
    const cleanTitle = (title: string) => {
        let seriesTitle = title.replace(/’/g, "'").trim()
        seriesTitle = seriesTitle.replace(/manhwa/gi, '')
        seriesTitle = seriesTitle.replace(scanRegex, '').trim();
        seriesTitle = seriesTitle
            // remove chapter numbers
            .replace(chapterRegex, "")
            .replace(/chapter|episode/gi, "")
        // remove special character
        const regex = /^\d.*(?<=[-|:~] )(.*)(?=\W)/gm;
        const match = regex.exec(seriesTitle);
        if (match) {
            seriesTitle = match[1];
        }

        seriesTitle = seriesTitle.replace(/:|\||\[#\]/gm, "");
        seriesTitle = seriesTitle.replace(/\s?[-–]\s?/g, " ");
        seriesTitle = seriesTitle.trim().replace(/\s\s+.*/g, "");
        seriesTitle = seriesTitle.trim().replace(/\s/g, "-").toLowerCase();
        // if (window.location.href.includes('webtoons')) {
        //     const match = props.title.match(/\|.*/gim)
        //     if (match) {
        //         return match[0].replace('|', '').trim().toLowerCase().replace(' ', '-')
        //     }
        // }
        return seriesTitle
    }
    const scans = (title: string) => {
        if (window.location.href.includes('webtoons')) {
            // webttons edge case
            scanSite = "webtoons";
        } else {
            const match = title.match(scanRegex)
            if (match) {
                scanSite = match[0].replace(' ', '').replace('-', '').toLowerCase()
            }
        }
    };
    const getChapterNum = (title: string) => {
        // get number after chapter then remove leading zeros
        const match = title.match(chapterRegex);
        if (match) {
            chapterNum = match[0]
        }

        if (chapterNum) {
            chapterNum = chapterNum !== '0' ? chapterNum.replace(/^0+/, "") : '0';
        }
    };
    scans(title);
    getChapterNum(title);
    let seriesTitle = cleanTitle(title);
    if (window.location.href.includes('webtoons')) {
        const meta = document.head.querySelector('meta[name="keywords"]')
        if (meta) {
            const cont = meta.getAttribute('content')
            if (cont) {
                const split = cont.split(',')
                seriesTitle = split[0].trim().replace(/\s/g, "-").toLowerCase()
                chapterNum = split[1].trim()
                scanSite = 'webtoons'
            }

        }
    }
    return { title: seriesTitle, chapter: chapterNum, scansite: scanSite, domain: window.location.origin, link: window.location.href }
};


export default Overlay


