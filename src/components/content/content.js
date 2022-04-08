import ReactDOM from "react-dom";
import Overlay from "./overlay";

const App = () => {
  return <Overlay />;
};

const app = document.createElement("div");
app.id = "manga-updater-overlay";
document.body.appendChild(app);

ReactDOM.render(<App />, app);
