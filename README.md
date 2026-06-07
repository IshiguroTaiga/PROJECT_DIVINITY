# Project: DIVINITY 🌌
### An Interactive Fan Site for Priestess (Arknights) & The Herta (Honkai: Star Rail)

"Project: DIVINITY" is a high-fidelity, single-page fan experience that explores the parallels between two cosmic enigmas: **Priestess** from the ancient First Civilization of Terra, and **The Herta**, member #83 of the Genius Society and Emanator of Erudition.

---

## ✨ Features

### 🌓 Dynamic Dual Themes
The entire site aesthetics, typography, and motifs shift seamlessly between the two characters at the click of a toggle.
- **Priestess Theme:** Ancient civilization, cosmic horror, deep crimson/obsidian palette, and the "EYESOFPRIESTESS" watermark.
- **The Herta Theme:** Galactic grandeur, academic arrogance, icy blue/navy palette, and Genius Society motifs.

### 🎭 Character-Specific UI/UX
- **SVG Cursors:** Custom-drawn crimson eye sigil for Priestess and a glowing cyan star for The Herta.
- **Particle Backgrounds:** Drifting glowing embers for Priestess and falling cosmic snowflakes for The Herta.
- **Parallax Hero:** Cinematic splash art that responds to mouse movement and scrolling.
- **Animated Timeline:** An immersive vertical timeline detailing the lore of both deities.
- **Lightbox Gallery:** A fullscreen visual record system for high-quality character assets.

### 🤖 Intelligent Chatbot (Groq-Powered)
A fully functional, persona-isolated chat interface using the **Groq API (Llama 3.3)** for near-instant responses.
- **Isolated History:** Independent memory banks for each character.
- **Advanced Controls:** Minimize, Maximize, New Chat, and Clear History functionality.
- **In-Character Fallbacks:** Character-accurate offline responses if the API is unreachable.

---

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3 (Custom Properties), Vanilla JavaScript.
- **Backend:** Node.js, Express (API Proxy Server to bypass CORS).
- **AI Inference:** Groq API (llama-3.3-70b-versatile).
- **Dev Tools:** Browser-sync, Concurrently, Nodemon (Live Hot Reloading).

---

## 🚀 Getting Started (Local Development)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Up API Key:**
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_actual_api_key_here
   ```

3. **Launch the Experience:**
   ```bash
   npm run dev
   ```
   *The site will automatically open at `http://localhost:3000` with Live Reload enabled.*

---

## 🌐 Deployment Guide (GitHub Pages + Backend)

Since GitHub Pages only hosts **static** files, it cannot run the `server.js` required for the AI chatbot. To publish this site fully:

### 1. The Frontend (GitHub Pages)
- Push the repository to GitHub.
- Go to **Settings > Pages** and select the `main` branch.
- *Note:* You will need to update `script.js` to point to your live backend URL instead of `/api/chat`.

### 2. The Backend (Proxy Server)
- Deploy the `server.js` and `package.json` to a platform that supports Node.js (e.g., **Render.com**, **Railway.app**, or **Fly.io**).
- Set your `GROQ_API_KEY` as an environment variable on that platform.

---

## 📜 Credits
- **Created by:** Ishiguro Taiga
- **Assets:** Character designs and lore belong to **Hypergryph** (Arknights) and **HoYoverse** (Honkai: Star Rail).
- **Disclaimer:** This is a non-profit fan project and is not affiliated with the developers or publishers of the respective games.

---
*"Even if the galaxies vanish into the void... I am here."*
