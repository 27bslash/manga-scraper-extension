import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState, useEffect } from 'react';


interface OptionsMenuProps {
    sources: { [key: string]: { url: string, latest: string } },
    currentSource: string,
    updateUrl: (key: string) => void,
}
export default function OptionsMenu(props: OptionsMenuProps) {
    const [source, setSource] = useState(props.currentSource);

    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value)
        setSource(event.target.value as string);
        props.updateUrl(event.target.value as string)
    };
    // console.log(props.sources, Object.keys(props.sources))
    Object.keys(props.sources).map((key: string, idx: number) => {
        return true
    })
    const updateSource = (source: string) => {

    }
    // console.log('options current source', source)
    return (
        <Box>
            <FormControl variant='standard'>
                <Select
                    disableUnderline
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={source}
                    label="Source"
                    onChange={handleChange}
                >
                    {Object.keys(props.sources).map((key: string, idx: number) => {
                        return (
                            <MenuItem key={idx} value={key}>{key}</MenuItem>
                        )
                    })}

                </Select>
            </FormControl>
        </Box>
    );
}