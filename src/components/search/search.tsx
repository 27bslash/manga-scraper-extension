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
    useEffect(() => {
        chrome.storage.sync.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            setM(mangaList)
        })
    }, [])
    const sorted = matchSorter(m.map((x: Manga) => {
        x.title = x.title.replace(/-/g, ' ')
        return x
    }), value, { keys: ['title'] })
    useEffect(() => {
        props.filterData(sorted)
    }, [value])
    return (
        <div className="search-container" style={{
            marginRight: 0,
            marginLeft: 'auto',
        }}>
            <TextField id="standard-basic" label="" variant="standard" onChange={(e) => setValue(e.target.value)} />
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