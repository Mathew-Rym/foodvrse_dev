# 🔐 Secure Authentication Setup Guide

## 🎯 Overview
This guide will help you set up secure authentication for Tabnine and Firebase in your FoodVrse project.

## ⚠️ Security First
- **Never commit credentials to version control**
- **Use environment variables for all sensitive data**
- **Rotate API keys regularly**
- **Monitor API usage and costs**

## 🔑 Tabnine Setup

### Step 1: Get Tabnine API Key
1. Go to [Tabnine Dashboard](https://app.tabnine.com/)
2. Sign in to your account
3. Navigate to **Settings** > **API Keys**
4. Generate a new API key
5. Copy the key (you won't see it again!)

### Step 2: Update Environment Variables
Replace in `.env.local`:
```bash
VITE_TABNINE_API_KEY=your_actual_api_key_here
VITE_TABNINE_ENABLED=true
```

### Step 3: Test Tabnine Integration
```typescript
import { TabnineService } from '@/services/tabnineService';

const tabnine = new TabnineService();
const suggestions = await tabnine.getSuggestions('console.log');
```

## 🔥 Firebase Setup

### Step 1: Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **General**
4. Scroll down to **Your apps** section
5. Copy the config values

### Step 2: Update Environment Variables
Replace in `.env.local`:
```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Test Firebase Integration
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

## 🚀 Google Drive Setup (Already Done ✅)

Your Google Drive API is already configured with:
- Service Account: `foodvrse_Drive API`
- Project: `spry-sentry-468018-q6`
- Status: Enabled

## 📱 Integration Examples

### Tabnine Code Completion
```typescript
// In your components
const [suggestions, setSuggestions] = useState([]);

useEffect(() => {
  const loadSuggestions = async () => {
    if (AUTH_CONFIG.TABNINE.ENABLED) {
      const tabnine = new TabnineService();
      const results = await tabnine.getSuggestions(code);
      setSuggestions(results);
    }
  };
  
  loadSuggestions();
}, [code]);
```

### Firebase Authentication
```typescript
// In your auth components
const signInWithFirebase = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase auth error:', error);
    throw error;
  }
};
```

## 🛡️ Security Best Practices

### 1. Environment Variables
```bash
# .env.local (never commit this file)
VITE_TABNINE_API_KEY=your_key_here
VITE_FIREBASE_API_KEY=your_key_here

# .env.example (commit this file)
VITE_TABNINE_API_KEY=YOUR_TABNINE_API_KEY_HERE
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
```

### 2. Validation
```typescript
// Always validate config before use
const { isValid, missing } = validateAuthConfig();
if (!isValid) {
  console.error('Missing credentials:', missing);
  return;
}
```

### 3. Error Handling
```typescript
try {
  const result = await service.authenticate();
} catch (error) {
  if (error.code === 'AUTH_INVALID_KEY') {
    // Handle invalid API key
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Handle rate limiting
  }
}
```

## 🔍 Monitoring & Debugging

### Check Configuration Status
```typescript
import { validateAuthConfig } from '@/config/auth';

const configStatus = validateAuthConfig();
console.log('Auth config status:', configStatus);
```

### Enable Debug Mode
```bash
# Add to .env.local for debugging
VITE_DEBUG_AUTH=true
VITE_LOG_LEVEL=debug
```

## 🚨 Troubleshooting

### Common Issues:
1. **API Key Invalid**: Check if key is correct and active
2. **Rate Limiting**: Implement exponential backoff
3. **CORS Issues**: Check domain whitelist
4. **Network Errors**: Verify internet connection

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API endpoints directly
4. Check service account permissions

## 📞 Support

- **Tabnine**: [support@tabnine.com](mailto:support@tabnine.com)
- **Firebase**: [Firebase Support](https://firebase.google.com/support)
- **Google Cloud**: [Google Cloud Support](https://cloud.google.com/support)

## 🎉 Next Steps

1. **Complete the setup steps above**
2. **Test each service individually**
3. **Integrate with your FoodVrse components**
4. **Implement proper error handling**
5. **Set up monitoring and alerts**

Your authentication is now secure and ready! 🚀
