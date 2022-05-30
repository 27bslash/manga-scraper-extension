import { Checkbox, ListItemButton, ListItemIcon } from "@mui/material"

const Checkboxbutton = (props: any) => {
    return (
        <ListItemButton role={undefined} onClick={props.handleToggle(props.idx)}
            sx={{
                ml: 1,
                "&.MuiListItemButton-root:hover": {
                    bgcolor: "transparent"
                },
                bgColor: props.checked.includes(props.idx) ? "primary.light" : "transparent"
            }}
            disableRipple
            dense>
            <ListItemIcon>
                <Checkbox
                    edge="end"
                    checked={props.checked.indexOf(props.idx) !== -1}
                    tabIndex={-1}
                    disableRipple={true}
                    // input{{ 'aria-labelledby': labelId }}
                    sx={{
                        width: 20,
                        padding: 0
                    }} />
            </ListItemIcon>
        </ListItemButton>
    )
}
export default Checkboxbutton