# EmailJS Setup Guide

This guide will help you set up EmailJS to handle form submissions without opening a new tab.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" or "Outlook" (or your preferred email provider)
4. Follow the authentication steps
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template structure:

```html
Subject: Business Partnership Application - {{company}}

Hello,

You have received a new business partnership application from the FoodVrse website.

Contact Information:
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}
- Job Title: {{job_title}}

Business Information:
- Company: {{company}}
- Business Type: {{business_type}}
- Location: {{location}}
- Employee Count: {{employee_count}}
- Website: {{website}}

Partnership Details:
- Business Description: {{description}}
- Partnership Interest: {{partnership_interest}}
- Monthly Food Waste: {{monthly_waste}}

Best regards,
FoodVrse Team
```

4. Save the template and note down your **Template ID**

## Step 4: Get API Keys

1. Go to "Account" > "API Keys"
2. Copy your **Public Key**

## Step 5: Update Environment Variables

Update your `.env.local` file with your actual EmailJS credentials:

```env
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
VITE_EMAILJS_SERVICE_ID=your_actual_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id_here
```

## Step 6: Test the Setup

1. Start your development server
2. Go to the Partner Application page
3. Fill out the form and submit
4. Check your email to confirm the submission was received

## Troubleshooting

### Common Issues:

1. **"EmailJS not initialized" error**
   - Make sure your public key is correct
   - Check that EmailJS is properly imported

2. **"Service not found" error**
   - Verify your service ID is correct
   - Ensure your email service is properly connected

3. **"Template not found" error**
   - Check your template ID
   - Make sure the template is published

4. **Form submission fails**
   - Check browser console for errors
   - Verify all environment variables are set
   - Ensure EmailJS account has sufficient credits

### Free Plan Limits:

- EmailJS free plan includes 200 emails per month
- Consider upgrading for higher volume

## Security Notes

- The public key is safe to expose in client-side code
- Never share your private keys
- Monitor your EmailJS usage to prevent abuse

## Alternative Setup

If you prefer not to use EmailJS, you can:

1. Use a backend API endpoint
2. Use a form service like Formspree or Netlify Forms
3. Set up a serverless function (Vercel Functions, Netlify Functions)

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Community: [https://community.emailjs.com/](https://community.emailjs.com/) 