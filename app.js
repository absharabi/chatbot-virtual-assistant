const btn = document.querySelector('.talk-btn');
const content = document.querySelector('.status-text');
const chatBox = document.querySelector('#chat-box');
const listeningIndicator = document.querySelector('.listening-indicator');
const elderlyToggle = document.getElementById('elderly-toggle');
const themeToggle = document.getElementById('theme-toggle');
const typeBox = document.getElementById('type-box');
const sendBtn = document.getElementById('send-btn');

// ---------------- GOVERNMENT SCHEME DATABASE ----------------
let schemesData = {};
let multiQuizState = { phase: "IDLE", currentQuestionIndex: 0, eligibleSchemes: [], ineligibleSchemes: [], selectedScheme: null };
let userProfile = { age: null, keralaResident: null, lowIncome: null, isWidow: null, isAgriLabourer: null, isDisabled: null, isSECC: null };

const profileQuestions = [
    { key: "age", text: "What is your age?" },
    { key: "keralaResident", text: "Are you a permanent resident of Kerala? Please answer yes or no." },
    { key: "lowIncome", text: "Is your annual family income below 1 Lakh Rupees?" },
    { key: "isWidow", text: "Are you a widow?" },
    { key: "isAgriLabourer", text: "Are you an agricultural labourer?" },
    { key: "isDisabled", text: "Do you have a medical certificate proving more than 40 percent disability?" },
    { key: "isSECC", text: "Is your family listed in the SECC 2011 database?" }
];

function resetProfile() {
    multiQuizState = { phase: "IDLE", currentQuestionIndex: 0, eligibleSchemes: [], ineligibleSchemes: [], selectedScheme: null };
    for (let k in userProfile) userProfile[k] = null;
}

function triggerGeolocation(searchQuery) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const query = searchQuery.replace(/ /g, "+");
            const mapsURL = `https://www.google.com/maps/search/${query}/@${latitude},${longitude},14z`;
            addMessage("📍 Opening nearest location in Google Maps...", "bot");
            addMessage(`If the map didn't pop up automatically, <a href="${mapsURL}" target="_blank" style="color: #4da8da; text-decoration: underline; font-weight: bold;">Click Here to Open Maps!</a>`, "bot", true);
            window.open(mapsURL, "_blank");
        }, () => {
            speak("Unable to access your location. Please enable location permission.");
        });
    } else {
        speak("Geolocation is not supported in this browser.");
    }
}

function nextQuestion() {
    multiQuizState.currentQuestionIndex++;
    if (multiQuizState.currentQuestionIndex < profileQuestions.length) {
        speak(profileQuestions[multiQuizState.currentQuestionIndex].text);
    } else {
        evaluateSchemes();
    }
}

function evaluateSchemes() {
    multiQuizState.eligibleSchemes = [];
    multiQuizState.ineligibleSchemes = [];

    for (let key in schemesData) {
        let scheme = schemesData[key];
        let conditions = scheme.conditions;
        let reasons = [];

        if (conditions.minAge && userProfile.age < conditions.minAge) reasons.push("Age must be " + conditions.minAge + "+");
        if (conditions.keralaResident && !userProfile.keralaResident) reasons.push("Must be a resident of Kerala");
        if (conditions.lowIncome && !userProfile.lowIncome) reasons.push("Must have low family income");
        if (conditions.isWidow && !userProfile.isWidow) reasons.push("Must be a widow");
        if (conditions.isAgriLabourer && !userProfile.isAgriLabourer) reasons.push("Must be an agricultural labourer");
        if (conditions.isDisabled && !userProfile.isDisabled) reasons.push("Must have 40%+ disability");
        if (conditions.isSECC && !userProfile.isSECC) reasons.push("Must be in SECC database");

        if (reasons.length === 0) {
            multiQuizState.eligibleSchemes.push(key);
        } else {
            multiQuizState.ineligibleSchemes.push({ key: key, reasons: reasons });
        }
    }

    let resultSpeech = "Evaluation complete. ";
    if (multiQuizState.eligibleSchemes.length > 0) {
        let names = multiQuizState.eligibleSchemes.map(k => schemesData[k].name).join(", ");
        resultSpeech += `Great news! You are eligible for: ${names}. `;
        resultSpeech += "Please declare the name of the scheme you want to look at, or say 'start again' to reset.";
        multiQuizState.phase = "WAITING_SCHEME_SELECTION";
    } else {
        multiQuizState.phase = "IDLE";
        resultSpeech += "Unfortunately, based on your profile, you are not eligible for any schemes right now. ";
        if (multiQuizState.ineligibleSchemes.length > 0) {
            let sample = multiQuizState.ineligibleSchemes[0];
            resultSpeech += `For example, you failed ${schemesData[sample.key].name} because: ${sample.reasons.join(", ")}.`;
        }
    }
    speak(resultSpeech);
}

