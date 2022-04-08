import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';

export default function TabToggler(props: any) {
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
            {props.checked.length === 1 && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        background: "red",
                    },
                }} >

                    <Tab className='align-right' label="Edit" onClick={props.handleClick('edit')} />
                    <Tab label="Delete" onClick={props.handleDelete()} />
                </Tabs>

            )
            }
            {props.checked.length > 1 && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        background: "red",
                    },
                }} >
                    <Tab className='align-right' label="Delete" onClick={props.handleDelete()} />
                </Tabs>

            )
            }
        </>
    )
}