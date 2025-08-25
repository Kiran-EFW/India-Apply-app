# Apply AI India - Backend

## Description
Backend API for the Apply AI India Government Services Assistant App built with NestJS.

## Features
- User authentication and authorization
- Voice AI integration with Eleven Labs
- Payment processing with Razorpay
- UTR generation for tax payments
- Document OCR processing
- Government service applications

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm test

# e2e tests
$ npm run test:e2e
```

## Environment Variables

Copy `env.example` to `.env` and fill in your configuration:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=gov_services

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Eleven Labs Configuration
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## API Endpoints

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

## Technology Stack
- NestJS
- TypeScript
- PostgreSQL
- JWT Authentication
- Eleven Labs API
- Razorpay API
