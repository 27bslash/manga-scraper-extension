interface Manga {
    title: string,
    chapter: string,
    latest: string,
    link: string,
    domain: string,
    scansite: string,
    read: boolean,
    current_source: string,
    sources: { [key: string]: { url: string, latest: string, chapter: string, latest_link: string, time_updated: number } }
}
export default Manga