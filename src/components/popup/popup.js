import ReactDOM from "react-dom";
import CheckboxList from "./manga-list/manga-list";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
function Popup() {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          type: "dark",
          primary: {
            main: "#26a27b",
          },
          secondary: {
            main: "#fafafa",
          },
        },
      })}
    >
      <CssBaseline />
      <div className="Popup">
        <CheckboxList />
      </div>
    </ThemeProvider>
  );
}
export default Popup;
ReactDOM.render(<Popup />, document.getElementById("react-target"));
