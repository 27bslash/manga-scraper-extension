import ReactDOM from "react-dom";
import Overlay from "./overlay";
import { useState, useEffect } from "react";
const App = () => {
  const [title, setTitle] = useState("");
  console.log("app");
  const callback = (mutationList) => {
    for (const mutation of mutationList) {
      if (
        mutation.type === "childList" ||
        mutation.type === "characterData"
      ) {
        setTitle(document.title);
        break;
      }
    }
  };
  useEffect(() => {
    setTitle(document.title);

    const head = document.querySelector("head");
    if (!head) {
      return;
    }

    const observer = new MutationObserver(callback);
    observer.observe(head, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  return <Overlay title={title}></Overlay>;
};

const app = document.createElement("div");
app.id = "manga-updater-overlay";
document.body.appendChild(app);

ReactDOM.render(<App />, app);
