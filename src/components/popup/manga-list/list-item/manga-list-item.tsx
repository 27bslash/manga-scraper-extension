import { useEffect, useState } from "react";
import { Grid, ListItem, Divider } from "@mui/material";
import Manga from "../../../../types/manga";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Checkboxbutton from "./../../buttons/checkboxButton";
import { MangaData } from "./gridItem";
TimeAgo.addDefaultLocale(en);

interface MListItemProps {
  data: Manga;
  idx: number;
  checked: any;
  handleToggle: (value: number, title: string) => void;
  mangaList: Manga[];
  onMangaUpdate: (title: string, updater: (m: Manga) => void) => void;
  onMarkRead: (title: string, source: string) => void;
  onLinkClicked: () => void;
}
const MListItem = (props: MListItemProps) => {
  // const [props.editing, setEditing] = useState(true)
  const normalizedTitle = props.data.title.replace(/\s/g, "-").toLowerCase();
  //   const [url, setCurrentUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [latestUrl, setLatestUrl] = useState("");
  const [currentSource, setCurrentSource] = useState(props.data.current_source);
  const [chapter, setChapter] = useState<number>();
  const [latest, setLatest] = useState(props.data.latest);
  const [timeAgo, setTimeAgo] = useState("");
  const [updateReadStatus, setUpdateReadStatus] = useState(false);
  const [selectedOldChapter, setSelectedOldChapter] = useState<string>("");
  const [availableOldChapters, setAvailableOldChapters] = useState<string[]>(
    [],
  );

  const handleOldChapterChange = (chapterValue: string) => {
    console.log("selected old chapter", chapterValue);
    const newChapter = chapterValue;
    setSelectedOldChapter(newChapter);

    const mangaListItem: Manga | undefined = props.mangaList.find(
      (res: Manga) =>
        res.title.replace(/\s/g, "-").toLowerCase() === normalizedTitle,
    );
    if (!mangaListItem) return;
    const currSource = currentSource;
    const latestChapter = +mangaListItem.sources[currSource].latest;
    const selectedChapterNum = newChapter
      ? +newChapter
      : +mangaListItem.sources[currSource].chapter;

    props.onMangaUpdate(props.data.title, (element) => {
      const source = element.sources[currSource];
      element.chapter = newChapter || source.chapter;
      source.chapter = newChapter || source.chapter;
      if (newChapter) {
        element.read = selectedChapterNum >= latestChapter;
      }
      console.log("updated chapter selection", element.title, newChapter);
    });

    if (newChapter && selectedChapterNum < latestChapter) {
      setUpdateReadStatus(true);
    } else {
      setUpdateReadStatus(false);
    }
  };

  useEffect(() => {
    const allSources = Object.keys(props.data.sources);
    if (allSources.includes(props.data.current_source))
      setCurrentSource(props.data.current_source);
    if (
      !allSources.includes(props.data.current_source) &&
      allSources.includes("any")
    ) {
      console.log("DEFUALT TO ANY: ", props.data);
      setCurrentSource("any");
    }
  }, [props.data.current_source, props.data]);

  const updateMangaLinks = () => {
    const badSources = ["mangadex", "reaperscans"];
    const mangaItem: Manga | undefined = props.mangaList.find(
      (res: Manga) =>
        res.title.replace(/\s/g, "-").toLowerCase() === normalizedTitle,
    );
    if (!mangaItem) return;

    const currSource = mangaItem.current_source;
    const oldChapters = resolveOldChapters(mangaItem, currSource);
    setAvailableOldChapters(oldChapters);

    const chapterNum =
      +mangaItem.sources[currSource].chapter || +mangaItem.chapter;
    const autoSelectedOldChapter = autoSelectOldChapter(
      oldChapters,
      chapterNum,
    );

    if (autoSelectedOldChapter) {
      setSelectedOldChapter(autoSelectedOldChapter);
      console.log(
        "auto selected old chapter",
        autoSelectedOldChapter,
        mangaItem.title,
      );
    }

    const chapter = resolveChapter(mangaItem, currSource);
    setChapter(chapter);
    setLatest(mangaItem.sources[currSource].latest);
    const link = resolveCurrentUrl(
      mangaItem,
      currSource,
      autoSelectedOldChapter,
    );
    setCurrentUrl(link);

    if (shouldUpdateReadStatus(mangaItem, currSource, link, badSources)) {
      setUpdateReadStatus(true);
    }

    setLatestUrl(mangaItem.sources[currSource].latest_link);
  };
  useEffect(() => {
    updateMangaLinks();
  }, [props.data, currentSource, selectedOldChapter]); // eslint-disable-line react-hooks/exhaustive-deps
  // const [latestUrl, setLatestUrl] = useState(props.data.latestLink);

  const updateCurrentSource = (key: string) => {
    try {
      props.onMangaUpdate(props.data.title, (element) => {
        element.current_source = key;
      });
      console.log("set current source", key, props.data.title);
      setCurrentSource(key);
    } catch (e) {
      console.log(e, "set current source");
    }
  };

  const markAsRead = (url: string) => {
    if (!isManifestManagedUrl(url)) {
      props.onMarkRead(props.data.title, currentSource);
    }
    props.onLinkClicked();
  };
  useEffect(() => {
    try {
      let defaultSource = props.data.sources[currentSource]
        ? currentSource
        : "any";
      const timeAgoFormatter = new TimeAgo("en-US");
      const currentTime = new Date().getTime() / 1000;
      const timeDelta =
        currentTime - props.data.sources[defaultSource].time_updated;
      const formattedTimeAgo = timeAgoFormatter.format(
        Date.now() - timeDelta * 1000,
      );
      setTimeAgo(String(formattedTimeAgo));
    } catch (error) {
      console.log("%c error", "color: red", error, props.data, currentSource);
    }
  }, [currentSource, props.data]);
  // console.log('mlist current source', currentSource)

  return (
    <Grid
      className="manga-updater-list-item"
      key={props.idx}
      sx={{
        borderBottom: 1,
        borderColor: "primary.main",
        display: "flex",
        width: "100%",
        m: 0,
        overflow: "hidden",
      }}
      container
      rowSpacing={0}
      columnSpacing={0}
    >
      <ListItem
        disableGutters
        disablePadding={true}
        sx={{ width: "100%", px: 1.5 }}
      >
        <Grid item xs={1} sm={1} md={1} sx={{ flexShrink: 0 }}>
          <Checkboxbutton
            checked={props.checked}
            handleToggle={props.handleToggle}
            idx={props.idx}
            title={props.data.title}
          />
        </Grid>
        <MangaData
          title={props.data.title}
          currentSource={currentSource}
          latest={latest}
          updateReadStatus={updateReadStatus}
          currentUrl={currentUrl}
          timeAgo={timeAgo}
          chapter={chapter!}
          latestUrl={latestUrl}
          sources={props.data.sources}
          updateUrl={updateCurrentSource}
          onMarkRead={markAsRead}
          availableOldChapters={availableOldChapters}
          selectedOldChapter={selectedOldChapter}
          onOldChapterChange={handleOldChapterChange}
        ></MangaData>
      </ListItem>
      <Divider light sx={{ width: "100%", mx: 0 }} />
    </Grid>
  );
};

