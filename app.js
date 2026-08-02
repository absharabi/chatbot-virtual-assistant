// ================================================================
// MITTU — Virtual Assistant (Enhanced Edition)
// Features: Multi-language, Command Registry, Typing Indicator,
//           Chat Persistence, Offline SW, Keyboard Shortcuts,
//           Quick Chips, Export, Help Card, XSS-safe links
// ================================================================

// ================== CONSTANTS ==================
const API_URLS = {
    bbcNews: 'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/rss.xml',
    govUpdates: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.thehindu.com/news/national/feeder/default.rss',
    jokes: 'https://official-joke-api.appspot.com/random_joke'
};

const EMERGENCY_NUMBERS = [
    { emoji: '📞', label: 'Police', number: '100' },
    { emoji: '🚑', label: 'Ambulance', number: '102' },
    { emoji: '🚒', label: 'Fire', number: '101' }
];

const LANG_CODES = { en: 'en-US', hi: 'hi-IN', ml: 'ml-IN' };

const PROFILE_QUESTION_KEYS = [
    'ageQuestion', 'keralaQuestion', 'incomeQuestion',
    'widowQuestion', 'agriQuestion', 'disabledQuestion', 'seccQuestion'
];

const PROFILE_DATA_KEYS = [
    'age', 'keralaResident', 'lowIncome',
    'isWidow', 'isAgriLabourer', 'isDisabled', 'isSECC'
];

// ================== STATE ==================
let schemesData = {};
let multiQuizState = {
    phase: "IDLE",
    currentQuestionIndex: 0,
    eligibleSchemes: [],
    ineligibleSchemes: [],
    selectedScheme: null
};
let userProfile = {
    age: null, keralaResident: null, lowIncome: null,
    isWidow: null, isAgriLabourer: null, isDisabled: null, isSECC: null
};
let isRecognizing = false;

// ================== DOM ELEMENTS ==================
const chatBox = document.getElementById('chat-box');
const btn = document.getElementById('talk-btn');
const statusText = document.getElementById('status-text');
const listeningIndicator = document.getElementById('listening-indicator');
const elderlyToggle = document.getElementById('elderly-toggle');
const themeToggle = document.getElementById('theme-toggle');
const typeBox = document.getElementById('type-box');
const sendBtn = document.getElementById('send-btn');
const clearChatBtn = document.getElementById('clear-chat');
const exportChatBtn = document.getElementById('export-chat');
const quickActions = document.getElementById('quick-actions');
const splashScreen = document.getElementById('splash-screen');
const appTitle = document.getElementById('app-title');
const appSubtitle = document.getElementById('app-subtitle');
const welcomeText = document.getElementById('welcome-text');
const splashText = document.getElementById('splash-text');

// ================== TRANSLATION HELPER ==================
// t() is defined in translations.js along with currentLang and setLanguage()

