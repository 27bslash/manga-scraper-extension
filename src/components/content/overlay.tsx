import { useState, useEffect } from "react";
import Manga from "./../../types/manga";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { CustomSnackBar } from "./snackBar";
import { extractTitle } from "./parseTitle";

const Overlay = (props: { title: string }) => {
  console.log("running manga extension", props.title, document.title);
  const [data, setData] = useState<any>(extractTitle(document.title));

  useEffect(() => {
    if (props.title && !/\d+/.test(document.title)) {
      const titleData = extractTitle(document.title);
      setData(titleData);
    }
    if (
      !/\d+/.test(document.title) &&
      !data.domain.includes("chrome-extension")
    ) {
      const interval = setInterval(() => {
        const titleData = extractTitle(document.title);
        setData(titleData);
        if (titleData.chapter) {
          console.log(titleData, "title: ", document.title);
          clearInterval(interval);
        }
      }, 1000);
    }
  }, [props.title]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [confirmationPrompt, setConfirmationPrompt] = useState(false);
  const getLatest = (
    source: {
      [x: string]: {
        url: string;
        latest: string;
        latest_link: string;
        time_updated: number;
      };
    },
    scansite: string,
    chapter: string
  ) => {
    let timeUpdated = Date.now() / 1000;
    console.log(source[scansite], source, scansite);
    if (source[scansite] && "time_updated" in source[scansite]) {
      timeUpdated = source[scansite].time_updated;
    }
    if (source[scansite]) {
      if ("latest" in source[scansite]) {
        if (source[scansite].latest < chapter) {
          source[scansite].latest = chapter;
          source[scansite].latest_link = data["link"];
        }
        return {
          url: data["link"],
          latest: source[scansite].latest,
          chapter: chapter,
          latest_link: source[scansite].latest_link || data["link"],
          time_updated: timeUpdated,
          old_chapters: {},
        };
      }
    }
    return {
      url: data["link"],
      latest: chapter,
      chapter: chapter,
      latest_link: data["link"],
      time_updated: timeUpdated,
      old_chapters: {},
    };
  };

  useEffect(() => {
    chrome.storage.local.get("manga-list", (result) => {
      result["manga-list"].forEach((x: Manga) => {
        // console.log(data.title, x['title'])
        if (titleSimilarity(data.title, x)) {
          // update chapter
          console.log("title is similar", x["title"]);
          setShowPrompt(false);
          if (data["chapter"] > x["chapter"]) {
            console.log("update chapter");
            x["chapter"] = data["chapter"];
            x["scansite"] = data["scansite"];
            x["link"] = data["link"];
            if (!x["sources"]) {
              x["sources"] = {};
            }
            x["sources"][data["scansite"]] = getLatest(
              x["sources"],
              data["scansite"],
              data["chapter"]
            );
            x["sources"]["any"] = x["sources"][data["scansite"]];
            x["read"] = x["chapter"] >= x["latest"];
            console.log("updated series info:", x);
            updateManga(x, updatePrompt);
          }
        }
      });
    });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePrompt = (b: boolean) => {
    setShowPrompt(b);
    setConfirmationPrompt(!b);
  };
  const [open, setOpen] = useState(true);
  useEffect(() => {
    chrome.storage.local.get("blacklist", (result) => {
      let blacklist = result["blacklist"] || [];
      const foundManga = blacklist.find(
        (x: any) => x["title"] === data["title"]
      );
      if (data["chapter"] - 5 >= +foundManga["chapter"]) {
        console.log("title in blacklist", data["title"], foundManga);
        blacklist = blacklist.filter(
          (manga: Manga) => manga["title"] !== data["title"]
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
        (x: any) => x["title"] === data["title"]
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
    reason?: string
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
      return;
    } else {
      setConfirmationPrompt(false);
      setOpen(false);
      return;
    }
  };

  const checkBlacklist = () => {
    chrome.storage.local.get("blacklist", (result) => {
      try {
        const blacklist = result["blacklist"];
        const filteredBlacklist = blacklist.find(
          (x: any) =>
            x["title"] === data["title"] &&
            data["chapter"] - 5 <= +x["chapter"] &&
            data["chapter"] !== +x["latest"]
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
  console.log(
    "state",
    "ch good: ",
    +data["chapter"] > 10,
    "prompt: ",
    showPrompt,
    open
  );
  useEffect(() => {
    checkBlacklist();
  }, []);
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
              <>
                <p onClick={handleClose} className="undo-button-mu">
                  undo
                </p>
              </>
            }
          />
        </ClickAwayListener>
      )}
    </div>
  );
};
const titleSimilarity = (title: string, manga: Manga) => {
  const titleWords = title.split("-");
  const mangaWords = manga["title"].split("-");
  const len =
    titleWords.length > mangaWords.length
      ? titleWords.length
      : mangaWords.length;
  let similarity = 0;
  titleWords.forEach((x) => {
    if (mangaWords.includes(x)) {
      similarity++;
    }
  });
  // console.log('similarity: ', similarity / len, title)
  return similarity / len >= 0.75;
};
const addNewManga = (data: any, updatePrompt: (x: boolean) => void) => {
  chrome.storage.local.get("blacklist", (result) => {
    const blacklist = result["blacklist"];
    const filtered = blacklist.filter((x: any) => x["title"] !== data["title"]);
    chrome.storage.local.set({ blacklist: filtered || [] });
  });
  chrome.runtime.sendMessage(
    {
      type: "insert",
      data: data,
    },
    (response) => {
      console.log("response", response);
    }
  );
  updatePrompt(false);
};

const updateManga = (data: any, updatePrompt: Function) => {
  // console.log(url)
  chrome.storage.local.get("manga-list", (result) => {
    let list = result["manga-list"];
    for (let i = 0; i < list.length; i++) {
      if (list[i]["title"] === data["title"]) {
        console.log("in db", list[i]["title"]);
        const currentSource = list[i]["current_source"];
        list[i] = data;
        list[i]["sources"][currentSource].url = data["link"];
        list[i]["sources"][currentSource].chapter = data["chapter"];
        console.log("list", list);
        break;
      }
    }
    chrome.storage.local.set({ "manga-list": list });
    chrome.runtime.sendMessage({ type: "update", data: list }, (response) => {
      console.log("updated");
    });
  });
  updatePrompt(false);
};

export default Overlay;
