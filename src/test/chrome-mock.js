/**
 * In-memory mock of the `chrome` extension APIs used by the extension.
 * Covers: storage.local, runtime (message/manifest), alarms, action badges,
 * and offscreen absence (forces the Firefox keepalive path in tests).
 */

const DEFAULT_MANIFEST = {
  name: "Reddit Manga List",
  version: "0.0.0-test",
  manifest_version: 3,
  content_scripts: [
    {
      matches: ["*://asurascans.com/*", "*://mangadex.org/*"],
      js: ["static/js/content.js"],
    },
  ],
};

export function createChromeMock() {
  const store = new Map();
  const alarms = new Map();

  const listeners = {
    runtimeOnMessage: [],
    runtimeOnInstalled: [],
    runtimeOnStartup: [],
    runtimeOnConnect: [],
    storageOnChanged: [],
    alarmsOnAlarm: [],
  };

  const pendingTimers = new Set();

  const flush = (cb) => {
    // resolve via microtask so test `act()` loops can flush chains fully
    const p = Promise.resolve().then(() => {
      pendingTimers.delete(p);
      try {
        cb();
      } catch (e) {
        console.error("MOCK CB ERROR:", e && e.message, e && e.stack);
      }
    });
    pendingTimers.add(p);
    return p;
  };

  const storageLocal = {
    get: (keys, cb) => {
      let result = {};
      if (typeof keys === "string") {
        if (store.has(keys)) result[keys] = store.get(keys);
      } else if (Array.isArray(keys)) {
        keys.forEach((k) => {
          if (store.has(k)) result[k] = store.get(k);
        });
      } else if (keys && typeof keys === "object") {
        Object.keys(keys).forEach((k) => {
          result[k] = store.has(k) ? store.get(k) : keys[k];
        });
      }
      flush(() => cb(result));
    },
    set: (items, cb) => {
      Object.keys(items).forEach((k) => store.set(k, items[k]));
      listeners.storageOnChanged.forEach((fn) =>
        flush(() => fn(items, "local")),
      );
      if (cb) flush(cb);
    },
    remove: (keys, cb) => {
      (Array.isArray(keys) ? keys : [keys]).forEach((k) => store.delete(k));
      if (cb) flush(cb);
    },
    clear: (cb) => {
      store.clear();
      if (cb) flush(cb);
    },
  };

  const makeEvent = (list) => ({
    addListener: (fn) => list.push(fn),
    removeListener: (fn) => {
      const i = list.indexOf(fn);
      if (i !== -1) list.splice(i, 1);
    },
  });

  const chrome = {
    runtime: {
      lastError: undefined,
      id: "test-extension-id",
      onMessage: makeEvent(listeners.runtimeOnMessage),
      onInstalled: makeEvent(listeners.runtimeOnInstalled),
      onStartup: makeEvent(listeners.runtimeOnStartup),
      onConnect: makeEvent(listeners.runtimeOnConnect),
      sendMessage: (msg, cb) => {
        if (!chrome.__sendMessageHandler) {
          if (cb) flush(() => cb({ ok: true }));
          return;
        }
        flush(() => cb(chrome.__sendMessageHandler(msg)));
      },
      getManifest: () => JSON.parse(JSON.stringify(chrome.__manifest)),
      getURL: (path) => `chrome-extension://test-extension-id/${path}`,
      getContexts: (_opts, cb) => {
        if (cb) flush(() => cb([]));
        return Promise.resolve([]);
      },
    },
    storage: {
      local: storageLocal,
      onChanged: makeEvent(listeners.storageOnChanged),
    },
    alarms: {
      onAlarm: makeEvent(listeners.alarmsOnAlarm),
      create: (name, info) => alarms.set(name, { name, ...info }),
      get: (name, cb) => flush(() => cb(alarms.get(name))),
      getAll: (cb) => flush(() => cb(Array.from(alarms.values()))),
      clear: (name, cb) => {
        alarms.delete(name);
        if (cb) flush(cb);
      },
    },
    action: {
      setBadgeText: jest.fn(),
      setBadgeTextColor: jest.fn(),
      setBadgeBackgroundColor: jest.fn(),
    },

    // ---- test helpers ----
    __store: store,
    __alarms: alarms,
    __listeners: listeners,
    __manifest: DEFAULT_MANIFEST,
    __seed: (items) => {
      Object.keys(items).forEach((k) => store.set(k, items[k]));
    },
    __reset: () => {
      store.clear();
      alarms.clear();
      Object.values(listeners).forEach((list) => list.splice(0));
      delete chrome.__sendMessageHandler;
      chrome.__manifest = DEFAULT_MANIFEST;
      Object.keys(chrome.action).forEach((k) => chrome.action[k].mockClear());
    },
  };

  return chrome;
}

/** Wait for all pending mock callbacks/microtasks to settle. */
export const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Build a Manga fixture with sensible defaults. */
export function makeManga(overrides = {}) {
  const opts = {
    title: "series-a",
    chapter: "1",
    latest: "5",
    read: false,
    current_source: "any",
    link: "https://example.com/chapter-1",
    domain: "example.com",
    scansite: "demo",
    time_updated: Math.floor(Date.now() / 1000),
    ...overrides,
  };
  return {
    title: opts.title,
    chapter: opts.chapter,
    latest: opts.latest,
    read: opts.read,
    current_source: opts.current_source,
    domain: opts.domain,
    scansite: opts.scansite,
    link: opts.link,
    sources: {
      [opts.current_source]: {
        url: opts.link,
        chapter: opts.chapter,
        latest: opts.latest,
        latest_link: `https://example.com/chapter-${opts.latest}`,
        time_updated: opts.time_updated,
        old_chapters: {},
      },
    },
  };
}
