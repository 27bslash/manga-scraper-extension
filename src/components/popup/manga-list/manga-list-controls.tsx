import { Container } from "@mui/material"
import Manga from "../../../types/manga";
import MasterBox from "../../master-box"
import Search from '../../search/search';
interface MangaListItemControlsProps {
    data?: Manga[],
    updated?: boolean,
    filterData: (data: Manga[], b: boolean) => void,
    showAll?: boolean,
    toggleAll?: (b: boolean) => void,
    allManga?: Manga[],
    checked?: boolean,
    deleting?: boolean,
}

const MangaListItemControls = (props: MangaListItemControlsProps) => {
    return (
        <Container className='MangaListItemControls' sx={{ display: 'flex', backgroundColor: 'rgb(55, 65 ,127)' }}>
            {props.data ? (
                <>
                    <MasterBox toggleAll={props.toggleAll} checked={props.checked} />
                    <Search data={props.data} filterData={props.filterData} showAll={props.showAll} updated={props.updated} deleting={props.deleting} />
                </>
            ) : (
                <Search filterData={props.filterData} allManga={props.allManga} updated={props.updated} />
            )}
        </Container>
    )
}
export default MangaListItemControls