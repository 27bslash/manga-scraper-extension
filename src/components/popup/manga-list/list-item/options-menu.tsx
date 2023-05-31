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
    const [displaySource, setDisplaySource] = useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setDisplaySource(event.target.value as string);
        props.updateUrl(event.target.value as string)
    };
    useEffect(() => {
        if (props.currentSource === 'any') {
            for (const k in props.sources) {
                if (k !== 'any' && props.sources[k].latest_link === props.sources[props.currentSource].latest_link) {
                    setDisplaySource(k)
                }
            }
        } else {
            setDisplaySource(props.currentSource)
        }
    }, [props.currentSource, props.sources])
    if (props.currentSource !== 'any') {
        if (displaySource !== props.currentSource) {
            // console.log(displaySource, props.currentSource, props.sources['any']['latest_link'],)
        }
    }
    return (
        <Box>
            <FormControl variant='standard'>
                <Select
                    disableUnderline
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={displaySource}
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