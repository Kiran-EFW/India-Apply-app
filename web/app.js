// Apply AI India - Web Application JavaScript

const API_BASE_URL = 'http://localhost:3000/api';
let currentUser = null;
let authToken = null;

// Language and UI variables
let selectedLanguage = 'hi-IN'; // Default to Hindi
let currentTranslations = {};
let currentServiceType = '';
let currentQuestionIndex = 0;
let totalQuestions = 0;
let userAnswers = {};
let isVoiceAssistantActive = false;
let recognition = null;
let synthesis = window.speechSynthesis;

// Supported Indian Languages
const supportedLanguages = {
    'hi-IN': {
        name: 'हिंदी (Hindi)',
        code: 'hi-IN',
        nativeName: 'हिंदी',
        region: 'National'
    },
    'en-IN': {
        name: 'English (India)',
        code: 'en-IN',
        nativeName: 'English',
        region: 'National'
    },
    'bn-IN': {
        name: 'বাংলা (Bengali)',
        code: 'bn-IN',
        nativeName: 'বাংলা',
        region: 'West Bengal, Tripura'
    },
    'ta-IN': {
        name: 'தமிழ் (Tamil)',
        code: 'ta-IN',
        nativeName: 'தமிழ்',
        region: 'Tamil Nadu, Puducherry'
    },
    'te-IN': {
        name: 'తెలుగు (Telugu)',
        code: 'te-IN',
        nativeName: 'తెలుగు',
        region: 'Andhra Pradesh, Telangana'
    },
    'mr-IN': {
        name: 'मराठी (Marathi)',
        code: 'mr-IN',
        nativeName: 'मराठी',
        region: 'Maharashtra'
    },
    'gu-IN': {
        name: 'ગુજરાતી (Gujarati)',
        code: 'gu-IN',
        nativeName: 'ગુજરાતી',
        region: 'Gujarat'
    },
    'kn-IN': {
        name: 'ಕನ್ನಡ (Kannada)',
        code: 'kn-IN',
        nativeName: 'ಕನ್ನಡ',
        region: 'Karnataka'
    },
    'ml-IN': {
        name: 'മലയാളം (Malayalam)',
        code: 'ml-IN',
        nativeName: 'മലയാളം',
        region: 'Kerala'
    },
    'pa-IN': {
        name: 'ਪੰਜਾਬੀ (Punjabi)',
        code: 'pa-IN',
        nativeName: 'ਪੰਜਾਬੀ',
        region: 'Punjab'
    },
    'or-IN': {
        name: 'ଓଡ଼ିଆ (Odia)',
        code: 'or-IN',
        nativeName: 'ଓଡ଼ିଆ',
        region: 'Odisha'
    },
    'as-IN': {
        name: 'অসমীয়া (Assamese)',
        code: 'as-IN',
        nativeName: 'অসমীয়া',
        region: 'Assam'
    }
};

// Translation objects for common UI elements
const translations = {
    'hi-IN': {
        appTitle: 'Apply AI India - सरकारी सेवाएं',
        selectLanguage: 'भाषा चुनें',
        login: 'लॉगिन',
        register: 'पंजीकरण',
        email: 'ईमेल',
        password: 'पासवर्ड',
        fullName: 'पूरा नाम',
        phoneNumber: 'मोबाइल नंबर',
        next: 'अगला',
        previous: 'पिछला',
        submit: 'जमा करें',
        skip: 'छोड़ें',
        cancel: 'रद्द करें',
        voiceHelper: 'आवाज़ सहायक',
        listen: 'सुनें',
        pleaseAnswer: 'कृपया इस प्रश्न का उत्तर दें',
        services: {
            passport: 'पासपोर्ट आवेदन',
            pan: 'पैन कार्ड आवेदन',
            aadhaar: 'आधार सेवाएं',
            itr: 'आयकर रिटर्न'
        }
    },
    'en-IN': {
        appTitle: 'Apply AI India - Government Services',
        selectLanguage: 'Select Language',
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        fullName: 'Full Name',
        phoneNumber: 'Phone Number',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        skip: 'Skip',
        cancel: 'Cancel',
        voiceHelper: 'Voice Helper',
        listen: 'Listen',
        pleaseAnswer: 'Please answer this question',
        services: {
            passport: 'Passport Application',
            pan: 'PAN Card Application',
            aadhaar: 'Aadhaar Services',
            itr: 'Income Tax Return'
        }
    },
    'bn-IN': {
        appTitle: 'Apply AI India - সরকারি সেবা',
        selectLanguage: 'ভাষা নির্বাচন করুন',
        login: 'লগইন',
        register: 'নিবন্ধন',
        email: 'ইমেইল',
        password: 'পাসওয়ার্ড',
        fullName: 'পূর্ণ নাম',
        phoneNumber: 'ফোন নম্বর',
        next: 'পরবর্তী',
        previous: 'পূর্ববর্তী',
        submit: 'জমা দিন',
        skip: 'এড়িয়ে যান',
        cancel: 'বাতিল',
        voiceHelper: 'ভয়েস সহায়ক',
        listen: 'শুনুন',
        pleaseAnswer: 'দয়া করে এই প্রশ্নের উত্তর দিন',
        services: {
            passport: 'পাসপোর্ট আবেদন',
            pan: 'প্যান কার্ড আবেদন',
            aadhaar: 'আধার সেবা',
            itr: 'আয়কর রিটার্ন'
        }
    },
    'ta-IN': {
        appTitle: 'Apply AI India - அரசு சேவைகள்',
        selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
        login: 'உள்நுழைய',
        register: 'பதிவு',
        email: 'மின்னஞ்சல்',
        password: 'கடவுச்சொல்',
        fullName: 'முழு பெயர்',
        phoneNumber: 'தொலைபேசி எண்',
        next: 'அடுத்து',
        previous: 'முந்தைய',
        submit: 'சமர்ப்பிக்கவும்',
        skip: 'தவிர்க்கவும்',
        cancel: 'ரத்து செய்யவும்',
        voiceHelper: 'குரல் உதவியாளர்',
        listen: 'கேளுங்கள்',
        pleaseAnswer: 'தயவுசெய்து இந்த கேள்விக்கு பதிலளிக்கவும்',
        services: {
            passport: 'பாஸ்போர்ட் விண்ணப்பம்',
            pan: 'பான் கார்டு விண்ணப்பம்',
            aadhaar: 'ஆதார் சேவைகள்',
            itr: 'வருமான வரி வருமானம்'
        }
    }
};

// Language selection functions
function showLanguageSelector() {
    // Hide all other sections
    const sectionsToHide = ['authContainer', 'servicesContainer', 'applicationForm', 'servicesSection'];
    sectionsToHide.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Show language selector
    document.getElementById('languageSelector').style.display = 'block';
    
    console.log('Language selector shown');
}

function selectLanguage(langCode) {
    selectedLanguage = langCode;
    currentTranslations = translations[langCode] || translations['hi-IN'];
    
    console.log('Language selected:', supportedLanguages[langCode].name);
    
    // Update UI elements
    updateUILanguage();
    
    // Hide language selector and show services
    document.getElementById('languageSelector').style.display = 'none';
    showServices();
    
    // Update speech synthesis and recognition language
    if (synthesis) {
        synthesis.cancel(); // Cancel any ongoing speech
    }
    
    // Update speech recognition language
    if (recognition) {
        recognition.lang = selectedLanguage;
    }
    
    // Show a welcome message in the selected language
    if (currentTranslations) {
        let welcomeMsg;
        switch(selectedLanguage) {
            case 'en-IN':
                welcomeMsg = 'Welcome! Please select a service to continue.';
                break;
            case 'hi-IN':
                welcomeMsg = 'स्वागत है! कृपया जारी रखने के लिए एक सेवा चुनें।';
                break;
            case 'ta-IN':
                welcomeMsg = 'வரவேற்கிறோம்! தொடர ஒரு சேவையைத் தேர்ந்தெடுக்கவும்।';
                break;
            case 'te-IN':
                welcomeMsg = 'స్వాగతం! కొనసాగించడానికి దయచేసి ఒక సేవను ఎంచుకోండి।';
                break;
            case 'bn-IN':
                welcomeMsg = 'স্বাগতম! অব্যাহত রাখতে একটি সেবা নির্বাচন করুন।';
                break;
            case 'mr-IN':
                welcomeMsg = 'स्वागत! सुरू ठेवण्यासाठी कृपया एक सेवा निवडा।';
                break;
            case 'gu-IN':
                welcomeMsg = 'આપનું સ્વાગત છે! ચાલુ રાખવા માટે કૃપા કરીને એક સેવા પસંદ કરો।';
                break;
            case 'kn-IN':
                welcomeMsg = 'ಸ್ವಾಗತ! ಮುಂದುವರಿಸಲು ದಯವಿಟ್ಟು ಒಂದು ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ।';
                break;
            case 'ml-IN':
                welcomeMsg = 'സ്വാഗതം! തുടരാൻ ദയവായി ഒരു സേവനം തിരഞ്ഞെടുക്കുക।';
                break;
            case 'pa-IN':
                welcomeMsg = 'ਜੀ ਆਇਆਂ ਨੂੰ! ਜਾਰੀ ਰੱਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸੇਵਾ ਚੁਣੋ।';
                break;
            case 'or-IN':
                welcomeMsg = 'ସ୍ୱାଗତ! ଜାରି ରଖିବା ପାଇଁ ଦୟାକରି ଏକ ସେବା ବାଛନ୍ତୁ।';
                break;
            default:
                welcomeMsg = 'स्वागत है! कृपया जारी रखने के लिए एक सेवा चुनें।';
        }
        speakText(welcomeMsg);
    }
}

