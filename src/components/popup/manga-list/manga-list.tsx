import { useState, useEffect } from "react";
import List from "@mui/material/List";
import BasicTabs from "../nav/list-top";
import { Box } from "@mui/material";
import Manga, { AllManga } from "../../../types/manga";
import MListItem from "./list-item/manga-list-item";
import MangaListItemControls from "./manga-list-controls";
import SearchResults from "../../search/searchResults";

interface ListProps {
  allManga?: AllManga[];
  demoMangaList?: Manga[];
}

export default function UserMangaList(props: ListProps) {
  const runtime = globalThis?.chrome?.runtime;
  const storageLocal = globalThis?.chrome?.storage?.local;
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState<boolean>();
  const [data, setData] = useState<Manga[]>([]);
  const [totalData, setTotalData] = useState<Manga[]>([]);
  const [addNew, setAddNew] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);

  const getStoredMangaList = (cb: (list: Manga[]) => void) => {
    if (!storageLocal?.get) {
      cb(props.demoMangaList || totalData || []);
      return;
    }
    storageLocal.get("manga-list", (res) => cb(res["manga-list"] || []));
  };

  const setStoredMangaList = (list: Manga[]) => {
    if (!storageLocal?.set) {
      setTotalData(list);
      return;
    }
    storageLocal.set({ "manga-list": list });
  };
  const syncList = (list: Manga[]) => {
    setStoredMangaList(list);
    updateDatabase("update", list);
  };
  const updateMangaByTitle = (title: string, updater: (m: Manga) => void) => {
    getStoredMangaList((mangaList) => {
      const nextList = mangaList.map((item) => {
        if (normalizeTitle(item.title) !== normalizeTitle(title)) return item;
        const clone = {
          ...item,
          sources: { ...item.sources },
        };
        updater(clone);
        return clone;
      });
      syncList(nextList);
      sortData();
      updateShowAll(nextList);
    });
  };
  const markMangaAsRead = (title: string, source: string) => {
    updateMangaByTitle(title, (element) => {
      const activeSource = element.sources[source];
      if (!activeSource) return;

      element.read = true;
      element.chapter = activeSource.latest;
      activeSource.chapter = activeSource.latest;
      activeSource.url = activeSource.latest_link;
    });
  };
  useEffect(() => {
    getStoredMangaList((mangaList) => {
      setTotalData(mangaList);
      updateShowAll(mangaList);
    });
    sortData(showAll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const updateShowAll = (data: Manga[] = []) => {
    if (!data) data = totalData;
    const filteredData = data.filter((x: Manga) => !x.read);
    console.log("filtered data  print", filteredData);
    if (filteredData.length === 0) {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  };

  // const [data, setData] = useState(testData)
  const toggleAll = (b: boolean) => {
    setCheckAll(!b);
    if (!b) {
      const allTItles = data.map((x, i) => x["title"]);
      setChecked(allTItles);
    } else {
      setChecked([]);
    }
  };

  const handleToggle = (value: number, title: string) => {
    let chkKeys = [...checked];
    const idx = checked.findIndex((x) => x === title);
    if (idx === -1) {
      chkKeys.push(title);
    } else {
      chkKeys.splice(idx, 1);
    }
    setChecked(chkKeys);
  };
  const handleDelete = () => {
    setDeletePrompt(true);
  };
  const deleteChecked = (value = -1) => {
    let newData = [...totalData];
    console.log("del", value);
    console.log("search data", newData);
    if (value !== -1) {
      newData.splice(value, 1);
      setData(newData);
      setChecked([]);
      return;
    }
    newData = newData.filter(
      (manga: Manga) => !checked.includes(manga["title"]),
    );
    setTotalData(newData);
    syncList(newData);
    sortData(showAll);
    setDeletePrompt(false);
  };

  const updateRead = (b: boolean) => {
    getStoredMangaList((mangaList) => {
      mangaList.forEach((manga: Manga, i: number) => {
        const currentSource = manga["current_source"];
        for (let check of checked) {
          const checkTitle = check.toLowerCase().replace(/\s/g, "-");
          if (checkTitle === manga["title"]) {
            if (b) {
              console.log("set read true", manga);
              manga.read = true;
              manga.chapter = manga.latest;
              manga.sources[currentSource]["chapter"] =
                manga.sources[currentSource]["latest"];
            } else {
              manga.read = false;
              manga.chapter = "1";
              manga.sources[currentSource]["chapter"] = "1";
            }
          }
        }
      });
      console.log("manga set local storage list", mangaList);
      setChecked([]);
      setCheckAll(false);
      syncList(mangaList);
      sortData(showAll);
      updateShowAll(mangaList);
    });
  };
  const updateDatabase = (type: string, data: Manga[]) => {
    if (!runtime?.sendMessage) {
      return;
    }
    console.log("update database");
    runtime.sendMessage({ type: type, data: data }, (response) => {
      console.log(`${type} entry`, response);
    });
  };
  const handleClick = (b = true, type: string) => {
    switch (type) {
      case "toggleView":
        setShowAll(b);
        sortData(b);
        setAddNew(false);
        break;
      case "addNew":
        setAddNew(b);
        break;
      default:
        break;
    }
  };

  const sortData = (nextShowAll = showAll) => {
    console.log("showall", nextShowAll);
    getStoredMangaList((storedList) => {
      const mangaList = sortByReleaseTime(storedList || []);
      try {
        setTotalData(mangaList);
        if (!nextShowAll) {
          const unread = mangaList.filter((x: Manga) => {
            if (x.sources[x.current_source].chapter) {
              return (
                +x.sources[x.current_source].chapter <
                +x.sources[x.current_source].latest
              );
            }
            return false;
          });
          // const filtered = mangaList.filter((x: Manga) => !x.read);

          setData(unread);
          console.log("mangalist", data);
        } else {
          setData(mangaList);
        }
      } catch (error) {
        console.log("data ", error);
      }
    });
    setChecked([]);
  };
  useEffect(() => {
    getStoredMangaList((mangalist) => {
      let didChange = false;
      const changedTitles: string[] = [];
      mangalist.forEach((x: Manga) => {
        if (
          x.chapter === x.latest ||
          +x.sources[x.current_source].chapter >=
            +x.sources[x.current_source].latest
        ) {
          if (!x.read) {
            x.read = true;
            changedTitles.push(x.title);
            didChange = true;
          }
        } else if (x.read) {
          x.read = false;
          didChange = true;
          changedTitles.push(x.title);
        }
      });
      if (didChange) {
        console.log("something changed updating database ", changedTitles);
        setStoredMangaList(mangalist);
        updateDatabase("update", mangalist);
        sortData(showAll);
      }
    });
  }, [data, showAll]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    // console.log('init data', showAll)
    sortData(showAll);
  }, [showAll]); // eslint-disable-line react-hooks/exhaustive-deps
  const sortByReleaseTime = (list: Manga[]) => {
    list.sort((a: Manga, b: Manga) => {
      let currentSourceA = "any";
      let currentSourceB = "any";
      if ("current_source" in a) {
        currentSourceA = a.current_source;
      }
      if ("current_source" in b) {
        currentSourceB = b.current_source;
      }
      return (
        b["sources"][currentSourceB]["time_updated"] -
        a["sources"][currentSourceA]["time_updated"]
      );
    });
    return list;
  };
  const filterData = (x: Manga[], b: boolean) => {
    if (b) {
      setData(sortByReleaseTime(x));
    } else {
      setData(x);
    }
  };
  const addNewManga = (manga: Manga) => {
    getStoredMangaList((mangaList) => {
      console.log("add new manga", manga);
      manga["title"] = manga["title"].toLowerCase().replace(/\s/g, "-");
      const mObject = {
        title: manga["title"],
        chapter: manga["latest"],
        read: true,
        latest: manga["latest"],
        sources: manga["sources"],
        current_source: "any",
        domain: manga["domain"],
        link: manga["link"],
        scansite: manga["scansite"],
      };
      // manual user chapter added
      mObject.sources["any"]["chapter"] = manga["latest"];
      // check if mangalist already has this manga
      if (mangaList.find((x: Manga) => x.title === manga["title"])) {
        console.log("already in list");
      } else {
        mangaList.push(mObject);
        syncList(mangaList);
      }
      setUpdated(!updated);
    });
  };
  useEffect(() => {
    getStoredMangaList((mangaList) => {
      const titleList = mangaList.map((x: Manga) => x.title);
      const newData = [...data].filter(
        (x: Manga) =>
          !titleList.includes(x["title"].toLowerCase().replace(/\s/g, "-")),
      );
      setData(newData);
    });
  }, [updated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        width: "500px",
        maxHeight: "315px",
        overflowY: "scroll",
        bgcolor: "background.paper",
      }}
    >
      <BasicTabs
        updateRead={updateRead}
        showAll={showAll}
        checked={checked}
        handleDelete={handleDelete}
        handleClick={handleClick}
        totalData={totalData}
      />
      {/* {JSON.stringify({ showall: checkAll, an: data.length })} */}
      {deletePrompt && (
        <div>
          delete {checked.length} series
          <div>
            <button onClick={() => deleteChecked(-1)}>yes</button>
            <button onClick={() => setDeletePrompt(false)}>no</button>
          </div>
        </div>
      )}
      {!addNew ? (
        <>
          <MangaListItemControls
            data={data}
            toggleAll={toggleAll}
            showAll={showAll}
            filterData={filterData}
            checked={checkAll}
            deleting={deletePrompt}
          />
          <List dense sx={{ width: "100%", p: 0 }}>
            {data.map((value, key: number) => {
              if (!value.title) return null;
              return (
                <MListItem
                  data={value}
                  handleToggle={handleToggle}
                  checked={checked}
                  idx={key}
                  mangaList={totalData}
                  onMangaUpdate={updateMangaByTitle}
                  onMarkRead={markMangaAsRead}
                  onLinkClicked={() =>
                    runtime?.sendMessage?.({ type: "linkClicked" })
                  }
                />
              );
            })}
          </List>
        </>
      ) : (
        <>
          <MangaListItemControls
            filterData={filterData}
            allManga={props.allManga}
            updated={updated}
          />
          <SearchResults
            data={data}
            addNewManga={addNewManga}
            filterData={filterData}
          />
        </>
      )}
    </Box>
  );
}
const normalizeTitle = (title: string) =>
  (title || "").toLowerCase().replace(/\s/g, "-");
