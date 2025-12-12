YouTube AI Ad Skipper 🚀Reclaim your viewing experience. An intelligent browser extension that leverages Google Gemini AI to analyze subtitles and automatically skip in-video sponsorships, self-promotions, and filler content.📸 Demo(Replace the image link above with a GIF of your extension in action!)🧐 How It WorksThis project uses a hybrid Client-Server architecture to offload heavy AI processing from the browser.Фрагмент кодуgraph LR
    A[Chrome Extension] -->|1. Send Video ID| B[Node.js Server]
    B -->|2. Fetch Subtitles| C[YouTube API/Scraper]
    B -->|3. Analyze Text| D[Google Gemini AI]
    D -->|4. Ad Segments| B
    B -->|5. Store Result| E[SQLite Cache]
    B -->|6. Return Timestamps| A
    A -->|7. Auto-Skip| F[YouTube Player]
Detection: You click "Start" on a video. The extension sends the ID to the local server.Analysis: The server downloads the subtitles and sends them to Gemini 2.5 Flash with a specialized prompt to identify sponsor segments.Caching: Results are saved in a local SQLite database. If you (or anyone) watch the video again, the result is instant.Action: The extension receives the timestamps (start -> end) and automatically fast-forwards the video player when those segments are reached.✨ Key Features🧠 AI-Powered Analysis: Utilizes the speed and context window of Gemini 2.5 Flash to understand context, not just keywords.⏭️ Smart Skipping: Automatically jumps over sponsorships, ensuring a seamless viewing flow.🔄 SPA Support: Fully compatible with YouTube's Single Page Application navigation (works when clicking suggested videos without refreshing).🖱️ Manual Control: Simple "Start/Stop" toggle in the popup with real-time status indicators (Active/Waiting/Error).⚡ Intelligent Caching: Analyzes a video once, stores the data, and retrieves it instantly for future views.🛠️ Tech StackComponentTechnologiesClientChrome Extension (Manifest V3), Vanilla JavaScript, HTML5, CSS3ServerNode.js, Express.jsAI EngineGoogle Gemini API (gemini-2.5-flash)DatabaseSQLite (via Sequelize ORM)Utilitiesyoutube-transcript-plus, node-fetch🚀 InstallationPrerequisitesNode.js (v18 or higher)A Google Gemini API KeyGoogle Chrome (or Chromium-based browser)1. Server SetupThe backend handles the AI communication.Clone the repository:Bashgit clone https://github.com/yourusername/youtube-ai-skipper.git
cd youtube-ai-skipper/server
Install dependencies:Bashnpm install
Configure your API Key:Open config.js or your environment file.Replace the placeholder with your actual Gemini API Key.Start the server:Bashnode background.js
The server will run on http://localhost:3000.2. Extension SetupLoad the extension into your browser.Open Chrome and navigate to chrome://extensions/.Toggle Developer mode (top right corner).Click Load unpacked.Select the extension folder from this project.The YouTube AD Remover icon should appear in your toolbar.📖 Usage GuideOpen YouTube: Navigate to any video you want to watch.Open the Extension: Click the extension icon in the toolbar.Click Start: Press the red "Start" button.Status: "Running..." means the AI is analyzing.Status: "Active! Skipping X segments" means ad segments were found.Enjoy: Watch the video. The player will automatically jump over the detected segments.Stop: Click "Stop" at any time to disable skipping for the current session.📂 Project StructurePlaintextyoutube-ai-skipper/
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
    ├── background.js      # Main Express Server entry point
    ├── config.js          # DB & API Configuration
    ├── promt.js           # The System Prompt for Gemini
    ├── database.sqlite    # Local Cache (Auto-generated)
    └── package.json       # Dependencies
🔮 Future Plans[ ] Multi-language Support: Detect ads in non-English videos automatically.[ ] Cloud Sync: Share skip segments with the community (Crowdsourcing).[ ] Custom Sensitivity: Slider to adjust how aggressive the AI is at finding ads.[ ] Firefox Port: Make the extension compatible with Mozilla Firefox.🤝 ContributingContributions are welcome! Please feel free to submit a Pull Request.Fork the projectCreate your Feature Branch (git checkout -b feature/AmazingFeature)Commit your Changes (git commit -m 'Add some AmazingFeature')Push to the Branch (git push origin feature/AmazingFeature)Open a Pull Request
