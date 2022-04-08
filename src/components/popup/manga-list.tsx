// import ListItem from './manga-list-item';
// import { useState } from 'react';
// import { useEffect } from 'react';
// import Manga from './../../types/manga';

// const MangaList = (props: { showAll: boolean; }) => {
//     const [editing, setEditing] = useState(Boolean)
//     const [selected, setSelected] = useState(-1)
//     const [showMenu, setshowMenu] = useState(new Array(data.length).fill(false))
//     const [tempValue, setTempValue] = useState(false)
//     useEffect(() => {
//         chrome.storage.sync.get('manga-list', (res) => {
//             console.log('popup refresh')
//             const mangaList = res['manga-list']
//             if (!props.showAll) {
//                 setData(mangaList.filter((x: Manga) => !x.read))
//             } else {
//                 setData(mangaList)
//             }
//         })
//     }, [props.showAll, tempValue])
//     const updateList = (index: number) => {
//         if (index === -1) return
//         const newData = [...data]
//         const deleted = newData.splice(index, 1)
//         // setData([...newData])
//         chrome.runtime.sendMessage({ type: 'delete', data: deleted[0]['title'] }, (response) => {
//             console.log('delete entry', response)
//             setTempValue(x => !x)
//         })
//     }
//     const toggleMenu = (index: number) => {
//         const newShowMenu = new Array(data.length).fill(false)
//         newShowMenu[index] = true
//         setshowMenu(newShowMenu)
//     }

//     const resetState = () => {
//         setEditing(false)
//         setSelected(-1)
//         setshowMenu(new Array(data.length).fill(false))
//     }
//     // console.log(editing, props.selected === props.index, props.selected, props.index)
//     let highlight = ''
//     return (
//         <div className='manga-list-popup'>
//             {showMenu.some(x => x) &&
//                 // check if any radio button has been clicked
//                 <div className="options-menu">
//                     <button className='menu-button edit-button' onClick={() => {

//                         // newArray[key] = !editing[key]
//                         setEditing(true)
//                     }}>edit</button>
//                     <button className='menu-button delete-button' onClick={() => deleteEntry(updateList, selected)}>delete</button>
//                 </div>}
//             {data.map((entry: object, key: number) => {
//                 if (selected === key) {
//                     highlight = 'highlight'
//                 } else {
//                     highlight = ''
//                 }
//                 return <div className={`list-item-wrapper ${highlight}`} key={key} >
//                     <input type='checkbox' readOnly={true} checked={showMenu[key]} onClick={() => {
//                         resetState()
//                         toggleMenu(key)
//                         if (showMenu[key]) {
//                             setSelected(key)
//                         } else {
//                             setSelected(-1)
//                         }
//                     }}></input>
//                     <ListItem data={entry} updateList={updateList} editing={editing} selected={selected} resetState={resetState} index={key} />
//                 </div>
//             }
//             )
//             }
//         </div >
//     )
// }
// const deleteEntry = (updateList: Function, idx: number) => {
//     updateList(idx)
//     // remove el from ui and remove from user db entry

// }
// export default MangaList

import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import BasicTabs from './list-top';
import { Container } from '@mui/material';
import Manga from './../../types/manga';
import MListItem from './manga-list-item';


export default function CheckboxList() {
    const [checked, setChecked] = useState<number[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [data, setData] = useState<Manga[]>([])
    const [editing, setEditing] = useState(Boolean)
    useEffect(() => {
        updateData()
    }, [showAll])
    // const [data, setData] = useState(testData)
    const handleToggle = (value: number) => () => {
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
    };
    const updateDatabase = (type: string, data:  string) => {
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
            case 'edit':
                setEditing(x => !x)
                break;
            default:
                break;
        }
    }

    const updateData = () => {
        chrome.storage.sync.get('manga-list', (res) => {
            const mangaList = res['manga-list']
            if (!showAll) {
                setData(mangaList.filter((x: Manga) => !x.read))
            } else {
                setData(mangaList)
            }
        })
    }
    return (
        <Container>
            <BasicTabs checked={checked} handleDelete={handleDelete} handleClick={handleClick} />
            <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
                {data.map((value, key: number) => {
                    // const labelId = `checkbox-list-label-${key}`;
                    return (
                        <MListItem value={value} handleToggle={handleToggle} handleDelete={handleDelete} checked={checked} showAll={showAll} idx={key} />
                    );
                })}
                <p>{checked}{'' + showAll}</p>
            </List >
        </Container>
    );
}