function updateUILanguage() {
    const t = currentTranslations;
    
    // Update common UI elements
    const elements = {
        'appTitle': t.appTitle,
        'loginBtn': t.login,
        'registerBtn': t.register,
        'voiceText': t.voiceHelper
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
    
    // Update hero section
    updateHeroSection();
    
    // Update service cards
    updateServiceCards();
    
    // Update form labels and placeholders
    updateFormElements();
    
    // Update button texts
    updateButtonTexts();
}

function updateHeroSection() {
    const t = currentTranslations;
    
    // Update hero section content based on language
    const heroContent = {
        'hi-IN': {
            title: 'सरकारी सेवाएं सरल बनाईं',
            subtitle: 'AI सहायता के साथ सरकारी सेवाओं के लिए आवेदन करें। तेज़, सुरक्षित और उपयोगकर्ता-अनुकूल।',
            button: '<i class="fas fa-rocket"></i> शुरू करें'
        },
        'en-IN': {
            title: 'Government Services Made Simple',
            subtitle: 'Apply for government services with AI assistance. Fast, secure, and user-friendly.',
            button: '<i class="fas fa-rocket"></i> Get Started'
        },
        'bn-IN': {
            title: 'সরকারি সেবা সহজ করা হয়েছে',
            subtitle: 'AI সহায়তায় সরকারি সেবার জন্য আবেদন করুন। দ্রুত, নিরাপদ এবং ব্যবহারকারী-বান্ধব।',
            button: '<i class="fas fa-rocket"></i> শুরু করুন'
        },
        'ta-IN': {
            title: 'அரசு சேவைகள் எளிதாக்கப்பட்டன',
            subtitle: 'AI உதவியுடன் அரசு சேவைகளுக்கு விண்ணப்பிக்கவும். வேகமான, பாதுகாப்பான மற்றும் பயனர் நட்பு.',
            button: '<i class="fas fa-rocket"></i> தொடங்கவும்'
        }
    };
    
    const content = heroContent[selectedLanguage] || heroContent['hi-IN'];
    
    // Update hero section elements
    const heroTitle = document.querySelector('.hero-section h1');
    const heroSubtitle = document.querySelector('.hero-section p');
    const heroButton = document.querySelector('.hero-section button');
    
    if (heroTitle) heroTitle.textContent = content.title;
    if (heroSubtitle) heroSubtitle.textContent = content.subtitle;
    if (heroButton) heroButton.innerHTML = content.button;
}

function updateServiceCards() {
    const t = currentTranslations;
    
    // Define service content for each language
    const serviceContent = {
        'hi-IN': {
            passport: {
                title: 'पासपोर्ट सेवाएं',
                description: 'नया पासपोर्ट, नवीनीकरण या पता बदलने के लिए आवेदन करें',
                button: 'अभी आवेदन करें',
                info: 'अधिक जानकारी'
            },
            aadhaar: {
                title: 'आधार सेवाएं',
                description: 'आधार विवरण अपडेट करें, ई-आधार डाउनलोड करें या स्थिति देखें',
                button: 'अभी आवेदन करें',
                info: 'अधिक जानकारी'
            },
            pan: {
                title: 'पैन कार्ड सेवाएं',
                description: 'नया पैन कार्ड आवेदन, सुधार या डुप्लिकेट के लिए आवेदन करें',
                button: 'अभी आवेदन करें',
                info: 'अधिक जानकारी'
            },
            'driving-license': {
                title: 'ड्राइविंग लाइसेंस',
                description: 'ड्राइविंग लाइसेंस आवेदन, नवीनीकरण या डुप्लिकेट के लिए आवेदन करें',
                button: 'अभी आवेदन करें',
                info: 'अधिक जानकारी'
            },
            itr: {
                title: 'आयकर रिटर्न',
                description: 'आयकर रिटर्न भरें, टैक्स गणना करें और रिफंड की जांच करें',
                button: 'अभी आवेदन करें',
                info: 'अधिक जानकारी'
            },
            scanner: {
                title: 'दस्तावेज़ स्कैनर',
                description: 'दस्तावेज़ स्कैन करें और फॉर्म भरने के लिए जानकारी निकालें',
                button: 'स्कैन करें',
                info: 'अधिक जानकारी'
            }
        },
        'en-IN': {
            passport: {
                title: 'Passport Services',
                description: 'Apply for new passport, renewal, or address change',
                button: 'Apply Now',
                info: 'More Info'
            },
            aadhaar: {
                title: 'Aadhaar Services',
                description: 'Update Aadhaar details, download e-Aadhaar, or check status',
                button: 'Apply Now',
                info: 'More Info'
            },
            pan: {
                title: 'PAN Card Services',
                description: 'Apply for new PAN card, correction, or duplicate',
                button: 'Apply Now',
                info: 'More Info'
            },
            'driving-license': {
                title: 'Driving License',
                description: 'Apply for driving license, renewal, or duplicate',
                button: 'Apply Now',
                info: 'More Info'
            },
            itr: {
                title: 'ITR Filing',
                description: 'File income tax return, calculate tax, and check refund',
                button: 'Apply Now',
                info: 'More Info'
            },
            scanner: {
                title: 'Document Scanner',
                description: 'Scan documents and extract information for form filling',
                button: 'Scan Now',
                info: 'More Info'
            }
        },
        'bn-IN': {
            passport: {
                title: 'পাসপোর্ট সেবা',
                description: 'নতুন পাসপোর্ট, নবায়ন বা ঠিকানা পরিবর্তনের জন্য আবেদন করুন',
                button: 'এখনই আবেদন করুন',
                info: 'আরও তথ্য'
            },
            aadhaar: {
                title: 'আধার সেবা',
                description: 'আধার বিবরণ আপডেট করুন, ই-আধার ডাউনলোড করুন বা স্থিতি দেখুন',
                button: 'এখনই আবেদন করুন',
                info: 'আরও তথ্য'
            },
            pan: {
                title: 'প্যান কার্ড সেবা',
                description: 'নতুন প্যান কার্ড, সংশোধন বা ডুপ্লিকেটের জন্য আবেদন করুন',
                button: 'এখনই আবেদন করুন',
                info: 'আরও তথ্য'
            },
            'driving-license': {
                title: 'ড্রাইভিং লাইসেন্স',
                description: 'ড্রাইভিং লাইসেন্স, নবায়ন বা ডুপ্লিকেটের জন্য আবেদন করুন',
                button: 'এখনই আবেদন করুন',
                info: 'আরও তথ্য'
            },
            itr: {
                title: 'আয়কর রিটার্ন',
                description: 'আয়কর রিটার্ন দাখিল করুন, কর গণনা করুন এবং রিফান্ড চেক করুন',
                button: 'এখনই আবেদন করুন',
                info: 'আরও তথ্য'
            },
            scanner: {
                title: 'ডকুমেন্ট স্ক্যানার',
                description: 'নথি স্ক্যান করুন এবং ফর্ম পূরণের জন্য তথ্য নিষ্কাশন করুন',
                button: 'এখনই স্ক্যান করুন',
                info: 'আরও তথ্য'
            }
        },
        'ta-IN': {
            passport: {
                title: 'பாஸ்போர்ட் சேவைகள்',
                description: 'புதிய பாஸ்போர்ட், புதுப்பித்தல் அல்லது முகவரி மாற்றத்திற்கு விண்ணப்பிக்கவும்',
                button: 'இப்போது விண்ணப்பிக்கவும்',
                info: 'மேலும் தகவல்'
            },
            aadhaar: {
                title: 'ஆதார் சேவைகள்',
                description: 'ஆதார் விவரங்களை புதுப்பிக்கவும், ஈ-ஆதாரை பதிவிறக்கவும் அல்லது நிலையை பார்க்கவும்',
                button: 'இப்போது விண்ணப்பிக்கவும்',
                info: 'மேலும் தகவல்'
            },
            pan: {
                title: 'பான் கார்டு சேவைகள்',
                description: 'புதிய பான் கார்டு, திருத்தம் அல்லது நகலுக்கு விண்ணப்பிக்கவும்',
                button: 'இப்போது விண்ணப்பிக்கவும்',
                info: 'மேலும் தகவல்'
            },
            'driving-license': {
                title: 'ஓட்டுநர் உரிமம்',
                description: 'ஓட்டுநர் உரிமம், புதுப்பித்தல் அல்லது நகலுக்கு விண்ணப்பிக்கவும்',
                button: 'இப்போது விண்ணப்பிக்கவும்',
                info: 'மேலும் தகவல்'
            },
            itr: {
                title: 'வருமான வரி ரிட்டர்ன்',
                description: 'வருமான வரி ரிட்டர்ன் தாக்கல் செய்யவும், வரி கணக்கிடவும் மற்றும் திரும்ப பணம் சரிபார்க்கவும்',
                button: 'இப்போது விண்ணப்பிக்கவும்',
                info: 'மேலும் தகவல்'
            },
            scanner: {
                title: 'ஆவண ஸ்கேனர்',
                description: 'ஆவணங்களை ஸ்கேன் செய்து படிவம் நிரப்புவதற்கான தகவலை பிரித்தெடுக்கவும்',
                button: 'இப்போது ஸ்கேன் செய்யவும்',
                info: 'மேலும் தகவல்'
            }
        }
    };
    
    const content = serviceContent[selectedLanguage] || serviceContent['hi-IN'];
    
    // Update service cards
    Object.keys(content).forEach(serviceKey => {
        const serviceCard = document.querySelector(`[onclick="startService('${serviceKey}')"]`);
        if (serviceCard) {
            const cardContainer = serviceCard.closest('.service-card');
            if (cardContainer) {
                const titleElement = cardContainer.querySelector('h4');
                const descElement = cardContainer.querySelector('p');
                const buttonElement = cardContainer.querySelector('button[onclick^="startService"]');
                const infoButton = cardContainer.querySelector('button[onclick^="showServiceInfo"]');
                
                if (titleElement) {
                    // Keep the speaker icon and update text
                    const speakerIcon = titleElement.querySelector('.fa-volume-up');
                    if (speakerIcon) {
                        titleElement.innerHTML = '';
                        titleElement.appendChild(speakerIcon);
                        titleElement.innerHTML += content[serviceKey].title;
                    } else {
                        titleElement.textContent = content[serviceKey].title;
                    }
                }
                if (descElement) descElement.textContent = content[serviceKey].description;
                if (buttonElement) buttonElement.innerHTML = `<i class="fas fa-arrow-right me-2"></i>${content[serviceKey].button}`;
                if (infoButton) infoButton.innerHTML = `<i class="fas fa-info-circle me-2"></i>${content[serviceKey].info}`;
            }
        }
    });
}

function updateFormElements() {
    const t = currentTranslations;
    
    // Update form labels and placeholders
    const formMappings = {
        'loginEmail': { label: t.email, placeholder: t.email },
        'loginPassword': { label: t.password, placeholder: t.password },
        'registerName': { label: t.fullName, placeholder: t.fullName },
        'registerEmail': { label: t.email, placeholder: t.email },
        'registerPhone': { label: t.phoneNumber, placeholder: t.phoneNumber },
        'registerPassword': { label: t.password, placeholder: t.password }
    };
    
    Object.keys(formMappings).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const label = document.querySelector(`label[for="${fieldId}"]`);
        
        if (field && formMappings[fieldId].placeholder) {
            field.placeholder = formMappings[fieldId].placeholder;
        }
        if (label && formMappings[fieldId].label) {
            label.textContent = formMappings[fieldId].label;
        }
    });
}

