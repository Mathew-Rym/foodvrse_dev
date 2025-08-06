# Google OAuth Fix Guide

## 🔧 Fix for "redirect_uri_mismatch" Error

The error you're seeing is because your Google OAuth app doesn't have the correct redirect URIs configured for localhost:8080.

---

## 📋 **STEP 1: Update Google OAuth Configuration**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Navigate to your project:**
   - Select your FoodVrse project
   - Or create a new project if needed

3. **Go to APIs & Services > Credentials:**
   - Click on "APIs & Services" in the left sidebar
   - Click on "Credentials"

4. **Find your OAuth 2.0 Client ID:**
   - Look for: `707536400304-6ogfei7hql85l4csjch467922du99hur.apps.googleusercontent.com`
   - Click on it to edit

5. **Add Authorized Redirect URIs:**
   Add these URLs to the "Authorized redirect URIs" section:
   ```
   https://vsvhkkalfziuyttwityc.supabase.co/auth/v1/callback
   http://localhost:8080/oauth-callback
   http://localhost:3000/oauth-callback
   https://www.foodvrse.com/oauth-callback
   ```

6. **Add Authorized JavaScript Origins:**
   Add these URLs to the "Authorized JavaScript origins" section:
   ```
   http://localhost:8080
   http://localhost:3000
   https://www.foodvrse.com
   https://vsvhkkalfziuyttwityc.supabase.co
   ```

7. **Save the changes**

---

## 📋 **STEP 2: Verify Supabase Configuration**

The Supabase configuration has been updated to include localhost:8080. The file `supabase/config.toml` now includes:
```toml
additional_redirect_urls = [
  # ... other URLs ...
  "http://localhost:8080/**",
  "http://localhost:8080/oauth-callback"
]
```

---

## 📋 **STEP 3: Test the Fix**

1. **Restart your dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test Google OAuth:**
   - Go to http://localhost:8080
   - Click "Sign In" or "Sign In with Google"
   - The OAuth flow should now work without the redirect_uri_mismatch error

---

## 🔍 **Troubleshooting**

### If you still get the error:

1. **Clear browser cache and cookies**
2. **Wait 5-10 minutes** (Google OAuth changes can take time to propagate)
3. **Check the exact error message** in the browser console
4. **Verify the redirect URI** matches exactly

### Common issues:

- **Wrong port**: Make sure you're using port 8080, not 3000
- **HTTP vs HTTPS**: Use `http://` for localhost, not `https://`
- **Trailing slashes**: Make sure URLs match exactly

---

## 📞 **Need Help?**

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Verify your Google OAuth client ID** matches the one in the code
3. **Make sure you're using the correct Google account** that owns the OAuth app

---

## ✅ **Expected Result**

After following these steps, you should be able to:
- Click "Sign In with Google"
- Be redirected to Google's OAuth page
- Grant permissions
- Be redirected back to your app successfully
- See your user profile created

**The OAuth flow should work seamlessly!** 🎉 