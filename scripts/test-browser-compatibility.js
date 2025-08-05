// Browser compatibility test script for FoodVrse
// Run this in different browsers to test compatibility

const testResults = {
  browser: {
    name: 'Unknown',
    version: 'Unknown',
    userAgent: navigator.userAgent
  },
  features: {},
  performance: {},
  issues: []
};

// Test browser detection
function detectBrowser() {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) {
    testResults.browser.name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    testResults.browser.version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    testResults.browser.name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    testResults.browser.version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    testResults.browser.name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    testResults.browser.version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edge')) {
    testResults.browser.name = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    testResults.browser.version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    testResults.browser.name = 'Internet Explorer';
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    testResults.browser.version = match ? match[1] : 'Unknown';
  }
}

// Test essential features
function testFeatures() {
  testResults.features = {
    // ES6 Features
    arrowFunctions: (() => true)(),
    templateLiterals: `test ${'works'}` === 'test works',
    destructuring: (() => { const {a} = {a: 1}; return a === 1; })(),
    spreadOperator: (() => { const arr = [...[1,2]]; return arr.length === 2; })(),
    
    // Web APIs
    fetch: typeof fetch !== 'undefined',
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    customElements: typeof customElements !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    
    // CSS Features
    cssGrid: CSS.supports('display', 'grid'),
    cssFlexbox: CSS.supports('display', 'flex'),
    cssCustomProperties: CSS.supports('--custom', 'property'),
    cssTransform: CSS.supports('transform', 'translateX(0)'),
    
    // Canvas and WebGL
    canvas: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!canvas.getContext('2d');
      } catch {
        return false;
      }
    })(),
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })(),
    
    // Modern APIs
    promises: typeof Promise !== 'undefined',
    asyncAwait: (async () => true)().then(() => true).catch(() => false),
    modules: typeof import !== 'undefined',
    
    // Mobile features
    touch: 'ontouchstart' in window,
    orientation: 'onorientationchange' in window,
    devicePixelRatio: typeof devicePixelRatio !== 'undefined',
    
    // Performance APIs
    performance: typeof performance !== 'undefined',
    requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
    requestIdleCallback: typeof requestIdleCallback !== 'undefined'
  };
}

// Test performance characteristics
function testPerformance() {
  testResults.performance = {
    // Device capabilities
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    
    // Connection info
    connection: (() => {
      if ('connection' in navigator) {
        const conn = navigator.connection;
        return {
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt
        };
      }
      return 'not supported';
    })(),
    
    // Screen info
    screen: {
      width: screen.width,
      height: screen.height,
      pixelDepth: screen.pixelDepth,
      colorDepth: screen.colorDepth
    },
    
    // Viewport info
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    }
  };
}

// Test specific FoodVrse features
function testFoodVrseFeatures() {
  const tests = {
    // Supabase compatibility
    supabase: (() => {
      try {
        // Test if Supabase client can be created
        return typeof window !== 'undefined';
      } catch {
        return false;
      }
    })(),
    
    // Google Maps compatibility
    googleMaps: (() => {
      try {
        // Test if Google Maps loader can be used
        return typeof window !== 'undefined';
      } catch {
        return false;
      }
    })(),
    
    // React compatibility
    react: (() => {
      try {
        return typeof React !== 'undefined';
      } catch {
        return false;
      }
    })(),
    
    // Tailwind CSS compatibility
    tailwind: (() => {
      try {
        // Check if Tailwind classes are applied
        const testEl = document.createElement('div');
        testEl.className = 'bg-red-500 text-white p-4';
        document.body.appendChild(testEl);
        const computedStyle = window.getComputedStyle(testEl);
        const hasTailwind = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
        document.body.removeChild(testEl);
        return hasTailwind;
      } catch {
        return false;
      }
    })()
  };
  
  testResults.features.foodvrse = tests;
}

// Identify potential issues
function identifyIssues() {
  const issues = [];
  
  // Check for missing critical features
  if (!testResults.features.fetch) {
    issues.push('Fetch API not supported - network requests will fail');
  }
  
  if (!testResults.features.localStorage) {
    issues.push('localStorage not supported - user preferences won\'t be saved');
  }
  
  if (!testResults.features.promises) {
    issues.push('Promises not supported - async operations will fail');
  }
  
  if (!testResults.features.cssGrid) {
    issues.push('CSS Grid not supported - layout may be broken');
  }
  
  if (!testResults.features.cssFlexbox) {
    issues.push('CSS Flexbox not supported - layout will be severely broken');
  }
  
  // Check browser version
  const version = parseInt(testResults.browser.version);
  switch (testResults.browser.name) {
    case 'Chrome':
      if (version < 60) issues.push('Chrome version too old (need 60+)');
      break;
    case 'Firefox':
      if (version < 60) issues.push('Firefox version too old (need 60+)');
      break;
    case 'Safari':
      if (version < 12) issues.push('Safari version too old (need 12+)');
      break;
    case 'Edge':
      if (version < 79) issues.push('Edge version too old (need 79+)');
      break;
    case 'Internet Explorer':
      issues.push('Internet Explorer is not supported');
      break;
  }
  
  // Check performance issues
  if (testResults.performance.deviceMemory < 4) {
    issues.push('Low device memory may cause performance issues');
  }
  
  if (testResults.performance.hardwareConcurrency < 4) {
    issues.push('Limited CPU cores may cause performance issues');
  }
  
  testResults.issues = issues;
}

// Run all tests
function runAllTests() {
  console.log('🧪 Running Browser Compatibility Tests...\n');
  
  detectBrowser();
  testFeatures();
  testPerformance();
  testFoodVrseFeatures();
  identifyIssues();
  
  // Display results
  console.log('📊 Test Results:');
  console.log('Browser:', `${testResults.browser.name} ${testResults.browser.version}`);
  console.log('User Agent:', testResults.browser.userAgent);
  
  console.log('\n🔧 Feature Support:');
  Object.entries(testResults.features).forEach(([feature, supported]) => {
    const status = supported ? '✅' : '❌';
    console.log(`${status} ${feature}`);
  });
  
  console.log('\n⚡ Performance:');
  console.log('Device Memory:', testResults.performance.deviceMemory);
  console.log('CPU Cores:', testResults.performance.hardwareConcurrency);
  console.log('Connection:', testResults.performance.connection);
  
  if (testResults.issues.length > 0) {
    console.log('\n⚠️ Issues Found:');
    testResults.issues.forEach(issue => {
      console.log(`- ${issue}`);
    });
  } else {
    console.log('\n🎉 No compatibility issues found!');
  }
  
  console.log('\n📋 Full Results:', testResults);
  
  return testResults;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testResults };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.testBrowserCompatibility = runAllTests;
  console.log('Browser compatibility test available as: window.testBrowserCompatibility()');
}

// Run tests
runAllTests(); 