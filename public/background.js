/* eslint-disable no-undef */
const WS_URL = "wss://0igubzuowh.execute-api.eu-west-2.amazonaws.com/dev";
let ws = null;
let wsReconnectTimer = null;
let wsUser = null;
let wsManualClose = false;
let wsConnecting = false;
const OFFSCREEN_DOCUMENT = "offscreen.html";
const OFFSCREEN_BG_LOG_PREFIX = "[offscreen:bg]";
const FIREFOX_KEEPALIVE_ALARM = "firefox-keepalive";
const FIREFOX_KEEPALIVE_PERIOD_MINUTES = 0.5; // 30 seconds
const ALL_MANGA_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
let offscreenCreating = null;
const actionApi = chrome.action || chrome.browserAction;
let allMangaCache = null;
let allMangaCacheFetchedAt = 0;
const LAST_POPUP_OPENED_AT_KEY = "last-popup-opened-at";

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
  console.log(
    "initializing extension; ensuring keepalive strategy and starting WebSocket",
  );
  ensureKeepaliveStrategy();
  startWebSocket();
  updateStorage();
});
chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started");
  ensureKeepaliveStrategy();
  startWebSocket();
  updateStorage();
});
chrome.storage.onChanged.addListener(() => {
  console.log("storage changed");
  updateBadgeText();
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) {
    return;
  }

  if (message.type === "keepalive") {
    sendResponse({ ok: true });
    return;
  }

  if (message.type === "update") {
    const mangaList = message.data;
    console.log("Received updated manga list:", mangaList);
  }

  if (message.type === "popupOpened") {
    chrome.storage.local.set(
      { [LAST_POPUP_OPENED_AT_KEY]: Math.floor(Date.now() / 1000) },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to store popup open timestamp:",
            chrome.runtime.lastError.message,
          );
        }
        updateBadgeText();
      },
    );
    sendResponse({ ok: true });
    return;
  }

  if (message.type === "getAllManga") {
    (async () => {
      try {
        const data = await fetchAllMangaCached();
        sendResponse({ getAllManga: data });
      } catch (error) {
        console.error("Failed to get all manga:", error);
        sendResponse({ getAllManga: [] });
      }
    })();
    return true;
  }
  if (message.type === "linkClicked") {
    chrome.storage.local.set({ showOverlay: false });
    return true;
  }
  console.log(message.type);
  (async () => {
    const response = await postData(message.type, message.data);
    sendResponse({ [message.type]: response, data: message.data });
  })();
  return true;
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "keepalive") {
    return;
  }
  port.onMessage.addListener(() => {});
});
if (chrome.alarms?.onAlarm) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== FIREFOX_KEEPALIVE_ALARM) {
      return;
    }
    console.log(`${OFFSCREEN_BG_LOG_PREFIX} Firefox keepalive alarm fired.`);
    startWebSocket();
  });
}

console.log(
  `${OFFSCREEN_BG_LOG_PREFIX} Background activated; ensuring keepalive strategy.`,
);
ensureKeepaliveStrategy();
updateBadgeText();

function ensureKeepaliveStrategy() {
  if (chrome.offscreen?.createDocument) {
    void ensureOffscreenDocument();
    return;
  }

  console.log(
    `${OFFSCREEN_BG_LOG_PREFIX} Offscreen API unavailable in this browser; enabling Firefox alarm fallback.`,
  );
  ensureFirefoxKeepaliveAlarm();
}

function ensureFirefoxKeepaliveAlarm() {
  if (!chrome.alarms?.create || !chrome.alarms?.get) {
    console.warn(
      `${OFFSCREEN_BG_LOG_PREFIX} Alarms API unavailable; Firefox fallback keepalive cannot be enabled.`,
    );
    return;
  }

  chrome.alarms.get(FIREFOX_KEEPALIVE_ALARM, (existingAlarm) => {
    const runtimeError = chrome.runtime.lastError;
    if (runtimeError) {
      console.warn(
        `${OFFSCREEN_BG_LOG_PREFIX} Failed to query keepalive alarm:`,
        runtimeError.message,
      );
      return;
    }

    if (existingAlarm) {
      console.log(
        `${OFFSCREEN_BG_LOG_PREFIX} Firefox keepalive alarm already exists.`,
        { name: FIREFOX_KEEPALIVE_ALARM },
      );
      return;
    }

    chrome.alarms.create(FIREFOX_KEEPALIVE_ALARM, {
      periodInMinutes: FIREFOX_KEEPALIVE_PERIOD_MINUTES,
    });
    console.log(`${OFFSCREEN_BG_LOG_PREFIX} Firefox keepalive alarm created.`, {
      name: FIREFOX_KEEPALIVE_ALARM,
      periodInMinutes: FIREFOX_KEEPALIVE_PERIOD_MINUTES,
    });
  });
}

