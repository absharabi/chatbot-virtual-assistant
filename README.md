# MITTU - Voice-Enabled Smart Virtual Companion & Welfare Scheme Evaluator

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Url-brightgreen.svg?style=for-the-badge)](https://absharabi.github.io/chatbot-virtual-assistant/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Git Pages](https://img.shields.io/badge/Pages-Deployed-orange?style=for-the-badge&logo=github&logoColor=white)]()

> MITTU is an advanced, voice-activated virtual assistant designed to bridge the digital literacy gap for senior citizens and low-income demographics. It features a state-driven, multi-factor **Government Scheme Eligibility Engine**, dual-mode accessibility styling, emergency routing, and daily helper functions—all operating without complex backend dependencies to run fast on lower-end devices.

### 🔗 **[Explore the Live Deployment](https://absharabi.github.io/chatbot-virtual-assistant/)**

---

## 🚀 Interactive Technical Showcase

### 1. ♿ Elderly-First Accessibility Grid System
Recruiters looking for accessibility compliance will appreciate MITTU's implementation of assistive layout engineering:
*   **Contrast & Legibility:** Activating *Elderly Mode* instantly overrides basic variables with high-contrast rulesets (bright yellow text on `#111111` black card background) compliant with WCAG 2.1 AAA standards.
*   **Adaptive Cognitive Load:** Hides large, distracting media assets (e.g., the pulsing robot GIF avatar) to save vertical screen space and keep focus solely on chat interactions.
*   **Speech Output Governance:** Modulates the Web Speech Synthesis engine dynamically, dropping the speech rate to **0.85x** for clear pronunciation and comfort.
*   **Layout Safety:** Built with `flex-shrink: 0` wrappers to prevent enlarged containers and buttons from breaking layouts on small Viewports.

### 2. 🏛️ Unified Multi-Scheme Matchmaking Engine
Instead of basic keyword matching, MITTU uses an interactive, state-guided assessment tree to profile users:
*   **Profile Building:** Walks users through a sequence of 7 demographic questions (Age, Kerala Residency, Family Income, Occupation, Disability, Widowed status, SECC registration).
*   **Conditional Evaluation:** Runs a custom matcher comparing user values against targeted rules defined dynamically in `schemes.json`.
*   **Transparency:** When ineligible, the engine gives the user clear reasons (e.g., *"Age must be 60+"* or *"Must be in SECC database"*).
*   **Routing to Local Action:** If the user is eligible, MITTU details specific documents needed, lists application steps, and generates GPS coordinates to map the nearest local Grama Panchayat or CSC office.

### 3. 🗺️ GPS Geolocation Service Locator
*   Leverages the browser `Navigator.geolocation` API to resolve the user's exact latitude and longitude asynchronously.
*   Directly parses and embeds user coordinates into query strings mapping to Google Maps search parameters, instantly opening directions to localized services like **Government Hospitals, Common Service Centers (CSCs), Police Stations, and Panchayat Offices**.

### 4. 📰 Fallback RSS Live News Feed
*   Parses national and international news headlines dynamically.
*   Uses a proxy wrapper to parse RSS news feeds (fetching *The Hindu* and *BBC News*) into a structured JSON string, generating clickable article preview cards inside the conversation board.

### 5. 🔔 Smart Utilities & Safety Safeguards
*   **Medication Reminders:** Demonstrates scheduling prompts (e.g., *"Take your medical pills & drink water"*). Uses non-blocking timer queues to prompt older users.
*   **Fraud Awareness System:** Triggers active security warnings when keywords like "OTP", "bank call", or "scam" are detected.
*   **Emergency SOS:** Instantly lists fire, ambulance, and police coordinates while sharing current location links.

---

## 🛠️ How to Run Locally

Because the project leverages advanced Web APIs (microphone voice capture and geolocation coordinates), modern browsers block these services on file-based scripts (`file:///...`). To test features, run it using a local HTTP server.

### Option A: Running with Python (Easiest)
1. Clone the repository:
   ```bash
   git clone https://github.com/absharabi/chatbot-virtual-assistant.git
   cd chatbot-virtual-assistant
   ```
2. Launch a fast HTTP server:
   ```bash
   python -m http.server 8000
   ```
3. Open directory in your browser: [http://localhost:8000](http://localhost:8000)

### Option B: Running with VS Code "Live Server"
1. Open this workspace in **VS Code**.
2. Click **Go Live** on the bottom right tray bar.

---

## 📂 Project Architecture

```
chatbot-virtual-assistant/
│
├── index.html        # App structural layout and core UI shell
├── style.css         # Styling system, responsive grids, and design themes
├── app.js            # Voice orchestration, state machines, and API integrations
├── schemes.json      # Structured database of schemes with matching parameters
├── avatar.png        # Icon resources
└── mittu.gif         # Audio status animations
```

---

## 💻 Tech Stack in Focus

*   **Structure:** Semantic markup (`index.html`) using best practices for web accessibility.
*   **Styling:** Custom CSS variables (`style.css`), Glassmorphic blur backdrops, responsive grid layouts, animations, and transitions.
*   **Core Logic:** Raw Vanilla JS (`app.js`) to achieve lightning-fast loading speeds on mobile devices.
*   **APIs Handled:**
    *   `SpeechRecognition` (Web Voice Command inputs)
    *   `SpeechSynthesis` (System Speech outputs)
    *   `Geolocation` (GPS Search coordinates)
    *   `RSS2JSON API` (Headline news aggregation)
