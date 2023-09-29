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
    }).join(' ')
};

export const TitleElement = (props: { url: string; updateRead: () => void; title: string, source?: string }) => {
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