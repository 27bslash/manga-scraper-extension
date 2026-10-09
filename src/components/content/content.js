import ReactDOM from "react-dom";
import Overlay from "./overlay";
import { useState, useEffect } from "react";

const LOG_PREFIX = "[manga-updater]";
let lastTitle = "";

const App = () => {
  const [title, setTitle] = useState("");
  const callback = (mutationList) => {
    for (const mutation of mutationList) {
      if (
        mutation.type === "childList" ||
        mutation.type === "characterData"
      ) {
        if (document.title !== lastTitle) {
          console.log(`${LOG_PREFIX} document.title changed`, {
            from: lastTitle,
            to: document.title,
            mutationType: mutation.type,
          });
          lastTitle = document.title;
        }
        setTitle(document.title);
        break;
      }
    }
  };
  useEffect(() => {
    console.log(`${LOG_PREFIX} content script mounted`, {
      url: window.location.href,
      documentTitle: document.title,
    });
    lastTitle = document.title;
    setTitle(document.title);

    const head = document.querySelector("head");
    if (!head) {
      console.warn(`${LOG_PREFIX} no <head> found; cannot observe title changes`);
      return;
    }

    console.log(`${LOG_PREFIX} observing <head> for title changes`);
    const observer = new MutationObserver(callback);
    observer.observe(head, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      console.log(`${LOG_PREFIX} disconnecting title observer`);
      observer.disconnect();
    };
  }, []);
  return <Overlay title={title}></Overlay>;
};

const app = document.createElement("div");
app.id = "manga-updater-overlay";
document.body.appendChild(app);
console.log(`${LOG_PREFIX} mounting overlay into`, {
  id: app.id,
  url: window.location.href,
});

ReactDOM.render(<App />, app);
