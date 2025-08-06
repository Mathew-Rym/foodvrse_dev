# reCAPTCHA Setup Guide for FoodVrse

## Step 1: Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click "Create" to add a new site
4. Fill in the form:
   - **Label**: FoodVrse Partner Application
   - **reCAPTCHA type**: reCAPTCHA v2
   - **Subtype**: "I'm not a robot" Checkbox
   - **Domains**: 
     - `localhost` (for development)
     - `www.foodvrse.com` (for production)
     - `foodvrse.com` (for production)
5. Accept the terms and click "Submit"
6. Copy the **Site Key** and **Secret Key**

## Step 2: Update Environment Variables

Add these to your `.env.local` file:

```env
# Google reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
VITE_RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the Partner Application page
3. Fill out the form and complete the reCAPTCHA
4. Submit the form - it should send an email to `hello@foodvrse.com`

## Step 4: EmailJS Setup (if not already done)

1. Go to [EmailJS](https://www.emailjs.com/) and create an account
2. Add your email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `to_email`
   - `from_name`
   - `from_email`
   - `company`
   - `job_title`
   - `phone`
   - `business_type`
   - `location`
   - `employee_count`
   - `website`
   - `description`
   - `partnership_interest`
   - `monthly_waste`
   - `message`

4. Update your `.env.local` with EmailJS credentials:
```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

## Features Implemented

✅ **Real reCAPTCHA v2**: "I'm not a robot" checkbox
✅ **Email submission**: Sends to `hello@foodvrse.com`
✅ **Form validation**: All required fields validated
✅ **Success/error handling**: Toast notifications
✅ **Form reset**: Clears form after successful submission
✅ **Loading states**: Shows loading spinner during submission

## Security Features

- reCAPTCHA prevents automated form submissions
- Email validation on both client and server side
- Form data sanitization
- Rate limiting (handled by EmailJS)
- Secure token-based verification

## Troubleshooting

1. **reCAPTCHA not showing**: Check if the site key is correct
2. **Email not sending**: Verify EmailJS configuration
3. **Form validation errors**: Check browser console for details
4. **Domain not allowed**: Add your domain to reCAPTCHA settings 