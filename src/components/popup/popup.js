import ReactDOM from "react-dom";
import CheckboxList from "./manga-list/manga-list";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
function Popup() {
  const [allManga, setAllManga] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(
          "https://27bslash.eu.pythonanywhere.com/db/manga-list/all"
        ),
        data = await res.json();
      console.log("run once");
      if (data.length > 0) {
        setAllManga(data);
      }
    })();
  }, []);
  console.log("%c allManga, ", "color: cyan", allManga);
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          type: "light",
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
      <div className="Popup">
        <CheckboxList allManga={allManga} />
      </div>
    </ThemeProvider>
  );
}
export default Popup;
ReactDOM.render(<Popup />, document.getElementById("react-target"));
