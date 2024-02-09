export const extractTitle = (title: string) => {
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