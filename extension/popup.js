// Clari Extension — Popup Script
// Reads state from background, renders status UI, handles actions.

const CLARI_APP_URL = "http://localhost:8080"; // Change to deployed URL when live

function formatTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatPlatform(platform) {
  if (!platform) return "Unknown";
  return platform === "google-meet" ? "Google Meet" : "Zoom";
}

function render(state) {
  const container = document.getElementById("app-content");
  const { transcript = [], wordCount = 0, meetingActive, platform, lastUpdated } = state || {};
  const hasTranscript = transcript.length > 0;

  if (!meetingActive && !hasTranscript) {
    container.innerHTML = `
      <div class="no-meeting">
        <strong>No active meeting</strong>
        Open a Google Meet or Zoom call, then enable captions to start capturing.
      </div>
      <div class="actions">
        <button class="btn-primary" id="btn-open-clari">Open Clari</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="status-row">
        <span class="dot ${meetingActive ? "active" : "inactive"}"></span>
        <span class="status-label">${meetingActive ? "Capturing" : "Stopped"}</span>
        ${platform ? `<span class="platform-badge">${formatPlatform(platform)}</span>` : ""}
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-value">${wordCount}</div>
          <div class="stat-label">Words captured</div>
        </div>
        <div class="stat">
          <div class="stat-value">${transcript.length}</div>
          <div class="stat-label">Segments</div>
        </div>
      </div>

      ${lastUpdated ? `<div class="last-updated">Last updated at ${formatTime(lastUpdated)}</div>` : ""}

      <div class="actions">
        <button class="btn-primary" id="btn-open-clari">Open in Clari</button>
        ${hasTranscript ? `<button class="btn-secondary" id="btn-copy">Copy Transcript</button>` : ""}
        ${hasTranscript ? `<button class="btn-danger" id="btn-clear">Clear Transcript</button>` : ""}
      </div>
      <div class="copied" id="copied-msg">Copied to clipboard!</div>
    `;
  }

  // Wire up buttons
  document.getElementById("btn-open-clari")?.addEventListener("click", () => {
    chrome.tabs.create({ url: CLARI_APP_URL + "/demo" });
  });

  document.getElementById("btn-copy")?.addEventListener("click", () => {
    const text = transcript
      .map((s) => `[${formatTime(s.timestamp)}] ${s.text}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      const msg = document.getElementById("copied-msg");
      if (msg) {
        msg.style.display = "block";
        setTimeout(() => { msg.style.display = "none"; }, 2000);
      }
    });
  });

  document.getElementById("btn-clear")?.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "CLEAR_TRANSCRIPT" }, () => {
      render({ transcript: [], wordCount: 0, meetingActive: false, platform: null, lastUpdated: null });
    });
  });
}

// Load state from background on popup open
chrome.runtime.sendMessage({ type: "GET_STATE" }, (state) => {
  render(state);
});