function updateButtonTexts() {
    const t = currentTranslations;
    
    // Update navigation buttons
    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
        nextBtn.innerHTML = `${t.next} <i class="fas fa-arrow-right ms-2"></i>`;
    }
    
    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
        prevBtn.innerHTML = `<i class="fas fa-arrow-left me-2"></i>${t.previous}`;
    }
    
    const submitBtn = document.getElementById('submitApplication');
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fas fa-paper-plane me-2"></i>${t.submit}`;
    }
    
    const skipBtn = document.getElementById('skipQuestion');
    if (skipBtn) {
        skipBtn.textContent = t.skip;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkBackendStatus();
    setupEventListeners();
    startLiveStatusMonitoring();
    // Don't show language selector by default - show it when "Get Started" is clicked
});

// Check backend status
async function checkBackendStatus() {
    const statusIndicator = document.getElementById('backendStatus');
    const statusText = document.getElementById('statusText');
    
    // Add checking state
    if (statusIndicator) {
        statusIndicator.className = 'status-indicator status-checking';
    }
    if (statusText) {
        statusText.textContent = 'Checking...';
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (response.ok) {
            const healthData = await response.json();
            statusIndicator.className = 'status-indicator status-online';
            if (statusText) {
                statusText.textContent = 'Backend Online';
            }
            console.log('Backend is online:', healthData);
        } else {
            statusIndicator.className = 'status-indicator status-offline';
            if (statusText) {
                statusText.textContent = 'Backend Offline';
            }
            console.log('Backend returned non-OK status:', response.status);
        }
    } catch (error) {
        statusIndicator.className = 'status-indicator status-offline';
        if (statusText) {
            statusText.textContent = 'Backend Offline';
        }
        console.log('Backend is offline:', error.message);
    }
}

// Live status monitoring
let statusCheckInterval = null;

function startLiveStatusMonitoring() {
    // Check status every 10 seconds
    statusCheckInterval = setInterval(() => {
        checkBackendStatus();
    }, 10000);
    
    console.log('Live status monitoring started - checking every 10 seconds');
    
    // Also add visibility change handler to check when tab becomes active
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('Tab became visible, checking backend status');
            checkBackendStatus();
        }
    });
}

function stopLiveStatusMonitoring() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
        console.log('Live status monitoring stopped');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Application form
    document.getElementById('applicationFormElement').addEventListener('submit', handleApplication);
    
    // Status click handler for manual refresh
    const statusText = document.getElementById('statusText');
    if (statusText) {
        statusText.addEventListener('click', function() {
            console.log('Manual status check requested');
            checkBackendStatus();
        });
        statusText.setAttribute('title', 'Click to refresh status');
    }
}

// Show services section
function showServices() {
    console.log('Showing services section');
    hideAllSections();
    const servicesSection = document.getElementById('servicesSection');
    if (servicesSection) {
        servicesSection.style.display = 'block';
        console.log('Services section displayed');
    } else {
        console.error('Services section not found');
    }
}

// Show login form
function showLoginForm() {
    hideAllSections();
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
}

// Show register form
function showRegisterForm() {
    hideAllSections();
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('registerForm').style.display = 'block';
}

// Hide all sections
function hideAllSections() {
    const sections = ['servicesSection', 'authForms', 'applicationForm', 'languageSelector'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            showAlert('Login successful!', 'success');
            showServices();
        } else {
            showAlert(data.message || 'Login failed', 'danger');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'danger');
        console.error('Login error:', error);
    }
}

// Handle register
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Registration successful! Please login.', 'success');
            showLoginForm();
        } else {
            showAlert(data.message || 'Registration failed', 'danger');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'danger');
        console.error('Registration error:', error);
    }
}

// Start service application with question-answer model
function startService(serviceType) {
    console.log('Starting service:', serviceType); // Debug log
    
    if (!currentUser) {
        showAlert('Please login first', 'warning');
        showLoginForm();
        return;
    }
    
    hideAllSections();
    document.getElementById('applicationForm').style.display = 'block';
    
    // Initialize for this service
    currentServiceType = serviceType;
    currentQuestionIndex = 0;
    userAnswers = {};
    
    console.log('Service type set to:', currentServiceType); // Debug log
    console.log('Question sets available:', Object.keys(questionSets)); // Debug log
    
    const questions = questionSets[serviceType] || questionSets.passport;
    totalQuestions = questions.length;
    
    console.log('Total questions:', totalQuestions); // Debug log
    console.log('Questions for service:', questions); // Debug log
    
    // Reset progress
    document.getElementById('progressBar').style.width = '0%';
    
    const titles = {
        'passport': 'पासपोर्ट आवेदन / Passport Application',
        'aadhaar': 'आधार सेवाएं / Aadhaar Services',
        'driving-license': 'ड्राइविंग लाइसेंस आवेदन / Driving License Application',
        'pan': 'पैन कार्ड आवेदन / PAN Card Application',
        'itr': 'आयकर रिटर्न / ITR Filing',
        'scanner': 'दस्तावेज़ स्कैनर / Document Scanner'
    };
    
    document.getElementById('applicationTitle').textContent = titles[serviceType] || 'Application Form';
    
    // Show summary section hidden and question container visible
    document.getElementById('summarySection').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('answerContainer').style.display = 'block';
    
    // Show first question
    showCurrentQuestion();
    
    // Voice welcome message
    if (isVoiceAssistantActive) {
        setTimeout(() => {
            speakText(`Welcome! Let's start with some simple questions for ${titles[serviceType]}.`);
            setTimeout(() => readQuestion(), 2000);
        }, 1000);
    }
    
    console.log('Service initialization complete'); // Debug log
}