// ================== UTILITIES ==================
function getTimeString() {
    return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

async function safeFetch(url, fallbackMsg) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        if (fallbackMsg) speak(fallbackMsg);
        return null;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** Scroll the chat container to the bottom */
function scrollToBottom() {
    requestAnimationFrame(() => {
        const container = chatBox.parentElement; // .chat-container
        if (container) container.scrollTop = container.scrollHeight;
    });
}

// ================== CORE CHAT FUNCTIONS ==================

/** Add a message to the chat (XSS-safe: text only by default) */
function addMessage(text, sender) {
    hideTypingIndicator();

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');

    const textSpan = document.createElement('span');
    textSpan.classList.add('msg-text');
    textSpan.textContent = text;

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('msg-time');
    timeSpan.textContent = getTimeString();

    messageDiv.appendChild(textSpan);
    messageDiv.appendChild(timeSpan);
    chatBox.appendChild(messageDiv);
    scrollToBottom();

    saveChat();
}

/** Add a message with a safe clickable link (no innerHTML) */
function addLinkMessage(displayText, url, emoji) {
    hideTypingIndicator();

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');

    const textSpan = document.createElement('span');
    textSpan.classList.add('msg-text');

    if (emoji) {
        textSpan.appendChild(document.createTextNode(emoji + ' '));
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = displayText;
    link.classList.add('chat-link');
    textSpan.appendChild(link);

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('msg-time');
    timeSpan.textContent = getTimeString();

    messageDiv.appendChild(textSpan);
    messageDiv.appendChild(timeSpan);
    chatBox.appendChild(messageDiv);
    scrollToBottom();

    saveChat();
}

/** Add the help card as a structured DOM element */
function addHelpCard() {
    hideTypingIndicator();

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');

    const card = document.createElement('div');
    card.classList.add('help-card');

    const title = document.createElement('span');
    title.classList.add('help-title');
    title.textContent = t('helpIntro');
    card.appendChild(title);

    const items = t('helpItems');
    items.forEach(itemText => {
        const item = document.createElement('span');
        item.classList.add('help-item');
        item.textContent = itemText;
        card.appendChild(item);
    });

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('msg-time');
    timeSpan.textContent = getTimeString();

    messageDiv.appendChild(card);
    messageDiv.appendChild(timeSpan);
    chatBox.appendChild(messageDiv);
    scrollToBottom();

    saveChat();
}

/** Speak text and add to chat */
function speak(text) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODES[currentLang] || 'en-US';

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = (LANG_CODES[currentLang] || 'en-US').split('-')[0];
    const matchVoice = voices.find(v => v.lang.startsWith(langPrefix));
    if (matchVoice) utterance.voice = matchVoice;

    // Elderly mode: slower speech
    if (document.body.classList.contains('elderly-mode')) {
        utterance.rate = 0.85;
    } else {
        utterance.rate = 1;
    }
    utterance.volume = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
    addMessage(text, 'bot');
}

/** Show typing indicator, wait briefly, then speak */
function typeThenSpeak(text, ms = 450) {
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        speak(text);
    }, ms);
}

/** Show bouncing dots typing indicator */
function showTypingIndicator() {
    if (document.getElementById('typing-indicator')) return;
    const div = document.createElement('div');
    div.classList.add('message', 'bot-message', 'typing-indicator');
    div.id = 'typing-indicator';
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatBox.appendChild(div);
    scrollToBottom();
}

/** Remove typing indicator */
function hideTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

// ================== CHAT PERSISTENCE ==================
function saveChat() {
    try {
        const msgs = [];
        chatBox.querySelectorAll('.message:not(.typing-indicator)').forEach(msg => {
            msgs.push({
                html: msg.innerHTML,
                isBot: msg.classList.contains('bot-message')
            });
        });
        localStorage.setItem('mittu_chat', JSON.stringify(msgs));
    } catch (e) { /* localStorage full or unavailable */ }
}

function loadChat() {
    try {
        const saved = localStorage.getItem('mittu_chat');
        if (saved) {
            const msgs = JSON.parse(saved);
            if (msgs.length > 0) {
                chatBox.innerHTML = '';
                msgs.forEach(m => {
                    const div = document.createElement('div');
                    div.classList.add('message', m.isBot ? 'bot-message' : 'user-message');
                    div.innerHTML = m.html;
                    chatBox.appendChild(div);
                });
                scrollToBottom();
            }
        }
    } catch (e) { /* parse error */ }
}

function clearChat() {
    chatBox.innerHTML = '';
    localStorage.removeItem('mittu_chat');
    speak(t('chatCleared'));
}

function exportChat() {
    const messages = chatBox.querySelectorAll('.message:not(.typing-indicator)');
    let text = '╔══════════════════════════════════════╗\n';
    text += '║     MITTU — Chat Export               ║\n';
    text += '╚══════════════════════════════════════╝\n';
    text += `Date: ${new Date().toLocaleString()}\n\n`;

    messages.forEach(msg => {
        const sender = msg.classList.contains('bot-message') ? '🤖 MITTU' : '👤 You';
        const timeEl = msg.querySelector('.msg-time');
        const time = timeEl ? timeEl.textContent : '';
        const textEl = msg.querySelector('.msg-text');
        const content = textEl ? textEl.textContent.trim() : msg.textContent.trim();
        text += `${sender}  ${time}\n${content}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mittu-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ================== GEOLOCATION ==================
function triggerGeolocation(searchQuery) {
    if (!navigator.geolocation) {
        speak(t('geoNotSupported'));
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const query = searchQuery.replace(/ /g, '+');
            const mapsURL = `https://www.google.com/maps/search/${query}/@${lat},${lng},14z`;
            addMessage('📍 ' + t('openingMaps'), 'bot');
            addLinkMessage(t('clickMaps'), mapsURL, '🗺️');
            window.open(mapsURL, '_blank');
        },
        () => { speak(t('locationDenied')); }
    );
}

