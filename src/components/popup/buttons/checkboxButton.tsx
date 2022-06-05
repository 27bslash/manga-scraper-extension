import { Checkbox, ListItemButton, ListItemIcon } from "@mui/material"

const Checkboxbutton = (props: any) => {
    const chkKeys: number[] = []
    props.checked.forEach((x: {})=> {
        chkKeys.push(+Object.keys(x)[0])
    })
    // console.log('%c checked keys', 'color: blue', chkKeys)
    return (
        <ListItemButton role={undefined} onClick={props.handleToggle(props.idx, props.title)}
            sx={{
                ml: 1,
                "&.MuiListItemButton-root:hover": {
                    bgcolor: "transparent"
                },
                bgColor: chkKeys.includes(props.idx) ? "primary.light" : "transparent"
            }}
            disableRipple
            dense>
            <ListItemIcon>
                <Checkbox
                    edge="end"
                    checked={chkKeys.indexOf(props.idx) !== -1}
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
