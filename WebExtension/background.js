// background.js (Chrome Extension)

// Listen for messages coming from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // If content.js requests ad segments for a specific video
  if (request.action === "get_segments") {
    
    const videoId = request.videoId;
    const SERVER_URL = `http://localhost:3000/analyze/${videoId}`; 
    // URL of your local Express server endpoint

    console.log(`[Background] Fetching from server for: ${videoId}`);

    // Make a request to your local server
    fetch(SERVER_URL, {
      method: "POST", // or GET depending on your Express server setup
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("[Background] Data received:", data);
      // Send the received data back to content.js
      sendResponse({ segments: data });
    })
    .catch(error => {
      console.error("[Background] Error fetching segments:", error);
      // Return error information to content.js
      sendResponse({ error: error.message });
    });

    // Important: return true to tell Chrome that sendResponse will be called asynchronously
    return true;
  }
});
