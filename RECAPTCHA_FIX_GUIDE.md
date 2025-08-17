# Fix reCAPTCHA "Invalid key type" Error

## Problem
The reCAPTCHA is showing "ERROR for site owner: Invalid key type" in the Donate popup and other forms.

## Root Cause
The reCAPTCHA keys are not properly configured in Google Cloud Console or there's a domain mismatch.

## Solution Steps

### Step 1: Create/Update Google Cloud Console reCAPTCHA

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to reCAPTCHA**
   - Go to **APIs & Services** → **Credentials**
   - Find existing reCAPTCHA or create new one

3. **Create New reCAPTCHA (if needed)**
   - Click **"Create Credentials"** → **"reCAPTCHA"**
   - Fill in the form:
     - **Label**: `FoodVrse reCAPTCHA`
     - **reCAPTCHA type**: `reCAPTCHA v2`
     - **Subtype**: `"I'm not a robot" Checkbox`
     - **Domains**: 
       - `localhost` (for development)
       - `www.foodvrse.com` (for production)
       - `foodvrse.com` (for production)
       - `127.0.0.1` (for local testing)

4. **Copy the Keys**
   - **Site Key**: Copy this key
   - **Secret Key**: Copy this key (keep secure)

### Step 2: Update Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_new_site_key_here
VITE_RECAPTCHA_SECRET_KEY=your_new_secret_key_here

# Other existing variables...
VITE_SUPABASE_URL=https://vsvhkkalfziuyttwityc.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyABKMHMAiFihQZA_ql6rhqi1EsNxWgv8ts
```

### Step 3: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your FoodVrse project

2. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add:
     - `VITE_RECAPTCHA_SITE_KEY` = your new site key
     - `VITE_RECAPTCHA_SECRET_KEY` = your new secret key

3. **Redeploy**
   - Trigger a new deployment to apply changes

### Step 4: Test the Fix

1. **Local Testing**
   ```bash
   npm run dev
   ```
   - Go to Donate popup
   - Check if reCAPTCHA loads without error

2. **Production Testing**
   - Visit https://www.foodvrse.com
   - Test the Donate popup
   - Test Partner Application form

## Alternative Quick Fix

If you want to temporarily disable reCAPTCHA for testing:

1. **Comment out reCAPTCHA in forms**
2. **Remove reCAPTCHA validation**
3. **Test form submission**

## Common Issues & Solutions

### Issue 1: "Invalid key type"
- **Solution**: Ensure you're using reCAPTCHA v2 "I'm not a robot" checkbox
- **Not**: reCAPTCHA v3 or invisible reCAPTCHA

### Issue 2: "Domain not allowed"
- **Solution**: Add your domain to the reCAPTCHA settings in Google Cloud Console

### Issue 3: Keys not working
- **Solution**: 
  1. Create new reCAPTCHA keys
  2. Update environment variables
  3. Clear browser cache
  4. Redeploy application

### Issue 4: Development vs Production
- **Solution**: Use different keys for development and production, or include both domains in the same key

## Verification Steps

After fixing:

1. ✅ reCAPTCHA loads without error
2. ✅ "I'm not a robot" checkbox appears
3. ✅ Form submission works with reCAPTCHA
4. ✅ No console errors related to reCAPTCHA
5. ✅ Works on both localhost and production

## Security Notes

- Keep secret keys secure and never expose them in frontend code
- Use environment variables for all sensitive keys
- Regularly rotate keys for security
- Monitor reCAPTCHA usage in Google Cloud Console

## Support

If issues persist:
1. Check Google Cloud Console for any quota limits
2. Verify domain settings are correct
3. Test with a fresh browser session
4. Check browser console for additional error details 