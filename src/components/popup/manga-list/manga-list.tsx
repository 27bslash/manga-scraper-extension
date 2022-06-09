
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import BasicTabs from '../nav/list-top';
import { Container } from '@mui/material';
import Manga from '../../../types/manga';
import MListItem from './list-item/manga-list-item';
import MangaListItemControls from './manga-list-controls';
import SearchResults from '../../search/searchResults';

interface listProps {
    allManga: Manga[]
}
interface CheckedType {
    [key: string]: string
}
export default function CheckboxList(props: listProps) {
    const [checked, setChecked] = useState<CheckedType[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [data, setData] = useState<Manga[]>([])
    const [totalData, setTotalData] = useState<Manga[]>([])
    const [refresh, setRefresh] = useState(false)
    const [addNew, setAddNew] = useState(false)

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
        if (!addNew) {
            sortData()
        }
    }, [refresh, showAll])
    useEffect(() => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangalist = res['manga-list']
            let updated = false
            mangalist.forEach((x: Manga) => {
                if (x.chapter === x.latest && x.read === false) {
                    x.read = true
                    updated = true
                }
            }
            )
            if (updated) {
                chrome.storage.local.set({ 'manga-list': mangalist })
                // updateDatabase('update', mangalist)
                sortData()
            }
        }
        )
    }, [refresh])
    // const [data, setData] = useState(testData)
    const toggleAll = (b: boolean) => {
        if (!b) {
            const mp = data.map((x, i) => {
                return { [String(i)]: x['title'] }
            })
            setChecked(mp)
        } else {
            setChecked([])
        }
    }
    chrome.storage.onChanged.addListener(() => {
        setRefresh(!refresh)
    })
    const handleToggle = (value: number, title: string) => () => {
        // console.log(value)

        const chkKeys: number[] = []
        checked.forEach((x: {}) => {
            chkKeys.push(+Object.keys(x)[0])
        })
        const currentIndex = chkKeys.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push({ [String(value)]: title });
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const handleDelete = (value = -1) => {
        let newData = [...totalData];
        console.log('del', value)
        console.log('search data', newData)
        if (value !== -1) {
            const spliced = newData.splice(value, 1)
            setData(newData)
            setChecked([])
            return
        };
        checked.forEach(x => {
            const chkTitle = Object.values(x)[0].toLowerCase().replace(/\s/g, '-')
            console.log('chk title', chkTitle)
            newData = newData.filter((manga: Manga) => {
                return manga.title !== chkTitle
            })
        })
        chrome.storage.local.set({ 'manga-list': newData })
        updateDatabase('update', newData)
        setTotalData(newData)
        setRefresh(!refresh)
    };
    const updateRead = (b: boolean) => {
        console.log('update read', b)
        const newData = [...data];
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            mangaList.forEach((manga: Manga, i: number) => {
                for (let check in checked) {
                    if (newData[parseInt(check)].title === manga['title']) {
                        if (b) {
                            manga.read = true
                            manga.chapter = manga.latest
                        }
                        else {
                            manga.read = false
                            manga.chapter = '1'
                        }
                    }
                }
            })
            updateDatabase('update', mangaList)
            chrome.storage.local.set({ 'manga-list': mangaList })
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
                sortData()
                setAddNew(false)
                break;
            case 'addNew':
                setAddNew(b)
                break;
            default:
                break;
        }
    }

    const sortData = () => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = sortByReleaseTime(res['manga-list'])
            try {
                if (mangaList) {
                    setTotalData(mangaList)
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
    const sortByReleaseTime = (list: Manga[]) => {
        list.sort((a: Manga, b: Manga) => {
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
        return list
    }
    const filterData = (x: Manga[]) => {
        setData(sortByReleaseTime(x))

    }
    const addNewManga = (manga: Manga) => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            console.log('add new manga', manga)
            manga['title'] = manga['title'].toLowerCase().replace(/\s/g, '-')
            const mObject = {
                'title': manga['title'],
                'chapter': manga['latest'],
                'read': true,
                'latest': manga['latest'],
                'sources': manga['sources'],
                'current_source': 'any',
                'domain': manga['domain'],
                'link': manga['link'],
                'scansite': manga['scansite']
            }
            // check if mangalist already has this manga
            if (mangaList.find((x: Manga) => x.title === manga['title'])) {
                console.log('already in list')
            } else {
                mangaList.push(mObject)
                updateDatabase('update', mangaList)
                chrome.storage.local.set({ 'manga-list': mangaList })
            }
            const titleList = mangaList.map((x: Manga) => x.title)
            setData(data.filter((x: Manga) => !titleList.includes(x.title)))
        })
    }

    return (
        <Container sx={{ maxWidth: '440px', padding: 0 }}>
            <BasicTabs updateRead={updateRead} showAll={showAll} checked={checked} handleDelete={handleDelete} handleClick={handleClick} totalData={totalData} />
            {!addNew ? (
                <>
                    <MangaListItemControls data={data} toggleAll={toggleAll} showAll={showAll} filterData={filterData} />
                    <List dense sx={{ width: '100%', padding: 0 }}>
                        {data.map((value, key: number) => {
                            return (
                                <MListItem data={value} handleToggle={handleToggle} checked={checked} idx={key} />
                            );
                        })}
                    </List >
                </>
            ) : (
                <div className="trest">
                    <MangaListItemControls filterData={filterData} allManga={props.allManga} />
                    <SearchResults data={data} addNewManga={addNewManga} />
                </div>
            )}
        </Container >
    );
}


