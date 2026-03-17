// Clari Extension — Background Service Worker (Manifest V3)
// Persists transcript state across popup open/close cycles.

const DEFAULT_STATE = {
  transcript: [],
  wordCount: 0,
  meetingActive: false,
  platform: null,
  lastUpdated: null,
};

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ clariState: DEFAULT_STATE });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case "TRANSCRIPT_UPDATE": {
      chrome.storage.local.get("clariState", ({ clariState }) => {
        const updated = {
          ...(clariState || DEFAULT_STATE),
          transcript: message.transcript,
          wordCount: message.wordCount,
          meetingActive: message.meetingActive,
          platform: message.platform,
          lastUpdated: Date.now(),
        };
        chrome.storage.local.set({ clariState: updated });
      });
      break;
    }

    case "MEETING_ENDED": {
      chrome.storage.local.get("clariState", ({ clariState }) => {
        const updated = {
          ...(clariState || DEFAULT_STATE),
          meetingActive: false,
          lastUpdated: Date.now(),
        };
        chrome.storage.local.set({ clariState: updated });
      });
      break;
    }

    case "GET_STATE": {
      chrome.storage.local.get("clariState", ({ clariState }) => {
        sendResponse(clariState || DEFAULT_STATE);
      });
      return true; // Keep message channel open for async response
    }

    case "CLEAR_TRANSCRIPT": {
      chrome.storage.local.set({ clariState: DEFAULT_STATE });
      sendResponse({ ok: true });
      break;
    }
  }
});
