const btn = document.querySelector('.talk-btn');
const content = document.querySelector('.status-text');
const chatBox = document.querySelector('#chat-box');
const listeningIndicator = document.querySelector('.listening-indicator');
const elderlyToggle = document.getElementById('elderly-toggle');
const themeToggle = document.getElementById('theme-toggle');
const typeBox = document.getElementById('type-box');
const sendBtn = document.getElementById('send-btn');

// Helper function to add messages to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (sender === 'bot') {
        messageDiv.classList.add('bot-message');
    } else {
        messageDiv.classList.add('user-message');
    }
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    // Auto scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
    // Clear any previous speech to prevent "stacking" or freezing
    window.speechSynthesis.cancel();

    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
    addMessage(text, 'bot');
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning! How can I help you today?");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon! Ready to assist you.");
    } else {
        speak("Good Evening! How was your day?");
    }
}

window.addEventListener('load', () => {
    // Initial greeting skipped to wait for user interaction or simplified
    // speak("Initializing JARVIS..."); // Optional
    // wishMe();
});

try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    let isRecognizing = false;

    // Check for "file://" protocol which often blocks microphone access
    if (window.location.protocol === 'file:') {
        alert("⚠️ IMPORTANT: You are opening this file directly (file://). Microphone access behaves poorly or is blocked in this mode.\n\nPlease use a Local Server (like 'Live Server' in VS Code) for the microphone to work correctly.");
    }

    recognition.continuous = false; // Ensure it stops after one sentence (standard for assistants)
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecognizing = true;
        content.textContent = "Listening... Speak now";
        listeningIndicator.classList.remove('hidden');
        console.log("Speech Recognition Started");
    };

    recognition.onspeechend = () => {
        content.textContent = "Processing...";
        listeningIndicator.classList.add('hidden');
        console.log("Speech Ended, Processing...");
        recognition.stop(); // Ensure it stops capturing
    };

    recognition.onend = () => {
        isRecognizing = false;
        content.textContent = "Click microphone to speak";
        listeningIndicator.classList.add('hidden');
    };

    recognition.onresult = (event) => {
        const currentIndex = event.resultIndex;
        const transcript = event.results[currentIndex][0].transcript;
        addMessage(transcript, 'user');
        takeCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        listeningIndicator.classList.add('hidden');
        content.textContent = "Click microphone to speak"; // Reset text
        isRecognizing = false; // Ensure state is reset

        if (event.error === 'not-allowed') {
            speak("Microphone access was denied. Please allow microphone permission.");
            alert("Microphone Access Denied!\n\n1. Click the 'Lock' icon in your browser URL bar.\n2. Allow Microphone access.\n3. Refresh the page.");
        } else if (event.error === 'network') {
            speak("I am having trouble connecting to the internet.");
        } else if (event.error === 'no-speech') {
            content.textContent = "No speech detected. Try moving closer.";
            // Simply stop processing, don't speak error for silence
            return;
        } else {
            speak("I didn't catch that. Please try again.");
        }
    };

    btn.addEventListener('click', () => {
        if (isRecognizing) {
            recognition.stop(); // Allow user to stop manually if they click again
            return;
        }
        content.textContent = "Listening...";
        recognition.start();
    });
} catch (e) {
    console.error(e);
    content.textContent = "Browser not supported";
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.");
}

// Feature: Elderly Mode Toggle
elderlyToggle.addEventListener('click', () => {
    document.body.classList.toggle('elderly-mode');
    const isElderly = document.body.classList.contains('elderly-mode');
    if (isElderly) {
        speak("Elderly Mode activated. Text size increased.");
    } else {
        speak("Standard Mode activated.");
    }
});

// Handle text input
function handleTextInput() {
    const text = typeBox.value;
    if (text.trim() === "") return;

    addMessage(text, 'user');
    takeCommand(text.toLowerCase());
    typeBox.value = "";
}

sendBtn.addEventListener('click', handleTextInput);

typeBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleTextInput();
    }
});

// Feature: Dark/Light Theme Toggle
// Feature: Dark/Light Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const icon = themeToggle.querySelector('i');

    if (isLight) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        speak("Switched to Light Mode.");
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        speak("Switched to Dark Mode.");
    }
});

function takeCommand(message) {
    // 1. System Info (Tech Stats)
    if (message.includes('system info') || message.includes('battery') || message.includes('internet')) {
        let stats = "Checking system stats... ";

        // Connectivity
        if (navigator.onLine) {
            stats += "You are online. ";
        } else {
            stats += "You are offline. ";
        }

        // Battery
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function (battery) {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging ? "and charging" : "on battery power";
                const finalStats = stats + `Battery is at ${level}% ${charging}.`;
                speak(finalStats);
            });
        } else {
            speak(stats + "Battery information is unavailable on this device.");
        }
        return;
    }

    // 2. Live News (via RSS to JSON)
    if (message.includes('news')) {
        speak("Fetching the latest headlines...");
        // Using RSS2JSON to fetch BBC News World Edition
        fetch('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/rss.xml')
            .then(response => response.json())
            .then(data => {
                const items = data.items.slice(0, 3); // Top 3 news
                let newsSummary = "Here are the top headlines: ";
                items.forEach((item, index) => {
                    newsSummary += `Number ${index + 1}: ${item.title}. `;
                    // Add clickable link card to chat
                    addMessage(`📰 ${item.title}`, 'bot');
                });
                speak(newsSummary);
            })
            .catch(error => {
                console.error(error);
                speak("I encountered an error fetching the news. Opening Google News instead.");
                window.open("https://news.google.com");
            });
        return;
    }

    // 3. Emergency Feature
    if (message.includes('emergency') || message.includes('help me') || message.includes('police')) {
        speak("Emergency protocol initiated. displaying emergency numbers.");
        addMessage("📞 Police: 100", 'bot');
        addMessage("🚑 Ambulance: 102", 'bot');
        addMessage("🚒 Fire: 101", 'bot');
        addMessage("📍 Your Location: Sending coordinates...", 'bot');
        // Simulator for location sharing
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const loc = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
                addMessage(loc, 'bot');
                window.open(`https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`, "_blank");
            });
        }
        return;
    }

    // 4. Mental Health Support
    if (message.includes('sad') || message.includes('depressed') || message.includes('lonely') || message.includes('anxiety')) {
        const comfortingMessages = [
            "I'm sorry you're feeling this way. Remember, it's okay not to be okay.",
            "Take a deep breath. You are stronger than you think.",
            "I'm here for you. Would you like to hear a joke to cheer you up?"
        ];
        const randomMsg = comfortingMessages[Math.floor(Math.random() * comfortingMessages.length)];
        speak(randomMsg);
        return;
    }

    // --- STANDARD FEATURES ---

    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello! I am Mittu, your virtual companion. How can I assist you?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else if (message.includes('weather')) {
        window.open(`https://www.google.com/search?q=weather+${message.replace("weather", "").trim()}`, "_blank");
        const finalText = "I found the weather information for " + message;
        speak(finalText);
    } else if (message.includes('joke')) {
        fetch('https://official-joke-api.appspot.com/random_joke')
            .then(response => response.json())
            .then(data => {
                const joke = `${data.setup} ... ${data.punchline}`;
                speak(joke);
            })
            .catch(error => {
                console.error('Error fetching joke:', error);
                speak("Why did the scarecrow win an award? Because he was outstanding in his field!");
            });
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}