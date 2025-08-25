# Apply AI India - API Keys Checklist

## 🔑 **Essential API Keys Required for Production**

### **Priority 1: Core Functionality (Required for MVP)**

#### 1. **Authentication & Security**
- [ ] **JWT Secret Key**
  - **Service**: Internal JWT signing
  - **Key**: `JWT_SECRET`
  - **Format**: 256-bit random string
  - **Example**: `your-super-secret-jwt-key-256-bits-minimum`
  - **Cost**: Free
  - **Status**: ⚠️ **MISSING**

#### 2. **Voice AI & Speech Services**
- [ ] **Eleven Labs API Key**
  - **Service**: Text-to-Speech (High Quality)
  - **Key**: `ELEVEN_LABS_API_KEY`
  - **URL**: https://elevenlabs.io/
  - **Cost**: $5/month for 30,000 characters
  - **Status**: ⚠️ **MISSING**

- [ ] **Azure Speech Services**
  - **Service**: Speech-to-Text
  - **Key**: `AZURE_SPEECH_KEY`
  - **Region**: `AZURE_SPEECH_REGION`
  - **URL**: https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/
  - **Cost**: $16/month for 5 hours
  - **Status**: ⚠️ **MISSING**

#### 3. **Payment Processing**
- [ ] **Razorpay API Keys**
  - **Service**: Payment Gateway
  - **Keys**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
  - **URL**: https://razorpay.com/
  - **Cost**: 2% + GST per transaction
  - **Status**: ⚠️ **MISSING**

#### 4. **Document Processing**
- [ ] **Google Cloud Vision API**
  - **Service**: OCR & Document Analysis
  - **Keys**: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_PRIVATE_KEY`, `GOOGLE_CLOUD_CLIENT_EMAIL`
  - **URL**: https://cloud.google.com/vision
  - **Cost**: $1.50 per 1000 requests
  - **Status**: ⚠️ **MISSING**

### **Priority 2: Enhanced Features (Required for Full Launch)**

#### 5. **Cloud Infrastructure**
- [ ] **AWS Access Keys**
  - **Service**: Cloud hosting, S3 storage
  - **Keys**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
  - **Region**: `AWS_REGION=ap-south-1`
  - **URL**: https://aws.amazon.com/
  - **Cost**: Pay-as-you-use (~$50-100/month)
  - **Status**: ⚠️ **MISSING**

#### 6. **Push Notifications**
- [ ] **Firebase Cloud Messaging**
  - **Service**: Push notifications
  - **Keys**: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`
  - **URL**: https://firebase.google.com/
  - **Cost**: Free tier available
  - **Status**: ⚠️ **MISSING**

#### 7. **Database**
- [ ] **PostgreSQL Connection**
  - **Service**: Database hosting
  - **Keys**: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
  - **Options**: AWS RDS, Google Cloud SQL, or local
  - **Cost**: $10-50/month
  - **Status**: ⚠️ **MISSING**

### **Priority 3: Future Integrations (Optional)**

#### 8. **Government APIs (Future)**
- [ ] **Aadhaar e-KYC API**
  - **Service**: Identity verification
  - **Keys**: `AADHAAR_API_KEY`, `AADHAAR_API_SECRET`
  - **URL**: https://uidai.gov.in/
  - **Cost**: TBD
  - **Status**: 🔮 **FUTURE**

- [ ] **Income Tax Department API**
  - **Service**: Tax filing integration
  - **Keys**: `ITD_API_KEY`
  - **URL**: https://incometax.gov.in/
  - **Cost**: Free
  - **Status**: 🔮 **FUTURE**

- [ ] **Passport Seva API**
  - **Service**: Passport services
  - **Keys**: `PASSPORT_API_KEY`
  - **URL**: https://passportindia.gov.in/
  - **Cost**: Free
  - **Status**: 🔮 **FUTURE**

## 📋 **API Key Setup Instructions**

### **Step 1: Obtain API Keys**

#### **Eleven Labs Setup**
1. Visit https://elevenlabs.io/
2. Create account and verify email
3. Go to Profile → API Key
4. Copy the API key
5. Add to `.env`: `ELEVEN_LABS_API_KEY=your_key_here`

#### **Azure Speech Services Setup**
1. Visit https://portal.azure.com/
2. Create Speech Service resource
3. Go to Keys and Endpoint
4. Copy Key 1 and Region
5. Add to `.env`:
   ```
   AZURE_SPEECH_KEY=your_key_here
   AZURE_SPEECH_REGION=eastus
   ```

#### **Razorpay Setup**
1. Visit https://razorpay.com/
2. Create merchant account
3. Go to Settings → API Keys
4. Generate new key pair
5. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_secret_key
   ```

#### **Google Cloud Vision Setup**
1. Visit https://console.cloud.google.com/
2. Create new project
3. Enable Vision API
4. Create service account
5. Download JSON key file
6. Add to `.env`:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   ```

