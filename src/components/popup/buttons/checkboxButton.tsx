import { Box, Checkbox } from "@mui/material"

const Checkboxbutton = (props: any) => {

    // console.log('%c checked keys', 'color: blue', chkKeys)
    const shouldButtonBeChecked = props.checked.find((x: string) => x === props.title)
    return (
        <Box
            role="button"
            onClick={() => props.handleToggle(props.idx, props.title)}
            sx={{
                width: 20,
                minWidth: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
            }}
        >
            <Checkbox
                checked={shouldButtonBeChecked ? true : false}
                tabIndex={-1}
                disableRipple={true}
                sx={{
                    width: 20,
                    padding: 0
                }}
            />
        </Box>
    )
}
export default Checkboxbutton
