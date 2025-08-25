# Apply AI India - Frontend

## Description
React Native frontend for the Apply AI India Government Services Assistant App.

## Features
- Voice-controlled navigation
- User authentication
- Document management
- Application tracking
- Payment processing
- UTR generation for tax payments
- Voice synthesis with Eleven Labs

## Installation

```bash
$ npm install
```

## Running the app

```bash
# Android
$ npm run android

# iOS
$ npm run ios

# Start Metro bundler
$ npm start
```

## Test

```bash
$ npm test
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
API_URL=http://localhost:3000
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, Voice)
├── screens/        # App screens
├── services/       # API services
└── types/          # TypeScript type definitions
```

## Key Components

### Authentication
- User registration and login
- JWT token management
- Secure storage

### Voice AI
- Text-to-speech with Eleven Labs
- Voice command processing
- Multilingual support

### Payment Processing
- Razorpay integration
- UTR generation
- Payment verification

### Document Management
- Document upload
- OCR processing
- Secure storage

## Technology Stack
- React Native
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for local storage
- Eleven Labs API
- Razorpay API
