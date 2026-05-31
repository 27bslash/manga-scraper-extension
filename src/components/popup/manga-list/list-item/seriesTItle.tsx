import { Box, Tooltip } from "@mui/material";
import { MouseEvent } from "react";
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
  updateRead: (url: string) => void;
  title: string;
  source?: string;
}) => {
  const handleClick = () => {
    props.updateRead(props.url);
  };

  const handleAuxClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 1) {
      props.updateRead(props.url);
    }
  };

  return (
    <Box
      display={"flex"}
      sx={{ minWidth: 0, width: "100%", flex: "1 1 0" }}
    >
      <Tooltip title={props.url}>
        <a
          href={props.url}
          rel="noreferrer"
          target="_blank"
          onClick={() => handleClick()}
          onAuxClick={handleAuxClick}
          className="series-title"
        >
          {capitalizeTitle(props.title)}
        </a>
      </Tooltip>
    </Box>
  );
};
