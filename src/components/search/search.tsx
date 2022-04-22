import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { matchSorter } from 'match-sorter'
import { useState } from 'react';
import { useEffect } from 'react';
import Manga from '../../types/manga';

const Search = (props: any) => {
    const data = props.data;
    const [value, setValue] = useState('');
    const [m, setM] = useState(props.data);
    // const requestSearch = (searchedVal: string) => {
    //     const filteredRows = data.filter((row: { name: string; }) => {
    //         return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    //     });
    //     setData(filteredRows);
    // };
    const initData = () => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            if (props.showAll) {
                setM(mangaList)
            }
            else {
                setM(m.filter((x: Manga) => !x.read))
            }
        })
        setValue('')
    }
    useEffect(() => {
        initData()
    }, []);
    useEffect(() => {
        initData()
    }, [props.showAll])
    useEffect(() => {
        props.filterData(sorted)
    }, [value])
    const sorted = matchSorter(m.map((x: Manga) => {
        x.title = x.title.replace(/-/g, ' ')
        return x

    }), value, { keys: ['title'] })

    return (
        <div className="search-container" style={{
            marginRight: 0,
            marginLeft: 'auto',
            padding: '5px'
        }}>
            <TextField
                sx={{
                    width: '80%', height: '80%', input: {
                        color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '5px', borderRadius: '5px',
                        "&::before": {
                            display: 'none',
                            border: 'none'
                        },
                        '&::after': {
                            border: 'none',
                            display: 'none'
                        }
                    },
                    "& .MuiInput-underline:after": {
                        display: 'none'
                    }
                }}
                
                color="primary"
                id="standard-basic"
                placeholder='Search...'
                label=""
                variant="standard"
                onChange={(e) => setValue(e.target.value)} />
        </div >
    )
}
export default Search


const capitalizeTitle = (title: string) => {
    // capitalize first letter of each word
    return title.split('-').map(word => {
        return word !== 'of' && word !== 'a' ? word.charAt(0).toUpperCase() + word.slice(1) : word
    }
    ).join(' ')
}