# MITTU - Voice-Enabled Smart Virtual Companion & Scheme Evaluator

[![Build Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web-blue.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()
[![Accessibility](https://img.shields.io/badge/Accessibility-Elderly%20Ready-orange.svg)]()

> MITTU is an advanced, voice-enabled, data-driven virtual companion designed to assist senior citizens and rural populations. By combining a **Unified Multi-Scheme Eligibility Engine**, real-time **voice command processing (Web Speech API)**, and key daily assistance utilities, MITTU bridges accessibility gaps to bring government benefits and essential health features directly to those who need them most.

### 🔗 **[Live Demo of MITTU Virtual Assistant](https://absharabi.github.io/chatbot-virtual-assistant/)**

---

## 🌟 Key Features

### 1. ♿ Elderly-First Accessibility Mode
*   **High-Contrast Theme:** Immediate switch to visual settings optimized for low-vision individuals (bright yellow-on-black).
*   **Dynamic Layout Refactor:** Disables heavy screen graphics (like avatar animations) to focus space on enlarged chat bubbles.
*   **Slower Speech Synthesis:** Automatically reduces Speech Synthesis output speech rate to **0.85x** for clear, comfortable listening.
*   **Voice Control Scaling:** Enlarged audio command capture button for tremor-prone fingers.

### 2. 🏛️ Government Scheme Eligibility Engine
*   **Sequential Profiling Quiz:** Builds a temporary secure profile using structured parameters (age, state residency, income category, occupations, disabilities, SECC status).
*   **Automatic Matchmaking Evaluation:** Cross-references the profile with local databases (`schemes.json`) to find qualifying welfare benefits instantly.
*   **Structured Walkthroughs:** Explains required documents and steps sequentially.
*   **Geolocation Service Routing:** Queries GPS locations to direct users to the nearest Common Service Centers (CSC) or Panchayat offices on Google Maps.

### 3. ⏱️ Integrated Health & Medication Reminders
*   Simple setting protocols for health prompts ("remind me to take pills").
*   Alerts users visually and acoustically back-to-back at target intervals.

### 4. 📰 Live National News & Government Updates
*   Pulls the latest national news headlines using an RSS-to-JSON parser fallback to bypass restricted government API feeds.
*   Direct hot-linking cards populate dynamically inside the chat feed for reading.

### 5. 🚨 Safety, Security & Fraud Warnings
*   **Fraud Awareness Protocols:** Direct trigger alerts warnings on fraudulent calls, OTP sharing, and scam links.
*   **SOS & Emergency Broadcast:** Instantly loads emergency numbers (Ambulance, Fire, Police) and resolves current geographic coordinates for rescue sharing.

---

## 🛠️ Technology Stack

MITTU is built with standard technologies to keep the system responsive on low-end devices without transpilation overhead:

*   **Frontend Structure:** HTML5 Semantic Elements
*   **Styling & Design System:** Flexbox Layouts, Glassmorphism, CSS Custom Properties (Variables)
*   **Logic & Web APIs:** Pure Javascript (ES6), Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), Geolocation API

---

## 📁 Architecture

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

## 🚀 Getting Started

### Prerequisites

To use voice features and geolocation locally, you **must run the application through an HTTP server** (and not via the `file://` protocol in your browser), because modern browsers block microphone and camera permissions on unsecured filesystem files.

### 1. Clone the repository
```bash
git clone https://github.com/absharabi/chatbot-virtual-assistant.git
cd chatbot-virtual-assistant
```

### 2. Start a Local Server

You can run the site using any light HTTP server:

**Using Python:**
```bash
python -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

**Using VS Code Live Server extension:**
1. Open the project in VS Code.
2. Click **Go Live** at the bottom status bar.

---

## 🤝 Contributing & Scope

This project is tailored for senior citizens, digital literacy programs, and municipal aid. Contributions improving local language inputs (Web Speech API localized engines) or adding state welfare configurations in `schemes.json` are welcome.

Created with 💙 by [absharabi](https://github.com/absharabi).
