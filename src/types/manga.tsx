interface Manga {
    title: string,
    chapter: string,
    latest: string,
    link: string,
    domain: string,
    scansite: string,
    read: boolean,
    current_source: string,
    sources: { [key: string]: { url: string, latest: string, latest_link: string } }
}
export default Manga