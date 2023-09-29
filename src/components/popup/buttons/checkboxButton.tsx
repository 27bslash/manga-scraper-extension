import { Checkbox, ListItemButton, ListItemIcon } from "@mui/material"

const Checkboxbutton = (props: any) => {

    // console.log('%c checked keys', 'color: blue', chkKeys)
    const shouldButtonBeChecked = props.checked.find((x: string) => x === props.title)
    return (
        <ListItemButton role={undefined} onClick={() => props.handleToggle(props.idx, props.title)}
            sx={{
                ml: 1,
                "&.MuiListItemButton-root:hover": {
                    bgcolor: "transparent"
                },
                bgColor: shouldButtonBeChecked ? "primary.light" : "transparent"
            }}
            disableRipple
            dense>
            <ListItemIcon>
                <Checkbox
                    edge="end"
                    checked={shouldButtonBeChecked ? true : false}
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
