import { useState, useEffect } from 'react';
import Manga from './../../types/manga';
import { Button, IconButton, Snackbar, SnackbarContent } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

interface Test {
    any: string
}
const Overlay = () => {
    const [data, setData] = useState<any>(extractTitle(document.title))
    useEffect(() => {
        if (!(/\d+/.test(document.title))) {
            setTimeout(() => {
                const titleData = extractTitle(document.title)
                if (titleData.chapter) {
                    setData(titleData)
                }
            }, 5000)

        }
    }, [data])
    console.log(data, document.title)
    const [showPrompt, setShowPrompt] = useState(true)
    const getLatest = (source: {
        [x: string]: {
            url: string;
            latest: string;
            latest_link: string,
            time_updated: number;
        };
    }, key: string, chapter: string) => {
        let timeUpdated = Date.now() / 1000;
        if ('time_updated' in source[key]) {
            timeUpdated = source[key].time_updated
        }
        if (source[key]) {
            if ('latest' in source[key]) {
                return { 'url': data['link'], 'latest': source[key].latest, 'latest_link': source[key].latest_link || data['link'], time_updated: timeUpdated }
            }
        }
        return { 'url': data['link'], 'latest': chapter, 'latest_link': data['link'], time_updated: timeUpdated }
    }

    useEffect(() => {
        chrome.storage.local.get('manga-list', (result) => {
            result['manga-list'].forEach((x: Manga) => {
                if (x['title'] === data['title']) {
                    // update chapter
                    setShowPrompt(false)
                    if (data['chapter'] > x['chapter']) {
                        x['chapter'] = data['chapter']
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
    }, [])
    // eslint-disable-line react-hooks/exhaustive-deps
    const updatePrompt = (b: boolean) => {
        setShowPrompt(b)
    }
    const [open, setOpen] = useState(true);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const vertical = 'top';
    const horizontal = 'center';
    const action = (
        <>
            <Button sx={{ minWidth: '0px', height: '30px', fontSize: '16px' }} color="secondary" size="small" onClick={() => addNewManga(data, updatePrompt)}>
                OK
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon color='secondary' fontSize="small" />
            </IconButton>
        </>
    );
    return (
        +data['chapter'] > 10 && showPrompt ? (
            <div className="manga-overlay">
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
                                width: '90%',
                            }
                        }}
                    />
                </Snackbar>
            </div>
            // <div className='manga-overlay'>start reading ?
            //     <p onClick={() => addNewManga(data, updatePrompt)}>ok</p>
            //     <p onClick={() => setShowPrompt(false)} >cancel</p>
            // </div >
        ) : (
            <div></div>
        )
    )
}
const addNewManga = (data: any, updatePrompt: Function) => {
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
                list[i] = data
                break
            }
        }
        chrome.storage.local.set({ 'manga-list': list })
        chrome.runtime.sendMessage({ type: 'update', data: list }, (response) => {
            console.log('update', response)
        })
    })
    updatePrompt(false)
}
const extractTitle = (title: string) => {
    let chapterNum = "",
        scanSite = "";
    const scanRegex = /\w+\s?-?\w+$/gim;
    const chapterRegex = /(?<=episode\s|chapter\s|#|- )\d+\.?\d*/im;
    const t = /(?=::|-|r)(.*?)(?=:: chapter| chapter)/gim
    const r = /(?<= - ).*(?=-)/gim
    const cleanTitle = (title: string) => {
        let seriesTitle = title.replace(scanRegex, '').trim();
        seriesTitle = seriesTitle
            // remove chapter numbers
            .replace(chapterRegex, "")
            .replace(/chapter|episode/gi, "")
        // remove special characters
        const match = seriesTitle.match(/(?<= -|::).*(?=:: chapter| -)/gim)
        if (match) {
            seriesTitle = match[0]
        }
        seriesTitle = seriesTitle.replace(/:|\||\[#\]/gm, "")
            .replace(/[-–]+/g, ' ')
            .trim()
            .replace(/\s/g, '-')
            .toLowerCase()
        return seriesTitle
    }
    const scans = (title: string) => {
        if (title.toLowerCase().includes("episode")) {
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
    const seriesTitle = cleanTitle(title);
    return { title: seriesTitle, chapter: chapterNum, scansite: scanSite, domain: window.location.origin, link: window.location.href }
};


export default Overlay


