
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import BasicTabs from '../nav/list-top';
import { Box as container, Container } from '@mui/material';
import Manga from '../../../types/manga';
import MListItem from './list-item/manga-list-item';
import Search from '../../search/search';
import MasterBox from './../../master-box';


export default function CheckboxList() {
    const [checked, setChecked] = useState<number[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [data, setData] = useState<Manga[]>([])
    const [refresh, setRefresh] = useState(false)
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
    const handleDelete = (value = -1) => () => {
        const newData = [...data];
        console.log(value)
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
        setData(newData);
        setChecked([]);
        // chrome.storage.sync.set({ 'manga-list': newData })
    };
    const updateRead = (b: boolean) => {
        console.log('update read', b)
        const newData = [...data];
        chrome.storage.sync.get('manga-list', (res) => {
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
            chrome.storage.sync.set({ 'manga-list': mangaList })
            setRefresh(!refresh)

            // checked.sort((a, b) => b - a).forEach(x => {
            //     if (b) {
            //         newData[x].read = true
            //         newData[x].chapter = newData[x].latest
            //     } else {
            //         newData[x].read = false
            //         newData[x].chapter = '1'
            //     }
            // })

            // if (showAll) {
            //     setData(newData);
            //     setChecked([]);
            //     return
            // } else {
            //     setData(newData.filter(x => !x.read))
            //     setChecked([]);
            //     return
            // }
            // chrome.storage.sync.set({ 'manga-list': newData })
        })


    }
    const updateDatabase = (type: string, data: Manga) => {
        chrome.runtime.sendMessage({ type: type, data: data }, (response) => {
            console.log(`${type} entry read`, response)
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

    const updateData = () => {
        chrome.storage.sync.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            console.log('manga list', mangaList)
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
    }
    const filterData = (x: Manga[]) => {
        setData(x)
    }
    return (
        <Container sx={{ padding: 0, maxWidth:'440px' }}>
            <BasicTabs updateRead={updateRead} showAll={showAll} checked={checked} handleDelete={handleDelete} handleClick={handleClick} />
            <div style={{ display: 'flex' }}>
                <MasterBox toggleAll={toggleAll} />
                <Search data={data} filterData={filterData} />
            </div>
            <List sx={{ width: '100%', bgcolor: 'background.dark', }}>
                {data.map((value, key: number) => {
                    return (
                        <MListItem data={value} handleToggle={handleToggle} handleDelete={handleDelete} checked={checked} showAll={showAll} idx={key} />
                    );
                })}
            </List >
        </Container>
    );
}
