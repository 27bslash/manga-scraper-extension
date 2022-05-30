import { Container } from "@mui/material"
import Manga from "../../../types/manga";
import MasterBox from "../../master-box"
import Search from '../../search/search';
interface MangaListItemControlsProps {
    data?: Manga[],
    filterData: (data: Manga[]) => void,
    showAll?: boolean,
    toggleAll?: (b: boolean) => void,
    allManga?: Manga[]
}

const MangaListItemControls = (props: MangaListItemControlsProps) => {
    return (
        <Container className='terstclass' sx={{ display: 'flex', backgroundColor: 'rgb(55, 65 ,127)' }}>
            {props.data ? (
                <>
                    <MasterBox toggleAll={props.toggleAll} />
                    <Search data={props.data} filterData={props.filterData} showAll={props.showAll} />
                </>
            ) : (
                <Search filterData={props.filterData} allManga={props.allManga} />
            )}
        </Container>
    )
}
export default MangaListItemControls