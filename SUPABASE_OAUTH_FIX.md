# Fix OAuth Redirect Issue

## Problem
When trying to sign up/sign in with Google, you get "localhost refused to connect" error.

## Root Cause
The Supabase project dashboard still has localhost URLs in the OAuth settings, even though we've updated the code.

## Solution

### Step 1: Update Supabase Dashboard Settings

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `vsvhkkalfziuyttwityc`

2. **Navigate to Authentication Settings**
   - Go to "Authentication" > "URL Configuration"

3. **Update Site URL**
   - **Site URL**: `https://www.foodvrse.com`

4. **Update Redirect URLs**
   Remove all localhost URLs and keep only:
   - `https://www.foodvrse.com/oauth-callback`
   - `https://www.foodvrse.com/**`

5. **Save Changes**
   - Click "Save" to apply the changes

### Step 2: Update Google OAuth Settings

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to OAuth Settings**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID

3. **Update Authorized Redirect URIs**
   Remove any localhost URLs and keep only:
   - `https://vsvhkkalfziuyttwityc.supabase.co/auth/v1/callback`

4. **Update Authorized JavaScript Origins**
   Remove any localhost URLs and keep only:
   - `https://www.foodvrse.com`

5. **Save Changes**

### Step 3: Test the Fix

1. **Clear browser cache** and cookies for foodvrse.com
2. **Try signing up/signing in** with Google
3. **Should now redirect properly** to the production site

## Alternative Quick Fix

If you want to test locally, you can temporarily add localhost URLs back to Supabase dashboard:

**For Development:**
- Site URL: `http://localhost:3000`
- Redirect URLs: 
  - `http://localhost:3000/oauth-callback`
  - `http://localhost:3000/**`

**For Production:**
- Site URL: `https://www.foodvrse.com`
- Redirect URLs:
  - `https://www.foodvrse.com/oauth-callback`
  - `https://www.foodvrse.com/**`

## Important Notes

- The code is already configured correctly with dynamic redirect URLs
- The issue is in the Supabase dashboard settings
- After updating the dashboard, OAuth should work properly
- Make sure to clear browser cache after making changes 