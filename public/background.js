/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener((details) => {
  //   setStorageKey("user", "test");
  // generate unique id:
  if (details.reason === "install") {
    console.log("This is a first install!");
    new Date();
    const id = String(Date.now());
    chrome.storage.sync.set({ id: id });
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
    chrome.storage.sync.get("id", (result) => {
      console.log("res", result);
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

// TODO
// when on a site in the scans db check for chapter and update it, if it is not on the list have option to add to list
// FIRST data is scraped from reddit
//
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

  init() {
    // 1. Create a mapping for message listeners
    // this.registerMessengerRequests();

    // 2. Listen for messages from background and run the listener from the map
    setInterval(() => {
      updateStorage();
    }, 10000);
    // console.log("inittt");
    // setInterval(() => {
    //   chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    //     this.sendDataToContent(tabs[0].id);
    //   });
    // }, 5000);
    console.log("inited");
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.type === "update") {
        console.log("update message received", this);
        const response = postData("update", request.data);
        updateStorage();
        sendResponse({ update: response, data: request.data });
      } else if (request.type === "delete") {
        console.log("delete message received", this);
        const response = postData("delete", request.data);
        updateStorage();
        sendResponse({ delete: response, data: request.data });
      }
    });
  }
}
const updateStorage = async () => {
  const user = await get_user();
  const data = await fetch(
    `https://27bslash.eu.pythonanywhere.com/db/manga-list/find/${user}`
  );
  const json = await data.json();
  const mangaList = json["document"]["manga-list"];
  chrome.storage.sync.set({ "manga-list": mangaList });

  // .then((res) => {
  //   console.log("b response", res);
  //   res.json().then((fin) => {
  //     console.log(fin);
  // });
};
const postData = async (method, data) => {
  const user = await get_user();
  const url = `https://27bslash.eu.pythonanywhere.com/db/manga-list/${method}/${user}`;
  data = JSON.stringify(data);
  console.log("data", data);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(data),
  });
  console.log("response", response);
  return response;
};
new Background().init();
