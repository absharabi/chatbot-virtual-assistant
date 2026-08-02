# MITTU - Voice-Enabled Multilingual Virtual Companion & Welfare Scheme Evaluator

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Url-brightgreen.svg?style=for-the-badge)](https://absharabi.github.io/chatbot-virtual-assistant/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![PWA / SW](https://img.shields.io/badge/Offline-PWA%20Ready-blueviolet?style=for-the-badge&logo=pwa&logoColor=white)]()
[![GitHub Pages](https://img.shields.io/badge/Pages-Deployed-orange?style=for-the-badge&logo=github&logoColor=white)]()

> **MITTU** is an advanced, voice-activated multilingual virtual assistant designed to bridge the digital literacy gap for senior citizens and low-income demographics. It features a state-driven **Government Scheme Eligibility Engine**, 3-language system (English, Hindi, Malayalam), WCAG 2.1 AAA Elderly Mode, command-registry routing, offline PWA capabilities, and emergency response features—all built with zero-dependency Vanilla JS for maximum performance on low-spec devices.

### 🔗 **[Explore the Live Deployment](https://absharabi.github.io/chatbot-virtual-assistant/)**

---

## 🚀 Key Features & Highlights

### 1. 🌐 Complete Multi-Language Engine (EN / HI / ML)
* **3 Languages Supported:** Full support for **English**, **Hindi (हिन्दी)**, and **Malayalam (മലയാളം)**.
* **Localized Speech Recognition & Synthesis:** Seamlessly toggles Web Speech Recognition `lang` code (`en-US`, `hi-IN`, `ml-IN`) and selects native voice outputs dynamically.
* **Multilingual Command Matching:** Keyword routing supports multi-lingual triggers (e.g., *"News"*, *"समाचार"*, *"വാർത്ത"*).
* **Multi-Language Yes/No Detection:** Evaluates quiz responses accurately in all 3 languages (e.g., *"Yes / हाँ / അതെ"*).
* **Preference Persistence:** Automatically saves user language choices using `localStorage`.

### 2. ♿ WCAG AAA Elderly-First Accessibility & High Contrast
* **Contrast & Legibility:** *Elderly Mode* switches to high-contrast rulesets (bright yellow text on ultra-dark `#111111` background), satisfying WCAG 2.1 AAA standards.
* **Speech Synthesis Modulation:** Speech rate drops to **0.85x** for clear pronunciation and comfortable listening.
* **Distraction-Free Mode:** Hides non-essential animated graphics to focus entirely on large, legible text output.

### 3. 🏛️ Unified Multi-Scheme Matchmaking Engine
* **Interactive Questionnaire:** Directs users through a state-driven assessment (Age, Kerala Residency, Income, Occupation, Disability, Widow Status, SECC Database).
* **Rule Matcher:** Compares responses against rules defined in `schemes.json`.
* **Transparent Feedback:** Explains specific reasons for ineligibility (e.g., *"Age must be 60+"* or *"Must be in SECC database"*).
* **Actionable Office Navigation:** Details required documents, step-by-step application instructions, and auto-generates localized GPS maps for Grama Panchayat or CSC offices.

### 4. ⚡ Modern Command Registry & Architecture
* **Extensible Command Registry:** Uses a clean, scalable array-based registry of pattern matchers and handler functions instead of monolithic `if/else` chains.
* **XSS Protection:** Enforces safe DOM element construction (`createElement`, `textContent`) for all link outputs and message elements to prevent cross-site scripting vulnerabilities.
* **`safeFetch` Resilience:** Wrapper with fallback handling for external API dependencies.

### 5. 🛠️ Rich Interactive Toolkit & PWA Capabilities
* **Offline Service Worker (`sw.js`):** Cache-first strategy for static resources ensures MITTU functions smoothly even with spotty connectivity.
* **Chat History Persistence & Export:** Automatically saves conversations to `localStorage` and allows downloading full transcripts as `.txt` files.
* **Quick-Action Chips:** One-click shortcuts for high-frequency commands (*Check Schemes*, *Emergency*, *News*, *System Info*, *Help*).
* **Keyboard Shortcuts:** Built-in productivity keys: <kbd>Ctrl+M</kbd> (Mic), <kbd>Esc</kbd> (Stop speech), <kbd>Ctrl+L</kbd> (Clear chat).
* **Emergency SOS & Location Service:** Instantly displays local emergency helplines (Police 100, Ambulance 102, Fire 101) alongside real-time GPS coordinate links.

---

## 🛠️ How to Run Locally

Because the project leverages Web APIs (microphone audio capture and geolocation), modern browsers block these services on direct `file://` execution. Please use a local HTTP server.

### Option A: Python HTTP Server (Recommended)
```bash
git clone https://github.com/absharabi/chatbot-virtual-assistant.git
cd chatbot-virtual-assistant
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option B: VS Code Live Server
1. Open the project folder in **VS Code**.
2. Click **Go Live** in the status bar.

---

## 📂 Project Architecture

```
chatbot-virtual-assistant/
│
├── index.html        # Glassmorphic shell, language selector, chips & splash screen
├── style.css         # Custom tokens, keyframes, light/dark/elderly modes & responsive rules
├── app.js            # Command registry, state machines, speech synthesis & persistent state
├── translations.js   # Centralized dictionary for EN, HI, ML translations & t() helper
├── sw.js             # Service Worker implementation for PWA offline caching
├── schemes.json      # Structured database of government schemes & eligibility parameters
├── avatar.png        # Brand avatar image
└── mittu.gif         # Animated listening status indicator
```

---

## 💻 Technical Stack

* **Structure:** HTML5 (Semantic, Accessible, SEO-optimized with OpenGraph tags).
* **Styling:** Vanilla CSS (Glassmorphism, custom CSS variables, responsive design, animations).
* **Logic:** Vanilla JavaScript (ES6+, Async/Await, State Machines, Command Registry).
* **Web APIs:**
  * `SpeechRecognition` (Web Voice Command Input)
  * `SpeechSynthesis` (Multi-Lingual Voice Synthesis)
  * `Geolocation` (GPS Navigation)
  * `ServiceWorker` (Offline PWA Caching)
  * `localStorage` (Chat history & user preferences)
