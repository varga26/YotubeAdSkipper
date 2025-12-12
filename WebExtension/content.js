// content.js
console.log("[YouTube Skipper] Content script loaded.");

// List of detected ad segments (each item: { start: seconds, end: seconds })
let adSegments = [];

// Current HTMLVideoElement we are monitoring
let currentVideoElement = null;

// Last processed videoId to detect navigation between videos
let lastVideoId = null;

// NEW: Flag that remembers whether the user pressed Start (analysis is active)
let isAnalysisActive = false;

/* ------------------------------------------------------------------
   1. Universal time parser: accepts "HH:MM:SS,mmm" or "SS.sss" or numeric
   Returns seconds (Number) or null on failure
   ------------------------------------------------------------------ */
function timeToSeconds(input) {
  if (typeof input === 'number') return input;
  if (!input) return null;
  if (input.toString().indexOf(':') === -1) return parseFloat(input);
  try {
    const parts = input.split(':').reverse();
    let seconds = 0;
    if (parts[0]) seconds += parseFloat(parts[0].replace(',', '.'));
    if (parts[1]) seconds += parseInt(parts[1]) * 60;
    if (parts[2]) seconds += parseInt(parts[2]) * 3600;
    return seconds;
  } catch (e) {
    return null;
  }
}

/* ------------------------------------------------------------------
   2. Skip logic: runs on video timeupdate events.
   Only attempts skipping when:
     - analysis is active (user started it)
     - a video element is attached
     - adSegments is non-empty
   If currentTime falls inside a segment, it jumps to (end + 0.1)
   ------------------------------------------------------------------ */
function checkAndSkip() {
  // DO NOTHING if analysis is not active
  if (!isAnalysisActive || !currentVideoElement || adSegments.length === 0) return;

  const currentTime = currentVideoElement.currentTime;
  for (const segment of adSegments) {
    if (currentTime >= segment.start && currentTime < segment.end) {
      console.log(`[Skipper] ⏭ Skipping ad: ${segment.start} -> ${segment.end}`);
      // Advance a little past the end to ensure playback resumes after the segment
      currentVideoElement.currentTime = segment.end + 0.1;
      return;
    }
  }
}

/* ------------------------------------------------------------------
   3. Utility functions
   - getVideoId: reads ?v= from the URL
   - fetchSegments: asks the background/service worker for stored segments
   - processSegments: normalize, filter and sort raw segments
   - attachListener: attach timeupdate listener to a video element
   ------------------------------------------------------------------ */
function getVideoId() {
  return new URLSearchParams(window.location.search).get("v");
}

function fetchSegments(videoId) {
  if (!videoId) return;
  // Reset current segments before asking for new ones
  adSegments = [];
  console.log(`[Skipper] Requesting segments for video: ${videoId}`);

  // Send a message to the extension runtime (background) to get stored segments
  chrome.runtime.sendMessage({ action: "get_segments", videoId: videoId }, (response) => {
    // If there's an error or no response, bail out
    if (chrome.runtime.lastError || !response || !response.segments) return;

    // Process and store the received segments
    processSegments(response.segments);
  });
}

function processSegments(rawSegments) {
  // Normalize incoming segment objects into { start: Number, end: Number }
  adSegments = rawSegments
    .map(s => ({
      start: timeToSeconds(s.start_time || s.start),
      end: timeToSeconds(s.end_time || s.end)
    }))
    // Keep only valid segments where end > start
    .filter(s => s.start !== null && s.end !== null && s.end > s.start)
    // Sort by start time ascending
    .sort((a, b) => a.start - b.start);

  console.log(`[Skipper] Loaded ${adSegments.length} segments.`);
}

function attachListener(video) {
  // If the same video element is already attached, skip re-attaching
  if (currentVideoElement === video) return;
  currentVideoElement = video;
  // Listen for time updates to run checkAndSkip
  currentVideoElement.addEventListener('timeupdate', checkAndSkip);
}

/* ------------------------------------------------------------------
   4. Page / navigation handling
   - handleNewPageLoad finds the video element and attaches the listener
   - detects new videoId and optionally auto-fetches segments if analysis is active
   ------------------------------------------------------------------ */
function handleNewPageLoad() {
  // Find the <video> element and attach the listener if present
  const video = document.querySelector('video');
  if (video) attachListener(video);

  // Detect navigation to a different video
  const newVideoId = getVideoId();
  if (newVideoId && newVideoId !== lastVideoId) {
    console.log(`[Skipper] New video detected: ${newVideoId}`);
    lastVideoId = newVideoId;
    adSegments = []; // Clear previous segments

    // IMPORTANT: If the extension was active before navigation, continue automatically
    if (isAnalysisActive) {
      console.log("[Skipper] Auto-continuing analysis...");
      fetchSegments(newVideoId);
    }
  }
}

/* ------------------------------------------------------------------
   5. DOM observation & initial boot
   - observe mutations to catch dynamically injected <video> elements
   - listen to yt-navigate-finish for YouTube SPA navigation
   ------------------------------------------------------------------ */
document.addEventListener("yt-navigate-finish", handleNewPageLoad);

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // If a <video> node was added or a container that has a <video>, trigger handler
      if (node.tagName === 'VIDEO' || (node.querySelector && node.querySelector('video'))) {
        handleNewPageLoad();
      }
    }
  }
});

// Observe the entire document for added nodes (captures SPA changes)
observer.observe(document.body, { childList: true, subtree: true });

// Initial run to attach to the player on script load
handleNewPageLoad();

/* ------------------------------------------------------------------
   Message interface: respond to popup/background messages
   - get_status: popup asks whether analysis is active and how many segments
   - start_analysis: enable analysis and fetch segments for current video
   - stop_analysis: disable analysis (user requested)
   ------------------------------------------------------------------ */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const videoId = getVideoId();

  // 1. Popup requests status
  if (request.action === "get_status") {
    sendResponse({
      isActive: isAnalysisActive,
      segmentsCount: adSegments.length,
      videoId: videoId
    });
  }

  // 2. Start command: mark analysis active and fetch segments
  if (request.action === "start_analysis") {
    isAnalysisActive = true;
    fetchSegments(videoId);
    sendResponse({ status: "started" });
  }

  // 3. Stop command: mark analysis inactive
  if (request.action === "stop_analysis") {
    isAnalysisActive = false;
    console.log("[Skipper] Stopped by user.");
    sendResponse({ status: "stopped" });
  }

  // Return true to keep the message channel open if any async responses are needed
  return true;
});
