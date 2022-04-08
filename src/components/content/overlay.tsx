import { SetStateAction, useState } from 'react';
import Manga from './../../types/manga';
import { useEffect } from 'react';

const Overlay = () => {
    const data = extractTitle(document.title)
    console.log('data', data)
    // listenForMessages();
    // console.log('app')
    const [showPrompt, setShowPrompt] = useState(true)
    const [id, setId] = useState('')
    chrome.storage.sync.get("id", (result) => {
        setId(result.id)
    });
    useEffect(() => {
        chrome.storage.sync.get('manga-list', (result) => {
            result['manga-list'].forEach((x: Manga) => {
                if (x['title'] === data['title']) {
                    // update chapter
                    x['link'] = window.location.href
                    x['domain'] = window.location.origin
                    x['read'] = false
                    x['chapter'] = data['chapter']
                    if (x['latest'] === data['chapter']) {
                        x['read'] = true
                    }
                    setShowPrompt(false)
                    addNewManga(x, updatePrompt)
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
            <div className='manga-overlay'>{data['title']}, {data['chapter']},{id} start watching?
                <p onClick={() => addNewManga(data, updatePrompt)}>ok</p>
                <p onClick={() => setShowPrompt(false)} >cancel</p>
            </div >
        ) : (
            <div></div>
        )
    )
}
const addNewManga = (data: object, updatePrompt: Function) => {
    // console.log(url)
    chrome.runtime.sendMessage({ type: 'update', data: data }, (response) => {
        console.log('add new', response)
    })
    updatePrompt(false)
}
const extractTitle = (title: string) => {
    let chapterNum = "",
        seriesTitle = "",
        scanSite = "";

    const scans = (title: string) => {
        const scanRegex = /\w+\s?\w+$/gim;
        seriesTitle = title.replace(scanRegex, "");
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
        const chapterRegex = /(?<=episode\s|chapter\s|#)\d+\.?\d*/im;
        // get number after chapter then remove leading zeros
        const match = title.match(chapterRegex);
        if (match) {
            console.log('match', match)
            chapterNum = match[0]
        }
        seriesTitle = seriesTitle
            // remove chapter numbers
            .replace(chapterRegex, "")
            .replace(/chapter|episode/gi, "")
            // remove special characters
            .replace(/:|-|-|\||\[#\]/gm, "")
            .trim()
            .replace(/\s/g, '-')
            .toLowerCase()
        if (chapterNum) {
            chapterNum = chapterNum !== '0' ? chapterNum.replace(/^0+/, "") : '0';
        }
    };
    scans(title);
    getChapterNum(title);
    return { title: seriesTitle, chapter: chapterNum, scansite: scanSite };
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
// I made my own version of dota2protracker:
// https://dota2-item-tracker.herokuapp.com/