// ================== SCHEME ENGINE ==================
function resetProfile() {
    multiQuizState = {
        phase: "IDLE", currentQuestionIndex: 0,
        eligibleSchemes: [], ineligibleSchemes: [], selectedScheme: null
    };
    for (let k in userProfile) userProfile[k] = null;
}

function nextQuestion() {
    multiQuizState.currentQuestionIndex++;
    if (multiQuizState.currentQuestionIndex < PROFILE_QUESTION_KEYS.length) {
        typeThenSpeak(t(PROFILE_QUESTION_KEYS[multiQuizState.currentQuestionIndex]));
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

        if (conditions.minAge && userProfile.age < conditions.minAge)
            reasons.push("Age must be " + conditions.minAge + "+");
        if (conditions.keralaResident && !userProfile.keralaResident)
            reasons.push("Must be a resident of Kerala");
        if (conditions.lowIncome && !userProfile.lowIncome)
            reasons.push("Must have low family income");
        if (conditions.isWidow && !userProfile.isWidow)
            reasons.push("Must be a widow");
        if (conditions.isAgriLabourer && !userProfile.isAgriLabourer)
            reasons.push("Must be an agricultural labourer");
        if (conditions.isDisabled && !userProfile.isDisabled)
            reasons.push("Must have 40%+ disability");
        if (conditions.isSECC && !userProfile.isSECC)
            reasons.push("Must be in SECC database");

        if (reasons.length === 0) {
            multiQuizState.eligibleSchemes.push(key);
        } else {
            multiQuizState.ineligibleSchemes.push({ key, reasons });
        }
    }

    let resultSpeech = t('evalComplete') + ' ';
    if (multiQuizState.eligibleSchemes.length > 0) {
        let names = multiQuizState.eligibleSchemes.map(k => schemesData[k].name).join(', ');
        resultSpeech += t('eligible') + names + '. ' + t('selectScheme');
        multiQuizState.phase = "WAITING_SCHEME_SELECTION";
    } else {
        multiQuizState.phase = "IDLE";
        resultSpeech += t('notEligible') + ' ';
        if (multiQuizState.ineligibleSchemes.length > 0) {
            let sample = multiQuizState.ineligibleSchemes[0];
            resultSpeech += `For example, you failed ${schemesData[sample.key].name} because: ${sample.reasons.join(', ')}.`;
        }
    }
    typeThenSpeak(resultSpeech, 600);
}

/** YES/NO detection supporting EN/HI/ML */
function detectYes(msg) {
    return msg.includes('yes') || msg.includes('yeah') || msg.includes('yep') || msg.includes('i am') ||
        msg.includes('हाँ') || msg.includes('हां') || msg.includes('जी') ||
        msg.includes('ഉവ്വ്') || msg.includes('അതെ') || msg.includes('ശരി');
}
function detectNo(msg) {
    return msg.includes('no') || msg.includes('nope') || msg.includes('not') ||
        msg.includes('नहीं') || msg.includes('ना') ||
        msg.includes('അല്ല') || msg.includes('ഇല്ല') || msg.includes('വേണ്ട');
}

