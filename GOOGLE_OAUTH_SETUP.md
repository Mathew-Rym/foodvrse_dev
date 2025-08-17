# Google OAuth Setup Guide

## Fix OAuth Application Name

To change the OAuth prompt from showing "vsvhkkalfziuyttwityc.supabase.co" to "FoodVrse", you need to update your Google Cloud Console settings:

### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to OAuth Settings**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID: `707536400304-6ogfei7hql85l4csjch467922du99hur.apps.googleusercontent.com`

3. **Update Application Information**
   - Click on the OAuth 2.0 Client ID
   - Update the following fields:
     - **Application name**: `FoodVrse`
     - **Application home page**: `https://www.foodvrse.com`
     - **Application privacy policy link**: `https://www.foodvrse.com/privacy-policy`
     - **Application terms of service link**: `https://www.foodvrse.com/terms-of-service`

4. **Save Changes**
   - Click "Save" to apply the changes

### Authorized Redirect URIs
Make sure these redirect URIs are configured:
- `https://www.foodvrse.com/oauth-callback`

### Authorized JavaScript Origins
Add this origin:
- `https://www.foodvrse.com`

## After Updates

Once you've updated the Google Cloud Console settings:
1. The OAuth prompt will show "FoodVrse" instead of the Supabase URL
2. The redirect will work properly to your production site
3. Users will see a more professional authentication experience

## Facebook Login

Facebook login is already configured to show "Coming Soon" message. Users are encouraged to use Google login or email signup instead. 