### **Step 2: Environment Configuration**

#### **Create Environment Files**
```bash
# Development
cp backend/env.example backend/.env.development

# Production
cp backend/env.example backend/.env.production

# Local testing
cp backend/env.example backend/.env.local
```

#### **Update .gitignore**
```bash
echo "*.env" >> .gitignore
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
echo "google-credentials.json" >> .gitignore
```

### **Step 3: API Key Validation**

#### **Backend Validation Script**
```typescript
// backend/src/config/api-key-validator.ts
export const validateApiKeys = async () => {
  const requiredKeys = [
    'JWT_SECRET',
    'ELEVEN_LABS_API_KEY',
    'AZURE_SPEECH_KEY',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'GOOGLE_CLOUD_PROJECT_ID'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    throw new Error(`Missing required API keys: ${missingKeys.join(', ')}`);
  }

  console.log('✅ All required API keys are configured');
};
```

#### **Test API Connectivity**
```bash
# Test Eleven Labs
curl -H "xi-api-key: YOUR_KEY" https://api.elevenlabs.io/v1/voices

# Test Azure Speech
curl -H "Ocp-Apim-Subscription-Key: YOUR_KEY" \
  "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models"

# Test Razorpay
curl -u "YOUR_KEY_ID:YOUR_SECRET" \
  https://api.razorpay.com/v1/orders
```

## 💰 **Cost Estimation**

### **Monthly Costs (Estimated)**
- **Eleven Labs**: $5-20/month (30K-100K characters)
- **Azure Speech**: $16-50/month (5-15 hours)
- **Google Cloud Vision**: $10-30/month (6K-20K requests)
- **Razorpay**: 2% + GST per transaction
- **AWS Infrastructure**: $50-100/month
- **Database**: $10-50/month
- **Firebase**: Free tier available

**Total Estimated Cost**: $91-260/month + transaction fees

### **Free Tier Alternatives**
- **Eleven Labs**: 10,000 characters/month free
- **Azure Speech**: 5 hours/month free
- **Google Cloud**: $300 credit for new users
- **Firebase**: Generous free tier
- **AWS**: Free tier for 12 months

## 🔒 **Security Best Practices**

### **API Key Management**
1. **Never commit keys to version control**
2. **Use environment variables**
3. **Rotate keys regularly (90 days)**
4. **Use least privilege principle**
5. **Monitor API usage**

### **Key Rotation Strategy**
```typescript
// Implement key rotation
const apiKeyManager = {
  async rotateKeys() {
    const keys = await this.getExpiringKeys();
    for (const key of keys) {
      await this.generateNewKey(key.service);
      await this.updateKey(key.service, key.newValue);
    }
  }
};
```

### **Usage Monitoring**
```typescript
// Monitor API usage
const apiUsageMonitor = {
  trackUsage(service: string, endpoint: string) {
    // Track API calls for billing and limits
    console.log(`${service}: ${endpoint} called at ${new Date()}`);
  }
};
```

## 🚀 **Deployment Checklist**

### **Pre-Deployment**
- [ ] All API keys obtained and configured
- [ ] Environment files created
- [ ] API connectivity tested
- [ ] Security measures implemented
- [ ] Monitoring setup configured

### **Post-Deployment**
- [ ] Health checks passing
- [ ] All services responding
- [ ] Payment processing working
- [ ] Voice features functional
- [ ] Document processing operational

## 📞 **Support Contacts**

### **API Provider Support**
- **Eleven Labs**: support@elevenlabs.io
- **Azure**: https://azure.microsoft.com/en-us/support/
- **Razorpay**: support@razorpay.com
- **Google Cloud**: https://cloud.google.com/support
- **AWS**: https://aws.amazon.com/support/

### **Emergency Contacts**
- **Technical Lead**: [Your Contact]
- **DevOps**: [Your Contact]
- **Security**: [Your Contact]

## ✅ **Status Summary**

| Service | Status | Priority | Cost | Setup Time |
|---------|--------|----------|------|------------|
| JWT Secret | ⚠️ Missing | P1 | Free | 5 min |
| Eleven Labs | ⚠️ Missing | P1 | $5/month | 15 min |
| Azure Speech | ⚠️ Missing | P1 | $16/month | 20 min |
| Razorpay | ⚠️ Missing | P1 | 2% + GST | 30 min |
| Google Vision | ⚠️ Missing | P1 | $1.50/1K req | 45 min |
| AWS | ⚠️ Missing | P2 | $50-100/month | 60 min |
| Firebase | ⚠️ Missing | P2 | Free | 30 min |
| PostgreSQL | ⚠️ Missing | P2 | $10-50/month | 30 min |

**Total Setup Time**: ~3-4 hours
**Total Monthly Cost**: $91-260 + transaction fees

**Recommendation**: Start with Priority 1 APIs for MVP, add Priority 2 for full launch.