// Show current question
function showCurrentQuestion() {
    console.log('showCurrentQuestion called'); // Debug log
    
    const questions = questionSets[currentServiceType] || questionSets.passport;
    const question = questions[currentQuestionIndex];
    
    console.log('Questions array:', questions); // Debug log
    console.log('Question to show:', question); // Debug log
    
    if (!question) {
        console.error('No question to show at index:', currentQuestionIndex);
        return;
    }
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Update counter based on selected language
    const counterText = getLocalizedCounterText(currentQuestionIndex + 1, totalQuestions);
    document.getElementById('questionCounter').textContent = counterText;
    
    // Update question content based on selected language
    document.getElementById('questionIcon').className = `${question.icon} fa-4x text-primary`;
    
    const questionDisplay = getLocalizedQuestionDisplay(question);
    document.getElementById('questionText').innerHTML = questionDisplay.text;
    document.getElementById('questionHint').textContent = questionDisplay.hint;
    
    // Show appropriate input type
    hideAllInputs();
    
    if (question.type === 'text') {
        showTextInput(question);
    } else if (question.type === 'choice') {
        showChoiceInput(question);
    } else if (question.type === 'date') {
        showDateInput(question);
    } else if (question.type === 'document') {
        showDocumentInput(question);
    }
    
    // Update navigation buttons
    updateQuestionNavigation();
    
    // Populate existing answer if available
    const existingAnswer = userAnswers[question.id];
    console.log('Existing answer for', question.id, ':', existingAnswer); // Debug log
    if (existingAnswer) {
        if (question.type === 'text') {
            const textInput = document.getElementById('currentAnswer');
            if (textInput) textInput.value = existingAnswer;
        } else if (question.type === 'date') {
            const dateInput = document.getElementById('dateAnswer');
            if (dateInput) dateInput.value = existingAnswer;
        } else if (question.type === 'choice') {
            // Choice selection is handled in showChoiceInput
            console.log('Choice answer will be restored in showChoiceInput');
        }
        // Document answers are handled in showDocumentInput
    }
    
    // Show skip option for optional questions
    const skipBtn = document.getElementById('skipQuestion');
    skipBtn.style.display = question.required ? 'none' : 'block';
    if (skipBtn.style.display !== 'none') {
        skipBtn.textContent = getLocalizedText('skip');
    }
    
    console.log('Question displayed successfully'); // Debug log
}

function getLocalizedCounterText(current, total) {
    switch(selectedLanguage) {
        case 'en-IN':
            return `Question ${current} of ${total}`;
        case 'hi-IN':
            return `प्रश्न ${current} / Question ${current} of ${total}`;
        case 'bn-IN':
            return `প্রশ্ন ${current} / Question ${current} of ${total}`;
        case 'ta-IN':
            return `கேள்வி ${current} / Question ${current} of ${total}`;
        default:
            return `प्रश्न ${current} / Question ${current} of ${total}`;
    }
}

function getLocalizedQuestionDisplay(question) {
    // For now, we'll show both languages. In the future, we can create 
    // language-specific question sets
    switch(selectedLanguage) {
        case 'en-IN':
            return {
                text: `${question.questionEn || question.question}<br><small class="text-muted">${question.question}</small>`,
                hint: question.hintEn || question.hint
            };
        case 'hi-IN':
            return {
                text: `${question.question}<br><small class="text-muted">${question.questionEn || question.question}</small>`,
                hint: question.hint
            };
        case 'bn-IN':
        case 'ta-IN':
            // For regional languages, show English primary and Hindi secondary for now
            return {
                text: `${question.questionEn || question.question}<br><small class="text-muted">${question.question}</small>`,
                hint: question.hintEn || question.hint
            };
        default:
            return {
                text: `${question.question}<br><small class="text-muted">${question.questionEn || question.question}</small>`,
                hint: question.hint
            };
    }
}

function getLocalizedText(key) {
    const t = currentTranslations;
    return t[key] || key;
}

// Update navigation buttons visibility
function updateQuestionNavigation() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const submitBtn = document.getElementById('submitApplication');
    
    // Show/hide previous button
    if (currentQuestionIndex > 0) {
        prevBtn.style.display = 'inline-block';
    } else {
        prevBtn.style.display = 'none';
    }
    
    // Show/hide next/submit button
    if (currentQuestionIndex < totalQuestions - 1) {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    }
}

// Hide all input types
function hideAllInputs() {
    document.getElementById('textInput').style.display = 'none';
    document.getElementById('choiceInput').style.display = 'none';
    document.getElementById('dateInput').style.display = 'none';
    document.getElementById('documentInput').style.display = 'none';
}

// Show text input
function showTextInput(question) {
    document.getElementById('textInput').style.display = 'block';
    const input = document.getElementById('currentAnswer');
    input.value = userAnswers[question.id] || '';
    input.placeholder = question.hint;
    
    // Add Enter key support
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('Enter key pressed in text input');
            e.preventDefault();
            nextQuestion();
        }
    });
    
    input.focus();
}

// Show choice input
function showChoiceInput(question) {
    document.getElementById('choiceInput').style.display = 'block';
    const container = document.getElementById('choiceButtons');
    container.innerHTML = '';
    
    question.choices.forEach(choice => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-2';
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-primary choice-btn w-100';
        
        // Handle both object format {text: '', value: ''} and string format
        let choiceText, choiceValue;
        if (typeof choice === 'string') {
            choiceText = choice;
            choiceValue = choice;
        } else {
            choiceText = choice.text;
            choiceValue = choice.value;
        }
        
        button.textContent = choiceText;
        button.onclick = () => selectChoice(choiceValue, question.id);
        
        if (userAnswers[question.id] === choiceValue) {
            button.classList.add('selected');
        }
        
        col.appendChild(button);
        container.appendChild(col);
    });
}

// Show date input
function showDateInput(question) {
    document.getElementById('dateInput').style.display = 'block';
    const input = document.getElementById('dateAnswer');
    input.value = userAnswers[question.id] || '';
    input.focus();
}

// Show document input
function showDocumentInput(question) {
    document.getElementById('documentInput').style.display = 'block';
    const uploadCard = document.querySelector('.document-upload-card');
    
    if (userAnswers[question.id]) {
        uploadCard.innerHTML = `
            <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
            <h5>फाइल अपलोड हो गई / File Uploaded</h5>
            <p class="text-success">${userAnswers[question.id].name || 'Document uploaded'}</p>
        `;
        uploadCard.classList.add('document-uploaded');
    } else {
        uploadCard.innerHTML = `
            <i class="fas fa-camera fa-4x text-muted mb-3"></i>
            <h5>फोटो खींचें या फाइल चुनें</h5>
            <p class="text-muted">Take Photo or Choose File</p>
        `;
        uploadCard.classList.remove('document-uploaded');
    }
}

// Select choice
function selectChoice(value, questionId) {
    console.log('Choice selected:', value, 'for question:', questionId); // Debug log
    userAnswers[questionId] = value;
    
    // Update button styles
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    console.log('User answers now:', userAnswers); // Debug log
    
    // Voice feedback
    if (isVoiceAssistantActive) {
        speakText('चुना गया / Selected: ' + event.target.textContent);
    }
}

