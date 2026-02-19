/* eslint-disable no-undef */
const WS_URL = "wss://0igubzuowh.execute-api.eu-west-2.amazonaws.com/dev";
let ws = null;
let wsReconnectTimer = null;
let wsUser = null;
let wsManualClose = false;
let wsConnecting = false;

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
  if (details.temporary) {
    console.log("This is a test install, skipping user initialization");
    // chrome.storage.local.set({ id: "1654712225690" });
    chrome.storage.local.set({ id: "test" });
  }
  if (details.reason === "install") {
    console.log("This is a first install!", chrome.runtime.id);
    initialiseNewUser();
  }
  startWebSocket();
  updateStorage();
});
chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started");
  startWebSocket();
  updateStorage();
});
chrome.storage.onChanged.addListener(() => {
  console.log("storage changed");
  updateBadgeText();
  startWebSocket();
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "update") {
    const mangaList = message.data;
    console.log("Received updated manga list:", mangaList);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "linkClicked") {
    chrome.storage.local.set({ showOverlay: false });
  }
  console.log(request.type);
  (async () => {
    const response = await postData(request.type, request.data);
    sendResponse({ [request.type]: response, data: request.data });
  })();
  return true;
});

function updateBadgeText() {
  chrome.storage.local.get("manga-list", (result) => {
    let badgeText = "0";
    let badgeColor = "#000000ff";
    try {
      const unread =
        result["manga-list"].filter((x) => {
          if (
            x.sources[x.current_source] &&
            x.sources[x.current_source].chapter
          ) {
            if (
              +x.sources[x.current_source].chapter <
              +x.sources[x.current_source].latest
            ) {
              return true;
            }
          } else {
            // console.log("no chapter", x.title, x.current_source, x.read);
            return !x.read;
          }
        }) || [];
      const currentTime = Date.now() / 1000;
      const recentUnread =
        unread.filter(
          (x) => currentTime - x.sources[x.current_source].time_updated < 86400,
        ) || [];
      badgeText = unread.length ? String(unread.length) : "";
      if (recentUnread.length > 0) {
        badgeColor = "#c21e1eff"; // Red for new chapters
      }
      console.log("Badge count:", badgeText);
    } catch {
      badgeText = "";
    }
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  });
}

function buildWebSocketUrl(user) {
  try {
    const url = new URL(WS_URL);
    url.searchParams.set("user", user);
    return url.toString();
  } catch {
    const separator = WS_URL.includes("?") ? "&" : "?";
    return `${WS_URL}${separator}user=${encodeURIComponent(user)}`;
  }
}

async function startWebSocket() {
  if (wsConnecting) {
    return;
  }
  wsConnecting = true;
  try {
    const user = await getUser();
    if (!user) {
      scheduleReconnect();
      return;
    }

    if (ws && wsUser === user) {
      return;
    }

    if (ws && wsUser !== user) {
      wsManualClose = true;
      ws.close();
      ws = null;
      wsUser = null;
    }

    try {
      ws = new WebSocket(buildWebSocketUrl(user));
      wsUser = user;
    } catch (err) {
      console.error("WebSocket failed to start:", err);
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      console.log("WebSocket connected");
      if (wsReconnectTimer) {
        clearTimeout(wsReconnectTimer);
        wsReconnectTimer = null;
      }
    };

    ws.onmessage = async (ev) => {
      console.log("websocket detected change", ev);
      const updated = await updateStorage();
      if (!updated) {
        return;
      }

      try {
        const payload = JSON.parse(ev.data);
        if (
          payload &&
          payload.type === "manga-updated" &&
          ws &&
          ws.readyState === WebSocket.OPEN
        ) {
          ws.send(JSON.stringify({ type: "manga-updated-ack" }));
        }
      } catch (error) {
        console.warn("WebSocket message parse failed:", error);
      }
    };

    ws.onclose = () => {
      console.warn("WebSocket closed");
      ws = null;
      wsUser = null;
      if (wsManualClose) {
        wsManualClose = false;
        return;
      }
      scheduleReconnect();
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  } finally {
    wsConnecting = false;
  }
}

function scheduleReconnect() {
  if (wsReconnectTimer) return;
  wsReconnectTimer = setTimeout(() => {
    wsReconnectTimer = null;
    startWebSocket();
  }, 5000);
}

async function updateStorage() {
  const user = await getUser();
  if (!user) return false;
  try {
    const res = await fetch(
      `https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/find/${user}`,
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    const mangaList = json["manga-list"] || [];
    chrome.storage.local.set({ "manga-list": mangaList });
    return true;
  } catch (error) {
    console.error("Failed to fetch manga list:", error);
    return false;
  }
}

async function postData(method, data) {
  const user = await getUser();
  if (!user) return null;

  const url = `https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/${method}/${user}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (json["manga-list"]) {
    chrome.storage.local.set({ "manga-list": json["manga-list"] });
  } else if (method === "insert") {
    const source_string = {
      url: data["link"],
      latest: data["chapter"],
      latest_link: data["link"],
      time_updated: Math.floor(Date.now() / 1000),
    };
    const sources = { any: source_string, [data["scansite"]]: source_string };

    const manga = {
      title: data["title"],
      chapter: String(data["chapter"]),
      link: data["link"],
      domain: "",
      latest: data["chapter"],
      scansite: data["scansite"],
      current_source: "any",
      sources: sources,
      read: true,
    };
    console.log("Manga to add:", manga, method);
    chrome.storage.local.get("manga-list", (result) => {
      result["manga-list"].push(manga);
      chrome.storage.local.set({ "manga-list": result["manga-list"] });
    });
  }
  return json;
}

async function getUser() {
  return new Promise((resolve) => {
    chrome.storage.local.get("id", (result) => {
      if (!result.id) {
        initialiseNewUser();
        resolve(null);
      } else {
        resolve(result.id);
      }
    });
  });
}

function initialiseNewUser() {
  const id = String(Date.now());
  chrome.storage.local.set({
    id,
    "manga-list": [],
    blacklist: [],
    showOverlay: true,
  });
  fetch(
    `https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/create/${id}`,
  )
    .then((res) => console.log("Created user on server:", res))
    .catch((err) => console.error(err));
}
// web-ext run in build dir
