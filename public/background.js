/* eslint-disable no-undef */
chrome.alarms.create("refresh", { periodInMinutes: 1 });

chrome.runtime.onInstalled.addListener((details) => {
  chrome.alarms.create("refresh", { periodInMinutes: 1 });
  if (details.temporary) {
    console.log("This is a test install, skipping user initialization");
    chrome.storage.local.set({ id: "test" });
  }
  if (details.reason === "install") {
    console.log("This is a first install!", chrome.runtime.id);
    initialiseNewUser();
  }
  updateStorage();
});
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("refresh", { periodInMinutes: 1 });
  console.log("Extension started");
  updateStorage();
});
chrome.storage.onChanged.addListener(() => {
  console.log("storage changed");
  updateBadgeText();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm:", alarm.name);
  if (alarm.name === "refresh") {
    updateStorage();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "linkClicked") {
    chrome.storage.local.set({ showOverlay: false });
    return;
  }

  (async () => {
    const response = await postData(request.type, request.data);
    sendResponse({ [request.type]: response, data: request.data });
  })();
  return true;
});

function updateBadgeText() {
  chrome.storage.local.get("manga-list", (result) => {
    let badgeText = "0";
    try {
      const filtered = result["manga-list"].filter((x) => !x.read) || [];
      badgeText = filtered.length ? String(filtered.length) : "";
      console.log("Badge count:", badgeText);
    } catch {
      badgeText = "";
    }
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: "#000000" });
  });
}

async function updateStorage() {
  const user = await getUser();
  if (!user) return;
  try {
    const res = await fetch(
      `https://27bslash.eu.pythonanywhere.com/db/manga-list/find/${user}`
    );
    const json = await res.json();
    const mangaList = json?.document?.["manga-list"] || [];
    chrome.storage.local.set({ "manga-list": mangaList });
  } catch (error) {
    console.error("Failed to fetch manga list:", error);
  }
}

async function postData(method, data) {
  console.log(method, data);
  const user = await getUser();
  if (!user) return null;
  const url = `https://27bslash.eu.pythonanywhere.com/db/manga-list/${method}/${user}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(data),
  });
  return await response.json();
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
  fetch(`https://27bslash.eu.pythonanywhere.com/db/manga-list/create/${id}`)
    .then((res) => console.log("Created user on server:", res))
    .catch((err) => console.error(err));
}
// web-ext run in build dir
