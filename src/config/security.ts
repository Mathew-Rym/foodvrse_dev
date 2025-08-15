// FoodVrse Security Configuration
// Multi-layered security approach for e-commerce protection

export const SECURITY_CONFIG = {
  // Client-Level Security
  CLIENT: {
    // Input validation patterns
    VALIDATION_PATTERNS: {
      EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PHONE: /^\+?[\d\s\-\(\)]{10,15}$/,
      PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      NAME: /^[a-zA-Z\s]{2,50}$/,
      ADDRESS: /^[a-zA-Z0-9\s\.,\-\(\)]{10,200}$/,
      CARD_NUMBER: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
      CVV: /^\d{3,4}$/,
      EXPIRY: /^(0[1-9]|1[0-2])\/\d{2}$/
    },
    
    // Rate limiting for client-side actions
    RATE_LIMITS: {
      LOGIN_ATTEMPTS: 5,
      LOGIN_TIMEOUT: 15 * 60 * 1000, // 15 minutes
      API_CALLS: 100,
      API_TIMEOUT: 60 * 1000, // 1 minute
      FORM_SUBMISSIONS: 10,
      FORM_TIMEOUT: 5 * 60 * 1000 // 5 minutes
    },
    
    // XSS Protection
    XSS_PROTECTION: {
      SANITIZE_INPUTS: true,
      ESCAPE_OUTPUTS: true,
      CONTENT_SECURITY_POLICY: true,
      XSS_AUDITOR: true
    },
    
    // CSRF Protection
    CSRF: {
      ENABLED: true,
      TOKEN_REFRESH_INTERVAL: 30 * 60 * 1000, // 30 minutes
      HEADER_NAME: 'X-CSRF-Token'
    }
  },
  
  // Frontend Server & Application Level Security
  FRONTEND: {
    // Session Management
    SESSION: {
      TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
      REFRESH_INTERVAL: 30 * 60 * 1000, // 30 minutes
      SECURE_COOKIES: true,
      HTTP_ONLY: true,
      SAME_SITE: 'strict'
    },
    
    // Authentication Security
    AUTH: {
      PASSWORD_MIN_LENGTH: 8,
      REQUIRE_SPECIAL_CHARS: true,
      REQUIRE_NUMBERS: true,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      MAX_LOGIN_ATTEMPTS: 5,
      LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
      SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
      MFA_ENABLED: false, // Can be enabled later
      JWT_EXPIRY: 24 * 60 * 60, // 24 hours
      REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 // 7 days
    },
    
    // Data Protection
    DATA: {
      ENCRYPTION_ENABLED: true,
      SENSITIVE_FIELDS: ['password', 'card_number', 'cvv', 'ssn', 'phone'],
      MASK_SENSITIVE_DATA: true,
      LOG_SENSITIVE_DATA: false
    }
  },
  
  // Network & Backend Server Level Security
  NETWORK: {
    // API Security
    API: {
      RATE_LIMITING: true,
      REQUEST_TIMEOUT: 30 * 1000, // 30 seconds
      MAX_PAYLOAD_SIZE: '10mb',
      CORS_ENABLED: true,
      ALLOWED_ORIGINS: ['https://www.foodvrse.com', 'https://foodvrse.com'],
      ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-CSRF-Token']
    },
    
    // HTTPS & SSL
    SSL: {
      ENFORCE_HTTPS: true,
      HSTS_ENABLED: true,
      HSTS_MAX_AGE: 31536000, // 1 year
      PRELOAD: true,
      SUBDOMAINS: true
    },
    
    // Headers Security
    HEADERS: {
      X_FRAME_OPTIONS: 'DENY',
      X_CONTENT_TYPE_OPTIONS: 'nosniff',
      X_XSS_PROTECTION: '1; mode=block',
      REFERRER_POLICY: 'strict-origin-when-cross-origin',
      PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=()'
    }
  }
};

