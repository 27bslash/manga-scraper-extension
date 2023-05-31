import ReactDOM from "react-dom";
import Overlay from "./overlay";
import { useState, useEffect } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const targetNode = document.getElementsByTagName("title")[0];
  console.log("tatr", targetNode);
  const config = { childList: true};

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        setTitle(document.title)
        break
        // console.log("A child node has been added or removed.");
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  return <Overlay title={title}></Overlay>;
};

const app = document.createElement("div");
app.id = "manga-updater-overlay";
document.body.appendChild(app);

ReactDOM.render(<App />, app);
