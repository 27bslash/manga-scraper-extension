import { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#3f51b5",
        },
        secondary: {
            main: "#fff",
        },
        background: {
            default: "#fff",
            paper: "#fff",
        }
    },
})

const MasterBox = (props: any) => {
    const [checked, setChecked] = useState(false);
    const handleClick = () => {
        props.toggleAll(checked);
        setChecked(!checked);
    }
    return (
        <ThemeProvider
            theme={theme}
        >
            <div style={{
                display: 'flex', alignItems: 'center'
            }}>
                <ListItemButton role={undefined} onClick={handleClick} disableRipple dense sx={{ padding: 0 }}>
                    <ListItemIcon>
                        <Checkbox
                            edge="end"
                            checked={checked}
                            tabIndex={-1}
                            disableRipple={true}
                            color='secondary'
                            sx={{
                                width: 20,
                                padding: 0,
                                ml: 1,
                                "&.MuiListItemButton-root:hover": {
                                    bgcolor: "transparent"
                                },
                                bgColor: '#fff'
                            }}
                        />
                    </ListItemIcon>
                </ListItemButton>
                <p style={{ marginTop: '1px', marginLeft: '2px', color: '#fff' }}> Select All</p>
            </div >
        </ThemeProvider >
    )
}
export default MasterBox