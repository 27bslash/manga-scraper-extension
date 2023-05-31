import ReactDOM from "react-dom";
import Overlay from "./components/content/overlay";
import './App.css'

const App = () => {
    return <Overlay title='test'/>;
};

const app = document.createElement("div");
app.id = "manga-updater-overlay";
app.textContent = "trsti";
document.body.appendChild(app);

ReactDOM.render(<App />, app);
