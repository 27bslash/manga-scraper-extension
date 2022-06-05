/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener((details) => {
  //   setStorageKey("user", "test");
  // generate unique id:
  chrome.alarms.create("refresh", { periodInMinutes: 5 });
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
  //   get_user()
  //     .then((res) => {
  //       const user = res;
  //       console.log("user", user);
  //       const req = fetch(
  //         `https://27bslash.eu.pythonanywhere.com/db/manga-list/${user}`
  //       )
  //         .then((r) => {
  //           console.log("r", r.text());
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
});
const as = async () => {
  console.log(get_user());
  get_user().then((res) => {
    console.log(res);
  });
  //   console.log("uuu", u);
  return "test";
};
const get_user = async () => {
  const p = new Promise((resolve, reject) => {
    chrome.storage.local.get("id", (result) => {
      resolve(result.id);
    });
  });
  return await p;
};

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
}
function getTabID() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query(
        {
          active: true,
        },
        function (tabs) {
          resolve(tabs[0].id);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

//function where you need it
async function getTabId() {
  let responseTabID = await getTabID();
  return responseTabID;
}

// testMessage();
class Background {
  async sendDataToContent(tabID) {
    await this.sendMessageToContentScript(tabID, {
      user: await get_user(),
      data: { test: "test" },
    });
  }
  async sendMessageToContentScript(tabID, data = null) {
    try {
      const response = await chrome.tabs.sendMessage(tabID, { data });
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error("sendMessageToContentScript error: ", error);
      return null;
    }
  }
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
    });
  }
  init() {
    updateStorage();
    this.updateBadgeText();
    chrome.storage.onChanged.addListener(() => {
      console.log("storage changed");
      this.updateBadgeText();
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      console.log(alarm.name); // refresh
      updateStorage();
      this.updateBadgeText();
    });

    console.log("inited");
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      const type = request.type;
      (async () => {
        const response = await postData(request.type, request.data);
        console.log("response", response);
        sendResponse({ [type]: response, data: request.data });
      })();
      updateStorage();
    });
    this.updateBadgeText();
  }
}
const updateStorage = async () => {
  const user = await get_user();
  const data = await fetch(
    `https://27bslash.eu.pythonanywhere.com/db/manga-list/find/${user}`
  );
  const json = await data.json();
  const mangaList = json["document"]["manga-list"];
  console.log("updateStorage", mangaList.length);
  chrome.storage.local.set({ "manga-list": mangaList });
};
const postData = async (method, data) => {
  const user = await get_user();
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
new Background().init();
