/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener((details) => {
  // generate unique id:
  chrome.alarms.create("refresh", { periodInMinutes: 1 });
  if (details.reason === "install") {
    console.log("This is a first install!");
    new Date();
    const id = String(Date.now());
    chrome.storage.local.set({ id: id });
    fetch(
      `https://27bslash.eu.pythonanywhere.com/db/manga-list/create/${id}`
    ).then((res) => {
      console.log("create", res);
    });
  }
});

const get_user = async () => {
  const p = new Promise((resolve, reject) => {
    chrome.storage.local.get("id", (result) => {
      resolve(result.id);
    });
  });
  return await p;
};

// testMessage();
class Background {
  updateBadgeText() {
    chrome.storage.local.get("manga-list", (result) => {
      const filtered = result["manga-list"].filter((x) => !x.read);
      console.log("filtered", filtered);
      let badgeText = filtered.length;
      if (badgeText === 0) {
        badgeText = "";
      }
      console.log("updateBadgeText", badgeText);
      chrome.action.setBadgeText({ text: String(badgeText) });
      chrome.action.setBadgeBackgroundColor({ color: [30, 41, 101, 100] });
    });
  }
  init() {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    this.signal.addEventListener("abort", () => console.log("abort listener"));
    console.log("first signal", this.signal);
    this.updateStorage();
    this.updateBadgeText();

    chrome.storage.onChanged.addListener(() => {
      console.log("storage changed");
      this.updateBadgeText();
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      console.log(alarm.name); // refresh
      this.updateStorage();
      this.updateBadgeText();
    });

    console.log("inited");
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const type = request.type;
      (async () => {
        const response = await this.postData(request.type, request.data);
        console.log("response", response);
        sendResponse({ [type]: response, data: request.data });
      })();
      //   this.updateStorage();
    });
    this.updateBadgeText();
  }
  updateStorage = async () => {
    const user = await get_user();

    try {
      console.log("2nd signal", this.signal);
      const data = await fetch(
        `https://27bslash.eu.pythonanywhere.com/db/manga-list/find/${user}`,
        {
          method: "get",
          signal: this.signal,
        }
      );
      const json = await data.json();
      const mangaList = json["document"]["manga-list"];
      console.log("this.updateStorage", mangaList.length);
      chrome.storage.local.set({ "manga-list": mangaList });
    } catch (error) {
      console.log(error, "aborted request");
    }
  };
  postData = async (method, data) => {
    const user = await get_user();

    this.controller.abort();
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    this.signal.addEventListener("abort", () => console.log("2nd listener"));
    
    const url = `https://27bslash.eu.pythonanywhere.com/db/manga-list/${method}/${user}`;
    data = JSON.stringify(data);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data),
    });
    const j = await response.json();
    return j;
  };
}
new Background().init();