// ================== STATE MACHINE HANDLERS ==================
function handleStateMachine(message) {
    // Session reset
    if (message.includes('start again') || message.includes('change scheme') || message.includes('restart') ||
        message.includes('फिर से') || message.includes('दोबारा') || message.includes('വീണ്ടും')) {
        resetProfile();
        speak(t('sessionReset'));
        return true;
    }

    // Phase 1: Profile Building
    if (multiQuizState.phase === "BUILDING_PROFILE") {
        let currentKey = PROFILE_DATA_KEYS[multiQuizState.currentQuestionIndex];

        if (currentKey === 'age') {
            let match = message.match(/\d+/);
            if (match) {
                userProfile.age = parseInt(match[0]);
                nextQuestion();
            } else {
                speak(t('ageRetry'));
            }
        } else {
            if (detectYes(message)) {
                userProfile[currentKey] = true;
                nextQuestion();
            } else if (detectNo(message)) {
                userProfile[currentKey] = false;
                nextQuestion();
            } else {
                speak(t('yesNoRetry') + ' ' + t(PROFILE_QUESTION_KEYS[multiQuizState.currentQuestionIndex]));
            }
        }
        return true;
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

            let docs = scheme.documents.join(', ');
            let steps = scheme.steps.join('. Next, ');
            typeThenSpeak(
                t('youSelected') + scheme.name + t('docsNeeded') + docs +
                t('stepsToApply') + steps + '. ' + t('findCenter'),
                600
            );
        } else {
            speak(t('selectEligible'));
        }
        return true;
    }

    // Phase 3: Location Permission
    if (multiQuizState.phase === "WAITING_LOCATION_PERMISSION") {
        if (detectYes(message) || message.includes('find') || message.includes('sure') || message.includes('ok')) {
            speak(t('findingCenter'));
            let query = 'Government Office near me';
            if (schemesData[multiQuizState.selectedScheme].apply.toLowerCase().includes('csc')) {
                query = 'Common Service Center near me';
            } else if (schemesData[multiQuizState.selectedScheme].apply.toLowerCase().includes('panchayat')) {
                query = 'Panchayat Office near me';
            }
            triggerGeolocation(query);
            resetProfile();
        } else {
            speak(t('okayHelp'));
            resetProfile();
        }
        return true;
    }

    return false;
}

// ================== COMMAND HANDLERS ==================
function handleGreeting() {
    typeThenSpeak(t('greeting'));
}

function handleHelp() {
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        // Speak the intro
        const utterance = new SpeechSynthesisUtterance(t('helpIntro'));
        utterance.lang = LANG_CODES[currentLang] || 'en-US';
        if (document.body.classList.contains('elderly-mode')) utterance.rate = 0.85;
        else utterance.rate = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        addHelpCard();
    }, 400);
}

function handleSystemInfo() {
    let stats = t('checkingStats');
    stats += navigator.onLine ? t('online') : t('offline');

    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? t('andCharging') : t('onBattery');
            typeThenSpeak(stats + t('batteryAt') + level + '% ' + charging + '.');
        });
    } else {
        typeThenSpeak(stats + t('batteryUnavailable'));
    }
}

function handleNews() {
    speak(t('fetchingNews'));
    showTypingIndicator();

    safeFetch(API_URLS.bbcNews, null).then(data => {
        hideTypingIndicator();
        if (!data || !data.items) {
            speak(t('newsError'));
            window.open('https://news.google.com', '_blank');
            return;
        }
        const items = data.items.slice(0, 3);
        let summary = t('newsHeadlines');
        items.forEach((item, i) => {
            summary += `Number ${i + 1}: ${item.title}. `;
            addMessage('📰 ' + item.title, 'bot');
        });
        speak(summary);
    });
}

function handleEmergency() {
    speak(t('emergencyInit'));
    EMERGENCY_NUMBERS.forEach(e => {
        addMessage(`${e.emoji} ${e.label}: ${e.number}`, 'bot');
    });
    addMessage('📍 Your Location: Sending coordinates...', 'bot');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            addMessage(`Lat: ${lat}, Long: ${lng}`, 'bot');
            const mapsURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            addLinkMessage('Click Here to View Location', mapsURL, '📍');
            window.open(mapsURL, '_blank');
        });
    }
}

function handleMentalHealth() {
    const messages = t('comfort');
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    typeThenSpeak(randomMsg);
}

function handleSchemeEligibility() {
    resetProfile();
    multiQuizState.phase = "BUILDING_PROFILE";
    typeThenSpeak(t('schemeStart') + ' ' + t(PROFILE_QUESTION_KEYS[0]), 500);
}

