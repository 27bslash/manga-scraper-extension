import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MouseEvent, useState } from "react";
import { gridItemProps } from "./gridItem";

interface OldChapterSelectorProps {
  data: gridItemProps;
  chapterOptions: string[];
}

const OldChapterSelector = ({
  data,
  chapterOptions,
}: OldChapterSelectorProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const checkUrlFormat = (url: string) => {
    // check if url contains {chapter}
    if (!url) return null;
    return url.match(/^(.*chapter.?)(\d+)(.?)$/gm);
  };
  if (checkUrlFormat(data.currentUrl)) {
    chapterOptions = Array.from({ length: +data.latest }, (_, i) =>
      String(i + 1),
    );
  } else {
    // invisible box same width as icon button to prevent layout shift when button appears
    return <Box width="20px"></Box>;
  }
  const lateCurrentChapter = data.chapter / +data.latest > 0.5;
  const sortedOldChapters = chapterOptions
    .map(Number)
    .sort((a, b) => {
      if (lateCurrentChapter) {
        // sort in descending order
        return b - a;
      }
      return a - b;
    })
    .map(String);
  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{ verticalAlign: "middle", p: 0, minWidth: 18 }}
      >
        <MenuIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        sx={{ padding: 0, margin: 0, maxHeight: "180px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {sortedOldChapters.map((chapterString) => (
          <MenuItem
            key={chapterString}
            autoFocus={chapterString === data.chapter.toString()}
            selected={chapterString === data.chapter.toString()}
            onClick={() => {
              data.onOldChapterChange(
                chapterString === data.chapter.toString() ? "" : chapterString,
              );
              handleMenuClose();
            }}
          >
            {chapterString}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default OldChapterSelector;

