import { useState } from "react"
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import OptionsMenu from "./options-menu";


const MListItem = (props: any) => {
    // popup list title , edit button current chapter, time ago seen, delete button
    const timeAgo = '1 day ago'
    // const [props.editing, setEditing] = useState(true)
    const [title, setTitle] = useState(capitalizeTitle(props.value.title))
    const [tempValue, setTempValue] = useState(title);
    const handleSubmit = (event: any) => {
        event.preventDefault()
        setTitle(tempValue)
        props.resetState()
    }

    let edit = props.checked.length === 1 && props.checked[0] === props.idx && props.editing
    const url = props.value.link || `https://www.asurascans.com/return-of-the-disaster-class-hero-chapter-1-1/`
    return (
        <Grid className="list-item" key={props.idx} sx={{ borderBottom: 1, borderColor: 'divider' }} container rowSpacing={0} columnSpacing={{ md: 4 }}>
            <ListItem

                secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                    </IconButton>
                }
                disablePadding={true}

            >
                <Grid item xs={2} sm={2} md={2}>
                    {props.showAll &&
                        <ListItemButton role={undefined} onClick={props.handleToggle(props.idx)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="end"
                                    checked={props.checked.indexOf(props.idx) !== -1}
                                    tabIndex={-1}
                                    disableRipple={true}
                                    // inputProps={{ 'aria-labelledby': labelId }}
                                    sx={{
                                        width: 20,
                                        padding: 0
                                    }}
                                />
                            </ListItemIcon>
                        </ListItemButton>
                    }
                </Grid>
                <Grid item xs={5} sm={5} md={5}>
                    {!edit ? (
                        <a href={url} onClick={() => props.handleDelete()} rel='noreferrer' target='_blank'>
                            <p className="series-title">{title}</p>
                        </a>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input
                                className="series-title"
                                onChange={
                                    (e) => {
                                        setTempValue(e.target.value);
                                        e.target.style.width = e.target.value.length + 1 + "ch";
                                    }}
                                value={tempValue}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        // reset();
                                    }
                                }}
                                style={{ width: props.value.title.length - 1 + "ch" }}
                            >
                            </input>
                        </form>
                    )}
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                    <p className='list-item-text' id='chapter-text' >{props.value['chapter']}/{props.value['latest'] || 100} </p>
                    <p className="text-small">{timeAgo}</p>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                    <OptionsMenu sources={props.value['scansite']} {...props} />
                    {/* <p className='list-item-text' >{props.value['scansite']} </p> */}
                </Grid>
            </ListItem>
            <Divider variant='middle' />
        </Grid >
    )
    // return (
    //     <div className='list-item'>
    //         <form onSubmit={(e) => handleSubmit(e)}>
    //             <div className='chapter-details'>
    //                 {!edit ? (
    //                     <a href={url} onClick={() => updatePopup(props.updateList, props.index)} rel='noreferrer' target='_blank'>
    //                         <p className="chapter-title">{title}idx: {props.index}</p>
    //                     </a>
    //                 ) : (
    //                     <input
    //                         className="series-title"
    //                         onChange={
    //                             (e) => {
    //                                 setTempValue(e.target.value);
    //                                 e.target.style.width = e.target.value.length + 1 + "ch";
    //                             }}
    //                         value={tempValue}
    //                         onKeyDown={(e) => {
    //                             if (e.key === "Escape") {
    //                                 // reset();
    //                             }
    //                         }}
    //                         style={{ width: props.data.title.length - 1 + "ch" }}
    //                     >
    //                     </input>)}
    //                 {/* <i
    //                     className="far fa-edit"
    //                     onClick={(e) => {
    //                         //   console.log(e);
    //                         // reset();
    //                     }}
    //                 >edit</i> */}
    //                 <p className="series-chapter">{props.data.chapter}index : {props.index}</p>
    //                 <p className="timeago" >{timeAgo}</p>
    //                 <p className="scanSite" >{props.data.scansite}</p>
    //             </div>
    //         </form>
    //         {/* <button onClick={() => deleteEntry(props.updateList, props.index)}>delete</button> */}
    //     </div >
    // )
}
const updatePopup = (updateList: Function, idx: number) => {
    console.log('clikced')
    updateList(idx)
}
const capitalizeTitle = (title: string) => {
    // capitalize first letter of each word
    return title.split('-').map(word => {
        return word !== 'of' && word !== 'a' ? word.charAt(0).toUpperCase() + word.slice(1) : word
    }
    ).join(' ')
}

export default MListItem