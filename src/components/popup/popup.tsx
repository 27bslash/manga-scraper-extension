import UserMangaList from "./manga-list/manga-list";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Manga, { AllManga } from "../../types/manga";

type PopupProps = {
  allManga?: AllManga[];
  demoMangaList?: Manga[];
};

function Popup({ allManga = [], demoMangaList = [] }: PopupProps) {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: {
            main: "#3f51b5",
          },
          secondary: {
            main: "rgb(220, 0, 78)",
          },
        },
      })}
    >
      <CssBaseline />
      <UserMangaList allManga={allManga} demoMangaList={demoMangaList} />
    </ThemeProvider>
  );
}
export default Popup;
