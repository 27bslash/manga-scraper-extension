import { Box, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import Manga from "../../../../types/manga";
import EditIcon from "@mui/icons-material/Edit";
const capitalizeTitle = (title: string) => {
  // capitalize first letter of each word
  let split = " ";
  if (title.includes("-")) {
    split = "-";
  }
  return title
    .split(split)
    .map((word: string, i: number) => {
      if (i === 0 && !/^(.)\1+$/.test(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else if (/^(.)\1+$/.test(word)) {
        // if word is all the same character
        return word.toUpperCase();
      } else if (word !== "of" && word !== "a") {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(" ");
};

export const TitleElement = (props: {
  url: string;
  updateRead: () => void;
  title: string;
  source?: string;
}) => {
  const sources = [
    "asurascans",
    "slayerscans",
    "mangaplus",
    "mangasushi",
    "kouhai",
    "realmscans",
    "comikey",
    "danke.moe",
    "kireicake",
    "setsuscans",
    "luminousscans",
    "reaperscans",
    "mangadex",
    "dynasty-scans",
    "guya.moe",
    "flamescans",
    "viewer.heros-web",
    "gdstmp.site",
    "webtoons",
    "mm-scans",
    "leviatanscans",
    "onepiecechapters",
    "alpha-scans",
    "sensescans",
    "cosmicscans",
  ];

  const [text, setText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const handleClick = () => {
    if (!props.source || !sources.includes(props.source)) {
      props.updateRead();
    }
  };
  const handleChange = (event: any) => {};
  const handleTextChange = (event: any) => {
    setText(event.target.value);
  };
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    console.log("submit", text);
    chrome.storage.local.get("manga-list", (res) => {
      const mangaList = res["manga-list"];
      const target = mangaList.find((res: Manga) => res.title === props.title);
      target.alternate_titles
        ? target.alternate_titles.push(text)
        : (target.alternate_titles = [text]);
      chrome.storage.local.set({ "manga-list": mangaList }, () => {
        console.log("updated", target);
        setText("");
      });
    });
  };

  return (
    <Box display={"flex"}>
      <p className="series-title">
        <a
          href={props.url}
          rel="noreferrer"
          target="_blank"
          onClick={() => handleClick()}
        >
          {capitalizeTitle(props.title)}
        </a>
      </p>
    </Box>
  );
};
