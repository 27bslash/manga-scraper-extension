/* eslint-disable no-undef */
const KEEPALIVE_INTERVAL_MS = 20000;
const KEEPALIVE_PORT_NAME = "keepalive";
const OFFSCREEN_DOC_LOG_PREFIX = "[offscreen:doc]";
let keepalivePort = null;

function sendRuntimeKeepalive(source) {
  console.log(`${OFFSCREEN_DOC_LOG_PREFIX} Sending keepalive via runtime message.`, {
    source,
  });
  chrome.runtime.sendMessage({ type: "keepalive" }, () => {
    const runtimeError = chrome.runtime.lastError;
    if (runtimeError) {
      console.warn(
        `${OFFSCREEN_DOC_LOG_PREFIX} runtime.sendMessage keepalive failed.`,
        { source, message: runtimeError.message },
      );
    }
  });
}

function connectKeepalive() {
  console.log(`${OFFSCREEN_DOC_LOG_PREFIX} Connecting keepalive port.`, {
    portName: KEEPALIVE_PORT_NAME,
  });
  try {
    keepalivePort = chrome.runtime.connect({ name: KEEPALIVE_PORT_NAME });
    console.log(`${OFFSCREEN_DOC_LOG_PREFIX} Keepalive port connected.`);
  } catch (error) {
    console.warn(
      `${OFFSCREEN_DOC_LOG_PREFIX} Failed to connect keepalive port; retrying in 1000ms.`,
      error,
    );
    keepalivePort = null;
    setTimeout(connectKeepalive, 1000);
    return;
  }

  keepalivePort.onDisconnect.addListener(() => {
    const disconnectReason = chrome.runtime.lastError?.message || null;
    console.warn(`${OFFSCREEN_DOC_LOG_PREFIX} Keepalive port disconnected.`, {
      disconnectReason,
    });
    keepalivePort = null;
    console.log(
      `${OFFSCREEN_DOC_LOG_PREFIX} Scheduling keepalive port reconnect in 1000ms.`,
    );
    setTimeout(connectKeepalive, 1000);
  });
}

function sendKeepalive() {
  if (keepalivePort) {
    console.log(`${OFFSCREEN_DOC_LOG_PREFIX} Sending keepalive via port.`);
    try {
      keepalivePort.postMessage({ type: "keepalive" });
    } catch (error) {
      console.warn(
        `${OFFSCREEN_DOC_LOG_PREFIX} keepalive port postMessage failed; falling back to runtime message.`,
        error,
      );
      sendRuntimeKeepalive("postMessage-fallback");
    }
  } else {
    console.log(
      `${OFFSCREEN_DOC_LOG_PREFIX} Keepalive port unavailable; using runtime message fallback.`,
    );
    sendRuntimeKeepalive("no-port");
  }

  try {
    localStorage.setItem("lastKeepalive", String(Date.now()));
    console.debug(
      `${OFFSCREEN_DOC_LOG_PREFIX} Updated localStorage lastKeepalive timestamp.`,
    );
  } catch (error) {
    console.warn(
      `${OFFSCREEN_DOC_LOG_PREFIX} Failed to persist keepalive timestamp.`,
      error,
    );
  }
}

console.log(`${OFFSCREEN_DOC_LOG_PREFIX} Script initialized.`);
console.log(`${OFFSCREEN_DOC_LOG_PREFIX} Keepalive interval configured.`, {
  intervalMs: KEEPALIVE_INTERVAL_MS,
});
connectKeepalive();
sendKeepalive();
setInterval(sendKeepalive, KEEPALIVE_INTERVAL_MS);
