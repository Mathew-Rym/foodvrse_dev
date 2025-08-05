// Test script to verify all APIs are working
// Run this in the browser console or as a Node.js script

const API_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'AIzaSyABKMHMAiFihQZA_ql6rhqi1EsNxWgv8ts',
  GOOGLE_OAUTH_CLIENT_ID: '707536400304-6ogfei7hql85l4csjch467922du99hur.apps.googleusercontent.com',
  SUPABASE_URL: 'https://vsvhkkalfziuyttwityc.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdmhra2FsZnppdXl0dHdpdHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODcwMTYsImV4cCI6MjA2Nzc2MzAxNn0.p-fJO01t2--lAGT3KIXghVHA_IWp5L7XiK5D2XeV0C0'
};

// Test Google Maps API
async function testGoogleMapsAPI() {
  console.log('Testing Google Maps API...');
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Nairobi,Kenya&key=${API_CONFIG.GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Google Maps API: Working');
      return true;
    } else {
      console.log('❌ Google Maps API: Failed -', data.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Google Maps API: Error -', error.message);
    return false;
  }
}

// Test Supabase API
async function testSupabaseAPI() {
  console.log('Testing Supabase API...');
  
  try {
    const response = await fetch(`${API_CONFIG.SUPABASE_URL}/rest/v1/platform_impact_metrics?select=*`, {
      headers: {
        'apikey': API_CONFIG.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase API: Working');
      return true;
    } else {
      console.log('❌ Supabase API: Failed -', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Supabase API: Error -', error.message);
    return false;
  }
}

// Test Google OAuth Configuration
function testGoogleOAuthConfig() {
  console.log('Testing Google OAuth Configuration...');
  
  if (API_CONFIG.GOOGLE_OAUTH_CLIENT_ID) {
    console.log('✅ Google OAuth Client ID: Configured');
    return true;
  } else {
    console.log('❌ Google OAuth Client ID: Missing');
    return false;
  }
}

// Test YouTube API (if configured)
async function testYouTubeAPI() {
  console.log('Testing YouTube API...');
  
  if (!API_CONFIG.YOUTUBE_API_KEY) {
    console.log('⚠️ YouTube API: No API key configured (optional)');
    return true;
  }
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=OYe3_kovTrY&key=${API_CONFIG.YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      console.log('✅ YouTube API: Working');
      return true;
    } else {
      console.log('❌ YouTube API: Failed -', data.error?.message || 'No data returned');
      return false;
    }
  } catch (error) {
    console.log('❌ YouTube API: Error -', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const results = {
    googleMaps: await testGoogleMapsAPI(),
    supabase: await testSupabaseAPI(),
    googleOAuth: testGoogleOAuthConfig(),
    youtube: await testYouTubeAPI()
  };
  
  console.log('\n📊 Test Results:');
  console.log('Google Maps API:', results.googleMaps ? '✅' : '❌');
  console.log('Supabase API:', results.supabase ? '✅' : '❌');
  console.log('Google OAuth:', results.googleOAuth ? '✅' : '❌');
  console.log('YouTube API:', results.youtube ? '✅' : '⚠️');
  
  const allWorking = Object.values(results).every(result => result);
  
  if (allWorking) {
    console.log('\n🎉 All APIs are working correctly!');
  } else {
    console.log('\n⚠️ Some APIs need attention. Check the errors above.');
  }
  
  return results;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAPIs = runAllTests;
  console.log('API test function available as: window.testAPIs()');
}

// Run tests if this is a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, API_CONFIG };
} 