/**
 * Functional tests for public/background.js.
 * The background script registers listeners at require-time, so tests drive
 * behaviour through the mocked chrome listeners (poll alarm, onMessage, etc).
 */

const POLL_ALARM = "manga-list-poll";
const FIND_URL =
  "https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/find";
const ALL_URL =
  "https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/all";

let chromeMock;

function flushAll() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function loadBackground() {
  jest.resetModules();
  return require("../../public/background");
}

const getListener = (list) => list[list.length - 1];

describe("background.js", () => {
  beforeEach(async () => {
    global.chrome.__reset();
    global.chrome.__seed({ id: "testuser" });
    global.fetch = jest.fn();
    loadBackground();
    // alarm creation and storage reads resolve asynchronously in the mock
    await flushAll();
    await flushAll();
  });

  describe("startup", () => {
    it("creates the poll alarm with a 30 minute period", () => {
      expect(global.chrome.__alarms.has(POLL_ALARM)).toBe(true);
      expect(global.chrome.__alarms.get(POLL_ALARM).periodInMinutes).toBe(30);
    });

    it("does not duplicate the poll alarm if one already exists", () => {
      const before = global.chrome.__alarms.get(POLL_ALARM);
      // re-running the script simulates the service worker waking up again
      loadBackground();
      expect(global.chrome.__alarms.get(POLL_ALARM)).toBe(before);
    });
  });

  describe("polling", () => {
    it("fetches the manga list and stores it when the poll alarm fires", async () => {
      const mangaList = [
        { title: "series-a", read: false },
        { title: "series-b", read: true },
      ];
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ "manga-list": mangaList }),
      });

      const alarmHandler = getListener(global.chrome.__listeners.alarmsOnAlarm);
      alarmHandler({ name: POLL_ALARM });
      await flushAll();
      await flushAll();
      await flushAll();

      expect(global.fetch).toHaveBeenCalledWith(`${FIND_URL}/testuser`);
      expect(global.chrome.__store.get("manga-list")).toEqual(mangaList);
    });

    it("does not overwrite storage when the fetch fails", async () => {
      global.chrome.__seed({
        "manga-list": [{ title: "existing", read: false }],
      });
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      const alarmHandler = getListener(global.chrome.__listeners.alarmsOnAlarm);
      alarmHandler({ name: POLL_ALARM });
      await flushAll();
      await flushAll();
      await flushAll();

      expect(global.chrome.__store.get("manga-list")).toEqual([
        { title: "existing", read: false },
      ]);
    });
  });

  describe("badge", () => {
    it("shows the number of unread series after a poll", async () => {
      const now = Math.floor(Date.now() / 1000);
      const mangaList = [
        { title: "unread-1", read: false, current_source: "any", sources: {} },
        { title: "unread-2", read: false, current_source: "any", sources: {} },
        { title: "read-1", read: true, current_source: "any", sources: {} },
      ];
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ "manga-list": mangaList }),
      });

      const alarmHandler = getListener(global.chrome.__listeners.alarmsOnAlarm);
      alarmHandler({ name: POLL_ALARM });
      await flushAll();
      await flushAll();
      await flushAll();

      expect(global.chrome.action.setBadgeText).toHaveBeenCalledWith(
        expect.objectContaining({ text: "2" }),
        expect.any(Function),
      );
    });
  });

  describe("onMessage", () => {
    let messageHandler;

    beforeEach(() => {
      messageHandler = getListener(global.chrome.__listeners.runtimeOnMessage);
    });

    it("responds to getAllManga with fetched data and caches it", async () => {
      const all = [{ title: "any-manga" }];
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => all,
      });
      const sendResponse = jest.fn();

      messageHandler({ type: "getAllManga" }, {}, sendResponse);
      await flushAll();

      expect(sendResponse).toHaveBeenCalledWith({ getAllManga: all });

      // second call should hit the cache, not the network
      messageHandler({ type: "getAllManga" }, {}, sendResponse);
      await flushAll();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("forwards unknown message types to the database endpoint via POST", async () => {
      global.chrome.__seed({ "manga-list": [] });
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      const sendResponse = jest.fn();

      messageHandler(
        { type: "setSource", data: { title: "new-series" } },
        {},
        sendResponse,
      );
      await flushAll();
      await flushAll();

      expect(global.fetch).toHaveBeenCalledWith(
        "https://kzw5xa1pt0.execute-api.us-east-1.amazonaws.com/dev/db/manga-list/setSource/testuser",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ title: "new-series" }),
        }),
      );
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ setSource: { success: true } }),
      );
    });

    it("stores a popup-opened timestamp", async () => {
      const before = Math.floor(Date.now() / 1000);
      const sendResponse = jest.fn();

      messageHandler({ type: "popupOpened" }, {}, sendResponse);
      await flushAll();

      expect(sendResponse).toHaveBeenCalledWith({ ok: true });
      const ts = global.chrome.__store.get("last-popup-opened-at");
      expect(ts).toBeGreaterThanOrEqual(before);
    });

    it("stores showOverlay=false for linkClicked messages", async () => {
      messageHandler({ type: "linkClicked" }, {}, jest.fn());
      await flushAll();

      expect(global.chrome.__store.get("showOverlay")).toBe(false);
    });
  });
});
