
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import BasicTabs from '../nav/list-top';
import { Box, Container } from '@mui/material';
import Manga from '../../../types/manga';
import MListItem from './list-item/manga-list-item';
import Search from '../../search/search';
import MasterBox from './../../master-box';


export default function CheckboxList() {
    const [checked, setChecked] = useState<number[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [data, setData] = useState<Manga[]>([])
    const [totalData, setTotalData] = useState<Manga[]>([])
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        chrome.storage.local.get('manga-list', (res) => {
            setTotalData(res['manga-list'])
            const filteredData = res['manga-list'].filter((x: Manga) => !x.read)
            if (filteredData.length === 0) {
                setShowAll(true)
            }
        })
    }, [])
    useEffect(() => {
        updateData()
    }, [showAll, refresh])
    // const [data, setData] = useState(testData)
    const toggleAll = (b: boolean) => {
        if (!b) {
            setChecked(data.map((_, i) => i))
        } else {
            setChecked([])
        }
    }
    chrome.storage.onChanged.addListener(() => {
        setRefresh(!refresh)
    })
    const handleToggle = (value: number) => () => {
        // console.log(value)

        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const handleDelete = (value = -1) => {
        const newData = [...data];
        console.log('del', value)
        if (value !== -1) {
            const spliced = newData.splice(value, 1)
            setData(newData)
            setChecked([])
            return
        };
        checked.sort((a, b) => b - a).forEach(x => {
            newData.splice(x, 1)
            console.log(x, newData)
        })
        updateDatabase('update', newData)
        chrome.storage.local.set({ 'manga-list': newData })
        setRefresh(!refresh)
        // chrome.storage.local.set({ 'manga-list': newData })
    };
    const updateRead = (b: boolean) => {
        console.log('update read', b)
        const newData = [...data];
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            mangaList.forEach((manga: Manga, i: number) => {
                checked.forEach(check => {
                    if (newData[check].title === manga['title']) {
                        console.log('title matches', i, check)
                        if (b) {
                            manga.read = true
                            manga.chapter = manga.latest
                        }
                        else {
                            manga.read = false
                            manga.chapter = '1'
                        }
                    }
                })
            })
            updateDatabase('update', mangaList)
            chrome.storage.local.set({ 'manga-list': mangaList })
            setRefresh(!refresh)
        })


    }
    const updateDatabase = (type: string, data: Manga[]) => {
        chrome.runtime.sendMessage({ type: type, data: data }, (response) => {
            console.log(`${type} entry`, response)
        })
    }
    const handleClick = (b = true, type: string) => {
        switch (type) {
            case 'toggleView':
                setShowAll(b)
                updateData()
                break;
            default:
                break;
        }
    }

    const sortData = () => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list'].sort((a: Manga, b: Manga) => {
                let currentSourceA = 'any'
                let currentSourceB = 'any'
                if ('current_source' in a) {
                    currentSourceA = a.current_source
                }
                if ('current_source' in b) {
                    currentSourceB = b.current_source
                }
                return b['sources'][currentSourceB]['time_updated'] - a['sources'][currentSourceA]['time_updated']
            })
            console.log(mangaList)
            try {
                if (mangaList) {
                    if (!showAll) {
                        setData(mangaList.filter((x: Manga) => !x.read))
                    } else {
                        setData(mangaList)
                    }
                }
            } catch (error) {
                console.log('data ', error)
            }
        })
        setChecked([])
    }
    const filterData = (x: Manga[]) => {
        setData(x)
    }
    // rgb(30 41 101) top bg
    // bot bg rgb(55 65 127)
    // divider rgb(119, 119, 203)
    return (
        <Container sx={{ maxWidth: '440px', padding: 0 }}>
            {JSON.stringify(showAll)}
            <BasicTabs updateRead={updateRead} showAll={showAll} checked={checked} handleDelete={handleDelete} handleClick={handleClick} totalData={totalData} />
            <Container className='terstcont' sx={{ display: 'flex', backgroundColor: 'rgb(55, 65 ,127)' }}>
                <MasterBox toggleAll={toggleAll} />
                <Search data={data} filterData={filterData} showAll={showAll} />
            </Container>
            <List dense sx={{ width: '100%', padding: 0 }}>
                {data.map((value, key: number) => {
                    return (
                        <MListItem data={value} handleToggle={handleToggle} handleDelete={handleDelete} checked={checked} showAll={showAll} idx={key} />
                    );
                })}
            </List >
        </Container >
    );
}
