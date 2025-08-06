#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps set up the .env.local file with required variables
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';

console.log('🔧 Setting up environment variables...\n');

const envContent = `# Vercel OIDC Token (for deployment)
VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9tYXRoZXctcnltcy1wcm9qZWN0cyIsInN1YiI6Im93bmVyOm1hdGhldy1yeW1zLXByb2plY3RzOnByb2plY3Q6Zm9vZHZyc2UtZGV2OmVudmlyb25tZW50OmRldmVsb3BtZW50Iiwic2NvcGUiOiJvd25lcjptYXRoZXctcnltcy1wcm9qZWN0czpwcm9qZWN0OmZvb2R2cnNlLWRldjplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsImF1ZCI6Imh0dHBzOi8vdmVyY2VsLmNvbS9tYXRoZXctcnltcy1wcm9qZWN0cyIsIm93bmVyIjoibWF0aGV3LXJ5bXMtcHJvamVjdHMiLCJvd25lcl9pZCI6InRlYW1feG9YSDRwQzRKcmJzNGpLemgyMXg1aEZEIiwicHJvamVjdCI6ImZvb2R2cnNlLWRldiIsInByb2plY3RfaWQiOiJwcmpfZ3ByY3hKSnhGc29MRkxZZTFaUWs0RjRSbXBEOCIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJ1c2VyX2lkIjoiZ0JKeDNGVHZOVm5hWXBNV0diWFpTTDZNIiwibmJmIjoxNzU0Mzk5NzYxLCJpYXQiOjE3NTQzOTk3NjEsImV4cCI6MTc1NDQ0Mjk2MX0.kXCtuwmDobgJwM-51DEUfOpTjEI2q0phZJXnz7L8Z1ka9uFcAQaQ8a82Geo-RY5hSAxf8DAFxSUz-p42PlB18M-uuiBF0_4NmkuRmgior0661xtKtrDDNVdvtqgxm7TzPwgHLGDXSu7t_fhy9d9plInP_grh8SWPxLFy0rHx234johjdNEjNTyFmh4aX5b90spoKpjVwZu0zcxQGJmVx4nnUQFO8j2PI3JEFmNdaQZdyxAWxlMD9THq5kA4fOT8uTb0EiTtPyIbCi7QulbMca7HV_4S-VYAVUYLp5JBco1NYQcJEjJq4T6d00shdd5GM5SjougpxL0g5ujZgqHZBeg"

# Supabase Configuration
VITE_SUPABASE_URL=https://vsvhkkalfziuyttwityc.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdmhra2FsZnppdXl0dHdpdHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODcwMTYsImV4cCI6MjA2Nzc2MzAxNn0.p-fJO01t2--lAGT3KIXghVHA_IWp5L7XiK5D2XeV0C0

# EmailJS Configuration (Optional - for form submissions)
# Follow EMAILJS_SETUP.md to get these values
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
VITE_EMAILJS_SERVICE_ID=your_actual_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id_here

# Google APIs
VITE_GOOGLE_MAPS_API_KEY=AIzaSyABKMHMAiFihQZA_ql6rhqi1EsNxWgv8ts
VITE_GOOGLE_OAUTH_CLIENT_ID=707536400304-6ogfei7hql85l4csjch467922du99hur.apps.googleusercontent.com

# OneSignal
VITE_ONESIGNAL_APP_ID=ad9e0988-c4d4-4d1c-8180-5bc8016f97c1
`;

try {
  if (existsSync('.env.local')) {
    console.log('⚠️  .env.local already exists. Backing up...');
    const backupContent = readFileSync('.env.local', 'utf8');
    writeFileSync('.env.local.backup', backupContent);
    console.log('✅ Backup created as .env.local.backup');
  }
  
  writeFileSync('.env.local', envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('');
  console.log('📋 Environment variables set:');
  console.log('   ✅ VITE_SUPABASE_URL');
  console.log('   ✅ VITE_SUPABASE_KEY');
  console.log('   ⚠️  VITE_EMAILJS_* (need to be configured)');
  console.log('   ✅ VITE_GOOGLE_MAPS_API_KEY');
  console.log('   ✅ VITE_GOOGLE_OAUTH_CLIENT_ID');
  console.log('   ✅ VITE_ONESIGNAL_APP_ID');
  console.log('');
  console.log('🔄 Restart your dev server to load the new environment variables:');
  console.log('   npm run dev');
  console.log('');
  console.log('📖 For EmailJS setup, follow: EMAILJS_SETUP.md');
  
} catch (error) {
  console.log(`❌ Error creating .env.local: ${error.message}`);
  console.log('');
  console.log('🔧 Manual setup:');
  console.log('1. Create .env.local file in project root');
  console.log('2. Add the environment variables manually');
  console.log('3. Restart the dev server');
} 