function updateBadgeText() {
  chrome.storage.local.get(
    ["manga-list", LAST_POPUP_OPENED_AT_KEY],
    (result) => {
      let badgeText = "0";
      let badgeColor = "#000000ff";
      try {
        const mangaList = result["manga-list"] || [];
        const lastPopupOpenedAt = Number(result[LAST_POPUP_OPENED_AT_KEY] || 0);
        const unread = mangaList.filter((mangaItem) => {
          if (
            mangaItem.sources?.[mangaItem.current_source] &&
            mangaItem.sources[mangaItem.current_source].chapter
          ) {
            if (
              +mangaItem.sources[mangaItem.current_source].chapter <
              +mangaItem.sources[mangaItem.current_source].latest
            ) {
              return true;
            }
          } else {
            // console.log("no chapter", x.title, x.current_source, x.read);
            return !mangaItem.read;
          }
          return false;
        });
        const currentTime = Date.now() / 1000;
        const recentUnread = unread.filter((mangaItem) => {
          const updatedAt = Number(
            mangaItem.sources?.[mangaItem.current_source]?.time_updated || 0,
          );

          if (updatedAt <= 0) {
            return false;
          }

          const isRecent = currentTime - updatedAt < 43200; // chapter in last 12 hours
          //   const isAfterPopupOpen = updatedAt > lastPopupOpenedAt;

          return isRecent;
        });
        badgeText = String(unread.length);
        if (recentUnread.length > 0) {
          badgeColor = "#c21e1eff"; // Red for new chapters
        }
        console.log("Badge count:", badgeText);
      } catch (error) {
        console.log("Error calculating badge text:", error);
        badgeText = "0";
      }
      if (!actionApi) {
        return;
      }
      actionApi.setBadgeText({ text: badgeText }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "setBadgeText failed:",
            chrome.runtime.lastError.message,
          );
        }
      });
      if (!actionApi.setBadgeTextColor || !actionApi.setBadgeBackgroundColor) {
        console.error(
          "Badge color APIs unavailable; badge may be unreadable on some browsers. Should never see this message on Chromium-based browsers.",
        );
        return;
      }
      actionApi.setBadgeTextColor({ color: "#FFFFFF" });
      actionApi.setBadgeBackgroundColor({ color: badgeColor });
    },
  );
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

async function ensureOffscreenDocument() {
  const hasOffscreenApi = Boolean(chrome.offscreen?.createDocument);
  const hasGetContexts = Boolean(chrome.runtime.getContexts);
  console.log(`${OFFSCREEN_BG_LOG_PREFIX} ensureOffscreenDocument invoked`, {
    hasOffscreenApi,
    hasGetContexts,
    isCreatingInProgress: Boolean(offscreenCreating),
  });

  if (!hasOffscreenApi) {
    console.log(
      `${OFFSCREEN_BG_LOG_PREFIX} Offscreen API unavailable; skipping setup.`,
    );
    return;
  }

  if (offscreenCreating) {
    console.log(
      `${OFFSCREEN_BG_LOG_PREFIX} Creation already in progress; awaiting existing promise.`,
    );
    await offscreenCreating;
    console.log(
      `${OFFSCREEN_BG_LOG_PREFIX} Existing creation promise resolved.`,
    );
    return;
  }

  if (hasGetContexts) {
    const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT);
    console.log(
      `${OFFSCREEN_BG_LOG_PREFIX} Checking for existing offscreen document context.`,
      { offscreenUrl },
    );
    const existing = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [offscreenUrl],
    });
    if (existing.length) {
      console.log(
        `${OFFSCREEN_BG_LOG_PREFIX} Existing offscreen document found; skipping creation.`,
        { count: existing.length },
      );
      return;
    }
  } else {
    console.log(
      `${OFFSCREEN_BG_LOG_PREFIX} chrome.runtime.getContexts unavailable; continuing without pre-check.`,
    );
  }

  console.log(`${OFFSCREEN_BG_LOG_PREFIX} Creating offscreen document.`, {
    url: OFFSCREEN_DOCUMENT,
  });
  offscreenCreating = chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT,
    reasons: ["LOCAL_STORAGE"],
    justification:
      "Keep a hidden page for periodic keepalive and store the last ping timestamp.",
  });

  try {
    await offscreenCreating;
    console.log(`${OFFSCREEN_BG_LOG_PREFIX} Offscreen document created.`);
  } catch (error) {
    console.error(
      `${OFFSCREEN_BG_LOG_PREFIX} Failed to create offscreen document:`,
      error,
    );
  } finally {
    offscreenCreating = null;
    console.log(`${OFFSCREEN_BG_LOG_PREFIX} Creation state reset.`);
  }
}
// https://0npgter010.execute-api.eu-west-2.amazonaws.com/dev/db/manga-list/find/test

async function updateStorage() {
  const user = await getUser();
  if (!user) {
    return false;
  }
  try {
    const res = await fetch(
      `https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/find/${user}`,
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    const mangaList = json["manga-list"] || [];
    const changed = await setMangaListIfChanged(mangaList);
    updateBadgeText();
    return changed;
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
    await setMangaListIfChanged(json["manga-list"]);
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

async function setMangaListIfChanged(nextList) {
  const currentList = await new Promise((resolve) => {
    chrome.storage.local.get("manga-list", (result) => {
      resolve(result["manga-list"] || []);
    });
  });

  const currentSerialized = JSON.stringify(currentList);
  const nextSerialized = JSON.stringify(nextList || []);
  if (currentSerialized === nextSerialized) {
    return false;
  }

  chrome.storage.local.set({ "manga-list": nextList || [] });
  return true;
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

async function fetchAllMangaCached() {
  const now = Date.now();
  if (allMangaCache && now - allMangaCacheFetchedAt < ALL_MANGA_CACHE_TTL_MS) {
    return allMangaCache;
  }

  const res = await fetch(
    "https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/all",
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  allMangaCache = Array.isArray(data) ? data : [];
  allMangaCacheFetchedAt = now;
  return allMangaCache;
}
// web-ext run in build dir