function handleKeralaSchemes() {
    let keralaSchemes = [];
    for (let key in schemesData) {
        if (schemesData[key].state === 'Kerala' && schemesData[key].name) {
            keralaSchemes.push(schemesData[key].name);
        }
    }
    if (keralaSchemes.length > 0) {
        typeThenSpeak(t('keralaList') + keralaSchemes.join(', ') + t('keralaAsk'));
    } else {
        typeThenSpeak(t('keralaNoInfo'));
    }
}

function handleSchemeInquiry(message) {
    for (let key in schemesData) {
        let scheme = schemesData[key];
        for (let keyword of scheme.keywords) {
            if (message.includes(keyword)) {
                if (message.includes('document') || message.includes('documents') || message.includes('certificates') ||
                    message.includes('दस्तावेज़') || message.includes('രേഖ')) {
                    typeThenSpeak(t('docsFor') + (scheme.name || 'scheme') + t('are') + scheme.documents.join(', ') + '.');
                } else {
                    let response = t('schemeInfoPrefix') +
                        `Eligibility: ${scheme.eligibility}. Documents: ${scheme.documents.join(', ')}. How to Apply: ${scheme.apply}. ` +
                        t('openingWebsite');
                    typeThenSpeak(response, 500);
                    if (scheme.url) {
                        setTimeout(() => window.open(scheme.url, '_blank'), 600);
                    }
                }
                return true;
            }
        }
    }
    return false;
}

function handleMedicationReminder() {
    speak(t('reminderSet'));
    addMessage(t('reminderDemo'), 'bot');
    setTimeout(() => {
        speak(t('reminderAlert'));
        addMessage(t('reminderBell'), 'bot');
    }, 10000);
}

function handleGovernmentUpdates() {
    speak(t('fetchingUpdates'));
    showTypingIndicator();

    safeFetch(API_URLS.govUpdates, null).then(data => {
        hideTypingIndicator();
        if (!data || data.status !== 'ok' || !data.items) {
            speak(t('updateError'));
            return;
        }
        const items = data.items.slice(0, 3);
        let summary = t('govUpdates');
        items.forEach((item, i) => {
            addMessage('📰 ' + item.title, 'bot');
            summary += `Update ${i + 1}: ${item.title}. `;
        });
        speak(summary);
        if (items.length > 0 && items[0].link) {
            window.open(items[0].link, '_blank');
        }
    });
}

function handleFraudAwareness() {
    typeThenSpeak(t('fraudWarning'));
}

