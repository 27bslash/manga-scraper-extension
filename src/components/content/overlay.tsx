import { SetStateAction, useState } from 'react';
import Manga from './../../types/manga';
import { useEffect } from 'react';
interface Test {
    any: string
}
const Overlay = () => {
    const data = extractTitle(document.title)
    // listenForMessages();
    // console.log('app')
    const [showPrompt, setShowPrompt] = useState(true)
    const [id, setId] = useState('')
    chrome.storage.sync.get("id", (result) => {
        setId(result.id)
    });
    const getLatest = (source: {
        [x: string]: {
            url: string;
            latest: string;
            latest_link: string;
        };
    }, key: string, chapter: string) => {
        if (source[key]) {
            if ('latest' in source[key]) {
                return { 'url': data['link'], 'latest': source[key].latest, 'latest_link': source[key].latest_link }
            }
        }
        return { 'url': data['link'], 'latest': chapter, 'latest_link': data['link'] }
    }

    useEffect(() => {
        chrome.storage.sync.get('manga-list', (result) => {
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
                        console.log('updated series info:', x)
                        addNewManga(x, updatePrompt)
                    }
                }
            })
        })
    }, [])
    // eslint-disable-line react-hooks/exhaustive-deps
    const updatePrompt = (b: boolean) => {
        setShowPrompt(b)
    }
    return (
        +data['chapter'] > 10 && showPrompt ? (
            <div className='manga-overlay'>start reading ?
                <p onClick={() => addNewManga(data, updatePrompt)}>ok</p>
                <p onClick={() => setShowPrompt(false)} >cancel</p>
            </div >
        ) : (
            <div></div>
        )
    )
}
const addNewManga = (data: any, updatePrompt: Function) => {
    // console.log(url)
    chrome.runtime.sendMessage({ type: 'update', data: data }, (response) => {
        console.log('add new', response)

    })
    chrome.storage.sync.get('manga-list', (result) => {
        const list = result['manga-list']
        list.forEach((element: Manga) => {
            if (element.title === data.title) {
                element = data
            }
        });
        chrome.storage.sync.set({ 'manga-list': list })
    })
    updatePrompt(false)
}
const extractTitle = (title: string) => {
    let chapterNum = "",
        scanSite = "";
    const scanRegex = /\w+\s?\w+$/gim;
    const chapterRegex = /(?<=episode\s|chapter\s|#)\d+\.?\d*/im;
    const cleanTitle = (title: string) => {
        let seriesTitle = title.replace(scanRegex, '').trim();
        seriesTitle = seriesTitle
            // remove chapter numbers
            .replace(chapterRegex, "")
            .replace(/chapter|episode/gi, "")
            // remove special characters
            .replace(/:|-|-|\||\[#\]/gm, "")
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
                scanSite = match[0].replace(' ', '').toLowerCase()
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
    return { title: seriesTitle, chapter: chapterNum, scansite: scanSite, domain: window.location.origin, link: window.location.href, sources: [{ scanSite: window.location.href }] }
};

const listenForMessages = () => {
    console.log('listen messga')
    chrome.runtime.onMessage.addListener((message, sender) => {
        const { type, data } = message;
        return true
        // return true;
    });
};
export default Overlay


