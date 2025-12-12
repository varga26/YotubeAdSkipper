# YouTube AI Ad Skipper 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20Extension-orange.svg)
![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash-purple.svg)

> **Reclaim your viewing experience.** An intelligent browser extension that leverages Google Gemini AI to analyze subtitles and automatically skip in-video sponsorships, self-promotions, and filler content.

---

## 📸 Demo

![Demo of Ad Skipper](https://via.placeholder.com/800x400?text=Insert+Your+Demo+GIF+Here)
*(Place a screenshot or GIF of your extension here)*

---

## 🧐 How It Works

This project uses a hybrid **Client-Server** architecture to offload heavy AI processing from the browser.

```mermaid
graph LR
    A[Chrome Extension] -->|1. Send Video ID| B[Node.js Server]
    B -->|2. Fetch Subtitles| C[YouTube API]
    B -->|3. Analyze Text| D[Google Gemini AI]
    D -->|4. Ad Segments| B
    B -->|5. Store Result| E[SQLite Cache]
    B -->|6. Return Timestamps| A
    A -->|7. Auto-Skip| F[YouTube Player]
