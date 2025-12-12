# YouTube AI Ad Skipper 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20Extension-orange.svg)
![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash-purple.svg)

> **Reclaim your viewing experience.**  
> An intelligent Chrome extension that uses Google Gemini AI to analyze YouTube subtitles and automatically skip in-video sponsorships, self-promotions, and filler content.

---

## 📸 Demo

![Demo of Ad Skipper](https://via.placeholder.com/800x400?text=Insert+Your+Demo+GIF+Here)

> Replace this placeholder with a real screenshot or GIF of the extension in action.

---

## 🧐 How It Works

This project uses a **Client–Server architecture** to offload AI processing from the browser.

```mermaid
graph LR
    A[Chrome Extension] -->|1. Send Video ID| B[Node.js Server]
    B -->|2. Fetch Subtitles| C[YouTube API]
    B -->|3. Analyze Text| D[Google Gemini AI]
    D -->|4. Ad Segments| B
    B -->|5. Store Result| E[SQLite Cache]
    B -->|6. Return Timestamps| A
    A -->|7. Auto-Skip| F[YouTube Player]
Flow Explanation
Detection – You click Start on a YouTube video.

Analysis – The extension sends the video ID to the local Node.js server.

AI Processing – Subtitles are analyzed by Gemini 2.5 Flash using a custom prompt.

Caching – Results are stored in a local SQLite database.

Action – The extension receives timestamps and automatically skips detected segments.

✨ Key Features
🧠 AI-Powered Analysis
Uses Gemini 2.5 Flash to understand context, not just keywords.

⏭️ Smart Skipping
Automatically skips sponsorships and self-promotions.

🔄 SPA Support
Fully compatible with YouTube’s Single Page Application navigation.

🖱️ Manual Control
Simple Start / Stop toggle with live status indicators.

⚡ Intelligent Caching
Videos are analyzed once and reused instantly in the future.

🛠️ Tech Stack
Component	Technologies
Client	Chrome Extension (Manifest V3), Vanilla JS, HTML5, CSS3
Server	Node.js, Express.js
AI Engine	Google Gemini API (gemini-2.5-flash)
Database	SQLite (Sequelize ORM)
Utilities	youtube-transcript-plus, node-fetch

🚀 Installation
Prerequisites
Node.js v18+

Google Gemini API Key

Google Chrome (or Chromium-based browser)

1️⃣ Server Setup
The backend handles AI communication.

bash
Копировать код
git clone https://github.com/varga26/YotubeAdSkipper.git
cd YotubeAdSkipper/server
npm install
Create a .env file (or edit config.js) and add your API key:

env
Копировать код
GEMINI_API_KEY=your_api_key_here
Start the server:

bash
Копировать код
node background.js
Server will run at:
👉 http://localhost:3000

2️⃣ Extension Setup
Open Chrome and go to: chrome://extensions/

Enable Developer mode

Click Load unpacked

Select the extension/ folder

The YouTube AI Ad Skipper icon should appear in your toolbar.

📖 Usage Guide
Open YouTube

Start any video

Click the extension icon

Press Start

Status meanings:
Running... → AI is analyzing the video

Active! Skipping X segments → Sponsor segments detected

Error → Something went wrong (check server)

▶️ Enjoy uninterrupted viewing
⏹️ Click Stop to disable skipping at any time

📂 Project Structure
plaintext
Копировать код
youtube-ai-skipper/
├── extension/             # Client-side code
│   ├── manifest.json      # Chrome V3 Manifest
│   ├── popup.html         # Extension UI
│   ├── style.css          # UI Styling
│   ├── popup.js           # UI Logic
│   ├── content.js         # Video Player Controller
│   ├── background.js      # Extension Service Worker
│   └── icon.png           # Logo
│
└── server/                # Backend code
    ├── background.js      # Express server entry point
    ├── config.js          # DB & API configuration
    ├── prompt.js          # Gemini system prompt
    ├── database.sqlite    # Local cache (auto-generated)
    └── package.json       # Dependencies
