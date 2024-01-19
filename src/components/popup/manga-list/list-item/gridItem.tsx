import { ListItem, IconButton, Grid, Divider } from "@mui/material"
import Checkboxbutton from "../../buttons/checkboxButton"
import OptionsMenu from "./options-menu"
import { TitleElement } from "./seriesTItle"
import Manga from "../../../../types/manga"
interface gridItemProps {
    title: string,
    currentSource: string,
    latest: string,
    url: string,
    latestUrl: string
    scansite: string
    updateReadStatus: boolean,
    chapter: string,
    timeAgo: string
    currentUrl: string
    sources: Manga['sources']
    updateUrl: (key: string) => void
}
export const GridItem = (props: gridItemProps) => {
    const updateRead = () => {
        chrome.storage.local.get('manga-list', (res) => {
            res['manga-list'].forEach((element: Manga) => {
                if (element.title === props.title) {
                    element.read = true
                    element.chapter = element.latest
                    element.sources[props.currentSource]['chapter'] = element.sources[props.currentSource]['latest']
                    element.sources[props.currentSource]['url'] = element.sources[props.currentSource]['latest_link']
                }
            })
            chrome.storage.local.set({ 'manga-list': res['manga-list'] }, () => {
                console.log('updated')
            })
            chrome.runtime.sendMessage({ type: 'update', data: res['manga-list'] })
            chrome.runtime.sendMessage({ type: 'linkClicked' })
        })
    }
    return (
        <>
            <Grid item xs={5} sm={5} md={5}>
                {+props.latest - +props.chapter <= 1 || props.updateReadStatus ? (
                    <TitleElement url={props.latestUrl} updateRead={updateRead} title={props.title} />
                ) : (
                    <TitleElement url={props.url} updateRead={updateRead} title={props.title} source={props.scansite} />
                )}
            </Grid>
            <Grid item xs={2} sm={2} md={2}>
                <p className='list-item-text' id='chapter-text' >
                    <a href={props.currentUrl} rel='noreferrer' target='_blank'>
                        {props.chapter}
                    </a>
                    /
                    <a href={props.latestUrl} rel='noreferrer' target='_blank' onClick={() => updateRead()}>
                        {props.latest || 100}
                    </a>
                </p>
                <p className="text-small">{props.timeAgo}</p>
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
                <OptionsMenu currentSource={props.currentSource} sources={props.sources} updateUrl={props.updateUrl} />
            </Grid>
        </>
    )
}