// Next question
function nextQuestion() {
    console.log('=== NEXT QUESTION FUNCTION CALLED ==='); // Basic test
    console.log('Next question clicked for service:', currentServiceType); // Debug log
    
    // Very basic check first
    if (!currentServiceType) {
        console.error('ERROR: currentServiceType is not set!');
        alert('Error: No service selected');
        return;
    }
    
    const questions = questionSets[currentServiceType] || questionSets.passport;
    const currentQuestion = questions[currentQuestionIndex];
    
    console.log('Questions available:', questions.length); // Debug log
    console.log('Current question index:', currentQuestionIndex); // Debug log
    console.log('Current question:', currentQuestion); // Debug log
    
    if (!currentQuestion) {
        console.error('No current question found at index:', currentQuestionIndex);
        console.error('Available questions:', questions.length);
        showAlert('Error: No question found', 'error');
        return;
    }
    
    // Get current answer
    let answer = null;
    if (currentQuestion.type === 'text') {
        const textInput = document.getElementById('currentAnswer');
        answer = textInput ? textInput.value.trim() : '';
        console.log('Text input element:', textInput, 'Value:', answer);
    } else if (currentQuestion.type === 'date') {
        const dateInput = document.getElementById('dateAnswer');
        answer = dateInput ? dateInput.value : '';
        console.log('Date input element:', dateInput, 'Value:', answer);
    } else if (currentQuestion.type === 'choice') {
        answer = userAnswers[currentQuestion.id];
        console.log('Choice answer from userAnswers:', answer);
    } else if (currentQuestion.type === 'document') {
        answer = userAnswers[currentQuestion.id];
        console.log('Document answer from userAnswers:', answer);
    }
    
    console.log('Current answer:', answer); // Debug log
    
    // Validate required fields
    if (currentQuestion.required && (!answer || answer === '')) {
        showAlert('कृपया इस प्रश्न का उत्तर दें / Please answer this question', 'warning');
        if (isVoiceAssistantActive) {
            speakText('कृपया इस प्रश्न का उत्तर दें');
        }
        return;
    }
    
    // Save answer
    if (answer) {
        userAnswers[currentQuestion.id] = answer;
        console.log('Answer saved:', currentQuestion.id, answer); // Debug log
    }
    
    // Move to next question or finish
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        console.log('Moving to question:', currentQuestionIndex); // Debug log
        showCurrentQuestion();
        
        if (isVoiceAssistantActive) {
            setTimeout(() => readQuestion(), 500);
        }
    } else {
        console.log('Showing summary'); // Debug log
        showSummary();
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showCurrentQuestion();
        
        if (isVoiceAssistantActive) {
            setTimeout(() => readQuestion(), 500);
        }
    }
}

// Skip question
function skipQuestion() {
    const questions = questionSets[currentServiceType] || questionSets.passport;
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion.required) {
        nextQuestion();
    }
}

// Update navigation buttons
function updateQuestionNavigation() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const submitBtn = document.getElementById('submitApplication');
    
    prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    
    if (currentQuestionIndex === totalQuestions - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Show summary
function showSummary() {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('answerContainer').style.display = 'none';
    document.getElementById('summarySection').style.display = 'block';
    
    let summaryHtml = '<div class="row">';
    const questions = questionSets[currentServiceType] || questionSets.passport;
    
    questions.forEach(question => {
        const answer = userAnswers[question.id];
        if (answer && answer !== '') {
            summaryHtml += `
                <div class="col-md-6 mb-2">
                    <strong>${question.question}:</strong><br>
                    <span class="text-muted">${answer.name ? answer.name : answer}</span>
                </div>
            `;
        }
    });
    
    summaryHtml += '</div>';
    document.getElementById('summaryContent').innerHTML = summaryHtml;
    
    // Update navigation
    document.getElementById('prevQuestion').style.display = 'inline-block';
    document.getElementById('nextQuestion').style.display = 'none';
    document.getElementById('submitApplication').style.display = 'inline-block';
    
    if (isVoiceAssistantActive) {
        speakText('सभी प्रश्न पूरे हो गए। कृपया अपनी जानकारी की जांच करें।');
    }
}

// Read current question
function readQuestion() {
    const questions = questionSets[currentServiceType] || questionSets.passport;
    const question = questions[currentQuestionIndex];
    
    if (question) {
        const text = `${question.question}. ${question.hint}`;
        speakText(text, 'hi-IN');
    }
}

// Voice answer input
function startVoiceAnswer() {
    if (!recognition) {
        showAlert('Voice input not supported', 'warning');
        return;
    }
    
    const input = document.getElementById('currentAnswer');
    input.classList.add('listening');
    
    recognition.onstart = () => {
        input.placeholder = 'सुन रहे हैं... / Listening...';
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        input.classList.remove('listening');
        showAlert('आवाज़ पकड़ ली गई / Voice captured', 'success');
    };
    
    recognition.onerror = () => {
        input.classList.remove('listening');
        showAlert('आवाज़ समझ नहीं आई / Voice not understood', 'error');
    };
    
    recognition.onend = () => {
        input.classList.remove('listening');
        input.placeholder = 'यहाँ टाइप करें / Type here';
    };
    
    recognition.start();
}

// Document upload functions
function triggerDocumentUpload() {
    document.getElementById('documentAnswer').click();
}

function handleDocumentAnswer(input) {
    const file = input.files[0];
    if (file) {
        const questions = questionSets[currentServiceType] || questionSets.passport;
        const currentQuestion = questions[currentQuestionIndex];
        
        userAnswers[currentQuestion.id] = file;
        showDocumentInput(currentQuestion);
        
        if (isVoiceAssistantActive) {
            speakText('दस्तावेज़ अपलोड हो गया / Document uploaded');
        }
    }
}

// Handle application submission
async function handleApplication(event) {
    event.preventDefault();
    
    const serviceType = event.target.dataset.serviceType;
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        address: document.getElementById('address').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        serviceType: serviceType
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/applications/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Application submitted successfully!', 'success');
            showServices();
        } else {
            showAlert(data.message || 'Application submission failed', 'danger');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'danger');
        console.error('Application error:', error);
    }
}

// Show alert message
function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Utility function to make authenticated requests
async function authenticatedRequest(url, options = {}) {
    if (!authToken) {
        throw new Error('No authentication token');
    }
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    const response = await fetch(url, finalOptions);
    
    if (response.status === 401) {
        // Token expired or invalid
        authToken = null;
        currentUser = null;
        showAlert('Session expired. Please login again.', 'warning');
        showLoginForm();
        throw new Error('Authentication failed');
    }
    
    return response;
}

// Logout function
function logout() {
    authToken = null;
    currentUser = null;
    showAlert('Logged out successfully', 'info');
    showServices();
}

// Fill developer credentials for easy testing
function fillDeveloperCredentials() {
    document.getElementById('loginEmail').value = 'developer@applyai.com';
    document.getElementById('loginPassword').value = 'dev123456';
    
    // Add visual feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Filled!';
    button.className = 'btn btn-success btn-sm mb-2';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.className = 'btn btn-outline-success btn-sm mb-2';
    }, 1500);
}

// Question-Answer Model for Simple UI
// Variables already declared at the top of the file

// Initialize speech recognition if supported
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage || 'hi-IN'; // Use selected language or default to Hindi
}

