import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import Manga from '../../../types/manga';

interface TabtogglerProps {
    showAll: boolean,
    handleClick: (b: boolean, s: string) => void,
    checked: number[],
    handleDelete: (value?: number) => void,
    updateEditing: (value: boolean) => void,
    updateRead: (b: boolean) => void,
    totalData: Manga[],
}
function TabToggler(props: TabtogglerProps) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const filteredData = props.totalData.filter((x: Manga) => !x.read)
    return (
        <>
            {props.checked.length === 0 && filteredData.length > 0 && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        background: 'rgb(119, 119, 203)',
                    },
                }} >
                    <Tab sx={{ color: '#fff !important' }} className='align-right' label="Unread" onClick={() => props.handleClick(false, 'toggleView')} />
                    <Tab sx={{ color: '#fff !important' }} label="All series" onClick={() => props.handleClick(true, 'toggleView')} />
                    <Tab sx={{ color: '#fff !important' }} label="Add New" onClick={() => props.handleClick(true, 'addNew')} />
                </Tabs>
            )}
            {props.checked.length === 0 && filteredData.length === 0 && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        background: "rgb(119, 119, 203)",
                    }
                }}>
                    <Tab sx={{ color: '#fff !important' }} label="All series" onClick={() => props.handleClick(true, 'toggleView')} />
                    <Tab sx={{ color: '#fff !important' }} label="Add New" onClick={() => props.handleClick(true, 'addNew')} />
                </Tabs>

            )}

            {props.checked.length > 0 && props.showAll && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        display: 'none',
                    },
                }} >
                    <Tab sx={{ color: '#fff !important' }} label="Delete" onClick={() => props.handleDelete(-1)} />
                </Tabs>

            )
            }
            {props.checked.length > 0 && !props.showAll && (
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
                    style: {
                        display: 'none',
                    },
                }} >
                    <Tab sx={{ color: '#fff !important' }} className='align-right' label="read" onClick={() => props.updateRead(true)} />
                    <Tab sx={{ color: '#fff !important' }} label="Add New" onClick={() => props.handleClick(true, 'addNew')} />
                </Tabs>

            )
            }
        </>
    )
}
export default TabToggler;