// Security utility functions
export class SecurityUtils {
  // Input sanitization
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  // XSS Protection
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // CSRF Token generation
  static generateCSRFToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  // Rate limiting check
  static checkRateLimit(key: string, limit: number, timeout: number): boolean {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Remove expired attempts
    const validAttempts = attempts.filter((timestamp: number) => now - timestamp < timeout);
    
    if (validAttempts.length >= limit) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validAttempts));
    
    return true;
  }
  
  // Input validation
  static validateInput(value: string, pattern: RegExp): boolean {
    return pattern.test(value);
  }
  
  // Sensitive data masking
  static maskSensitiveData(data: string, type: 'email' | 'phone' | 'card'): string {
    switch (type) {
      case 'email':
        const [local, domain] = data.split('@');
        return `${local.substring(0, 2)}***@${domain}`;
      case 'phone':
        return data.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
      case 'card':
        return data.replace(/(\d{4})\d{8}(\d{4})/, '$1********$2');
      default:
        return data;
    }
  }
  
  // Secure random string generation
  static generateSecureRandom(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Hash sensitive data (client-side)
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Security middleware for API calls
export class SecurityMiddleware {
  private static csrfToken: string | null = null;
  
  // Initialize security middleware
  static initialize(): void {
    this.csrfToken = SecurityUtils.generateCSRFToken();
    this.setupSecurityHeaders();
    this.setupEventListeners();
  }
  
  // Setup security headers
  private static setupSecurityHeaders(): void {
    // Add security headers to meta tags
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://cdn.onesignal.com https://api.onesignal.com https://polyfill.io https://player.vimeo.com https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://maps.googleapis.com https://api.supabase.co https://vsvhkkalfziuyttwityc.supabase.co https://onesignal.com https://cdn.onesignal.com https://api.onesignal.com https://polyfill.io wss://vsvhkkalfziuyttwityc.supabase.co wss://*.supabase.co https://*.supabase.co https://*.supabase.com; frame-src 'self' https://storage.googleapis.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://www.google.com/recaptcha/;";
    document.head.appendChild(meta);
  }
  
  // Setup security event listeners
  private static setupEventListeners(): void {
    // Prevent right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // Prevent F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    });
    
    // Sanitize all form inputs
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target && target.value) {
        target.value = SecurityUtils.sanitizeInput(target.value);
      }
    });
  }
  
  // Secure API request wrapper
  static async secureRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // Add security headers
    const secureOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': this.csrfToken || '',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    };
    
    // Rate limiting check
    if (!SecurityUtils.checkRateLimit('api_calls', SECURITY_CONFIG.CLIENT.RATE_LIMITS.API_CALLS, SECURITY_CONFIG.CLIENT.RATE_LIMITS.API_TIMEOUT)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    return fetch(url, secureOptions);
  }
  
  // Validate form data
  static validateFormData(data: Record<string, any>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Check for XSS attempts
        if (value.includes('<script>') || value.includes('javascript:') || value.includes('onerror=')) {
          errors.push(`Invalid input detected in ${key}`);
        }
        
        // Validate based on field type
        switch (key) {
          case 'email':
            if (!SecurityUtils.validateInput(value, SECURITY_CONFIG.CLIENT.VALIDATION_PATTERNS.EMAIL)) {
              errors.push('Invalid email format');
            }
            break;
          case 'password':
            if (!SecurityUtils.validateInput(value, SECURITY_CONFIG.CLIENT.VALIDATION_PATTERNS.PASSWORD)) {
              errors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            }
            break;
          case 'phone':
            if (!SecurityUtils.validateInput(value, SECURITY_CONFIG.CLIENT.VALIDATION_PATTERNS.PHONE)) {
              errors.push('Invalid phone number format');
            }
            break;
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Initialize security on app startup
if (typeof window !== 'undefined') {
  SecurityMiddleware.initialize();
} 