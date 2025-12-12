// popup.js

let isRunning = false;

function updateUI(isActive, count) {
    const resultText = document.getElementById('result');
    const btn = document.getElementById('analyzeBtn');
    
    isRunning = isActive;

    // Reset all state classes before updating
    resultText.className = ''; 
    // (If 'result' had other layout classes, 
    // it's better to use resultText.classList.remove('status-active', 'status-error'))

    if (isActive) {
        // --- STATE: RUNNING ---
        
        btn.innerText = "Stop";
        // Add class that makes the button black (see CSS)
        btn.classList.add('state-running');
        btn.disabled = false;
        
        // if (count > 0) {
        //     resultText.innerText = `Active: Skipping ${count} segments`;
        // } else {
        //     resultText.innerText = "Active: Monitoring..."; 
        // }
        resultText.innerText = `Active`;
        // Add class for green text
        resultText.classList.add('status-active');

    } else {
        // --- STATE: STOPPED ---
        
        btn.innerText = "Start";
        // Remove class, button reverts to default red color from CSS
        btn.classList.remove('state-running');
        btn.disabled = false;
        
        resultText.innerText = "Ready to start";
        // Text classes were reset at the start of the function, so it becomes gray automatically
    }
}

// 1. Initialization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url && tab.url.includes("youtube.com/watch")) {
            chrome.tabs.sendMessage(tab.id, { action: "get_status" }, (response) => {
                if (!chrome.runtime.lastError && response) {
                    updateUI(response.isActive, response.segmentsCount);
                }
            });
        } else {
            const resEl = document.getElementById('result');
            resEl.innerText = "Not a YouTube video";
            // Add error class (if you want red text)
            resEl.classList.add('status-error');
            document.getElementById('analyzeBtn').disabled = true;
        }
    } catch (e) { console.error(e); }
});

// 2. Click (Toggle)
document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const command = isRunning ? "stop_analysis" : "start_analysis";

    chrome.tabs.sendMessage(tab.id, { action: command }, (response) => {
        if (chrome.runtime.lastError) {
            const resEl = document.getElementById('result');
            resEl.innerText = "Error: Refresh page";
            resEl.classList.add('status-error');
            return;
        }

        if (response && response.status === "started") {
            updateUI(true, 0);
        } 
        else if (response && response.status === "stopped") {
            updateUI(false, 0);
        }
    });
});