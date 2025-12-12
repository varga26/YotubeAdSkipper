🎯 YouTube AI Ad Skipper

Smart Ad Remover – Let AI watch the ads so you don't have to

Show Image
Show Image
Show Image
Show Image
A powerful browser extension that leverages Google Gemini AI to automatically detect and skip sponsored segments in YouTube videos. No more manually scrubbing through sponsorships, self-promotions, or embedded ads—let artificial intelligence handle it for you.

📸 Demo
<div align="center">
  <img src="https://via.placeholder.com/800x450/667085/FFFFFF/?text=Demo+GIF+Here" alt="Demo Preview" width="100%">
  <p><em>Watch the extension intelligently skip sponsor segments in real-time</em></p>
</div>

🚀 How It Works
mermaidgraph LR
    A[YouTube Page] -->|Video ID| B[Chrome Extension]
    B -->|Request Analysis| C[Local Server]
    C -->|Fetch Subtitles| D[YouTube API]
    C -->|Analyze Text| E[Google Gemini AI]
    E -->|Ad Segments| C
    C -->|Cache in SQLite| F[Database]
    C -->|Return Segments| B
    B -->|Auto-Skip| A

User opens a YouTube video → Extension extracts the video ID
Extension requests analysis → Server checks cache or fetches subtitles
Gemini AI processes subtitles → Identifies sponsor segments with timestamps
Results are cached → Future loads are instant
Extension auto-skips ads → Seamless viewing experience


✨ Features

🧠 AI-Powered Detection – Gemini 2.5 Flash analyzes subtitles to find sponsorships, self-promos, and embedded ads
⏭️ Automatic Skipping – Jumps over detected segments in real-time
🔄 SPA Navigation Support – Works seamlessly when switching videos (YouTube's Single Page App)
💾 Smart Caching – Stores analyzed segments in SQLite for instant subsequent loads
🖱️ Manual Control – Start/Stop button with visual status indicators
🌐 Multi-Language Support – Works with English, German, French, Spanish, and more
🎨 Modern UI – Clean, intuitive popup interface with smooth animations
⚡ Performance Optimized – Minimal resource usage, runs only when needed


📦 Installation
Prerequisites

Node.js v18 or higher
Google Chrome (or Chromium-based browser)
Google Gemini API Key (Get one here)

Server Setup

Clone the repository

bash   git clone https://github.com/yourusername/youtube-ai-ad-skipper.git
   cd youtube-ai-ad-skipper

Navigate to the server directory

bash   cd background

Install dependencies

bash   npm install

Configure environment variables
Create a .env file in the background folder:

env   GEMINI_API_KEY=your_gemini_api_key_here

Start the server

bash   node background.js
```
   
   The server will run on `http://localhost:3000`

### Chrome Extension Setup

1. **Open Chrome Extensions page**
   
   Navigate to `chrome://extensions/` or click the puzzle icon → Manage Extensions

2. **Enable Developer Mode**
   
   Toggle the switch in the top-right corner

3. **Load the extension**
   
   Click **"Load unpacked"** and select the project root folder (containing `manifest.json`)

4. **Verify installation**
   
   You should see the extension icon appear in your toolbar

---

## 🎮 Usage Guide

### Starting the Ad Skipper

1. **Open any YouTube video**
   
   Navigate to a video with subtitles/captions available

2. **Click the extension icon**
   
   The popup will open showing the current status

3. **Press "Start"**
   
   The extension will:
   - Analyze the video subtitles using AI
   - Detect all sponsor segments
   - Begin automatically skipping them

4. **Status Indicators**
   - 🟢 **Active** – Monitoring and skipping ads
   - ⚫ **Stopped** – Not currently active
   - 🔴 **Error** – Refresh the page and try again

### Stopping the Ad Skipper

Simply click the extension icon again and press **"Stop"**. The extension will remain inactive until you manually start it again.

### Navigation Between Videos

The extension **automatically continues working** when you click on a new video—no need to restart it manually!

---

## 📂 Project Structure
```
youtube-ai-ad-skipper/
│
├── background/                 # Server-side code
│   ├── background.js          # Express server + API endpoints
│   ├── config.js              # Database configuration (Sequelize)
│   ├── model.js               # AdSegment model definition
│   ├── promt.js               # Gemini API prompt template
│   ├── package.json           # Server dependencies
│   └── .env                   # Environment variables (not tracked)
│
├── background.js              # Extension background service worker
├── content.js                 # Content script (runs on YouTube pages)
├── popup.html                 # Extension popup UI
├── popup.css                  # Popup styling
├── popup.js                   # Popup logic
├── manifest.json              # Chrome extension manifest (V3)
├── icon.png                   # Extension icon
│
└── README.md                  # You are here!

🛠️ Technologies Used
Client-Side

Vanilla JavaScript – No frameworks, pure performance
Chrome Extension Manifest V3 – Modern extension architecture
HTML5/CSS3 – Clean, responsive UI

Server-Side

Node.js + Express – RESTful API server
SQLite + Sequelize – Lightweight database with ORM
Google Gemini API – Advanced AI text analysis
YouTube Transcript APIs – Subtitle fetching


🔮 Roadmap & Future Plans

 Firefox Support – Port to Firefox WebExtensions
 Custom Skip Rules – Let users define their own patterns
 Community Database – Share analyzed segments across users
 Machine Learning Training – Improve detection accuracy over time
 Mobile Support – Kiwi Browser / Firefox Mobile compatibility
 Video Chapters Integration – Respect manual chapter markers
 Whitelist/Blacklist – Skip ads only on specific channels
 Statistics Dashboard – Track total time saved


🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

Please ensure your code follows the existing style and includes appropriate comments.

