import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect } from "react";

interface OptionsMenuProps {
  sources: {
    [key: string]: { url: string; latest: string; latest_link: string };
  };
  currentSource: string;
  updateUrl: (key: string) => void;
  title: string;
}
export default function OptionsMenu(props: OptionsMenuProps) {
  const [displaySource, setDisplaySource] = useState("any");
  const handleChange = (event: SelectChangeEvent) => {
    setDisplaySource(event.target.value as string);
    props.updateUrl(event.target.value as string);
  };
  useEffect(() => {
    const sourceKeys = Object.keys(props.sources || {});
    if (sourceKeys.length === 0) {
      setDisplaySource("any");
      return;
    }

    if (props.currentSource === "any") {
      const anyLatestLink = props.sources.any?.latest_link;
      let matchedSource = "";
      for (const k in props.sources) {
        if (
          k !== "any" &&
          anyLatestLink &&
          props.sources[k]?.latest_link === anyLatestLink
        ) {
          matchedSource = k;
          break;
        }
      }
      setDisplaySource(matchedSource || "any");
    } else {
      setDisplaySource(
        props.sources[props.currentSource]
          ? props.currentSource
          : sourceKeys[0] || "any",
      );
    }
  }, [props.currentSource, props.sources]);

  return (
    <Box
      className="options-wrapper"
      justifyContent={"flex-end"}
      display={"flex"}
      sx={{ width: "100%" }}
    >
      <FormControl variant="standard">
        <Select
          disableUnderline
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={displaySource}
          label="Source"
          onChange={handleChange}
          sx={{
            width: "100%",
            "& .MuiSelect-select": {
              textAlign: "right",
              pr: "20px !important",
            },
            "& .MuiSelect-icon": {
              right: 0,
            },
          }}
        >
          {Object.keys(props.sources).map((key: string, idx: number) => {
            return (
              <MenuItem key={idx} value={key}>
                {key}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
