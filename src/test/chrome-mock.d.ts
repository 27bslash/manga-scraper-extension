import type Manga from "../types/manga";

export interface ChromeMockStorageLocal {
  get(
    keys: string | string[] | Record<string, unknown>,
    cb: (items: Record<string, unknown>) => void,
  ): void;
  set(items: Record<string, unknown>, cb?: () => void): void;
  remove(keys: string | string[], cb?: () => void): void;
  clear(cb?: () => void): void;
}

export interface ChromeMockAlarms {
  create(name: string, info: { when?: number; periodInMinutes?: number }): void;
  get(name: string, cb: (alarm: unknown) => void): void;
  getAll(cb: (alarms: unknown[]) => void): void;
  clear(name: string, cb?: () => void): void;
}

export interface ChromeMockEvent<T extends (...args: never[]) => void> {
  addListener(fn: T): void;
  removeListener(fn: T): void;
}

export interface ChromeMock {
  runtime: {
    lastError?: unknown;
    id: string;
    onMessage: ChromeMockEvent<(msg: unknown, sender: unknown, sendResponse: (res?: unknown) => void) => void>;
    onInstalled: ChromeMockEvent<(details: unknown) => void>;
    onStartup: ChromeMockEvent<() => void>;
    onConnect: ChromeMockEvent<(port: unknown) => void>;
    sendMessage(msg: unknown, cb?: (res?: unknown) => void): void;
    getManifest(): Record<string, unknown>;
    getURL(path: string): string;
    getContexts(opts: unknown, cb?: (contexts: unknown[]) => void): void | Promise<unknown[]>;
  };
  storage: {
    local: ChromeMockStorageLocal;
    onChanged: ChromeMockEvent<(changes: unknown, area: string) => void>;
  };
  alarms: {
    onAlarm: ChromeMockEvent<(alarm: unknown) => void>;
    create(name: string, info: { when?: number; periodInMinutes?: number }): void;
    get(name: string, cb: (alarm: unknown) => void): void;
    getAll(cb: (alarms: unknown[]) => void): void;
    clear(name: string, cb?: () => void): void;
  };
  action: Record<string, jest.Mock>;
  __store: { get(key: string): unknown };
  __alarms: Map<string, unknown>;
  __listeners: Record<string, unknown[]>;
  __manifest: Record<string, unknown>;
  __seed(items: Record<string, unknown>): void;
  __reset(): void;
}

export function createChromeMock(): ChromeMock;
export function makeManga(overrides?: Partial<Manga>): Manga;
export const flushAsync: () => Promise<void>;