function handleNearbyService(message) {
    speak(t('findingService'));

    let searchQuery = '';
    if (message.includes('hospital') || message.includes('ആശുപത്രി') || message.includes('अस्पताल')) {
        searchQuery = 'Government+Hospital+near+me';
    } else if (message.includes('panchayat') || message.includes('പഞ്ചായത്ത്') || message.includes('पंचायत')) {
        searchQuery = 'Panchayat+Office+near+me';
    } else if (message.includes('police') || message.includes('പോലീസ്') || message.includes('पुलिस')) {
        searchQuery = 'Police+Station+near+me';
    } else if (message.includes('csc') || message.includes('सीएससी')) {
        searchQuery = 'Common+Service+Center+near+me';
    } else {
        searchQuery = 'Government+Office+near+me';
    }

    if (!navigator.geolocation) {
        speak(t('geoNotSupported'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const mapsURL = `https://www.google.com/maps/search/${searchQuery}/@${lat},${lng},14z`;
            addMessage('📍 ' + t('openingMaps'), 'bot');
            window.open(mapsURL, '_blank');
        },
        () => { speak(t('locationDenied')); }
    );
}

function handleOpenGoogle() { window.open('https://google.com', '_blank'); speak(t('openingGoogle')); }
function handleOpenYoutube() { window.open('https://youtube.com', '_blank'); speak(t('openingYoutube')); }
function handleOpenFacebook() { window.open('https://facebook.com', '_blank'); speak(t('openingFacebook')); }

function handleSearch(message) {
    window.open(`https://www.google.com/search?q=${message.replace(/ /g, '+')}`, '_blank');
    typeThenSpeak(t('searchResult') + message);
}

function handleWikipedia(message) {
    window.open(`https://en.wikipedia.org/wiki/${message.replace('wikipedia', '').trim()}`, '_blank');
    typeThenSpeak(t('wikiResult') + message);
}

function handleTime() {
    const time = new Date().toLocaleString(undefined, { hour: 'numeric', minute: 'numeric' });
    typeThenSpeak(t('currentTime') + time);
}

function handleDate() {
    const date = new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    typeThenSpeak(t('todayDate') + date);
}

function handleCalculator() {
    window.open('Calculator:///');
    speak(t('openingCalc'));
}

function handleWeather(message) {
    const query = message.replace('weather', '').replace('मौसम', '').replace('കാലാവസ്ഥ', '').trim() || '';
    window.open(`https://www.google.com/search?q=weather+${query}`, '_blank');
    typeThenSpeak(t('weatherInfo') + (query || 'your area'));
}

function handleJoke() {
    showTypingIndicator();
    safeFetch(API_URLS.jokes, null).then(data => {
        hideTypingIndicator();
        if (data) {
            typeThenSpeak(`${data.setup} ... ${data.punchline}`);
        } else {
            typeThenSpeak("Why did the scarecrow win an award? Because he was outstanding in his field!");
        }
    });
}

// ================== COMMAND REGISTRY ==================
const commands = [
    // --- Greetings ---
    {
        match: m => m.includes('hey') || m.includes('hello') || m.includes('hi ') || m === 'hi' ||
            m.includes('नमस्ते') || m.includes('നമസ്കാരം'),
        handler: handleGreeting
    },
    // --- Help ---
    {
        match: m => m === 'help' || m.includes('what can you do') || m.includes('commands') ||
            m.includes('मदद') || m.includes('സഹായം'),
        handler: handleHelp
    },
    // --- System Info ---
    {
        match: m => m.includes('system info') || m.includes('battery') || m.includes('internet') ||
            m.includes('सिस्टम') || m.includes('बैटरी') || m.includes('സിസ്റ്റം') || m.includes('ബാറ്ററി'),
        handler: handleSystemInfo
    },
    // --- News ---
    {
        match: m => m.includes('news') || m.includes('समाचार') || m.includes('खबर') ||
            m.includes('വാർത്ത'),
        handler: handleNews
    },
    // --- Emergency ---
    {
        match: m => m.includes('emergency') || m.includes('help me') || m.includes('police') ||
            m.includes('आपातकाल') || m.includes('पुलिस') || m.includes('അടിയന്തരം') || m.includes('പോലീസ്'),
        handler: handleEmergency
    },
    // --- Mental Health ---
    {
        match: m => m.includes('sad') || m.includes('depressed') || m.includes('lonely') || m.includes('anxiety') ||
            m.includes('उदास') || m.includes('दुखी') || m.includes('വിഷമം') || m.includes('ദുഃഖം'),
        handler: handleMentalHealth
    },
    // --- Scheme Eligibility Engine ---
    {
        match: m => m.includes('eligible') || m.includes('eligibility') || m.includes('what schemes') ||
            m.includes('what am i eligible for') ||
            m.includes('पात्र') || m.includes('योजना') || m.includes('अर्ह') ||
            m.includes('അർഹത') || m.includes('പദ്ധതി'),
        handler: handleSchemeEligibility
    },
    // --- Kerala Schemes ---
    {
        match: m => m.includes('kerala pension') || m.includes('kerala scheme') || m.includes('kerala schemes') ||
            m.includes('pension schemes in kerala') || m.includes('കേരള പെൻഷൻ'),
        handler: handleKeralaSchemes
    },
    // --- Medication Reminder ---
    {
        match: m => m.includes('remind') && (m.includes('pill') || m.includes('medicine') || m.includes('water') ||
            m.includes('दवाई') || m.includes('മരുന്ന്')),
        handler: handleMedicationReminder
    },
    // --- Government Updates ---
    {
        match: m => m.includes('new scheme') || m.includes('latest scheme') || m.includes('new pension') ||
            m.includes('government updates') || m.includes('recent scheme') ||
            m.includes('सरकारी अपडेट') || m.includes('സർക്കാർ അപ്ഡേറ്റ'),
        handler: handleGovernmentUpdates
    },
    // --- Fraud Awareness ---
    {
        match: m => m.includes('otp') || m.includes('fraud') || m.includes('scam') || m.includes('bank call') ||
            m.includes('धोखा') || m.includes('तట്ടിപ്പ്'),
        handler: handleFraudAwareness
    },
    // --- Nearby Services ---
    {
        match: m => m.includes('nearby hospital') || m.includes('nearest hospital') || m.includes('government hospital') ||
            m.includes('panchayat office') || m.includes('nearest police station') ||
            m.includes('csc center') || m.includes('nearby panchayat') ||
            m.includes('अस्पताल') || m.includes('ആശുപത്രി') || m.includes('പഞ്ചായത്ത്'),
        handler: handleNearbyService
    },
    // --- Open websites ---
    { match: m => m.includes('open google'), handler: handleOpenGoogle },
    { match: m => m.includes('open youtube'), handler: handleOpenYoutube },
    { match: m => m.includes('open facebook'), handler: handleOpenFacebook },
    // --- Knowledge queries ---
    {
        match: m => m.includes('what is') || m.includes('who is') || m.includes('what are'),
        handler: handleSearch
    },
    { match: m => m.includes('wikipedia'), handler: handleWikipedia },
    // --- Time & Date ---
    { match: m => m.includes('time') || m.includes('समय') || m.includes('സമയം'), handler: handleTime },
    { match: m => m.includes('date') || m.includes('तारीख') || m.includes('തീയതി'), handler: handleDate },
    // --- Calculator ---
    { match: m => m.includes('calculator') || m.includes('कैलकुलेटर'), handler: handleCalculator },
    // --- Weather ---
    {
        match: m => m.includes('weather') || m.includes('मौसम') || m.includes('കാലാവസ്ഥ'),
        handler: handleWeather
    },
    // --- Joke ---
    {
        match: m => m.includes('joke') || m.includes('चुटकुला') || m.includes('तमाश') || m.includes('തമാശ'),
        handler: handleJoke
    }
];

// ================== MAIN COMMAND ROUTER ==================
function takeCommand(message) {
    // State machine gets priority (active quiz/scheme flow)
    if (multiQuizState.phase !== "IDLE") {
        if (handleStateMachine(message)) return;
    }

    // Check for session reset even when idle
    if (message.includes('start again') || message.includes('restart') ||
        message.includes('फिर से') || message.includes('വീണ്ടും')) {
        resetProfile();
        speak(t('sessionReset'));
        return;
    }

    // Direct scheme inquiries (search by keyword in schemes.json)
    if (handleSchemeInquiry(message)) return;

    // Command registry
    for (const cmd of commands) {
        if (cmd.match(message)) {
            cmd.handler(message);
            return;
        }
    }

    // Fallback
    typeThenSpeak(t('fallback'));
}

// ================== SPEECH RECOGNITION ==================
try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    if (window.location.protocol === 'file:') {
        alert("⚠️ IMPORTANT: You are opening this file directly (file://). Microphone access is blocked in this mode.\n\nPlease use a Local Server (like 'Live Server' in VS Code) for the microphone to work correctly.");
    }

    recognition.continuous = false;
    recognition.lang = LANG_CODES[currentLang] || 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecognizing = true;
        statusText.textContent = t('listening');
        listeningIndicator.classList.remove('hidden');
        btn.classList.add('listening');
    };

    recognition.onspeechend = () => {
        statusText.textContent = t('processing');
        listeningIndicator.classList.add('hidden');
        recognition.stop();
    };

    recognition.onend = () => {
        isRecognizing = false;
        statusText.textContent = t('micStatus');
        listeningIndicator.classList.add('hidden');
        btn.classList.remove('listening');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        addMessage(transcript, 'user');
        takeCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        listeningIndicator.classList.add('hidden');
        btn.classList.remove('listening');
        statusText.textContent = t('micStatus');
        isRecognizing = false;

        if (event.error === 'not-allowed') {
            speak(t('micDenied'));
            alert("Microphone Access Denied!\n\n1. Click the 'Lock' icon in your browser URL bar.\n2. Allow Microphone access.\n3. Refresh the page.");
        } else if (event.error === 'network') {
            speak(t('networkError'));
        } else if (event.error === 'no-speech') {
            statusText.textContent = t('noSpeech');
            return;
        } else {
            speak(t('didntCatch'));
        }
    };

    // Mic button click
    btn.addEventListener('click', () => {
        if (isRecognizing) {
            recognition.stop();
            return;
        }
        // Update recognition language before starting
        recognition.lang = LANG_CODES[currentLang] || 'en-US';
        statusText.textContent = t('listening');
        recognition.start();
    });

    // ================== LANGUAGE SELECTOR ==================
    document.querySelectorAll('.lang-btn').forEach(langBtn => {
        langBtn.addEventListener('click', () => {
            const lang = langBtn.dataset.lang;
            setLanguage(lang);

            // Update active button
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            langBtn.classList.add('active');

            // Update recognition language
            recognition.lang = LANG_CODES[lang] || 'en-US';

            // Update UI text
            updateUIText();
        });
    });

} catch (e) {
    console.error(e);
    statusText.textContent = t('browserNotSupported');
    alert("Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.");
}

