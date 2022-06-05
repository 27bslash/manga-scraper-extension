import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState, useEffect } from 'react';


interface OptionsMenuProps {
    sources: { [key: string]: { url: string, latest: string, latest_link: string } },
    currentSource: string,
    updateUrl: (key: string) => void,
}
export default function OptionsMenu(props: OptionsMenuProps) {
    const [source, setSource] = useState(props.currentSource);

    const handleChange = (event: SelectChangeEvent) => {
        setSource(event.target.value as string);
        props.updateUrl(event.target.value as string)
    };
    useEffect(() => {
        if (props.currentSource === 'any') {
            for (const k in props.sources) {
                if (k !== 'any' && props.sources[k].latest_link === props.sources[props.currentSource].latest_link) {
                    setSource(k)
                }
            }
        }
    }, [props.currentSource, props.sources])
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