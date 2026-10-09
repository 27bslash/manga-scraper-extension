import { useState, useEffect } from "react";
import Manga from "./../../types/manga";
import { Snackbar } from "@mui/material";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import { CustomSnackBar } from "./snackBar";
import { extractTitle } from "./parseTitle";

const LOG_PREFIX = "[manga-updater]";

const Overlay = (props: { title: string }) => {
  //   console.log("running manga extension", props.title, document.title);
  const [data, setData] = useState<any>(() => {
    const initial = extractTitle(document.title);
    console.log(`${LOG_PREFIX} overlay mounted`, {
      url: window.location.href,
      documentTitle: document.title,
      parsed: initial,
    });
    return initial;
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [confirmationPrompt, setConfirmationPrompt] = useState(false);

  useEffect(() => {
    const titleHasDigits = /\d+/.test(document.title);
    console.log(`${LOG_PREFIX} title effect`, {
      propsTitle: props.title,
      documentTitle: document.title,
      titleHasDigits,
      domain: data?.domain,
    });
    if (props.title && !titleHasDigits) {
      const titleData = extractTitle(document.title);
      console.log(`${LOG_PREFIX} title has no digits yet; setting data`, titleData);
      setData(titleData);
    }
    if (
      !titleHasDigits &&
      !data.domain.includes("chrome-extension")
    ) {
      console.log(`${LOG_PREFIX} starting chapter poll (title had no digits)`);
      const interval = setInterval(() => {
        const titleData = extractTitle(document.title);
        setData(titleData);
        if (titleData.chapter) {
          console.log(`${LOG_PREFIX} poll resolved chapter`, {
            documentTitle: document.title,
            parsed: titleData,
          });
          clearInterval(interval);
        }
      }, 1000);
    }
  }, [props.title, data?.domain]);
  const getLatest = (
    source: {
      [x: string]: {
        url: string;
        latest?: string;
        latest_link?: string;
        chapter?: string;
        time_updated: number;
        old_chapters?: any;
      };
    },
    scansite: string,
    chapter: string,
  ) => {
    let timeUpdated = Date.now() / 1000;
    console.log(`${LOG_PREFIX} getLatest input`, {
      scansite,
      chapter,
      hasScansiteSource: Boolean(source[scansite]),
      sourceKeys: Object.keys(source || {}),
    });
    if (source[scansite] && "time_updated" in source[scansite]) {
      timeUpdated = source[scansite].time_updated;
    }
    if (source[scansite]) {
      const next = {
        ...source[scansite],
        url: data["link"],
        latest: source[scansite].latest || source.any?.latest || chapter,
        chapter: chapter,
        latest_link:
          source[scansite].latest_link ||
          source.any?.latest_link ||
          data["link"],
        time_updated: timeUpdated,
        old_chapters: source[scansite].old_chapters || {},
      };
      console.log(`${LOG_PREFIX} getLatest output (existing source)`, next);
      return next;
    }
    const fallback = {
      url: data["link"],
      latest: source.any?.latest || chapter,
      chapter: chapter,
      latest_link: source.any?.latest_link || data["link"],
      time_updated: timeUpdated,
      old_chapters: {},
    };
    console.log(`${LOG_PREFIX} getLatest output (new source)`, fallback);
    return fallback;
  };

  useEffect(() => {
    console.log(`${LOG_PREFIX} matching parsed page against stored list`, {
      parsedTitle: data?.title,
      parsedChapter: data?.chapter,
      parsedScansite: data?.scansite,
      url: data?.link,
    });
    chrome.storage.local.get("manga-list", (result) => {
      const storedList: Manga[] = result["manga-list"] || [];
      console.log(`${LOG_PREFIX} stored list size`, storedList.length);
      let matchedAny = false;
      storedList.forEach((storedMangaItem: Manga) => {
        const similar = titleSimilarity(data.title, storedMangaItem);
        if (!similar) return;
        matchedAny = true;
        console.log(`${LOG_PREFIX} title is similar`, {
          parsed: data.title,
          stored: storedMangaItem["title"],
          currentSource: storedMangaItem["current_source"],
          parsedChapter: data["chapter"],
          storedChapter: storedMangaItem["chapter"],
          storedLatest: storedMangaItem["latest"],
        });
        setShowPrompt(false);
        if (+data["chapter"] > +storedMangaItem["chapter"]) {
          console.log(
            `${LOG_PREFIX} chapter advanced ${storedMangaItem["chapter"]} -> ${data["chapter"]} (${storedMangaItem["title"]})`,
          );
          storedMangaItem["chapter"] = data["chapter"];
          storedMangaItem["scansite"] = data["scansite"];
          storedMangaItem["link"] = data["link"];
          if (!storedMangaItem["sources"]) {
            storedMangaItem["sources"] = {};
          }
          storedMangaItem["sources"][data["scansite"]] = getLatest(
            storedMangaItem["sources"],
            data["scansite"],
            data["chapter"],
          );
          storedMangaItem["sources"]["any"] =
            storedMangaItem["sources"][data["scansite"]];
          storedMangaItem["read"] =
            +storedMangaItem["chapter"] >= +storedMangaItem["latest"];
          console.log(`${LOG_PREFIX} updated series info`, storedMangaItem);
          updateManga(storedMangaItem);
          updatePrompt(false);
        } else {
          console.log(
            `${LOG_PREFIX} no update: parsed chapter ${data["chapter"]} <= stored ${storedMangaItem["chapter"]}`,
          );
        }
      });
      if (!matchedAny) {
        console.warn(
          `${LOG_PREFIX} no stored title matched parsed title`,
          data.title,
        );
      }
    });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePrompt = (b: boolean) => {
    setShowPrompt(b);
    setConfirmationPrompt(!b);
  };
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (!data) return;
    chrome.storage.local.get("blacklist", (result) => {
      let blacklist = result["blacklist"] || [];
      const foundManga = blacklist.find(
        (x: any) => x["title"] === data["title"],
      );
      if (!foundManga) return;
      if (data["chapter"] - 5 >= +foundManga["chapter"]) {
        console.log("title in blacklist", data["title"], foundManga);
        blacklist = blacklist.filter(
          (manga: Manga) => manga["title"] !== data["title"],
        );
        chrome.storage.local.set({ blacklist: blacklist }, () => {
          setOpen(true);
        });
      }
    });
  }, [data]);
  const addToBlackList = (title: string) => {
    chrome.storage.local.get("blacklist", (result) => {
      if (!result["blacklist"]) {
        result["blacklist"] = [];
      }
      let blacklist: { title: string; chapter: string }[] = result["blacklist"];
      const foundManga = blacklist.find(
        (x: any) => x["title"] === data["title"],
      );
      console.log("blacklist", blacklist, foundManga);
      if (!foundManga) {
        console.log("add to black list: ", title);
        blacklist.push({ title: title, chapter: data["chapter"] });
      }
      // else if (foundManga && data['chapter'] - 5 >= +foundManga['chapter']) {
      //     console.log('title in blacklist', data['title'], foundManga)
      //     blacklist = blacklist.filter((manga) => manga['title'] !== data['title'])
      // }
      chrome.storage.local.set({ blacklist: blacklist }, () => {
        setOpen(false);
      });
    });
  };
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (event) {
      let target = event.target as HTMLElement;
      if (target.tagName === "path") {
        const parent = target.parentElement;
        if (parent) {
          target = parent;
        }
      }
      if (target.tagName === "svg") {
        if (target.classList.contains("close-icon-mu")) {
          setOpen(false);
          addToBlackList(data["title"]);
          return;
        } else if (target.classList.contains("add-icon-mu")) {
          setConfirmationPrompt(true);
          setOpen(false);
          return;
        }
      }
      if (reason === "clickaway") {
        setOpen(false);
        console.log("reason", reason);
        return;
      }
    }
    if (reason === "timeout" || reason === "clickaway") {
      console.log("close", reason);
      setOpen(false);
      addNewManga(data, updatePrompt);
      setConfirmationPrompt(false);
    } else {
      setConfirmationPrompt(false);
      setOpen(false);
    }
  };

  const checkBlacklist = () => {
    chrome.storage.local.get("blacklist", (result) => {
      try {
        const blacklist = result["blacklist"];
        const filteredBlacklist = blacklist.find(
          (x: any) =>
            x["title"] === data["title"] &&
            data["chapter"] - 5 <= +x["chapter"],
        );
        if (filteredBlacklist) {
          setOpen(false);
          return false;
        }
      } catch (error) {
        console.error("error", error);
        setOpen(true);
        return true;
      }
    });
    return true;
  };
  const handleClickAway = () => {
    addNewManga(data, updatePrompt);
    setConfirmationPrompt(false);
  };
  //   console.log(
  //     "state",
  //     "ch good: ",
  //     +data["chapter"] > 10,
  //     "prompt: ",
  //     showPrompt,
  //     open
  //   );
  useEffect(() => {
    checkBlacklist();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="manga-overlay">
      {+data["chapter"] > 10 && showPrompt && (
        // <CustomSnackBar open={open} handleClose={handleClose}>
        <CustomSnackBar open={open} handleClose={handleClose}></CustomSnackBar>
      )}
      {confirmationPrompt && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={!open}
            onClose={handleClose}
            message={data["title"].replace(/-/g, " ") + " " + data["chapter"]}
            autoHideDuration={3000}
            sx={{ textTransform: "capitalize", color: "secondary !important" }}
            action={
              <p onClick={handleClose} className="undo-button-mu">
                undo
              </p>
            }
          />
        </ClickAwayListener>
      )}
    </div>
  );
};
const titleSimilarity = (title: string, manga: Manga) => {
  const titleWords = title.split("-");
  if (!manga["title"]) return false;
  const mangaWords = manga["title"].split("-");
  const len = Math.max(titleWords.length, mangaWords.length);
  let similarity = 0;
  titleWords.forEach((x) => {
    if (mangaWords.includes(x)) {
      similarity++;
    }
  });
  const ratio = similarity / len;
  if (ratio > 0) {
    console.log(`${LOG_PREFIX} titleSimilarity`, {
      parsed: title,
      stored: manga["title"],
      ratio,
      pass: ratio >= 0.75,
    });
  }
  return ratio >= 0.75;
};
const addNewManga = (data: any, updatePrompt: (x: boolean) => void) => {
  chrome.storage.local.get("blacklist", (result) => {
    const blacklist = result["blacklist"];
    const filtered = blacklist.filter((x: any) => x["title"] !== data["title"]);
    chrome.storage.local.set({ blacklist: filtered || [] });
  });
  console.log("adding new manga", data);
  chrome.runtime.sendMessage(
    {
      type: "insert",
      data: data,
    },
    (response) => {
      console.log("response", response);
    },
  );
  updatePrompt(false);
};

const updateManga = (data: any) => {
  // console.log(url)
  console.log(`${LOG_PREFIX} updateManga: writing`, {
    title: data["title"],
    chapter: data["chapter"],
    scansite: data["scansite"],
    read: data["read"],
  });
  chrome.storage.local.get("manga-list", (result) => {
    let list = result["manga-list"];
    let matched = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i]["title"] === data["title"]) {
        matched = true;
        console.log("in db", list[i]["title"]);
        const currentSource = list[i]["current_source"];
        console.log(`${LOG_PREFIX} updateManga: matched stored item`, {
          title: list[i]["title"],
          currentSource,
          oldChapter: list[i]["sources"]?.[currentSource]?.chapter,
          newChapter: data["chapter"],
          sourceKeys: Object.keys(list[i]["sources"] || {}),
        });
        list[i] = data;
        list[i]["sources"][currentSource].url = data["link"];
        list[i]["sources"][currentSource].chapter = data["chapter"];
        break;
      }
    }
    if (!matched) {
      console.warn(
        `${LOG_PREFIX} updateManga: no stored item matched title`,
        data["title"],
      );
    }
    chrome.storage.local.set({ "manga-list": list }, () => {
      console.log(`${LOG_PREFIX} updateManga: local storage written`);
    });
    chrome.runtime.sendMessage({ type: "update", data: list }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          `${LOG_PREFIX} updateManga: sendMessage failed`,
          chrome.runtime.lastError.message,
        );
      } else {
        console.log(`${LOG_PREFIX} updateManga: sent to background`, response);
      }
    });
  });
};

export default Overlay;
