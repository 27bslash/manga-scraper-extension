import { Container, Grid } from "@mui/material"
import Manga, { AllManga } from "../../../types/manga";
import MasterBox from "../../master-box"
import Search from '../../search/search';
interface MangaListItemControlsProps {
    data?: Manga[],
    updated?: boolean,
    filterData: (data: Manga[], b: boolean) => void,
    showAll?: boolean,
    toggleAll?: (b: boolean) => void,
    allManga?: AllManga[],
    checked?: boolean,
    deleting?: boolean,
}

const MangaListItemControls = (props: MangaListItemControlsProps) => {
    return (
        <Container
            className='MangaListItemControls'
            disableGutters
            maxWidth={false}
            sx={{ backgroundColor: 'rgb(55, 65 ,127)', px: 0 }}
        >
            {props.data ? (
                <Grid container sx={{ width: '100%', px: 1.5, alignItems: 'center' }}>
                    <Grid item xs={7}>
                        <MasterBox toggleAll={props.toggleAll} checked={props.checked} />
                    </Grid>
                    <Grid item xs={5}>
                        <Search data={props.data} filterData={props.filterData} showAll={props.showAll} updated={props.updated} deleting={props.deleting} />
                    </Grid>
                </Grid>
            ) : (
                <Search filterData={props.filterData} allManga={props.allManga} updated={props.updated} />
            )}
        </Container>
    )
}
export default MangaListItemControls
