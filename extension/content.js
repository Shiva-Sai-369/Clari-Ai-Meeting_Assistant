// Clari Extension — Content Script
// Injected into Google Meet (meet.google.com) and Zoom (zoom.us/wc, zoom.us/j).
// Scrapes live captions via MutationObserver and shows a floating overlay.

(function () {
  // Guard: only run once
  if (window.__clariInjected) return;
  window.__clariInjected = true;

  // ─── Platform detection ───────────────────────────────────────────────────
  const platform = location.hostname.includes("meet.google.com")
    ? "google-meet"
    : "zoom";

  // ─── Caption selectors ────────────────────────────────────────────────────
  // Google Meet uses aria-live regions for captions. Class names like .a4cQT
  // change with deploys — aria-live is the most stable selector.
  const CAPTION_SELECTORS = {
    "google-meet": [
      '[aria-live="polite"]',
      '[aria-live="assertive"]',
      ".a4cQT",
      ".iOzk7",
    ],
    zoom: [
      ".caption-line",
      '[class*="live-transcription"]',
      '[class*="caption"]',
    ],
  };

  // ─── State ────────────────────────────────────────────────────────────────
  let isCapturing = false;
  let transcript = []; // [{ text, timestamp }]
  let lastCaptionText = "";
  let observer = null;
  let syncInterval = null;
  const OVERLAY_ID = "clari-overlay";

  // ─── Utilities ────────────────────────────────────────────────────────────
  function countWords(segments) {
    return segments.reduce(
      (acc, s) => acc + s.text.trim().split(/\s+/).filter(Boolean).length,
      0
    );
  }

  function syncToBackground() {
    chrome.runtime.sendMessage({
      type: "TRANSCRIPT_UPDATE",
      transcript,
      wordCount: countWords(transcript),
      meetingActive: isCapturing,
      platform,
    });
  }

  // ─── Caption scraping ─────────────────────────────────────────────────────
  function handleCaptionNode(node) {
    const text = node.textContent?.trim();
    if (!text || text === lastCaptionText || text.length < 3) return;

    // Avoid near-duplicates (Meet updates captions incrementally)
    const lastSeg = transcript[transcript.length - 1];
    if (lastSeg && text.startsWith(lastSeg.text) && text.length < lastSeg.text.length + 60) {
      // Overwrite the last segment (it's still the same utterance)
      lastSeg.text = text;
    } else {
      transcript.push({ text, timestamp: Date.now() });
    }

    lastCaptionText = text;
    updateOverlay();
    syncToBackground();
  }

  function startObserver() {
    if (observer) return;

    const selectors = CAPTION_SELECTORS[platform];

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Check added nodes
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = /** @type {Element} */ (node);
            if (selectors.some((sel) => el.matches?.(sel))) {
              handleCaptionNode(el);
            }
            // Also check descendants
            for (const sel of selectors) {
              el.querySelectorAll?.(sel).forEach(handleCaptionNode);
            }
          }
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            const parent = node.parentElement;
            if (parent && selectors.some((sel) => parent.closest?.(sel))) {
              handleCaptionNode(parent);
            }
          }
        }

        // Check character data changes (in-place text updates)
        if (mutation.type === "characterData") {
          const parent = mutation.target.parentElement;
          if (parent && selectors.some((sel) => parent.closest?.(sel))) {
            handleCaptionNode(parent);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Periodic sync in case mutations are missed
    syncInterval = setInterval(syncToBackground, 5000);
  }

  function stopObserver() {
    observer?.disconnect();
    observer = null;
    clearInterval(syncInterval);
    syncInterval = null;
  }

  // ─── Controls ──────────────────────────────────────────────────────────────
  function startCapture() {
    isCapturing = true;
    startObserver();
    syncToBackground();
    updateOverlay();
  }

  function stopCapture() {
    isCapturing = false;
    stopObserver();
    syncToBackground();
    chrome.runtime.sendMessage({ type: "MEETING_ENDED" });
    updateOverlay();
  }

  function clearCapture() {
    transcript = [];
    lastCaptionText = "";
    syncToBackground();
    updateOverlay();
  }

  // ─── Overlay UI ────────────────────────────────────────────────────────────
  function createOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;

    const el = document.createElement("div");
    el.id = OVERLAY_ID;
    el.innerHTML = `
      <div id="clari-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;cursor:move;">
        <span style="font-weight:700;font-size:13px;letter-spacing:0.5px;">⚡ Clari</span>
        <div style="display:flex;gap:6px;">
          <button id="clari-clear" title="Clear transcript" style="${btnStyle("#374151")}">✕</button>
          <button id="clari-minimize" title="Minimize" style="${btnStyle("#374151")}">─</button>
        </div>
      </div>
      <div id="clari-body">
        <div id="clari-status" style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:12px;color:#9ca3af;">
          <span id="clari-dot" style="width:8px;height:8px;border-radius:50%;background:#6b7280;display:inline-block;"></span>
          <span id="clari-status-text">Idle</span>
          <span style="margin-left:auto;font-size:11px;" id="clari-wordcount">0 words</span>
        </div>
        <div id="clari-preview" style="font-size:11px;color:#d1d5db;min-height:32px;max-height:60px;overflow:hidden;margin-bottom:10px;line-height:1.4;"></div>
        <button id="clari-toggle" style="${btnStyle("#7c3aed")}width:100%;padding:6px 0;font-size:12px;font-weight:600;">
          Start Capture
        </button>
      </div>
    `;

    Object.assign(el.style, {
      position: "fixed",
      bottom: "80px",
      right: "20px",
      zIndex: "2147483647",
      background: "#1f2937",
      color: "#f9fafb",
      borderRadius: "12px",
      padding: "12px 14px",
      width: "220px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "13px",
      userSelect: "none",
    });

    document.body.appendChild(el);

    // Wire up buttons
    document.getElementById("clari-toggle").addEventListener("click", () => {
      isCapturing ? stopCapture() : startCapture();
    });

    document.getElementById("clari-clear").addEventListener("click", (e) => {
      e.stopPropagation();
      clearCapture();
    });

    let minimized = false;
    document.getElementById("clari-minimize").addEventListener("click", (e) => {
      e.stopPropagation();
      minimized = !minimized;
      document.getElementById("clari-body").style.display = minimized
        ? "none"
        : "block";
      document.getElementById("clari-minimize").textContent = minimized
        ? "+"
        : "─";
      el.style.width = minimized ? "120px" : "220px";
    });

    // Drag support
    makeDraggable(el, document.getElementById("clari-header"));
  }

  function btnStyle(bg) {
    return `background:${bg};border:none;border-radius:6px;color:#f9fafb;cursor:pointer;padding:3px 7px;font-size:11px;`;
  }

  function updateOverlay() {
    const dot = document.getElementById("clari-dot");
    const statusText = document.getElementById("clari-status-text");
    const wordCount = document.getElementById("clari-wordcount");
    const preview = document.getElementById("clari-preview");
    const toggle = document.getElementById("clari-toggle");
    if (!dot) return;

    const words = countWords(transcript);
    dot.style.background = isCapturing ? "#10b981" : "#6b7280";
    if (isCapturing) dot.style.animation = "clari-pulse 1.5s infinite";
    else dot.style.animation = "none";
    statusText.textContent = isCapturing ? "Capturing" : "Stopped";
    wordCount.textContent = `${words} word${words !== 1 ? "s" : ""}`;

    const last3 = transcript.slice(-3).map((s) => s.text).join(" … ");
    preview.textContent = last3 || (isCapturing ? "Waiting for captions…" : "No transcript yet.");

    toggle.textContent = isCapturing ? "Stop Capture" : "Start Capture";
    toggle.style.background = isCapturing ? "#dc2626" : "#7c3aed";
  }

  function makeDraggable(el, handle) {
    let ox = 0, oy = 0, mx = 0, my = 0;
    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      ox = e.clientX - el.getBoundingClientRect().left;
      oy = e.clientY - el.getBoundingClientRect().top;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
    function onMove(e) {
      mx = e.clientX - ox;
      my = e.clientY - oy;
      el.style.left = mx + "px";
      el.style.top = my + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
  }

  // Inject pulse keyframe once
  const style = document.createElement("style");
  style.textContent = `@keyframes clari-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`;
  document.head.appendChild(style);

  // ─── Boot ─────────────────────────────────────────────────────────────────
  // Wait for the meeting UI to load before injecting overlay
  function boot() {
    createOverlay();
    updateOverlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    // DOM ready — but Meet loads content dynamically, so slight delay
    setTimeout(boot, 2000);
  }

  // Detect page unload (meeting ended)
  window.addEventListener("beforeunload", () => {
    if (isCapturing) stopCapture();
  });
})();
