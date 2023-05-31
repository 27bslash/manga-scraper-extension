
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
    const [showAll, setShowAll] = useState<boolean>();
    const [data, setData] = useState<Manga[]>([])
    const [totalData, setTotalData] = useState<Manga[]>([])
    const [refresh, setRefresh] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [checkAll, setCheckAll] = useState(false)
    const [deletePrompt, setDeletePrompt] = useState(false)
    useEffect(() => {
        chrome.storage.local.get('manga-list', (res) => {
            setTotalData(res['manga-list'])
            updateShowAll(res['manga-list'])
        })
        sortData()
    }, [])
    const updateShowAll = (data: Manga[] = []) => {
        if (!data) data = totalData
        const filteredData = data.filter((x: Manga) => !x.read)
        console.log('filtered data  print', filteredData)
        if (filteredData.length === 0) {
            setShowAll(true)
        } else {
            setShowAll(false)
        }
    }
    useEffect(() => {
        // console.log('init data', showAll)
        sortData()
        console.log(data)
    }, [showAll])

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
                updateDatabase('update', mangalist)
                sortData()
            }
        }
        )
    }, [refresh])
    // const [data, setData] = useState(testData)
    const toggleAll = (b: boolean) => {
        setCheckAll(!b)
        if (!b) {
            const mp = data.map((x, i) => {
                return { [String(i)]: x['title'] }
            })
            setChecked(mp)
        } else {
            setChecked([])
        }
    }
    // chrome.storage.onChanged.addListener(() => {
    //     setRefresh(!refresh)
    // })
    const handleToggle = (value: number, title: string) => () => {
        console.log(value, title)

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
    const handleDelete = () => {
        setDeletePrompt(true)
    };
    const deleteChecked = (value = -1) => {
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
            newData = newData.filter((manga: Manga) => {
                return manga.title !== chkTitle
            })
        })
        setTotalData(newData)
        chrome.storage.local.set({ 'manga-list': newData })
        updateDatabase('update', newData)
        sortData()
        setDeletePrompt(false)
    }

    const updateRead = (b: boolean) => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            mangaList.forEach((manga: Manga, i: number) => {
                const currentSource = manga['current_source']
                for (let check of checked) {
                    const checkTitle = Object.values(check)[0].toLowerCase().replace(/\s/g, '-')
                    if (checkTitle === manga['title']) {
                        if (b) {
                            manga.read = true
                            manga.chapter = manga.latest
                            manga.sources[currentSource]['chapter'] = manga.sources[currentSource]['latest']
                        }
                        else {
                            manga.read = false
                            manga.chapter = '1'
                            manga.sources[currentSource]['chapter'] = '1'
                        }
                    }
                }
            })
            console.log('manga set local storage list', mangaList)
            setChecked([])
            setCheckAll(false)
            chrome.storage.local.set({ 'manga-list': mangaList })
            sortData()
            updateShowAll(mangaList)
            updateDatabase('update', mangaList)
        })


    }
    const updateDatabase = (type: string, data: Manga[]) => {
        console.log('update database')
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
        console.log('showall', showAll)
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = sortByReleaseTime(res['manga-list'])
            try {
                if (mangaList) {
                    setTotalData(mangaList)
                    if (!showAll) {
                        const filtered = mangaList.filter((x: Manga) => !x.read)
                        setData(prev => filtered)
                        console.log('mangalist', data)
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
    const filterData = (x: Manga[], b: boolean) => {
        if (b) {
            setData(sortByReleaseTime(x))
        }
        else {
            setData(x)
        }
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
                chrome.storage.local.set({ 'manga-list': mangaList })
                updateDatabase('update', mangaList)
            }
            setUpdated(!updated)
        })
    }
    useEffect(() => {
        chrome.storage.local.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            const titleList = mangaList.map((x: Manga) => x.title)
            const newData = [...data].filter((x: Manga) => !titleList.includes(x['title'].toLowerCase().replace(/\s/g, '-')))
            setData(newData)
        })
    }, [updated])
    return (
        <Container sx={{ maxWidth: '440px', padding: 0 }}>
            <BasicTabs updateRead={updateRead} showAll={showAll} checked={checked} handleDelete={handleDelete} handleClick={handleClick} totalData={totalData} />
            {/* {JSON.stringify({ showall: checkAll, an: data.length })} */}
            {deletePrompt &&
                <div>
                    delete {checked.length} series
                    <div>
                        <button onClick={() => deleteChecked(-1)}>yes</button>
                        <button onClick={() => setDeletePrompt(false)}>no</button>
                    </div>
                </div>
            }
            {
                !addNew ? (
                    <>
                        <MangaListItemControls data={data} toggleAll={toggleAll} showAll={showAll} filterData={filterData} checked={checkAll} deleting={deletePrompt} />
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
                        <MangaListItemControls filterData={filterData} allManga={props.allManga} updated={updated} />
                        <SearchResults data={data} addNewManga={addNewManga} filterData={filterData} />
                    </div>
                )
            }
        </Container >
    );
}


