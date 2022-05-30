import { Grid, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import Manga from './../../types/manga';

interface SearchResultsProps {
    data: Manga[],
    addNewManga: (manga: Manga) => void,
}

const SearchResults = (props: SearchResultsProps) => {
    return (

        <List dense sx={{ width: '100%', padding: 0 }}>
            {props.data.map((value, key: number) => {
                return (
                    <>
                        <Grid className="manga-updater-list-item searchResult" key={key} sx={{ borderBottom: 1, borderColor: 'primary.main', padding: '5px' }} container rowSpacing={0} columnSpacing={{ md: 2 }}
                            onClick={() => props.addNewManga(value)}>
                            <ListItem
                                disablePadding
                                secondaryAction={<IconButton edge="end" aria-label="comments">
                                </IconButton>}
                                sx={{ padding: '4px 4px 0px 4px' }}

                            ></ListItem>
                            <Grid item xs={9} sm={9} md={9} >
                                <ListItemText sx={{ textAlign: 'left', textTransform: 'capitalize' }} primary={value.title} />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3}>
                                <ListItemText primary={value.latest} />
                            </Grid>
                        </Grid >
                    </>
                );
            })}
        </List >
    )
}
export default SearchResults