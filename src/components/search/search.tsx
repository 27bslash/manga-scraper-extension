import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { matchSorter } from 'match-sorter'
import { useState } from 'react';
import { useEffect } from 'react';
import Manga from '../../types/manga';

const Search = (props: any) => {
    const [value, setValue] = useState('');
    const [m, setM] = useState(props.data || []);
    const [dataRecieved, setDataRecieved] = useState(false);

    let sorted: Manga[] = []
    let minLen = 3
    if (props.data) minLen = 0
    const initData = () => {
        if (props.data) {

            chrome.storage.local.get('manga-list', (res) => {
                const mangaList = res['manga-list']
                if (props.showAll) {
                    console.log('full search')
                    setM(mangaList)
                }
                else {
                    console.log('un read search')
                    setM(mangaList.filter((x: Manga) => !x.read))
                }
            })
            if (m) {
                setDataRecieved(true)
            }
        } else {
            chrome.storage.local.get('manga-list', (res) => {
                const mangaList = res['manga-list']
                const titleList = mangaList.map((x: Manga) => x.title)
                if (props.allManga) {
                    console.log('allManga')
                    const filteredData = props.allManga.filter((x: Manga) => {
                        return !titleList.includes(x['title'])
                    })
                    if (filteredData.length > 0) {
                        setDataRecieved(true)
                        setM(filteredData)
                        console.log('%c  data received', 'color: green', filteredData.length)
                    }
                }
            })
        }
        setValue('')

    }
    useEffect(() => {
        // console.log('updateSearch')
        initData()
    }, [props.showAll, props.deleting]);

    // initData()

    // useEffect(() => {
    //     console.log('update intidata')
    //     initData()
    // }, [props.updated])

    // useEffect(() => {
    //     console.log('showall initdata')
    //     if (props.data) {
    //         initData()
    //     }
    // }, [props.showAll])

    // useEffect(() => {
    //     console.log('all manga data')
    //     if (props.allManga) {
    //         initData()
    //     }
    // }, [props.allManga])

    useEffect(() => {
        let b = false
        if (props.data) b = true
        if (value.length > 0 || props.data) {
            props.filterData(sorted, b)
        } else {
            props.filterData([], false)
        }
    }, [value])

    if (value.length > minLen) {
        // console.log('sort', m)
        sorted = matchSorter(m.map((x: any) => {
            x.title = x.title.replace(/-/g, ' ')
            return x
        }), value, { keys: [{ threshold: matchSorter.rankings.CONTAINS, key: 'title' }] })
    } else if (value.length === 0) {
        sorted = m
    }
    // console.log('sorted: ', sorted)

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
                disabled={!dataRecieved}
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