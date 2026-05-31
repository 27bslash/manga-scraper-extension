import { Grid, Tooltip } from "@mui/material";
import OptionsMenu from "./options-menu";
import { TitleElement } from "./seriesTItle";
import Manga from "../../../../types/manga";
import { MouseEvent, useState } from "react";

import OldChapterSelector from "./oldChapterSelector";
export interface gridItemProps {
  title: string;
  currentSource: string;
  latest: string;
  latestUrl: string;
  updateReadStatus: boolean;
  chapter: number;
  timeAgo: string;
  currentUrl: string;
  sources: Manga["sources"];
  updateUrl: (key: string) => void;
  onMarkRead: (url: string) => void;
  availableOldChapters: string[];
  selectedOldChapter: string;
  onOldChapterChange: (chapter: string) => void;
}
export const MangaData = (props: gridItemProps) => {
  const chapterOptions = props.availableOldChapters;
  console.log(
    "title",
    props.title,
    "availableOldChapters",
    props.availableOldChapters,
  );
  return (
    <>
      <Grid
        item
        xs={6}
        sx={{ minWidth: 0, overflow: "hidden", maxWidth: "100%" }}
      >
        {(+props.latest - +props.chapter <= 1 || props.updateReadStatus) &&
        props.availableOldChapters.length <= 0 &&
        !props.selectedOldChapter ? (
          <TitleElement
            url={props.latestUrl}
            updateRead={props.onMarkRead}
            title={props.title}
          />
        ) : (
          <TitleElement
            url={props.currentUrl}
            updateRead={props.onMarkRead}
            title={props.title}
            source={props.currentSource}
          />
        )}
      </Grid>
      <Grid
        item
        xs={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Chapters data={props} chapterOptions={chapterOptions} />
        <p
          className="text-small"
          style={{
            margin: 0,
            lineHeight: 1.1,
            textAlign: "right",
            width: "100%",
          }}
        >
          {props.timeAgo}
        </p>
      </Grid>
      <Grid
        item
        xs={3}
        sx={{
          minWidth: 0,
          overflow: "hidden",
          display: "flex",
          justifyContent: "flex-end",
          pr: 0,
        }}
      >
        <OptionsMenu
          currentSource={props.currentSource}
          sources={props.sources}
          updateUrl={props.updateUrl}
          title={props.title}
        />
      </Grid>
    </>
  );
};
interface ChaptersProps {
  data: gridItemProps;
  chapterOptions: string[];
}

function Chapters({ data, chapterOptions }: ChaptersProps) {
  const handleAuxClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 1) {
      data.onMarkRead(data.currentUrl);
    }
  };

  return (
    <p
      className="list-item-text"
      id="chapter-text"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        gap: "0.1rem",
        margin: 0,
        padding: 0,
        width: "100%",
      }}
    >
      <OldChapterSelector data={data} chapterOptions={chapterOptions} />
      <Tooltip title={data.currentUrl}>
        <a
          href={data.currentUrl}
          rel="noreferrer"
          target="_blank"
          onClick={() => data.onMarkRead(data.currentUrl)}
          onAuxClick={handleAuxClick}
          style={{ padding: 0, margin: 0 }}
        >
          {data.chapter}
        </a>
      </Tooltip>
      <span style={{ margin: "0 0.1rem" }}>/</span>
      <Tooltip title={data.latestUrl}>
        <a
          href={data.latestUrl}
          rel="noreferrer"
          target="_blank"
          onClick={() => data.onMarkRead(data.latestUrl)}
          onAuxClick={(event) => {
            if (event.button === 1) {
              data.onMarkRead(data.latestUrl);
            }
          }}
          style={{ padding: 0, margin: 0 }}
        >
          {data.latest}
        </a>
      </Tooltip>
    </p>
  );
}
