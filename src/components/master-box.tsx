import { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
const MasterBox = (props: any) => {
    const [checked, setChecked] = useState(false);
    const handleClick = () => {
        props.toggleAll(checked);
        setChecked(!checked);
    }
    return (
        <div style={{
            marginLeft: '8px'
        }}>
            <ListItemButton role={undefined} onClick={handleClick} disableRipple dense>
                <ListItemIcon>
                    <Checkbox
                        edge="end"
                        checked={checked}
                        tabIndex={-1}
                        disableRipple={true}
                        sx={{
                            width: 20,
                            padding: 0,
                            "& .MuiListItemButton-root:hover": {
                                backgroundColor: "primary.light"
                            }
                        }}
                    />
                </ListItemIcon>
            </ListItemButton>
        </div >
    )
}
export default MasterBox