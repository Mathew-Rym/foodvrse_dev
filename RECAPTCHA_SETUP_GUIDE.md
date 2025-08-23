# reCAPTCHA Setup Guide for FoodVrse

## 🎯 Overview
This guide will help you set up real reCAPTCHA keys to actually verify users and prevent spam/bot submissions.

## 📋 Current Status
- ✅ reCAPTCHA components are implemented
- ❌ reCAPTCHA validation is currently disabled (commented out)
- ❌ Using placeholder keys in `.env.local`

## 🔧 Step 1: Get Real reCAPTCHA Keys

### 1.1 Go to Google reCAPTCHA Admin Console
1. Visit: https://www.google.com/recaptcha/admin
2. Sign in with your Google account
3. Click "Create" to add a new site

### 1.2 Configure reCAPTCHA
1. **Label**: `FoodVrse - Production`
2. **reCAPTCHA type**: Select `reCAPTCHA v2` → `"I'm not a robot" Checkbox`
3. **Domains**: Add your domains:
   - `foodvrse.com` (if you have a custom domain)
   - `*.vercel.app` (for Vercel deployments)
   - `localhost` (for local development)
4. **Accept the terms of service**
5. Click "Submit"

### 1.3 Get Your Keys
After creation, you'll get:
- **Site Key**: `6Lc...` (public key for frontend)
- **Secret Key**: `6Lc...` (private key for backend verification)

## 🔧 Step 2: Update Environment Variables

### 2.1 Update `.env.local`
Replace the placeholder keys with your real keys:

```bash
# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=6LcYOUR_REAL_SITE_KEY_HERE
VITE_RECAPTCHA_SECRET_KEY=6LcYOUR_REAL_SECRET_KEY_HERE
```

## 🔧 Step 3: Enable reCAPTCHA Validation

### 3.1 Enable in PartnerApplication.tsx
Uncomment the reCAPTCHA validation:

```typescript
// In src/pages/PartnerApplication.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!consent) {
    toast.error("Please agree to receive newsletters and information");
    return;
  }

  // ✅ Enable reCAPTCHA validation
  if (!recaptchaToken) {
    toast.error("Please complete the reCAPTCHA verification");
    return;
  }

  // ... rest of the function
};
```

### 3.2 Enable in EnhancedLocationSearch.tsx
Uncomment the reCAPTCHA validation:

```typescript
// In src/components/EnhancedLocationSearch.tsx
const handleWaitlistFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!expansionFormData.name || !expansionFormData.email) {
    toast.error('Please fill in all required fields');
    return;
  }

  // ✅ Enable reCAPTCHA validation
  if (!recaptchaToken) {
    toast.error("Please complete the reCAPTCHA verification");
    return;
  }

  // ... rest of the function
};
```

## 🔧 Step 4: Test reCAPTCHA

### 4.1 Local Testing
1. Start your development server: `npm run dev`
2. Go to a form with reCAPTCHA (e.g., Partner Application)
3. Fill out the form
4. Complete the reCAPTCHA challenge
5. Submit the form
6. Verify that validation works

### 4.2 Production Testing
1. Deploy to production: `vercel --prod`
2. Test on your live domain
3. Verify reCAPTCHA works in production

## ✅ Success Checklist

- [ ] Real reCAPTCHA keys obtained from Google
- [ ] Environment variables updated with real keys
- [ ] reCAPTCHA validation enabled in all forms
- [ ] Forms tested locally
- [ ] Forms tested in production

## 🎯 Benefits of Real reCAPTCHA

1. **Spam Prevention**: Blocks automated form submissions
2. **Bot Protection**: Prevents malicious bots from abusing your forms
3. **User Verification**: Ensures real humans are submitting forms
4. **Security**: Protects against automated attacks
5. **Analytics**: Provides insights into form usage and threats