fetch("schemes.json")
    .then(response => response.json())
    .then(data => {
        schemesData = data;
    })
    .catch(error => console.error("Error loading schemes:", error));

// Helper function to add messages to chat
function addMessage(text, sender, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (sender === 'bot') {
        messageDiv.classList.add('bot-message');
    } else {
        messageDiv.classList.add('user-message');
    }
    if (isHTML) {
        messageDiv.innerHTML = text;
    } else {
        messageDiv.textContent = text;
    }
    chatBox.appendChild(messageDiv);
    // Auto scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
    // Clear any previous speech to prevent "stacking" or freezing
    window.speechSynthesis.cancel();

    const text_speak = new SpeechSynthesisUtterance(text);

    // Adjust rate and volume for elderly mode
    if (document.body.classList.contains('elderly-mode')) {
        text_speak.rate = 0.85; // Speak slower for clarity
        text_speak.volume = 1;
    } else {
        text_speak.rate = 1;
        text_speak.volume = 1;
    }

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
    // ---------------- MULTI-SCHEME EVALUATION ENGINE ----------------
    // Session Controls
    if (message.includes("start again") || message.includes("change scheme") || message.includes("restart")) {
        resetProfile();
        speak("Session reset. How else can I help you?");
        return;
    }

    // Phase 1: Building Profile
    if (multiQuizState.phase === "BUILDING_PROFILE") {
        let currentQ = profileQuestions[multiQuizState.currentQuestionIndex];
        
        if (currentQ.key === "age") {
            let match = message.match(/\d+/);
            if (match) {
                userProfile.age = parseInt(match[0]);
                nextQuestion();
            } else {
                speak("I did not catch your age. Please tell me your age in numbers.");
            }
        } else {
            if (message.includes("yes") || message.includes("yeah") || message.includes("yep") || message.includes("i am")) {
                userProfile[currentQ.key] = true;
                nextQuestion();
            } else if (message.includes("no") || message.includes("nope") || message.includes("not")) {
                userProfile[currentQ.key] = false;
                nextQuestion();
            } else {
                speak("Please answer with just yes or no. " + currentQ.text);
            }
        }
        return;
    }

    // Phase 2: Scheme Selection
    if (multiQuizState.phase === "WAITING_SCHEME_SELECTION") {
        let chosen = null;
        for (let sch of multiQuizState.eligibleSchemes) {
            let sData = schemesData[sch];
            if (message.includes(sData.name.toLowerCase()) || 
                sData.keywords.some(k => message.includes(k))) {
                chosen = sch;
                break;
            }
        }

        if (chosen) {
            let scheme = schemesData[chosen];
            multiQuizState.selectedScheme = chosen;
            multiQuizState.phase = "WAITING_LOCATION_PERMISSION";
            
            let docs = scheme.documents.join(", ");
            let steps = scheme.steps.join(". Next, ");
            speak(`You selected ${scheme.name}. Here are the required documents: ${docs}. The steps to apply are: First, ${steps}. Finally, do you want me to find the nearest center or office to apply for this?`);
        } else {
             speak("Please say the name of one of the eligible schemes, or say 'start again' to reset.");
        }
        return;
    }

    // Phase 3: Location Routing
    if (multiQuizState.phase === "WAITING_LOCATION_PERMISSION") {
        if (message.includes("yes") || message.includes("yeah") || message.includes("find") || message.includes("sure") || message.includes("ok")) {
            speak("Finding the nearest service center for your scheme...");
            let query = "Government Office near me";
            if (schemesData[multiQuizState.selectedScheme].apply.toLowerCase().includes("csc")) {
                 query = "Common Service Center near me";
            } else if (schemesData[multiQuizState.selectedScheme].apply.toLowerCase().includes("panchayat")) {
                 query = "Panchayat Office near me";
            }
            triggerGeolocation(query);
            resetProfile();
        } else {
            speak("Okay, let me know if you need anything else.");
            resetProfile();
        }
        return;
    }

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
                const mapsURL = `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`;
                addMessage(`If map was blocked, <a href="${mapsURL}" target="_blank" style="color: #4da8da; text-decoration: underline; font-weight: bold;">Click Here to View Coordinate Base</a>`, 'bot', true);
                window.open(mapsURL, "_blank");
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

    // ---------------- GOVERNMENT SCHEME INFORMATION ----------------
    // Start Engine
    if (message.includes("eligible") || message.includes("eligibility") || message.includes("what schemes") || message.includes("what am i eligible for")) {
        resetProfile();
        multiQuizState.phase = "BUILDING_PROFILE";
        speak("Let's find out what schemes exactly you are eligible for. I will ask you a few questions. First, " + profileQuestions[0].text);
        return;
    }

    if (message.includes("kerala pension") || message.includes("kerala scheme") || message.includes("kerala schemes") || message.includes("pension schemes in kerala")) {
        let keralaSchemes = [];
        for (let key in schemesData) {
            if (schemesData[key].state === "Kerala" && schemesData[key].name) {
                keralaSchemes.push(schemesData[key].name);
            }
        }
        if (keralaSchemes.length > 0) {
            speak("Here are the Kerala pension schemes I can help with: " + keralaSchemes.join(", ") + ". You can ask me about any of these for details or documents.");
        } else {
            speak("I don't have information on Kerala schemes right now.");
        }
        return;
    }

    // Direct inquiry handling (without running evaluation engine)
    for (let key in schemesData) {
        let scheme = schemesData[key];
        for (let keyword of scheme.keywords) {
            if (message.includes(keyword)) {
                if (message.includes("document") || message.includes("documents") || message.includes("certificates")) {
                    speak("The required documents for the " + (scheme.name || "scheme") + " are: " + scheme.documents.join(", ") + ".");
                } else {
                    let response = `Here is the information about the scheme:\n\nEligibility:\n${scheme.eligibility}\n\nRequired Documents:\n${scheme.documents.join("\n")}\n\nHow to Apply:\n${scheme.apply}\n\nOpening the official website for you.`;
                    speak(response);
                    if (scheme.url) {
                        window.open(scheme.url, "_blank");
                    }
                }
                return;
            }
        }
    }

    // ---------------- MEDICATION / HEALTH REMINDERS ----------------
    if (message.includes("remind") && (message.includes("pill") || message.includes("medicine") || message.includes("water"))) {
        speak("I have set your health reminder. I will alert you shortly.");
        addMessage("⏱️ Health reminder set (10 second demo mode)", "bot");

        setTimeout(() => {
            speak("Reminder! It is time to take your medication and drink a glass of water.");
            addMessage("🔔 MEDICAL REMINDER: Time for pills & water!", "bot");
        }, 10000); // 10 second demo for presentation purposes
        return;
    }

    // ---------------- LIVE GOVERNMENT UPDATES ----------------
    if (message.includes("new scheme") ||
        message.includes("latest scheme") ||
        message.includes("new pension") ||
        message.includes("government updates") ||
        message.includes("recent scheme")) {

        speak("Fetching latest government scheme updates...");

        // Note: The PIB RSS feed is currently blocking the rss2json parser. 
        // Using a reliable National News feed as a working fallback.
        fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.thehindu.com/news/national/feeder/default.rss")
            .then(response => response.json())
            .then(data => {
                if (data.status !== 'ok') {
                    throw new Error("RSS Feed returned an error: " + data.message);
                }
                const items = data.items.slice(0, 3);
                let summary = "Here are the latest government updates. I am opening the top story for you now: ";
                items.forEach((item, index) => {
                    addMessage(`📰 ${item.title}`, "bot");
                    summary += `Update ${index + 1}: ${item.title}. `;
                });
                speak(summary);
                if (items.length > 0 && items[0].link) {
                    window.open(items[0].link, "_blank");
                }
            })
            .catch(error => {
                console.error("RSS Fetch Error:", error);
                speak("Unable to fetch updates at the moment. Please try again later.");
            });
        return;
    }

    // ---------------- FRAUD AWARENESS ----------------
    if (message.includes("otp") ||
        message.includes("fraud") ||
        message.includes("scam") ||
        message.includes("bank call")) {

        speak("Warning! Never share your OTP, bank PIN or password with anyone. Government and banks never ask for confidential details over phone. Be careful of unknown links.");
        return;
    }

    // ---------------- NEARBY GOVERNMENT SERVICE LOCATOR ----------------
    if (message.includes("nearby hospital") ||
        message.includes("nearest hospital") ||
        message.includes("government hospital") ||
        message.includes("panchayat office") ||
        message.includes("nearest police station") ||
        message.includes("csc center") ||
        message.includes("nearby panchayat")) {

        speak("Finding the requested government service near your location.");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                let searchQuery = "";

                if (message.includes("hospital")) {
                    searchQuery = "Government+Hospital+near+me";
                }
                else if (message.includes("panchayat")) {
                    searchQuery = "Panchayat+Office+near+me";
                }
                else if (message.includes("police")) {
                    searchQuery = "Police+Station+near+me";
                }
                else if (message.includes("csc")) {
                    searchQuery = "Common+Service+Center+near+me";
                }

                const mapsURL = `https://www.google.com/maps/search/${searchQuery}/@${latitude},${longitude},14z`;

                addMessage("📍 Opening nearest location in Google Maps...", "bot");
                window.open(mapsURL, "_blank");

            }, () => {
                speak("Unable to access your location. Please enable location permission.");
            });
        } else {
            speak("Geolocation is not supported in this browser.");
        }

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
        speak("I can assist with government schemes, emergency help, fraud awareness, news and daily assistance. Please ask something related.");
    }
}