// Question sets based on filing requirements
questionSets = {
    passport: [
        {
            id: 'fullName',
            icon: 'fas fa-user',
            question: 'आपका पूरा नाम क्या है?',
            questionEn: 'What is your full name?',
            hint: 'जैसे: राजेश कुमार शर्मा / e.g: Rajesh Kumar Sharma',
            type: 'text',
            required: true
        },
        {
            id: 'gender',
            icon: 'fas fa-venus-mars',
            question: 'आप पुरुष हैं या महिला?',
            questionEn: 'Are you male or female?',
            hint: 'अपना लिंग चुनें / Select your gender',
            type: 'choice',
            choices: [
                { value: 'male', text: 'पुरुष / Male' },
                { value: 'female', text: 'महिला / Female' },
                { value: 'other', text: 'अन्य / Other' }
            ],
            required: true
        },
        {
            id: 'dateOfBirth',
            icon: 'fas fa-calendar',
            question: 'आपकी जन्म तिथि क्या है?',
            questionEn: 'What is your date of birth?',
            hint: 'अपनी जन्म तिथि चुनें / Select your birth date',
            type: 'date',
            required: true
        },
        {
            id: 'placeOfBirth',
            icon: 'fas fa-map-marker-alt',
            question: 'आप कहाँ पैदा हुए थे?',
            questionEn: 'Where were you born?',
            hint: 'गाँव/शहर, जिला, राज्य / Village/City, District, State',
            type: 'text',
            required: true
        },
        {
            id: 'fatherName',
            icon: 'fas fa-male',
            question: 'आपके पिता का नाम क्या है?',
            questionEn: 'What is your father\'s name?',
            hint: 'जैसे: श्री राम प्रकाश शर्मा / e.g: Shri Ram Prakash Sharma',
            type: 'text',
            required: true
        },
        {
            id: 'motherName',
            icon: 'fas fa-female',
            question: 'आपकी माता का नाम क्या है?',
            questionEn: 'What is your mother\'s name?',
            hint: 'जैसे: श्रीमती सुनीता शर्मा / e.g: Smt. Sunita Sharma',
            type: 'text',
            required: true
        },
        {
            id: 'mobile',
            icon: 'fas fa-mobile-alt',
            question: 'आपका मोबाइल नंबर क्या है?',
            questionEn: 'What is your mobile number?',
            hint: 'जैसे: 9876543210 / e.g: 9876543210',
            type: 'text',
            required: true
        },
        {
            id: 'email',
            icon: 'fas fa-envelope',
            question: 'आपका ईमेल पता क्या है?',
            questionEn: 'What is your email address?',
            hint: 'वैकल्पिक / Optional - जैसे: name@example.com',
            type: 'text',
            required: false
        },
        {
            id: 'address',
            icon: 'fas fa-home',
            question: 'आपका पूरा पता क्या है?',
            questionEn: 'What is your complete address?',
            hint: 'घर संख्या, गली, मोहल्ला, शहर, राज्य, पिनकोड / House No, Street, Area, City, State, PIN',
            type: 'text',
            required: true
        },
        {
            id: 'identityProof',
            icon: 'fas fa-id-card',
            question: 'कृपया अपना पहचान प्रमाण अपलोड करें',
            questionEn: 'Please upload your identity proof',
            hint: 'आधार कार्ड, वोटर आईडी, या ड्राइविंग लाइसेंस / Aadhaar Card, Voter ID, or Driving License',
            type: 'document',
            required: true
        },
        {
            id: 'addressProof',
            icon: 'fas fa-file-text',
            question: 'कृपया अपना पता प्रमाण अपलोड करें',
            questionEn: 'Please upload your address proof',
            hint: 'बिजली का बिल, पानी का बिल, या बैंक स्टेटमेंट / Electricity Bill, Water Bill, or Bank Statement',
            type: 'document',
            required: true
        }
    ],
    pan: [
        {
            id: 'fullName',
            icon: 'fas fa-user',
            question: 'आपका पूरा नाम क्या है?',
            questionEn: 'What is your full name?',
            hint: 'जैसे: राजेश कुमार शर्मा / e.g: Rajesh Kumar Sharma',
            type: 'text',
            required: true
        },
        {
            id: 'fatherName',
            icon: 'fas fa-male',
            question: 'आपके पिता का नाम क्या है?',
            questionEn: 'What is your father\'s name?',
            hint: 'यह अनिवार्य है / This is mandatory',
            type: 'text',
            required: true
        },
        {
            id: 'dateOfBirth',
            icon: 'fas fa-calendar',
            question: 'आपकी जन्म तिथि क्या है?',
            questionEn: 'What is your date of birth?',
            hint: 'अपनी जन्म तिथि चुनें / Select your birth date',
            type: 'date',
            required: true
        },
        {
            id: 'gender',
            icon: 'fas fa-venus-mars',
            question: 'आप पुरुष हैं या महिला?',
            questionEn: 'Are you male or female?',
            hint: 'अपना लिंग चुनें / Select your gender',
            type: 'choice',
            choices: [
                { value: 'male', text: 'पुरुष / Male' },
                { value: 'female', text: 'महिला / Female' }
            ],
            required: true
        },
        {
            id: 'aadhaar',
            icon: 'fas fa-id-card-alt',
            question: 'आपका आधार नंबर क्या है?',
            questionEn: 'What is your Aadhaar number?',
            hint: 'यदि आपके पास है तो / If you have one - 12 अंकों का नंबर / 12 digit number',
            type: 'text',
            required: true
        },
        {
            id: 'mobile',
            icon: 'fas fa-mobile-alt',
            question: 'आपका मोबाइल नंबर क्या है?',
            questionEn: 'What is your mobile number?',
            hint: 'आधार से लिंक किया गया / Linked with Aadhaar - जैसे: 9876543210',
            type: 'text',
            required: true
        },
        {
            id: 'address',
            icon: 'fas fa-home',
            question: 'आपका संपर्क पता क्या है?',
            questionEn: 'What is your communication address?',
            hint: 'पूरा पता पिनकोड के साथ / Complete address with PIN code',
            type: 'text',
            required: true
        }
    ],
    aadhaar: [
        {
            id: 'aadhaarNumber',
            icon: 'fas fa-id-card-alt',
            question: 'आपका आधार नंबर क्या है?',
            questionEn: 'What is your Aadhaar number?',
            hint: '12 अंकों का आधार नंबर / 12 digit Aadhaar number',
            type: 'text',
            required: true
        },
        {
            id: 'updateType',
            icon: 'fas fa-edit',
            question: 'आप क्या अपडेट करना चाहते हैं?',
            questionEn: 'What do you want to update?',
            hint: 'अपडेट का प्रकार चुनें / Select update type',
            type: 'choice',
            choices: [
                { value: 'biometric', text: 'बायोमेट्रिक / Biometric (Photo/Fingerprint)' },
                { value: 'demographic', text: 'व्यक्तिगत जानकारी / Personal Information' },
                { value: 'address', text: 'पता / Address' },
                { value: 'mobile', text: 'मोबाइल नंबर / Mobile Number' }
            ],
            required: true
        },
        {
            id: 'mobile',
            icon: 'fas fa-mobile-alt',
            question: 'आपका नया मोबाइल नंबर क्या है?',
            questionEn: 'What is your new mobile number?',
            hint: 'यदि मोबाइल अपडेट कर रहे हैं / If updating mobile - जैसे: 9876543210',
            type: 'text',
            required: false
        }
    ],
    itr: [
        // Basic Information
        {
            id: 'panNumber',
            icon: 'fas fa-credit-card',
            question: 'आपका पैन नंबर क्या है?',
            questionEn: 'What is your PAN number?',
            hint: 'जैसे: ABCDE1234F / e.g: ABCDE1234F',
            type: 'text',
            required: true
        },
        {
            id: 'aadhaarNumber',
            icon: 'fas fa-id-card-alt',
            question: 'आपका आधार नंबर क्या है?',
            questionEn: 'What is your Aadhaar number?',
            hint: 'पैन से लिंक किया गया / Linked with PAN - 12 अंकों का नंबर',
            type: 'text',
            required: true
        },
        {
            id: 'fullName',
            icon: 'fas fa-user',
            question: 'आपका पूरा नाम क्या है?',
            questionEn: 'What is your full name?',
            hint: 'जैसा कि पैन कार्ड में है / As per PAN card',
            type: 'text',
            required: true
        },
        {
            id: 'dateOfBirth',
            icon: 'fas fa-calendar',
            question: 'आपकी जन्म तिथि क्या है?',
            questionEn: 'What is your date of birth?',
            hint: 'DD/MM/YYYY',
            type: 'date',
            required: true
        },
        {
            id: 'mobileNumber',
            icon: 'fas fa-phone',
            question: 'आपका मोबाइल नंबर क्या है?',
            questionEn: 'What is your mobile number?',
            hint: '10 अंकों का नंबर / 10 digit number',
            type: 'text',
            required: true
        },
        {
            id: 'emailAddress',
            icon: 'fas fa-envelope',
            question: 'आपका ईमेल पता क्या है?',
            questionEn: 'What is your email address?',
            hint: 'example@email.com',
            type: 'text',
            required: true
        },
        
        // Assessment Year
        {
            id: 'assessmentYear',
            icon: 'fas fa-calendar-check',
            question: 'किस साल का ITR भर रहे हैं?',
            questionEn: 'Which assessment year ITR are you filing?',
            hint: 'मूल्यांकन वर्ष / Assessment Year',
            type: 'choice',
            choices: ['2024-25', '2023-24', '2022-23'],
            required: true
        },
        
        // Bank Details
        {
            id: 'bankAccount',
            icon: 'fas fa-university',
            question: 'आपका बैंक खाता नंबर क्या है?',
            questionEn: 'What is your bank account number?',
            hint: 'रिफंड के लिए मुख्य खाता / Primary account for refund',
            type: 'text',
            required: true
        },
        {
            id: 'ifscCode',
            icon: 'fas fa-code',
            question: 'आपके बैंक का IFSC कोड क्या है?',
            questionEn: 'What is your bank IFSC code?',
            hint: 'जैसे: SBIN0001234 / e.g: SBIN0001234',
            type: 'text',
            required: true
        },
        {
            id: 'bankName',
            icon: 'fas fa-building',
            question: 'आपके बैंक का नाम क्या है?',
            questionEn: 'What is your bank name?',
            hint: 'बैंक का पूरा नाम / Full bank name',
            type: 'text',
            required: true
        },
        
        // Employment Details
        {
            id: 'employmentType',
            icon: 'fas fa-briefcase',
            question: 'आप क्या काम करते हैं?',
            questionEn: 'What is your employment type?',
            hint: 'अपने काम का प्रकार चुनें / Select your employment type',
            type: 'choice',
            choices: ['नौकरी / Salaried', 'व्यापार / Business', 'फ्रीलांसर / Freelancer', 'सेवानिवृत्त / Retired'],
            required: true
        },
        {
            id: 'employerName',
            icon: 'fas fa-building',
            question: 'आपके नियोक्ता का नाम क्या है?',
            questionEn: 'What is your employer name?',
            hint: 'कंपनी/संगठन का नाम / Company/Organization name',
            type: 'text',
            required: false
        },
        {
            id: 'employerTAN',
            icon: 'fas fa-hashtag',
            question: 'आपके नियोक्ता का TAN नंबर क्या है?',
            questionEn: 'What is your employer TAN number?',
            hint: 'Form 16 में मिलेगा / Available in Form 16',
            type: 'text',
            required: false
        },
        
        // Salary Income
        {
            id: 'grossSalary',
            icon: 'fas fa-rupee-sign',
            question: 'आपकी कुल वार्षिक सैलरी कितनी है?',
            questionEn: 'What is your gross annual salary?',
            hint: 'रुपयों में / In Rupees - जैसे: 1200000',
            type: 'text',
            required: false
        },
        {
            id: 'hra',
            icon: 'fas fa-home',
            question: 'आपको HRA कितना मिलता है?',
            questionEn: 'What is your HRA amount?',
            hint: 'वार्षिक HRA / Annual HRA',
            type: 'text',
            required: false
        },
        {
            id: 'tdsDeducted',
            icon: 'fas fa-minus-circle',
            question: 'आपकी सैलरी से कितना TDS काटा गया है?',
            questionEn: 'How much TDS was deducted from salary?',
            hint: 'Form 16 में देखें / Check Form 16',
            type: 'text',
            required: false
        },
        
        // Other Income
        {
            id: 'bankInterest',
            icon: 'fas fa-percent',
            question: 'क्या आपको बैंक से ब्याज की आय है?',
            questionEn: 'Do you have interest income from bank?',
            hint: 'बचत खाता, FD ब्याज / Savings, FD interest',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        {
            id: 'interestAmount',
            icon: 'fas fa-coins',
            question: 'कुल ब्याज की राशि कितनी है?',
            questionEn: 'What is the total interest amount?',
            hint: 'वार्षिक ब्याज / Annual interest',
            type: 'text',
            required: false
        },
        {
            id: 'rentalIncome',
            icon: 'fas fa-home',
            question: 'क्या आपको किराए की आय है?',
            questionEn: 'Do you have rental income?',
            hint: 'मकान की संपत्ति से आय / Income from house property',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        {
            id: 'rentalAmount',
            icon: 'fas fa-money-check',
            question: 'वार्षिक किराया कितना है?',
            questionEn: 'What is the annual rental income?',
            hint: 'कुल किराया आय / Total rental income',
            type: 'text',
            required: false
        },
        {
            id: 'capitalGains',
            icon: 'fas fa-chart-line',
            question: 'क्या आपने शेयर/म्यूचुअल फंड बेचे हैं?',
            questionEn: 'Did you sell shares/mutual funds?',
            hint: 'कैपिटल गेन्स / Capital gains',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        
        // Deductions Section 80C
        {
            id: 'section80c',
            icon: 'fas fa-piggy-bank',
            question: 'क्या आपने 80C के तहत निवेश किया है?',
            questionEn: 'Do you have investments under Section 80C?',
            hint: 'LIC, PPF, ELSS, NSC आदि / LIC, PPF, ELSS, NSC etc.',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        {
            id: 'section80cAmount',
            icon: 'fas fa-calculator',
            question: '80C के तहत कुल निवेश कितना है?',
            questionEn: 'What is your total 80C investment?',
            hint: 'अधिकतम ₹1.5 लाख / Maximum ₹1.5 lakh',
            type: 'text',
            required: false
        },
        
        // Health Insurance 80D
        {
            id: 'healthInsurance',
            icon: 'fas fa-heartbeat',
            question: 'क्या आपने स्वास्थ्य बीमा प्रीमियम का भुगतान किया है?',
            questionEn: 'Do you pay health insurance premium?',
            hint: 'Section 80D कटौती / Section 80D deduction',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        {
            id: 'healthInsuranceAmount',
            icon: 'fas fa-medical-kit',
            question: 'स्वास्थ्य बीमा प्रीमियम की राशि कितनी है?',
            questionEn: 'What is your health insurance premium amount?',
            hint: 'वार्षिक प्रीमियम / Annual premium',
            type: 'text',
            required: false
        },
        
        // Home Loan Interest
        {
            id: 'homeLoan',
            icon: 'fas fa-house-damage',
            question: 'क्या आपने होम लोन का ब्याज भुगतान किया है?',
            questionEn: 'Do you pay home loan interest?',
            hint: 'Section 24(b) कटौती / Section 24(b) deduction',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        {
            id: 'homeLoanInterest',
            icon: 'fas fa-percentage',
            question: 'होम लोन ब्याज की राशि कितनी है?',
            questionEn: 'What is your home loan interest amount?',
            hint: 'वार्षिक ब्याज भुगतान / Annual interest paid',
            type: 'text',
            required: false
        },
        
        // Education Loan 80E
        {
            id: 'educationLoan',
            icon: 'fas fa-graduation-cap',
            question: 'क्या आपने शिक्षा लोन का ब्याज भुगतान किया है?',
            questionEn: 'Do you pay education loan interest?',
            hint: 'Section 80E कटौती / Section 80E deduction',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        
        // Donations 80G
        {
            id: 'donations',
            icon: 'fas fa-hand-holding-heart',
            question: 'क्या आपने दान दिया है?',
            questionEn: 'Did you make any donations?',
            hint: 'Section 80G कटौती / Section 80G deduction',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        
        // Advance Tax
        {
            id: 'advanceTax',
            icon: 'fas fa-clock',
            question: 'क्या आपने एडवांस टैक्स का भुगतान किया है?',
            questionEn: 'Did you pay advance tax?',
            hint: 'तिमाही कर भुगतान / Quarterly tax payments',
            type: 'choice',
            choices: ['हाँ / Yes', 'नहीं / No'],
            required: true
        },
        
        // Document Uploads
        {
            id: 'form16',
            icon: 'fas fa-file-upload',
            question: 'कृपया अपना Form 16 अपलोड करें',
            questionEn: 'Please upload your Form 16',
            hint: 'नौकरी करने वालों के लिए / For salaried employees',
            type: 'document',
            required: false
        },
        {
            id: 'bankStatements',
            icon: 'fas fa-file-invoice',
            question: 'कृपया बैंक स्टेटमेंट अपलोड करें',
            questionEn: 'Please upload bank statements',
            hint: 'ब्याज आय के लिए / For interest income',
            type: 'document',
            required: false
        },
        {
            id: 'investmentProofs',
            icon: 'fas fa-folder-open',
            question: 'निवेश प्रमाण अपलोड करें',
            questionEn: 'Upload investment proofs',
            hint: '80C, 80D कटौती के लिए / For 80C, 80D deductions',
            type: 'document',
            required: false
        }
    ]
};

// Text-to-Speech function with enhanced language support
function speakText(text, lang = null) {
    if (!synthesis) {
        console.log('Speech synthesis not supported');
        return;
    }
    
    synthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || selectedLanguage; // Use selected language
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Enhanced language-specific voice selection
    const availableVoices = synthesis.getVoices();
    
    // Define language priorities for voice selection
    const languagePriorities = {
        'hi-IN': ['hi-IN', 'hi', 'en-IN', 'en-US'],
        'en-IN': ['en-IN', 'en-GB', 'en-US', 'en'],
        'ta-IN': ['ta-IN', 'ta', 'hi-IN', 'en-IN'],
        'te-IN': ['te-IN', 'te', 'hi-IN', 'en-IN'],
        'bn-IN': ['bn-IN', 'bn', 'hi-IN', 'en-IN'],
        'mr-IN': ['mr-IN', 'mr', 'hi-IN', 'en-IN'],
        'gu-IN': ['gu-IN', 'gu', 'hi-IN', 'en-IN'],
        'kn-IN': ['kn-IN', 'kn', 'hi-IN', 'en-IN'],
        'ml-IN': ['ml-IN', 'ml', 'hi-IN', 'en-IN'],
        'pa-IN': ['pa-IN', 'pa', 'hi-IN', 'en-IN'],
        'or-IN': ['or-IN', 'or', 'hi-IN', 'en-IN']
    };
    
    const priorities = languagePriorities[utterance.lang] || ['en-IN', 'en-US', 'hi-IN'];
    
    // Find the best available voice
    let selectedVoice = null;
    for (const priority of priorities) {
        selectedVoice = availableVoices.find(voice => 
            voice.lang === priority || 
            (voice.lang.startsWith(priority.split('-')[0]) && voice.lang.includes('IN'))
        );
        if (selectedVoice) break;
    }
    
    // Fallback to any English voice if no regional voice found
    if (!selectedVoice) {
        selectedVoice = availableVoices.find(voice => 
            voice.lang.startsWith('en')
        );
    }
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
    } else {
        console.log('No suitable voice found, using default');
    }
    
    // Add error handling
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
    };
    
    utterance.onend = () => {
        console.log('Speech synthesis completed');
    };
    
    try {
        synthesis.speak(utterance);
    } catch (error) {
        console.error('Failed to speak text:', error);
    }
}

// Voice input for form fields
function startVoiceInput(fieldId) {
    if (!recognition) {
        showAlert('Voice input not supported in this browser', 'warning');
        return;
    }

    const field = document.getElementById(fieldId);
    if (!field) return;

    recognition.onstart = () => {
        field.placeholder = 'बोल रहे हैं... / Listening...';
        field.style.borderColor = '#28a745';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        field.value = transcript;
        field.style.borderColor = '';
        showAlert('Voice input captured successfully', 'success');
    };

    recognition.onerror = (event) => {
        field.style.borderColor = '';
        showAlert('Voice input failed. Please try again.', 'error');
    };

    recognition.onend = () => {
        field.placeholder = field.getAttribute('placeholder').replace('बोल रहे हैं... / Listening...', '');
        field.style.borderColor = '';
    };

    recognition.start();
}

// Toggle voice assistant
function toggleVoiceAssistant() {
    isVoiceAssistantActive = !isVoiceAssistantActive;
    const voiceIcon = document.getElementById('voiceIcon');
    const voiceText = document.getElementById('voiceText');
    
    if (isVoiceAssistantActive) {
        voiceIcon.className = 'fas fa-microphone-slash';
        voiceText.textContent = 'Voice Off';
        speakText('Voice assistant activated. I will help you fill the form step by step.');
    } else {
        voiceIcon.className = 'fas fa-microphone';
        voiceText.textContent = 'Voice Assistant';
        synthesis.cancel();
    }
}

// Read current step instructions
function readCurrentStep() {
    const stepTexts = {
        1: 'Step 1: Please enter your personal information including full name, gender, and date of birth.',
        2: 'Step 2: Please provide your contact details including mobile number and email address.',
        3: 'Step 3: Please enter your complete address including PIN code and state.',
        4: 'Step 4: Please upload your identity proof and address proof documents.',
        5: 'Step 5: Please review all your information and submit the application.'
    };
    
    const text = stepTexts[currentStep] || 'Please complete the current step';
    speakText(text, 'en-IN');
}

// Step navigation
function changeStep(direction) {
    if (direction === 1 && !validateCurrentStep()) {
        return;
    }

    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    
    // Update step counter
    currentStep += direction;
    
    // Show new step
    document.getElementById(`step${currentStep}`).style.display = 'block';
    
    // Update progress bar
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Update step counter display
    document.getElementById('stepCounter').textContent = `Step ${currentStep} of ${totalSteps}`;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update step description
    updateStepDescription();
    
    // Voice feedback
    if (isVoiceAssistantActive) {
        setTimeout(() => readCurrentStep(), 500);
    }
    
    // Scroll to top
    document.getElementById('applicationForm').scrollIntoView({ behavior: 'smooth' });
}

// Validate current step
function validateCurrentStep() {
    const step = document.getElementById(`step${currentStep}`);
    const requiredFields = step.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            field.style.borderColor = '#dc3545';
            showAlert(`कृपया सभी आवश्यक फ़ील्ड भरें / Please fill all required fields`, 'warning');
            
            if (isVoiceAssistantActive) {
                speakText('Please fill all required fields before proceeding');
            }
            
            setTimeout(() => {
                field.style.borderColor = '';
            }, 3000);
            
            return false;
        }
    }
    
    return true;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
    
    // Show/hide next and submit buttons
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
        populateReviewData();
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Update step description
function updateStepDescription() {
    const descriptions = {
        1: 'व्यक्तिगत विवरण भरें / Fill personal details',
        2: 'संपर्क जानकारी प्रदान करें / Provide contact information',
        3: 'अपना पूरा पता दें / Enter your complete address',
        4: 'आवश्यक दस्तावेज़ अपलोड करें / Upload required documents',
        5: 'जानकारी की समीक्षा करें / Review your information'
    };
    
    document.getElementById('stepDescription').textContent = descriptions[currentStep];
}

// Populate review data
function populateReviewData() {
    const reviewData = document.getElementById('reviewData');
    const formData = {
        'Full Name': document.getElementById('fullName').value,
        'Gender': document.getElementById('gender').value,
        'Date of Birth': document.getElementById('dateOfBirth').value,
        'Mobile': document.getElementById('mobile').value,
        'Email': document.getElementById('email').value,
        'Address': document.getElementById('address').value,
        'PIN Code': document.getElementById('pincode').value,
        'State': document.getElementById('state').value
    };
    
    let html = '<h6>Application Summary:</h6>';
    for (let [key, value] of Object.entries(formData)) {
        if (value) {
            html += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    }
    
    reviewData.innerHTML = html;
}

// Handle file upload
function triggerFileUpload(inputId) {
    document.getElementById(inputId).click();
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        const uploadArea = input.parentElement;
        uploadArea.innerHTML = `
            <i class="fas fa-check-circle fa-3x text-success mb-2"></i>
            <p class="mb-0"><strong>${file.name}</strong><br>
            <small>File uploaded successfully</small></p>
        `;
        uploadArea.style.backgroundColor = '#d4edda';
        uploadArea.style.borderColor = '#28a745';
        
        if (isVoiceAssistantActive) {
            speakText('Document uploaded successfully');
        }
    }
}

// Show service information
function showServiceInfo(serviceType) {
    const serviceInfos = {
        'passport': 'पासपोर्ट सेवाएं: नया पासपोर्ट, नवीनीकरण, या पता परिवर्तन के लिए आवेदन करें। आवश्यक दस्तावेज़: पहचान प्रमाण, पता प्रमाण, जन्म प्रमाण।',
        'aadhaar': 'आधार सेवाएं: आधार अपडेट, बायोमेट्रिक अपडेट, या नई आधार कार्ड के लिए आवेदन करें।',
        'pan': 'पैन कार्ड सेवाएं: नया पैन कार्ड, सुधार, या डुप्लिकेट पैन कार्ड के लिए आवेदन करें।',
        'driving-license': 'ड्राइविंग लाइसेंस: नया लाइसेंस, नवीनीकरण, या डुप्लिकेट लाइसेंस के लिए आवेदन करें।',
        'itr': 'आयकर रिटर्न: अपना आयकर रिटर्न भरें, टैक्स की गणना करें और रिफंड की स्थिति देखें।',
        'scanner': 'दस्तावेज़ स्कैनर: अपने दस्तावेज़ों को स्कैन करें और स्वचालित रूप से फॉर्म भरने के लिए जानकारी निकालें।'
    };
    
    const info = serviceInfos[serviceType] || 'Service information not available';
    showAlert(info, 'info');
    
    if (isVoiceAssistantActive) {
        speakText(info);
    }
}



// Add form submission prevention and button event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Prevent form submission from interfering with navigation
    const appForm = document.getElementById('applicationFormElement');
    if (appForm) {
        appForm.addEventListener('submit', function(e) {
            console.log('Form submission prevented');
            e.preventDefault();
            nextQuestion();
        });
    }
    
    // Add direct click event listener to next button as backup
    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            console.log('Next button clicked via event listener');
            e.preventDefault();
            e.stopPropagation();
            nextQuestion();
        });
    }
});

// Export functions for global access
window.showServices = showServices;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.startService = startService;
window.logout = logout;
window.fillDeveloperCredentials = fillDeveloperCredentials;
window.speakText = speakText;
window.toggleVoiceAssistant = toggleVoiceAssistant;
window.readQuestion = readQuestion;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.skipQuestion = skipQuestion;
window.startVoiceAnswer = startVoiceAnswer;
window.showServiceInfo = showServiceInfo;
window.triggerDocumentUpload = triggerDocumentUpload;
window.handleDocumentAnswer = handleDocumentAnswer;
window.selectChoice = selectChoice;
window.selectLanguage = selectLanguage;
window.showLanguageSelector = showLanguageSelector;

