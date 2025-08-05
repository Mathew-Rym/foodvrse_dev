// Browser compatibility utilities for FoodVrse

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: {
    es6: boolean;
    fetch: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    intersectionObserver: boolean;
    customElements: boolean;
    webGL: boolean;
    serviceWorker: boolean;
  };
}

export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';

  // Detect browser
  if (userAgent.includes('Chrome')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edge')) {
    name = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    name = 'Internet Explorer';
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    version = match ? match[1] : 'Unknown';
  }

  // Check features
  const features = {
    es6: typeof Promise !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    customElements: typeof customElements !== 'undefined',
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })(),
    serviceWorker: 'serviceWorker' in navigator,
  };

  // Determine if browser is supported
  const versionNum = parseInt(version);
  const isSupported = (() => {
    switch (name) {
      case 'Chrome':
        return versionNum >= 60;
      case 'Firefox':
        return versionNum >= 60;
      case 'Safari':
        return versionNum >= 12;
      case 'Edge':
        return versionNum >= 79;
      case 'Internet Explorer':
        return false; // IE is not supported
      default:
        return features.es6 && features.fetch; // Fallback check
    }
  })();

  return {
    name,
    version,
    isSupported,
    features,
  };
};

export const getBrowserWarnings = (browserInfo: BrowserInfo): string[] => {
  const warnings: string[] = [];

  if (!browserInfo.isSupported) {
    warnings.push(`Your browser (${browserInfo.name} ${browserInfo.version}) is not fully supported. Please update to a modern browser.`);
  }

  if (!browserInfo.features.es6) {
    warnings.push('Your browser does not support ES6 features. Some functionality may not work properly.');
  }

  if (!browserInfo.features.fetch) {
    warnings.push('Your browser does not support the Fetch API. Network requests may fail.');
  }

  if (!browserInfo.features.localStorage) {
    warnings.push('Your browser does not support localStorage. Some features may not work properly.');
  }

  if (!browserInfo.features.intersectionObserver) {
    warnings.push('Your browser does not support Intersection Observer. Some animations may not work.');
  }

  return warnings;
};

export const applyBrowserFixes = (browserInfo: BrowserInfo): void => {
  // Apply browser-specific CSS classes
  const body = document.body;
  
  // Add browser-specific classes
  body.classList.add(`${browserInfo.name.toLowerCase()}-browser`);
  body.classList.add(`version-${browserInfo.version}`);
  
  if (!browserInfo.isSupported) {
    body.classList.add('unsupported-browser');
  }

  // Safari-specific fixes
  if (browserInfo.name === 'Safari') {
    body.classList.add('safari-fix');
  }

  // iOS Safari fixes
  if (browserInfo.name === 'Safari' && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
    body.classList.add('ios-safari-fix');
  }

  // Firefox-specific fixes
  if (browserInfo.name === 'Firefox') {
    body.classList.add('firefox-fix');
  }

  // Edge-specific fixes
  if (browserInfo.name === 'Edge') {
    body.classList.add('edge-fix');
  }

  // IE fallbacks
  if (browserInfo.name === 'Internet Explorer') {
    body.classList.add('ie-fallback');
  }
};

export const checkPerformance = (): {
  isSlow: boolean;
  recommendations: string[];
} => {
  const recommendations: string[] = [];
  let isSlow = false;

  // Check device memory
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory < 4) {
      isSlow = true;
      recommendations.push('Your device has limited memory. Consider closing other tabs for better performance.');
    }
  }

  // Check connection speed
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      isSlow = true;
      recommendations.push('You have a slow internet connection. Some features may load slowly.');
    }
  }

  // Check hardware concurrency
  if ('hardwareConcurrency' in navigator) {
    const cores = navigator.hardwareConcurrency;
    if (cores < 4) {
      recommendations.push('Your device has limited processing power. Some animations may be disabled.');
    }
  }

  return { isSlow, recommendations };
};

export const initializeBrowserCompatibility = (): void => {
  const browserInfo = detectBrowser();
  const warnings = getBrowserWarnings(browserInfo);
  const performance = checkPerformance();

  // Apply browser fixes
  applyBrowserFixes(browserInfo);

  // Log warnings in development
  if (import.meta.env.DEV) {
    if (warnings.length > 0) {
      console.warn('Browser Compatibility Warnings:', warnings);
    }
    if (performance.recommendations.length > 0) {
      console.warn('Performance Recommendations:', performance.recommendations);
    }
  }

  // Show critical warnings to user
  if (!browserInfo.isSupported) {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #fef3c7;
      color: #92400e;
      padding: 1rem;
      text-align: center;
      z-index: 9999;
      border-bottom: 2px solid #f59e0b;
    `;
    warningDiv.innerHTML = `
      <strong>Browser Not Supported:</strong> 
      Your browser (${browserInfo.name} ${browserInfo.version}) may not work properly with FoodVrse. 
      Please update to Chrome 60+, Firefox 60+, Safari 12+, or Edge 79+.
    `;
    document.body.appendChild(warningDiv);
  }

  // Store browser info for debugging
  (window as any).__browserInfo = browserInfo;
}; 