// Resolves the current chapter number based on the manga item and source
function resolveChapter(mangaItem: Manga, currSource: string): number {
  const chapterNum =
    +mangaItem.sources[currSource].chapter || +mangaItem.chapter;
  const latest = +mangaItem.sources[currSource].latest;

  if (chapterNum > latest) {
    return latest;
  }
  return chapterNum;
}

// Returns an array of old chapters, sorted numerically
function resolveOldChapters(mangaItem: Manga, currSource: string): string[] {
  /** Returns an array of old chapters if they exist, sorted numerically */
  const oldChapters = mangaItem.sources[currSource].old_chapters;
  if (!oldChapters || Object.keys(oldChapters).length === 0) return [];

  return Object.keys(oldChapters)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b)
    .map(String);
}
// Selects the closest old chapter if none is selected
function autoSelectOldChapter(
  chapters: string[],
  currentChapter: number,
): string | undefined {
  /**
   * Selects the next chapter (current + 1) from available chapter keys.
   * @param chapters Available chapter keys as strings.
   * @param currentChapter Current stored chapter number.
   * @returns Matching next chapter key, or `undefined` if none exists.
   */

  if (!chapters || chapters.length === 0) return "";
  const target = currentChapter + 1;
  return chapters.find((ch) => +ch === target) || undefined;
}
function shouldUpdateReadStatus(
  mangaItem: Manga,
  currSource: string,
  link: string,
  badSources: string[] = ["mangadex", "reaperscans"], // sources that do not reliably update chapter URLs
): boolean {
  const chapterNum =
    +mangaItem.sources[currSource].chapter || +mangaItem.chapter;
  const latest = +mangaItem.sources[currSource].latest;

  if (!link) return true;
  if (!mangaItem.sources[currSource]) return true;
  if (+latest - +chapterNum <= 1) return false;
  if (badSources.includes(currSource)) return false;

  return true;
}

