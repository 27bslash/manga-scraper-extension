import ReactDOM from "react-dom";
import Overlay from "./overlay";
import { useState, useEffect } from "react";
const App = () => {
  const [title, setTitle] = useState("");
  console.log("app");
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        setTitle(document.title);
        break;
        // console.log("A child node has been added or removed.");
      }
    }
  };
  const observer = new MutationObserver(callback);
  const addObserver = () => {
    if (!document.querySelector("head")) {
      window.setTimeout(addObserver, 500);
    }
    observer.observe(document.querySelector("head"), {
      subtree: true,
      childList: true,
    });
  };
  useEffect(() => {
    addObserver();
  }, []);
  return <Overlay title={title}></Overlay>;
};

const app = document.createElement("div");
app.id = "manga-updater-overlay";
document.body.appendChild(app);

ReactDOM.render(<App />, app);