// ================== UI TEXT UPDATER ==================
function updateUIText() {
    appSubtitle.textContent = t('subtitle');
    typeBox.placeholder = t('placeholder');
    statusText.textContent = t('micStatus');
    if (splashText) splashText.textContent = t('splashText');

    // Update chip labels
    document.querySelectorAll('.chip').forEach(chip => {
        const key = chip.dataset.chipKey;
        if (key && t(key)) chip.textContent = t(key);
    });

    // Update welcome message if it's still the default
    if (welcomeText && chatBox.querySelectorAll('.message').length <= 1) {
        welcomeText.textContent = t('welcomeMsg');
    }
}

// ================== EVENT LISTENERS ==================

// Text input
function handleTextInput() {
    const text = typeBox.value;
    if (text.trim() === '') return;
    addMessage(text, 'user');
    takeCommand(text.toLowerCase());
    typeBox.value = '';
}

sendBtn.addEventListener('click', handleTextInput);
typeBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleTextInput();
});

// Elderly Mode
elderlyToggle.addEventListener('click', () => {
    document.body.classList.toggle('elderly-mode');
    speak(document.body.classList.contains('elderly-mode') ? t('elderlyOn') : t('elderlyOff'));
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const icon = themeToggle.querySelector('i');

    if (isLight) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        speak(t('lightMode'));
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        speak(t('darkMode'));
    }
});

