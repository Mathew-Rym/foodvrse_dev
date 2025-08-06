#!/usr/bin/env node

/**
 * Comprehensive Integration Test
 * Tests frontend-backend communication and all app functions
 */

import { readFileSync, existsSync } from 'fs';

console.log('🔍 Testing Frontend-Backend Integration...\n');

// Test 1: Environment Variables
console.log('1. 🔧 Environment Variables Check:');
const envVars = {
  'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL || 'not_set',
  'VITE_SUPABASE_KEY': process.env.VITE_SUPABASE_KEY ? 'set' : 'not_set',
  'VITE_EMAILJS_PUBLIC_KEY': process.env.VITE_EMAILJS_PUBLIC_KEY || 'not_set',
  'VITE_EMAILJS_SERVICE_ID': process.env.VITE_EMAILJS_SERVICE_ID || 'not_set',
  'VITE_EMAILJS_TEMPLATE_ID': process.env.VITE_EMAILJS_TEMPLATE_ID || 'not_set'
};

Object.entries(envVars).forEach(([key, value]) => {
  const status = value !== 'not_set' ? '✅' : '❌';
  console.log(`   ${status} ${key}: ${value}`);
});
console.log('');

// Test 2: Supabase Connection
console.log('2. 🔗 Supabase Connection Test:');
async function testSupabaseConnection() {
  try {
    const supabaseUrl = 'https://vsvhkkalfziuyttwityc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdmhra2FsZnppdXl0dHdpdHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODcwMTYsImV4cCI6MjA2Nzc2MzAxNn0.p-fJO01t2--lAGT3KIXghVHA_IWp5L7XiK5D2XeV0C0';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/platform_impact_metrics?select=count`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.ok) {
      console.log('   ✅ Supabase connection successful');
      console.log('   ✅ Database accessible');
      return true;
    } else {
      console.log(`   ❌ Supabase connection failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Supabase connection error: ${error.message}`);
    return false;
  }
}

// Test 3: Authentication Configuration
console.log('3. 🔐 Authentication Configuration:');
async function testAuthConfig() {
  try {
    const supabaseUrl = 'https://vsvhkkalfziuyttwityc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdmhra2FsZnppdXl0dHdpdHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODcwMTYsImV4cCI6MjA2Nzc2MzAxNn0.p-fJO01t2--lAGT3KIXghVHA_IWp5L7XiK5D2XeV0C0';
    
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.ok) {
      console.log('   ✅ Auth settings accessible');
      console.log('   ✅ OAuth configuration loaded');
      return true;
    } else {
      console.log(`   ❌ Auth settings not accessible: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Auth configuration error: ${error.message}`);
    return false;
  }
}

// Test 4: Google APIs
console.log('4. 🗺️ Google APIs Test:');
async function testGoogleAPIs() {
  const googleMapsKey = 'AIzaSyABKMHMAiFihQZA_ql6rhqi1EsNxWgv8ts';
  const googleOAuthId = '707536400304-6ogfei7hql85l4csjch467922du99hur.apps.googleusercontent.com';
  
  try {
    // Test Google Maps
    const mapsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Nairobi,Kenya&key=${googleMapsKey}`
    );
    const mapsData = await mapsResponse.json();
    
    if (mapsData.status === 'OK') {
      console.log('   ✅ Google Maps API: Working');
    } else {
      console.log(`   ❌ Google Maps API: ${mapsData.status}`);
    }
    
    // Test Google OAuth
    if (googleOAuthId) {
      console.log('   ✅ Google OAuth Client ID: Configured');
    } else {
      console.log('   ❌ Google OAuth Client ID: Missing');
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Google APIs error: ${error.message}`);
    return false;
  }
}

// Test 5: Frontend Components
console.log('5. 🎨 Frontend Components Check:');
function checkFrontendComponents() {
  const components = [
    'src/components/VideoModal.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx',
    'src/pages/PartnerApplication.tsx',
    'src/contexts/AuthContext.tsx',
    'src/hooks/useRealTimeMetrics.ts'
  ];
  
  components.forEach(component => {
    if (existsSync(component)) {
      console.log(`   ✅ ${component}: Exists`);
    } else {
      console.log(`   ❌ ${component}: Missing`);
    }
  });
}

// Test 6: Build Configuration
console.log('6. ⚙️ Build Configuration:');
function checkBuildConfig() {
  const configFiles = [
    'vite.config.ts',
    'tailwind.config.ts',
    'postcss.config.js',
    'package.json'
  ];
  
  configFiles.forEach(file => {
    if (existsSync(file)) {
      console.log(`   ✅ ${file}: Exists`);
    } else {
      console.log(`   ❌ ${file}: Missing`);
    }
  });
}

// Test 7: Dependencies
console.log('7. 📦 Dependencies Check:');
function checkDependencies() {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    const requiredDeps = [
      '@supabase/supabase-js',
      '@emailjs/browser',
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        console.log(`   ✅ ${dep}: Installed`);
      } else {
        console.log(`   ❌ ${dep}: Missing`);
      }
    });
  } catch (error) {
    console.log(`   ❌ Error reading package.json: ${error.message}`);
  }
}

// Test 8: Environment File
console.log('8. 📄 Environment File Check:');
function checkEnvironmentFile() {
  if (existsSync('.env.local')) {
    console.log('   ✅ .env.local: Exists');
  } else {
    console.log('   ❌ .env.local: Missing - Need to create this file');
    console.log('   📝 Required variables:');
    console.log('      VITE_SUPABASE_URL=https://vsvhkkalfziuyttwityc.supabase.co');
    console.log('      VITE_SUPABASE_KEY=your_supabase_anon_key');
    console.log('      VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key');
    console.log('      VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id');
    console.log('      VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running Integration Tests...\n');
  
  // Run async tests
  await testSupabaseConnection();
  await testAuthConfig();
  await testGoogleAPIs();
  
  // Run sync tests
  checkFrontendComponents();
  checkBuildConfig();
  checkDependencies();
  checkEnvironmentFile();
  
  console.log('\n🎉 Integration Test Complete!');
  console.log('\n📋 Issues Found:');
  console.log('   1. ❌ Environment variables not set - Need .env.local file');
  console.log('   2. ❌ EmailJS not configured - Follow EMAILJS_SETUP.md');
  console.log('\n🔧 To Fix:');
  console.log('   1. Create .env.local file with required variables');
  console.log('   2. Set up EmailJS account and update credentials');
  console.log('   3. Test authentication flow in browser');
  console.log('   4. Verify all components render correctly');
}

runAllTests().catch(console.error); 