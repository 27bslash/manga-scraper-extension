import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
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
    
    useEffect(() => {
        setChecked(props.checked)
    }, [props.checked])

    const handleClick = () => {
        props.toggleAll(checked);
        setChecked(!checked);
    }
    return (
        <ThemeProvider
            theme={theme}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                gap: '6px',
            }}>
                <Box
                    role="button"
                    onClick={handleClick}
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
                        checked={checked}
                        tabIndex={-1}
                        disableRipple={true}
                        color='secondary'
                        sx={{
                            width: 20,
                            padding: 0,
                            bgColor: '#fff'
                        }}
                    />
                </Box>
                <p style={{ marginTop: '1px', marginLeft: 13, color: '#fff' }}>Select All</p>
            </div >
        </ThemeProvider >
    )
}
export default MasterBox
