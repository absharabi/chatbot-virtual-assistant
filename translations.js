// ================================================================
// MITTU — Multi-Language Translation System
// Supports: English (en), Hindi (hi), Malayalam (ml)
// ================================================================

let currentLang = localStorage.getItem('mittu_lang') || 'en';

const TRANSLATIONS = {
    // ======================== ENGLISH ========================
    en: {
        // UI Elements
        title: "M I T T U",
        subtitle: "Virtual Companion",
        placeholder: "Type your command here...",
        micStatus: "Click mic to speak",
        listening: "Listening... Speak now",
        processing: "Processing...",
        noSpeech: "No speech detected. Try moving closer.",
        browserNotSupported: "Browser not supported",

        // Greetings
        greeting: "Hello! I am Mittu, your virtual companion. How can I assist you?",
        goodMorning: "Good Morning! How can I help you today?",
        goodAfternoon: "Good Afternoon! Ready to assist you.",
        goodEvening: "Good Evening! How was your day?",

        // Mode toggles
        elderlyOn: "Elderly Mode activated. Text size increased.",
        elderlyOff: "Standard Mode activated.",
        lightMode: "Switched to Light Mode.",
        darkMode: "Switched to Dark Mode.",

        // Scheme Engine
        schemeStart: "Let's find out what schemes exactly you are eligible for. I will ask you a few questions.",
        ageQuestion: "What is your age?",
        keralaQuestion: "Are you a permanent resident of Kerala? Please answer yes or no.",
        incomeQuestion: "Is your annual family income below 1 Lakh Rupees?",
        widowQuestion: "Are you a widow?",
        agriQuestion: "Are you an agricultural labourer?",
        disabledQuestion: "Do you have a medical certificate proving more than 40 percent disability?",
        seccQuestion: "Is your family listed in the SECC 2011 database?",
        ageRetry: "I did not catch your age. Please tell me your age in numbers.",
        yesNoRetry: "Please answer with just yes or no.",
        evalComplete: "Evaluation complete.",
        eligible: "Great news! You are eligible for: ",
        selectScheme: "Please declare the name of the scheme you want to look at, or say 'start again' to reset.",
        notEligible: "Unfortunately, based on your profile, you are not eligible for any schemes right now.",
        selectEligible: "Please say the name of one of the eligible schemes, or say 'start again' to reset.",
        findCenter: "Finally, do you want me to find the nearest center or office to apply for this?",
        findingCenter: "Finding the nearest service center for your scheme...",
        sessionReset: "Session reset. How else can I help you?",
        docsFor: "The required documents for ",
        are: " are: ",
        schemeInfoPrefix: "Here is the information about the scheme. ",
        openingWebsite: "Opening the official website for you.",
        youSelected: "You selected ",
        docsNeeded: ". Here are the required documents: ",
        stepsToApply: ". The steps to apply are: First, ",

        // Emergency
        emergencyInit: "Emergency protocol initiated. Displaying emergency numbers.",

        // Mental health
        comfort: [
            "I'm sorry you're feeling this way. Remember, it's okay not to be okay.",
            "Take a deep breath. You are stronger than you think.",
            "I'm here for you. Would you like to hear a joke to cheer you up?"
        ],

        // System info
        checkingStats: "Checking system stats. ",
        online: "You are online. ",
        offline: "You are offline. ",
        batteryAt: "Battery is at ",
        andCharging: "and charging",
        onBattery: "on battery power",
        batteryUnavailable: "Battery information is unavailable on this device.",

        // News
        fetchingNews: "Fetching the latest headlines...",
        newsHeadlines: "Here are the top headlines: ",
        newsError: "I encountered an error fetching the news. Opening Google News instead.",

        // Location
        openingMaps: "Opening nearest location in Google Maps...",
        clickMaps: "Click Here to Open Maps!",
        locationDenied: "Unable to access your location. Please enable location permission.",
        geoNotSupported: "Geolocation is not supported in this browser.",
        findingService: "Finding the requested government service near your location.",

        // Reminders
        reminderSet: "I have set your health reminder. I will alert you shortly.",
        reminderDemo: "⏱️ Health reminder set (10 second demo mode)",
        reminderAlert: "Reminder! It is time to take your medication and drink a glass of water.",
        reminderBell: "🔔 MEDICAL REMINDER: Time for pills & water!",

        // Government updates
        fetchingUpdates: "Fetching latest government scheme updates...",
        govUpdates: "Here are the latest government updates. I am opening the top story for you now: ",
        updateError: "Unable to fetch updates at the moment. Please try again later.",

        // Fraud awareness
        fraudWarning: "Warning! Never share your OTP, bank PIN or password with anyone. Government and banks never ask for confidential details over phone. Be careful of unknown links.",

        // Standard commands
        openingGoogle: "Opening Google...",
        openingYoutube: "Opening Youtube...",
        openingFacebook: "Opening Facebook...",
        searchResult: "This is what I found on the internet regarding ",
        wikiResult: "This is what I found on Wikipedia regarding ",
        currentTime: "The current time is ",
        todayDate: "Today's date is ",
        openingCalc: "Opening Calculator",
        weatherInfo: "I found the weather information for ",
        fallback: "I can assist with government schemes, emergency help, fraud awareness, news and daily assistance. Try saying 'help' to see what I can do.",

        // Help
        helpIntro: "Here's what I can do:",
        helpItems: [
            '🏛️ "Check eligibility" — Find matching government schemes',
            '📰 "News" — Fetch latest headlines',
            '🚨 "Emergency" — SOS contacts & your location',
            '💊 "Remind me pills" — Health reminders',
            '🔐 "OTP" / "Fraud" — Scam awareness tips',
            '🗺️ "Nearest hospital" — GPS service locator',
            '🌤️ "Weather" — Current weather info',
            '😂 "Tell me a joke" — Lighten the mood',
            '💻 "System info" — Battery & connectivity',
            '⌨️ Ctrl+M = Mic | Esc = Stop | Ctrl+L = Clear'
        ],

        // Quick action chips
        chipSchemes: "🏛️ Check Schemes",
        chipEmergency: "🚨 Emergency",
        chipNews: "📰 News",
        chipSystem: "💻 System Info",
        chipHelp: "❓ Help",

        // Chat actions
        chatCleared: "Chat cleared. How can I help you?",
        welcomeMsg: "Hello! I'm Mittu. How can I help you today?",

        // Kerala schemes
        keralaList: "Here are the Kerala pension schemes I can help with: ",
        keralaAsk: ". You can ask me about any of these for details or documents.",
        keralaNoInfo: "I don't have information on Kerala schemes right now.",

        // Mic errors
        micDenied: "Microphone access was denied. Please allow microphone permission.",
        networkError: "I am having trouble connecting to the internet.",
        didntCatch: "I didn't catch that. Please try again.",
        okayHelp: "Okay, let me know if you need anything else.",

        // Splash
        splashText: "Loading your virtual companion...",
    },

    // ======================== HINDI ========================
    hi: {
        title: "मि ट् टू",
        subtitle: "वर्चुअल सहायक",
        placeholder: "अपना प्रश्न यहाँ टाइप करें...",
        micStatus: "बोलने के लिए माइक दबाएं",
        listening: "सुन रहा हूँ... अभी बोलिए",
        processing: "प्रोसेसिंग...",
        noSpeech: "कोई आवाज़ नहीं सुनाई दी। करीब आकर बोलिए।",
        browserNotSupported: "ब्राउज़र सपोर्ट नहीं करता",

        greeting: "नमस्ते! मैं मिट्टू हूँ, आपका वर्चुअल सहायक। मैं आपकी कैसे मदद कर सकता हूँ?",
        goodMorning: "सुप्रभात! आज मैं आपकी कैसे मदद कर सकता हूँ?",
        goodAfternoon: "शुभ दोपहर! बताइए कैसे सहायता करूँ।",
        goodEvening: "शुभ संध्या! आपका दिन कैसा रहा?",

        elderlyOn: "बुज़ुर्ग मोड चालू। अक्षर बड़े किए गए।",
        elderlyOff: "सामान्य मोड चालू।",
        lightMode: "लाइट मोड चालू।",
        darkMode: "डार्क मोड चालू।",

        schemeStart: "चलिए पता करते हैं कि आप किन योजनाओं के लिए पात्र हैं। मैं आपसे कुछ सवाल पूछूँगा।",
        ageQuestion: "आपकी उम्र क्या है?",
        keralaQuestion: "क्या आप केरल के स्थायी निवासी हैं? कृपया हाँ या ना में बताएं।",
        incomeQuestion: "क्या आपकी पारिवारिक वार्षिक आय 1 लाख रुपये से कम है?",
        widowQuestion: "क्या आप विधवा हैं?",
        agriQuestion: "क्या आप कृषि मजदूर हैं?",
        disabledQuestion: "क्या आपके पास 40 प्रतिशत से अधिक विकलांगता का प्रमाणपत्र है?",
        seccQuestion: "क्या आपका परिवार SECC 2011 डेटाबेस में सूचीबद्ध है?",
        ageRetry: "मुझे आपकी उम्र समझ नहीं आई। कृपया संख्या में बताएं।",
        yesNoRetry: "कृपया सिर्फ हाँ या ना में जवाब दें।",
        evalComplete: "मूल्यांकन पूर्ण।",
        eligible: "बधाई! आप इन योजनाओं के लिए पात्र हैं: ",
        selectScheme: "कृपया उस योजना का नाम बताएं जिसे देखना चाहते हैं, या 'फिर से शुरू' कहें।",
        notEligible: "दुर्भाग्य से, आपकी प्रोफ़ाइल के आधार पर, आप अभी किसी योजना के लिए पात्र नहीं हैं।",
        selectEligible: "कृपया पात्र योजना का नाम बताएं, या 'फिर से शुरू' कहें।",
        findCenter: "क्या आप चाहते हैं कि मैं आवेदन के लिए निकटतम केंद्र खोजूँ?",
        findingCenter: "निकटतम सेवा केंद्र खोज रहा हूँ...",
        sessionReset: "सत्र रीसेट। और कैसे मदद करूँ?",
        docsFor: "",
        are: " के लिए आवश्यक दस्तावेज़: ",
        schemeInfoPrefix: "योजना की जानकारी इस प्रकार है। ",
        openingWebsite: "आधिकारिक वेबसाइट खोल रहा हूँ।",
        youSelected: "आपने चुना ",
        docsNeeded: "। आवश्यक दस्तावेज़: ",
        stepsToApply: "। आवेदन के चरण: पहला, ",

        emergencyInit: "आपातकालीन प्रोटोकॉल शुरू। आपातकालीन नंबर दिखा रहे हैं।",

        comfort: [
            "मुझे दुख है कि आप ऐसा महसूस कर रहे हैं। याद रखें, ठीक न होना भी ठीक है।",
            "गहरी सांस लें। आप अपनी सोच से ज़्यादा मज़बूत हैं।",
            "मैं आपके साथ हूँ। क्या खुश होने के लिए कोई चुटकुला सुनना चाहेंगे?"
        ],

        checkingStats: "सिस्टम की जानकारी जाँच रहा हूँ। ",
        online: "आप ऑनलाइन हैं। ",
        offline: "आप ऑफलाइन हैं। ",
        batteryAt: "बैटरी ",
        andCharging: "और चार्ज हो रही है",
        onBattery: "बैटरी पावर पर",
        batteryUnavailable: "इस डिवाइस पर बैटरी जानकारी उपलब्ध नहीं।",

        fetchingNews: "ताज़ा खबरें ला रहा हूँ...",
        newsHeadlines: "प्रमुख समाचार: ",
        newsError: "खबरें लाने में समस्या हुई। Google News खोल रहा हूँ।",

        openingMaps: "Google Maps में निकटतम स्थान खोल रहा हूँ...",
        clickMaps: "Maps खोलने के लिए यहाँ क्लिक करें!",
        locationDenied: "लोकेशन प्राप्त नहीं हो सकी। कृपया लोकेशन अनुमति दें।",
        geoNotSupported: "इस ब्राउज़र में जियोलोकेशन उपलब्ध नहीं।",
        findingService: "निकट सरकारी सेवा खोज रहा हूँ।",

        reminderSet: "आपका स्वास्थ्य रिमाइंडर सेट किया गया।",
        reminderDemo: "⏱️ स्वास्थ्य रिमाइंडर (10 सेकंड डेमो)",
        reminderAlert: "रिमाइंडर! दवाई लेने और पानी पीने का समय।",
        reminderBell: "🔔 दवाई रिमाइंडर: दवाई और पानी का समय!",

        fetchingUpdates: "नवीनतम सरकारी योजना अपडेट ला रहा हूँ...",
        govUpdates: "नवीनतम सरकारी अपडेट। शीर्ष कहानी खोल रहा हूँ: ",
        updateError: "अभी अपडेट नहीं मिल पा रहे। बाद में प्रयास करें।",

        fraudWarning: "चेतावनी! OTP, बैंक PIN या पासवर्ड कभी किसी को न बताएं। सरकार और बैंक कभी फोन पर गोपनीय जानकारी नहीं मांगते।",

        openingGoogle: "Google खोल रहा हूँ...",
        openingYoutube: "Youtube खोल रहा हूँ...",
        openingFacebook: "Facebook खोल रहा हूँ...",
        searchResult: "इंटरनेट पर यह जानकारी मिली: ",
        wikiResult: "विकिपीडिया पर यह जानकारी मिली: ",
        currentTime: "वर्तमान समय है ",
        todayDate: "आज की तारीख है ",
        openingCalc: "कैलकुलेटर खोल रहा हूँ",
        weatherInfo: "मौसम की जानकारी: ",
        fallback: "मैं सरकारी योजनाओं, आपातकालीन सहायता, धोखाधड़ी जागरूकता, समाचार में मदद कर सकता हूँ। 'मदद' बोलें।",

        helpIntro: "मैं यह सब कर सकता हूँ:",
        helpItems: [
            '🏛️ "पात्रता जांचें" — सरकारी योजनाएं खोजें',
            '📰 "समाचार" — ताज़ा खबरें',
            '🚨 "आपातकाल" — SOS संपर्क और स्थान',
            '💊 "दवाई याद दिलाओ" — स्वास्थ्य रिमाइंडर',
            '🔐 "OTP" / "धोखा" — स्कैम जागरूकता',
            '🗺️ "निकटतम अस्पताल" — GPS खोजक',
            '🌤️ "मौसम" — वर्तमान मौसम',
            '😂 "चुटकुला सुनाओ" — मनोरंजन',
            '💻 "सिस्टम जानकारी" — बैटरी और कनेक्शन',
            '⌨️ Ctrl+M = माइक | Esc = रोकें | Ctrl+L = साफ़'
        ],

        chipSchemes: "🏛️ योजनाएं",
        chipEmergency: "🚨 आपातकाल",
        chipNews: "📰 समाचार",
        chipSystem: "💻 सिस्टम",
        chipHelp: "❓ मदद",

        chatCleared: "चैट साफ़। कैसे मदद करूँ?",
        welcomeMsg: "नमस्ते! मैं मिट्टू हूँ। आज कैसे मदद करूँ?",

        keralaList: "केरल की पेंशन योजनाएं: ",
        keralaAsk: "। इनमें से किसी के बारे में पूछ सकते हैं।",
        keralaNoInfo: "केरल योजनाओं की जानकारी अभी उपलब्ध नहीं।",

        micDenied: "माइक्रोफोन अनुमति नहीं दी गई। कृपया अनुमति दें।",
        networkError: "इंटरनेट से कनेक्ट करने में समस्या।",
        didntCatch: "समझ नहीं आया। फिर से कहें।",
        okayHelp: "ठीक है, ज़रूरत हो तो बताइए।",

        splashText: "आपका वर्चुअल सहायक लोड हो रहा है...",
    },

    // ======================== MALAYALAM ========================
    ml: {
        title: "മി ട് ടു",
        subtitle: "വെർച്വൽ സഹായി",
        placeholder: "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക...",
        micStatus: "സംസാരിക്കാൻ മൈക്ക് അമർത്തുക",
        listening: "കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
        processing: "പ്രോസസ്സ് ചെയ്യുന്നു...",
        noSpeech: "ശബ്ദം കേട്ടില്ല. അടുത്ത് വന്ന് സംസാരിക്കുക.",
        browserNotSupported: "ബ്രൗസർ പിന്തുണയ്ക്കുന്നില്ല",

        greeting: "നമസ്കാരം! ഞാൻ മിട്ടുവാണ്, നിങ്ങളുടെ വെർച്വൽ സഹായി. എന്ത് സഹായം വേണം?",
        goodMorning: "സുപ്രഭാതം! ഇന്ന് എന്ത് സഹായം വേണം?",
        goodAfternoon: "ശുഭ ഉച്ചനേരം! സഹായിക്കാൻ തയ്യാർ.",
        goodEvening: "ശുഭ സന്ധ്യ! നിങ്ങളുടെ ദിവസം എങ്ങനെയായിരുന്നു?",

        elderlyOn: "മുതിർന്നവർക്കുള്ള മോഡ് ഓൺ. അക്ഷരങ്ങൾ വലുതാക്കി.",
        elderlyOff: "സാധാരണ മോഡ് ഓൺ.",
        lightMode: "ലൈറ്റ് മോഡിലേക്ക് മാറി.",
        darkMode: "ഡാർക്ക് മോഡിലേക്ക് മാറി.",

        schemeStart: "നിങ്ങൾ ഏതൊക്കെ പദ്ധതികൾക്ക് അർഹരാണെന്ന് കണ്ടെത്താം. ചില ചോദ്യങ്ങൾ ചോദിക്കാം.",
        ageQuestion: "നിങ്ങളുടെ പ്രായം എത്രയാണ്?",
        keralaQuestion: "നിങ്ങൾ കേരളത്തിലെ സ്ഥിര താമസക്കാരനാണോ? ഉവ്വ് അല്ലെങ്കിൽ അല്ല എന്ന് പറയുക.",
        incomeQuestion: "നിങ്ങളുടെ കുടുംബ വാർഷിക വരുമാനം 1 ലക്ഷം രൂപയിൽ കുറവാണോ?",
        widowQuestion: "നിങ്ങൾ വിധവയാണോ?",
        agriQuestion: "നിങ്ങൾ കാർഷിക തൊഴിലാളിയാണോ?",
        disabledQuestion: "40 ശതമാനത്തിൽ കൂടുതൽ വൈകല്യം തെളിയിക്കുന്ന മെഡിക്കൽ സർട്ടിഫിക്കറ്റ് ഉണ്ടോ?",
        seccQuestion: "നിങ്ങളുടെ കുടുംബം SECC 2011 ഡാറ്റാബേസിൽ ഉൾപ്പെട്ടിട്ടുണ്ടോ?",
        ageRetry: "നിങ്ങളുടെ പ്രായം മനസ്സിലായില്ല. ദയവായി അക്കത്തിൽ പറയുക.",
        yesNoRetry: "ദയവായി ഉവ്വ് അല്ലെങ്കിൽ അല്ല എന്ന് മാത്രം പറയുക.",
        evalComplete: "വിലയിരുത്തൽ പൂർത്തിയായി.",
        eligible: "സന്തോഷവാർത്ത! നിങ്ങൾ ഈ പദ്ധതികൾക്ക് അർഹരാണ്: ",
        selectScheme: "ദയവായി കാണാൻ ആഗ്രഹിക്കുന്ന പദ്ധതിയുടെ പേര് പറയുക, അല്ലെങ്കിൽ 'വീണ്ടും തുടങ്ങുക' എന്ന് പറയുക.",
        notEligible: "നിർഭാഗ്യവശാൽ, നിങ്ങളുടെ പ്രൊഫൈൽ അനുസരിച്ച് ഇപ്പോൾ ഒരു പദ്ധതിക്കും അർഹതയില്ല.",
        selectEligible: "ദയവായി അർഹമായ പദ്ധതിയുടെ പേര് പറയുക, അല്ലെങ്കിൽ 'വീണ്ടും തുടങ്ങുക' എന്ന് പറയുക.",
        findCenter: "അവസാനമായി, അപേക്ഷിക്കാൻ അടുത്തുള്ള കേന്ദ്രം കണ്ടെത്തണോ?",
        findingCenter: "അടുത്തുള്ള സേവന കേന്ദ്രം കണ്ടെത്തുന്നു...",
        sessionReset: "സെഷൻ റീസെറ്റ്. വേറെ എന്ത് സഹായം വേണം?",
        docsFor: "",
        are: " ന് ആവശ്യമായ രേഖകൾ: ",
        schemeInfoPrefix: "പദ്ധതിയുടെ വിവരങ്ങൾ. ",
        openingWebsite: "ഔദ്യോഗിക വെബ്‌സൈറ്റ് തുറക്കുന്നു.",
        youSelected: "നിങ്ങൾ തിരഞ്ഞെടുത്തു ",
        docsNeeded: ". ആവശ്യമായ രേഖകൾ: ",
        stepsToApply: ". അപേക്ഷിക്കാനുള്ള ഘട്ടങ്ങൾ: ആദ്യം, ",

        emergencyInit: "അടിയന്തര പ്രോട്ടോക്കോൾ ആരംഭിച്ചു. അടിയന്തര നമ്പറുകൾ കാണിക്കുന്നു.",

        comfort: [
            "നിങ്ങൾ ഇങ്ങനെ അനുഭവിക്കുന്നതിൽ ദുഃഖമുണ്ട്. ശരിയല്ലാതിരിക്കുന്നത് ശരിയാണ്.",
            "ആഴത്തിൽ ശ്വസിക്കുക. നിങ്ങൾ കരുതുന്നതിലും ശക്തരാണ്.",
            "ഞാൻ നിങ്ങളോടൊപ്പമുണ്ട്. സന്തോഷിക്കാൻ ഒരു തമാശ കേൾക്കണോ?"
        ],

        checkingStats: "സിസ്റ്റം വിവരങ്ങൾ പരിശോധിക്കുന്നു. ",
        online: "നിങ്ങൾ ഓൺലൈനാണ്. ",
        offline: "നിങ്ങൾ ഓഫ്‌ലൈനാണ്. ",
        batteryAt: "ബാറ്ററി ",
        andCharging: "ചാർജ് ചെയ്യുന്നു",
        onBattery: "ബാറ്ററി പവറിൽ",
        batteryUnavailable: "ഈ ഉപകരണത്തിൽ ബാറ്ററി വിവരം ലഭ്യമല്ല.",

        fetchingNews: "പുതിയ വാർത്തകൾ കൊണ്ടുവരുന്നു...",
        newsHeadlines: "പ്രധാന വാർത്തകൾ: ",
        newsError: "വാർത്തകൾ ലഭിക്കുന്നതിൽ പ്രശ്നം. Google News തുറക്കുന്നു.",

        openingMaps: "Google Maps-ൽ അടുത്തുള്ള സ്ഥലം തുറക്കുന്നു...",
        clickMaps: "Maps തുറക്കാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക!",
        locationDenied: "ലൊക്കേഷൻ ലഭിച്ചില്ല. ലൊക്കേഷൻ അനുവാദം നൽകുക.",
        geoNotSupported: "ഈ ബ്രൗസറിൽ ജിയോലൊക്കേഷൻ ലഭ്യമല്ല.",
        findingService: "അടുത്തുള്ള സർക്കാർ സേവനം കണ്ടെത്തുന്നു.",

        reminderSet: "ആരോഗ്യ ഓർമ്മപ്പെടുത്തൽ സെറ്റ് ചെയ്തു.",
        reminderDemo: "⏱️ ആരോഗ്യ ഓർമ്മപ്പെടുത്തൽ (10 സെക്കൻഡ് ഡെമോ)",
        reminderAlert: "ഓർമ്മപ്പെടുത്തൽ! മരുന്ന് കഴിക്കാനും വെള്ളം കുടിക്കാനും സമയമായി.",
        reminderBell: "🔔 മരുന്ന് ഓർമ്മപ്പെടുത്തൽ!",

        fetchingUpdates: "പുതിയ സർക്കാർ അപ്‌ഡേറ്റുകൾ...",
        govUpdates: "നവീന സർക്കാർ അപ്‌ഡേറ്റുകൾ. ആദ്യ വാർത്ത തുറക്കുന്നു: ",
        updateError: "ഇപ്പോൾ അപ്‌ഡേറ്റുകൾ ലഭ്യമല്ല. പിന്നീട് ശ്രമിക്കുക.",

        fraudWarning: "മുന്നറിയിപ്പ്! OTP, ബാങ്ക് PIN, പാസ്‌വേഡ് ആരോടും പങ്കിടരുത്. സർക്കാരും ബാങ്കുകളും ഫോണിലൂടെ രഹസ്യ വിവരങ്ങൾ ചോദിക്കില്ല.",

        openingGoogle: "Google തുറക്കുന്നു...",
        openingYoutube: "Youtube തുറക്കുന്നു...",
        openingFacebook: "Facebook തുറക്കുന്നു...",
        searchResult: "ഇന്റർനെറ്റിൽ ഇത് കണ്ടെത്തി: ",
        wikiResult: "വിക്കിപീഡിയയിൽ ഇത് കണ്ടെത്തി: ",
        currentTime: "ഇപ്പോൾ സമയം ",
        todayDate: "ഇന്നത്തെ തീയതി ",
        openingCalc: "കാൽക്കുലേറ്റർ തുറക്കുന്നു",
        weatherInfo: "കാലാവസ്ഥ വിവരം: ",
        fallback: "സർക്കാർ പദ്ധതികൾ, അടിയന്തര സഹായം, തട്ടിപ്പ് ബോധവൽക്കരണം, വാർത്തകൾ എന്നിവയിൽ സഹായിക്കാം. 'സഹായം' എന്ന് പറയുക.",

        helpIntro: "എനിക്ക് ഇതൊക്കെ ചെയ്യാൻ കഴിയും:",
        helpItems: [
            '🏛️ "അർഹത പരിശോധിക്കുക" — സർക്കാർ പദ്ധതികൾ',
            '📰 "വാർത്തകൾ" — പുതിയ വാർത്തകൾ',
            '🚨 "അടിയന്തരം" — SOS & സ്ഥാനം',
            '💊 "മരുന്ന് ഓർമ്മിപ്പിക്കുക" — ആരോഗ്യ ഓർമ്മപ്പെടുത്തൽ',
            '🔐 "OTP" / "തട്ടിപ്പ്" — സ്കാം ബോധവൽക്കരണം',
            '🗺️ "അടുത്തുള്ള ആശുപത്രി" — GPS ലൊക്കേറ്റർ',
            '🌤️ "കാലാവസ്ഥ" — നിലവിലെ കാലാവസ്ഥ',
            '😂 "തമാശ" — വിനോദം',
            '💻 "സിസ്റ്റം" — ബാറ്ററി & കണക്ഷൻ',
            '⌨️ Ctrl+M = മൈക്ക് | Esc = നിർത്തുക | Ctrl+L = മായ്ക്കുക'
        ],

        chipSchemes: "🏛️ പദ്ധതികൾ",
        chipEmergency: "🚨 അടിയന്തരം",
        chipNews: "📰 വാർത്തകൾ",
        chipSystem: "💻 സിസ്റ്റം",
        chipHelp: "❓ സഹായം",

        chatCleared: "ചാറ്റ് മായ്ച്ചു. എന്ത് സഹായം വേണം?",
        welcomeMsg: "നമസ്കാരം! ഞാൻ മിട്ടുവാണ്. ഇന്ന് എന്ത് സഹായം വേണം?",

        keralaList: "കേരള പെൻഷൻ പദ്ധതികൾ: ",
        keralaAsk: ". ഇവയിൽ ഏതിനെക്കുറിച്ചും ചോദിക്കാം.",
        keralaNoInfo: "കേരള പദ്ധതികളെക്കുറിച്ച് ഇപ്പോൾ വിവരമില്ല.",

        micDenied: "മൈക്രോഫോൺ അനുവാദം നിഷേധിച്ചു.",
        networkError: "ഇന്റർനെറ്റ് കണക്ഷൻ പ്രശ്നം.",
        didntCatch: "മനസ്സിലായില്ല. വീണ്ടും ശ്രമിക്കുക.",
        okayHelp: "ശരി, ആവശ്യമെങ്കിൽ അറിയിക്കുക.",

        splashText: "വെർച്വൽ സഹായി ലോഡ് ചെയ്യുന്നു...",
    }
};

/**
 * Get translated string for the current language.
 * Falls back to English if key not found.
 */
function t(key) {
    const langData = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
    return langData[key] !== undefined ? langData[key] : (TRANSLATIONS['en'][key] || key);
}

/**
 * Set the active language and persist preference.
 */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('mittu_lang', lang);
    document.documentElement.lang = lang === 'ml' ? 'ml' : lang === 'hi' ? 'hi' : 'en';
}
