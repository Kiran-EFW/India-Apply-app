# Apply AI India - Quick Setup Guide

## 🚀 **Make the App Run in 30 Minutes**

### **✅ Step 1: Dependencies Installed (COMPLETED)**
- ✅ Frontend dependencies installed
- ✅ Backend dependencies installed

### **🔧 Step 2: Environment Setup (REQUIRED)**

#### **Create Environment File**
```bash
# Copy the example file
cp backend/env.example backend/.env

# Edit the .env file with your values
```

#### **Minimum Required Environment Variables**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-256-bits-minimum
JWT_EXPIRES_IN=7d

# Database Configuration (REQUIRED)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=gov_services

# Voice AI (OPTIONAL - for voice features)
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key_here

# Payment Processing (OPTIONAL - for payments)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Speech Recognition (OPTIONAL - for voice input)
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=eastus

# Document Processing (OPTIONAL - for OCR)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

### **🗄️ Step 3: Database Setup (REQUIRED)**

#### **Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb gov_services

# Or use Docker
docker run --name postgres-gov -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=gov_services -p 5432:5432 -d postgres:13
```

#### **Option B: Cloud Database (Recommended)**
- **Supabase** (Free tier): https://supabase.com/
- **Railway** (Free tier): https://railway.app/
- **AWS RDS** (Paid): https://aws.amazon.com/rds/

### **🔑 Step 4: API Keys Setup (OPTIONAL)**

#### **Quick Start - No API Keys**
The app will work without external APIs, but with limited functionality:
- ✅ Authentication (local)
- ✅ Basic UI navigation
- ✅ Form handling
- ❌ Voice features (will show errors)
- ❌ Payment processing (will show errors)
- ❌ Document scanning (will show errors)

#### **Full Features - Get API Keys**
1. **Eleven Labs** (Voice AI): https://elevenlabs.io/ - $5/month
2. **Azure Speech** (Speech recognition): https://azure.microsoft.com/ - $16/month
3. **Razorpay** (Payments): https://razorpay.com/ - 2% + GST
4. **Google Cloud Vision** (OCR): https://cloud.google.com/vision - $1.50/1K requests

### **🚀 Step 5: Run the App**

#### **Start Backend**
```bash
cd backend
npm install
npm run start:dev
```

#### **Start Frontend**
```bash
cd frontend/GovServicesApp
npm install
npm start
```

#### **Run on Device/Emulator**
```bash
# Android
npm run android

# iOS
npm run ios
```

## 🎯 **Current App Status**

### **✅ What Works Right Now**
- Complete UI with 17 screens
- Navigation between screens
- Form handling and validation
- Local authentication
- Voice command interface (UI only)
- Document upload interface (UI only)
- Payment interface (UI only)

### **⚠️ What Needs API Keys**
- Voice synthesis (Eleven Labs)
- Speech recognition (Azure)
- Payment processing (Razorpay)
- Document OCR (Google Cloud)

### **🔧 What Needs Database**
- User registration/login
- Document storage
- Application tracking
- Payment history

## 📱 **Quick Test**

### **1. Start Backend Only**
```bash
cd backend
npm run start:dev
```
**Expected**: Server starts on http://localhost:3000

### **2. Test Health Endpoint**
```bash
curl http://localhost:3000/health
```
**Expected**: JSON response with service status

### **3. Start Frontend**
```bash
cd frontend/GovServicesApp
npm start
```
**Expected**: Metro bundler starts, QR code appears

### **4. Run on Device**
- Scan QR code with Expo Go app
- Or run `npm run android` / `npm run ios`

## 🚨 **Common Issues & Solutions**

### **Issue 1: Database Connection Error**
```bash
# Error: "Database not initialized"
# Solution: Set up PostgreSQL and update .env
```

### **Issue 2: API Key Errors**
```bash
# Error: "Eleven Labs API key not configured"
# Solution: Add API key to .env or ignore for basic testing
```

### **Issue 3: Port Already in Use**
```bash
# Error: "Port 3000 already in use"
# Solution: Change PORT in .env or kill existing process
```

### **Issue 4: Metro Bundler Issues**
```bash
# Error: "Metro bundler not starting"
# Solution: Clear cache and restart
npm start -- --reset-cache
```

## 🎉 **Success Criteria**

The app is **RUNNING** when:
- ✅ Backend server starts without errors
- ✅ Frontend Metro bundler starts
- ✅ App opens on device/emulator
- ✅ Navigation between screens works
- ✅ Forms can be filled and submitted
- ✅ Voice button responds (even if no actual voice)

## 📞 **Next Steps**

### **For Basic Testing (30 minutes)**
1. Set up database
2. Configure basic .env
3. Start backend and frontend
4. Test navigation and forms

### **For Full Features (2-3 hours)**
1. Obtain API keys
2. Configure all services
3. Test voice features
4. Test payment processing
5. Test document scanning

### **For Production (1-2 weeks)**
1. Set up cloud infrastructure
2. Configure SSL certificates
3. Set up monitoring
4. Performance optimization
5. Security hardening

## ✅ **Current Status: READY TO RUN**

With the dependencies now installed, the app can be made runnable in **30 minutes** with just:
1. Database setup
2. Basic environment configuration
3. Starting the servers

**The app will work with basic functionality even without external API keys!**