// Resolves the current URL based on chapter selection and old chapters
function resolveCurrentUrl(
  mangaItem: Manga,
  currSource: string,
  selectedOldChapter?: string,
): string {
  const latest_link = mangaItem.sources[currSource].latest_link;
  const current_link = mangaItem.sources[currSource].url;
  const chapterNum =
    +mangaItem.sources[currSource].chapter || +mangaItem.chapter;
  const oldChapters = mangaItem.sources[currSource].old_chapters || {};
  const latest = mangaItem.sources[currSource].latest;

  if (selectedOldChapter && oldChapters[selectedOldChapter]) {
    return oldChapters[selectedOldChapter].latest_link;
  }

  if (
    current_link &&
    current_link.includes("chapter") &&
    +latest - chapterNum > 1
  ) {
    const next = current_link.replace(
      /^(.*chapter.?)(\d+)(.?)$/i,
      (_, prefix, number, suffix) => {
        return `${prefix}${parseInt("" + chapterNum) + 1}${suffix}`;
      },
    );
    return next;

    // return getNextChapterUrl(oldChapters, chapterNum, modifiedLink, latest);
  } else if (!current_link) {
    console.log(mangaItem.title, "missing current link for source", currSource);
  }

  return latest_link || mangaItem.link;
}
export default MListItem;

function isManifestManagedUrl(url: string): boolean {
  try {
    const runtime = globalThis?.chrome?.runtime;
    const manifest = runtime?.getManifest?.();
    const matches =
      manifest?.content_scripts?.flatMap((script) => script.matches || []) ||
      [];
    if (!matches.length) return false;

    const parsed = new URL(url);
    return matches.some((pattern) => matchUrlPattern(parsed, pattern));
  } catch (error) {
    console.log("failed manifest url check", error, url);
    return false;
  }
}

function matchUrlPattern(target: URL, pattern: string): boolean {
  const m = pattern.match(/^(\*|http|https|file|ftp):\/\/([^/]+)\/(.*)$/i);
  if (!m) return false;

  const scheme = m[1];
  const hostPattern = m[2];
  const pathPattern = m[3] || "*";

  if (scheme !== "*" && target.protocol.replace(":", "") !== scheme) {
    return false;
  }
  if (!matchHost(target.hostname, hostPattern)) {
    return false;
  }
  return wildcardMatch(target.pathname + target.search, `/${pathPattern}`);
}

function matchHost(hostname: string, pattern: string): boolean {
  if (pattern === "*") return true;
  return wildcardMatch(hostname, pattern);
}

function wildcardMatch(value: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escaped.replace(/\*/g, ".*")}$`, "i");
  return regex.test(value);
}
