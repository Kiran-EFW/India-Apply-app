# Apply AI India - Government Services Assistant App

## Project Overview
A comprehensive voice AI-enabled mobile application designed to help Indian citizens apply for government services including passport, PAN card, Aadhaar updates, tax filing, and more through natural voice interactions.

## 🚀 Features

### Core Features
- **Voice-First Interface**: Natural voice interactions in multiple Indian languages
- **Document Intelligence**: OCR capabilities for Indian documents (Aadhaar, PAN, Passport)
- **Application Tracking**: Real-time status updates for government applications
- **Secure Document Vault**: Encrypted storage for important documents
- **Payment Processing**: Integrated Razorpay payments for application fees
- **UTR Generation**: Automated UTR generation for tax payments

### Government Services
- **Passport Services**: New application, renewal, updates
- **PAN Card Services**: New PAN, updates, reprints
- **Aadhaar Services**: Address updates, biometric appointments
- **Tax Services**: ITR filing, UTR generation, refund tracking
- **Driving License**: Applications and renewals
- **Voter ID**: Registration and updates

### AI & Voice Capabilities
- **Multilingual Support**: 12+ Indian languages
- **Voice Synthesis**: High-quality TTS with Eleven Labs
- **Contextual Understanding**: Smart conversation flow
- **Accent Recognition**: Optimized for Indian accents
- **Voice Biometrics**: Secure voice-based authentication

## 🏗️ Architecture

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL + MongoDB
- **Authentication**: JWT + Aadhaar e-KYC
- **Voice AI**: Eleven Labs integration
- **Payments**: Razorpay integration
- **Cloud**: AWS (India region)

### Frontend (React Native)
- **Framework**: React Native with TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Voice Recognition**: React Native Voice
- **Storage**: AsyncStorage + Secure Storage

## 📁 Project Structure

```
Apply AI India/
├── backend/                 # NestJS backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── documents/      # Document processing
│   │   ├── services/       # Government services
│   │   ├── elevenlabs/     # Voice synthesis
│   │   ├── ocr/           # Document OCR
│   │   ├── razorpay/      # Payment processing
│   │   └── utr/           # UTR generation
│   └── README.md
├── frontend/               # React Native app
│   └── GovServicesApp/
│       ├── src/
│       │   ├── components/ # UI components
│       │   ├── contexts/   # React contexts
│       │   ├── screens/    # App screens
│       │   ├── services/   # API services
│       │   └── types/      # TypeScript types
│       └── README.md
├── docs/                   # Documentation
├── DEVELOPMENT_PLAN.md     # Development roadmap
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- React Native development environment
- Android Studio / Xcode

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Configure environment variables
npm run start:dev
```

### Frontend Setup
```bash
cd frontend/GovServicesApp
npm install
# Configure environment variables
npm run android  # or npm run ios
```

### Environment Variables
Copy `backend/env.example` to `backend/.env` and configure:
- Database credentials
- JWT secret
- Eleven Labs API key
- Razorpay credentials
- AWS credentials

## 🚀 Development Phases

### Phase 1: Foundation (4-6 weeks) ✅
- [x] Project structure setup
- [x] Authentication system
- [x] Basic voice recognition
- [x] Eleven Labs integration

### Phase 2: MVP Services (8-10 weeks) 🔄
- [x] Passport application flow
- [x] PAN card service
- [x] Document OCR pipeline
- [x] Payment integration
- [x] UTR generation
- [x] Application tracking system
- [x] Tax filing interface
- [x] Aadhaar appointment booking
- [x] Notifications system

### Phase 3: AI Enhancement (6-8 weeks) 📋
- [ ] Multilingual NLP models
- [ ] Contextual conversations
- [ ] Document intelligence
- [ ] Predictive assistance

### Phase 4: Service Expansion (8-10 weeks) 📋
- [ ] Aadhaar services
- [ ] Tax filing
- [ ] Family management
- [ ] Biometric appointments

### Phase 5: Advanced Features (6-8 weeks) 📋
- [ ] Offline capabilities
- [ ] Accessibility features
- [ ] Analytics dashboard
- [ ] Grievance redressal

### Phase 6: Scaling & Optimization (4-6 weeks) 📋
- [ ] Load testing
- [ ] Security audit
- [ ] Compliance certification
- [ ] Beta testing

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Voice AI
- `POST /elevenlabs/text-to-speech` - Convert text to speech
- `GET /elevenlabs/voices` - Get available voices

### Payments
- `POST /razorpay/create-order` - Create payment order
- `POST /razorpay/verify-payment` - Verify payment

### UTR Management
- `POST /utr/generate` - Generate UTR for tax payment
- `GET /utr/:utrNumber` - Get UTR details
- `GET /utr` - Get user UTRs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 🔮 Roadmap

- [ ] Integration with more government APIs
- [ ] Advanced AI features
- [ ] Multi-language support expansion
- [ ] Offline-first architecture
- [ ] Blockchain integration for document verification
- [ ] AI-powered document fraud detection

---

**Built with ❤️ for India's Digital Transformation**
