// Apply AI India - Web Application JavaScript

const API_BASE_URL = 'http://localhost:3000/api';
let currentUser = null;
let authToken = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkBackendStatus();
    setupEventListeners();
});

// Check backend status
async function checkBackendStatus() {
    const statusIndicator = document.getElementById('backendStatus');
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            statusIndicator.className = 'status-indicator status-online';
            console.log('Backend is online');
        } else {
            statusIndicator.className = 'status-indicator status-offline';
            console.log('Backend is offline');
        }
    } catch (error) {
        statusIndicator.className = 'status-indicator status-offline';
        console.log('Backend is offline:', error);
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
}

// Show services section
function showServices() {
    hideAllSections();
    document.getElementById('servicesSection').style.display = 'block';
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
    document.getElementById('servicesSection').style.display = 'none';
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('applicationForm').style.display = 'none';
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
    
    // Update counter
    document.getElementById('questionCounter').textContent = 
        `प्रश्न ${currentQuestionIndex + 1} / Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    
    // Update question content
    document.getElementById('questionIcon').className = `${question.icon} fa-4x text-primary`;
    document.getElementById('questionText').innerHTML = 
        `${question.question}<br><small class="text-muted">${question.questionEn}</small>`;
    document.getElementById('questionHint').textContent = question.hint;
    
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
    if (existingAnswer) {
        if (question.type === 'text') {
            const textInput = document.getElementById('currentAnswer');
            if (textInput) textInput.value = existingAnswer;
        } else if (question.type === 'date') {
            const dateInput = document.getElementById('dateAnswer');
            if (dateInput) dateInput.value = existingAnswer;
        }
        // Choice and document answers are handled differently
    }
    
    // Show skip option for optional questions
    const skipBtn = document.getElementById('skipQuestion');
    skipBtn.style.display = question.required ? 'none' : 'block';
    
    console.log('Question displayed successfully'); // Debug log
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
        button.textContent = choice.text;
        button.onclick = () => selectChoice(choice.value, question.id);
        
        if (userAnswers[question.id] === choice.value) {
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
    userAnswers[questionId] = value;
    
    // Update button styles
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Voice feedback
    if (isVoiceAssistantActive) {
        speakText('चुना गया / Selected: ' + event.target.textContent);
    }
}

// Next question
function nextQuestion() {
    console.log('Next question clicked'); // Debug log
    
    const questions = questionSets[currentServiceType] || questionSets.passport;
    const currentQuestion = questions[currentQuestionIndex];
    
    console.log('Current question:', currentQuestion); // Debug log
    console.log('Current service type:', currentServiceType); // Debug log
    console.log('Current question index:', currentQuestionIndex); // Debug log
    
    if (!currentQuestion) {
        console.error('No current question found');
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
let currentQuestionIndex = 0;
let totalQuestions = 0;
let userAnswers = {};
let currentServiceType = '';
let isVoiceAssistantActive = false;
let recognition = null;
let synthesis = window.speechSynthesis;
let questionSets = {};

// Initialize speech recognition if supported
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN'; // Hindi (India)
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

// Text-to-Speech function
function speakText(text, lang = 'hi-IN') {
    if (synthesis) {
        synthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.8;
        utterance.pitch = 1;
        synthesis.speak(utterance);
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