// Clear Chat
clearChatBtn.addEventListener('click', clearChat);

// Export Chat
exportChatBtn.addEventListener('click', exportChat);

// Quick Action Chips
quickActions.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const command = chip.dataset.command;
    if (command) {
        addMessage(command, 'user');
        takeCommand(command.toLowerCase());
    }
});

// ================== KEYBOARD SHORTCUTS ==================
document.addEventListener('keydown', (e) => {
    // Ctrl+M — Toggle microphone
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        btn.click();
    }
    // Escape — Stop speech
    if (e.key === 'Escape') {
        window.speechSynthesis.cancel();
        hideTypingIndicator();
    }
    // Ctrl+L — Clear chat
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearChat();
    }
});

// ================== INITIALIZATION ==================

// Load schemes data
fetch('schemes.json')
    .then(response => response.json())
    .then(data => {
        schemesData = data;
        // Hide splash after data loads
        setTimeout(() => {
            if (splashScreen) splashScreen.classList.add('hidden');
        }, 800);
    })
    .catch(error => {
        console.error('Error loading schemes:', error);
        if (splashScreen) splashScreen.classList.add('hidden');
    });

// Load saved chat history
loadChat();

// Set initial language UI state
(function initLanguage() {
    const stored = localStorage.getItem('mittu_lang') || 'en';
    currentLang = stored;
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === stored);
    });
    updateUIText();
})();

// Ensure voices are loaded for speech synthesis
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded, ready for multi-language synthesis
    };
}

// Register Service Worker for offline support
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('SW registration failed:', err));
}