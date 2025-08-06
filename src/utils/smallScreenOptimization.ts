// Small screen optimization utilities for FoodVrse
// Specifically designed for CATS22 flip and other small screens

export interface ScreenInfo {
  width: number;
  height: number;
  isSmall: boolean;
  isVerySmall: boolean;
  isUltraSmall: boolean;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
}

export const getScreenInfo = (): ScreenInfo => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  return {
    width,
    height,
    isSmall: width <= 768,
    isVerySmall: width <= 360,
    isUltraSmall: width <= 280,
    devicePixelRatio,
    orientation: width > height ? 'landscape' : 'portrait'
  };
};

export const optimizeForSmallScreen = () => {
  const screenInfo = getScreenInfo();
  
  // Add CSS classes based on screen size
  const body = document.body;
  
  if (screenInfo.isUltraSmall) {
    body.classList.add('ultra-small-screen');
  } else if (screenInfo.isVerySmall) {
    body.classList.add('very-small-screen');
  } else if (screenInfo.isSmall) {
    body.classList.add('small-screen');
  }
  
  // Add orientation class
  body.classList.add(`orientation-${screenInfo.orientation}`);
  
  // Optimize font sizes for small screens
  if (screenInfo.isVerySmall) {
    const style = document.createElement('style');
    style.textContent = `
      .ultra-small-text { font-size: 0.75rem !important; }
      .ultra-small-padding { padding: 0.25rem !important; }
      .ultra-small-margin { margin: 0.25rem !important; }
      .stack-vertical { flex-direction: column !important; }
      .single-column { grid-template-columns: 1fr !important; }
    `;
    document.head.appendChild(style);
  }
  
  return screenInfo;
};

export const getOptimizedSpacing = (baseSpacing: number): number => {
  const screenInfo = getScreenInfo();
  
  if (screenInfo.isUltraSmall) {
    return Math.max(1, Math.floor(baseSpacing * 0.25));
  } else if (screenInfo.isVerySmall) {
    return Math.max(2, Math.floor(baseSpacing * 0.5));
  } else if (screenInfo.isSmall) {
    return Math.max(3, Math.floor(baseSpacing * 0.75));
  }
  
  return baseSpacing;
};

export const getOptimizedFontSize = (baseSize: string): string => {
  const screenInfo = getScreenInfo();
  
  const sizeMap: Record<string, string[]> = {
    'xs': ['0.5rem', '0.625rem', '0.75rem'],
    'sm': ['0.625rem', '0.75rem', '0.875rem'],
    'base': ['0.75rem', '0.875rem', '1rem'],
    'lg': ['0.875rem', '1rem', '1.125rem'],
    'xl': ['1rem', '1.125rem', '1.25rem'],
    '2xl': ['1.125rem', '1.25rem', '1.5rem'],
    '3xl': ['1.25rem', '1.5rem', '1.875rem'],
  };
  
  const sizes = sizeMap[baseSize] || ['1rem', '1rem', '1rem'];
  
  if (screenInfo.isUltraSmall) {
    return sizes[0];
  } else if (screenInfo.isVerySmall) {
    return sizes[1];
  } else if (screenInfo.isSmall) {
    return sizes[2];
  }
  
  return baseSize;
};

export const optimizeLayout = () => {
  const screenInfo = getScreenInfo();
  
  // Optimize grid layouts
  const grids = document.querySelectorAll('.grid');
  grids.forEach(grid => {
    if (screenInfo.isVerySmall) {
      grid.classList.add('grid-cols-1');
      grid.classList.remove('grid-cols-2', 'grid-cols-3', 'grid-cols-4');
    }
  });
  
  // Optimize flex layouts
  const flexRows = document.querySelectorAll('.flex-row');
  flexRows.forEach(flex => {
    if (screenInfo.isVerySmall) {
      flex.classList.remove('flex-row');
      flex.classList.add('flex-col');
    }
  });
  
  // Optimize text sizes
  const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const fontSize = computedStyle.fontSize;
    
    if (screenInfo.isVerySmall && fontSize) {
      const size = parseFloat(fontSize);
      if (size > 16) {
        (element as HTMLElement).style.fontSize = `${Math.max(12, size * 0.75)}px`;
      }
    }
  });
};

export const addSmallScreenListeners = () => {
  // Listen for orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      optimizeForSmallScreen();
      optimizeLayout();
    }, 100);
  });
  
  // Listen for resize events
  window.addEventListener('resize', () => {
    optimizeForSmallScreen();
    optimizeLayout();
  });
  
  // Initial optimization
  optimizeForSmallScreen();
  optimizeLayout();
};

export const getTouchTargetSize = (): number => {
  const screenInfo = getScreenInfo();
  
  // Ensure touch targets are at least 44px for accessibility
  if (screenInfo.isVerySmall) {
    return 44;
  } else if (screenInfo.isSmall) {
    return 48;
  }
  
  return 44;
};

export const optimizeTouchTargets = () => {
  const minSize = getTouchTargetSize();
  
  const buttons = document.querySelectorAll('button, a, [role="button"]');
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect();
    if (rect.width < minSize || rect.height < minSize) {
      (button as HTMLElement).style.minWidth = `${minSize}px`;
      (button as HTMLElement).style.minHeight = `${minSize}px`;
      (button as HTMLElement).style.padding = `${Math.max(8, minSize / 4)}px`;
    }
  });
};

// Initialize small screen optimizations
export const initializeSmallScreenOptimization = () => {
  addSmallScreenListeners();
  optimizeTouchTargets();
  
  // Add CSS for ultra-small screens
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 360px) {
      .ultra-small-container {
        padding: 0.25rem !important;
        margin: 0.125rem !important;
      }
      
      .ultra-small-text {
        font-size: 0.75rem !important;
        line-height: 1rem !important;
      }
      
      .ultra-small-button {
        padding: 0.5rem !important;
        font-size: 0.875rem !important;
        min-height: 44px !important;
        min-width: 44px !important;
      }
      
      .ultra-small-card {
        padding: 0.5rem !important;
        margin: 0.25rem !important;
        border-radius: 0.375rem !important;
      }
      
      .ultra-small-grid {
        grid-template-columns: 1fr !important;
        gap: 0.25rem !important;
      }
      
      .ultra-small-flex {
        flex-direction: column !important;
        gap: 0.25rem !important;
      }
    }
    
    @media (max-width: 280px) {
      .ultra-small-container {
        padding: 0.125rem !important;
        margin: 0.0625rem !important;
      }
      
      .ultra-small-text {
        font-size: 0.625rem !important;
        line-height: 0.875rem !important;
      }
      
      .ultra-small-button {
        padding: 0.375rem !important;
        font-size: 0.75rem !important;
        min-height: 40px !important;
        min-width: 40px !important;
      }
    }
  `;
  document.head.appendChild(style);
}; 