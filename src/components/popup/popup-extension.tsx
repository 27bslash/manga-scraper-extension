import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import Popup from "./popup";
import { AllManga } from "../../types/manga";
import "../../App.css";

function PopupExtensionRoot() {
  const [allManga, setAllManga] = useState<AllManga[]>([]);

  useEffect(() => {
    const runtime = chrome.runtime;
    if (!runtime?.sendMessage) {
      return;
    }

    runtime.sendMessage({ type: "popupOpened" }, () => {
      const runtimeError = runtime.lastError;
      if (runtimeError) {
        console.error("Failed to notify popup open:", runtimeError.message);
      }
    });

    runtime.sendMessage({ type: "getAllManga" }, (response) => {
      const runtimeError = runtime.lastError;
      if (runtimeError) {
        console.error("Failed to load all manga:", runtimeError.message);
        return;
      }

      const data: AllManga[] = response?.getAllManga;
      if (Array.isArray(data) && data.length > 0) {
        setAllManga(data);
      }
    });
  }, []);

  return <Popup allManga={allManga} />;
}

ReactDOM.render(
  <PopupExtensionRoot />,
  document.getElementById("react-target"),
);
