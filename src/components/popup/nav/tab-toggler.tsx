import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';

interface TabtogglerProps {
    showAll: boolean,
    handleClick: (b: boolean, s: string) => void,
    checked: number[],
    handleDelete: (value?: number) => void,
    updateEditing: (value: boolean) => void,
    updateRead: (b: boolean) => void,
}
function TabToggler(props: TabtogglerProps) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            {props.checked.length === 0 && (
                <Tabs value={value} onChange={handleChange} centered aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        background: "red",
                    },
                }} >
                    <Tab className='align-right' label="Unread" onClick={() => props.handleClick(false, 'toggleView')} />
                    <Tab label="All series" onClick={() => props.handleClick(true, 'toggleView')} />
                </Tabs>
            )}
            {props.checked.length > 0 && props.showAll && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        display: 'none',
                    },
                }} >
                    <Tab label="Delete" onClick={() => props.handleDelete()} />
                    <Tab className='align-right' label="un-read" onClick={() => props.updateRead(false)} />
                </Tabs>

            )
            }
            {props.checked.length > 0 && !props.showAll && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        display: 'none',
                    },
                }} >
                    <Tab className='align-right' label="read" onClick={() => props.updateRead(true)} />
                </Tabs>

            )
            }
        </>
    )
}
export default TabToggler;