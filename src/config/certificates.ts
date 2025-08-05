// Supabase Root 2021 CA Certificate Configuration
// Certificate details for secure Supabase connections

export const SUPABASE_CERTIFICATE = {
  // Certificate Information
  name: 'Supabase Root 2021 CA',
  issuer: 'Supabase Inc',
  validFrom: '2021-04-28',
  validTo: '2031-04-26',
  serialNumber: '6C BC 4C A1 DE B6 3F 69 2D 0A 20 24 C6 72 89 C2 D1 3D 54 F6',
  
  // Certificate Details
  subject: {
    country: 'US',
    state: 'Delaware',
    locality: 'New Castle',
    organization: 'Supabase Inc',
    commonName: 'Supabase Root 2021 CA'
  },
  
  // Fingerprints
  fingerprints: {
    sha1: 'A4 51 8A 09 33 AF 69 49 48 2C CA 30 14 C0 07 C3 69 DF 9F 6F',
    md5: '86 41 C0 ED 6E B8 27 49 AA 1F 40 BD 36 8D D2 29'
  },
  
  // Public Key Information
  publicKey: {
    algorithm: 'RSA',
    keySize: 2048,
    sha1Fingerprint: 'C6 74 56 48 06 AE 84 1B 36 15 AB FE 26 CF 28 8A 3C BE 2E D5'
  },
  
  // Certificate Authority
  isCA: true,
  maxPathLength: 'Unlimited',
  
  // Usage
  keyUsage: ['Certificate signature', 'Revocation list signature'],
  
  // Subject Key Identifier
  subjectKeyIdentifier: 'A8 D7 B9 76 37 D8 2C ED 92 12 26 9E 0E 32 24 D5 2D 69 46 2C'
};

// Certificate validation function
export const validateSupabaseCertificate = (certificate: any): boolean => {
  try {
    // Check if certificate matches Supabase Root 2021 CA
    const expectedSerial = SUPABASE_CERTIFICATE.serialNumber.replace(/\s/g, '');
    const actualSerial = certificate.serialNumber?.replace(/\s/g, '');
    
    if (actualSerial !== expectedSerial) {
      console.warn('Certificate serial number mismatch');
      return false;
    }
    
    // Check if certificate is not expired
    const now = new Date();
    const validFrom = new Date(SUPABASE_CERTIFICATE.validFrom);
    const validTo = new Date(SUPABASE_CERTIFICATE.validTo);
    
    if (now < validFrom || now > validTo) {
      console.warn('Certificate is expired or not yet valid');
      return false;
    }
    
    // Check if issuer matches
    if (certificate.issuer?.organization !== SUPABASE_CERTIFICATE.issuer) {
      console.warn('Certificate issuer mismatch');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Certificate validation error:', error);
    return false;
  }
};

// Certificate pinning configuration
export const CERTIFICATE_PINNING = {
  // SHA-256 fingerprint for certificate pinning
  sha256: 'A4:51:8A:09:33:AF:69:49:48:2C:CA:30:14:C0:07:C3:69:DF:9F:6F',
  
  // Backup fingerprints (if needed)
  backup: [
    // Add backup certificate fingerprints here if needed
  ],
  
  // Pinning configuration
  maxAge: 5184000, // 60 days in seconds
  includeSubdomains: true,
  reportUri: null // Set to reporting URL if needed
};

// Security headers for certificate
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://cdn.onesignal.com https://polyfill.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://maps.googleapis.com https://api.supabase.co https://onesignal.com https://cdn.onesignal.com https://polyfill.io; frame-src 'self' https://storage.googleapis.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com;"
};

// Certificate monitoring
export const CERTIFICATE_MONITORING = {
  // Check certificate validity
  checkValidity: () => {
    const now = new Date();
    const validTo = new Date(SUPABASE_CERTIFICATE.validTo);
    const daysUntilExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 30) {
      console.warn(`Supabase certificate expires in ${daysUntilExpiry} days`);
      return false;
    }
    
    return true;
  },
  
  // Monitor certificate health
  monitorHealth: () => {
    // Add certificate health monitoring logic here
    const isValid = CERTIFICATE_MONITORING.checkValidity();
    
    if (!isValid) {
      // Send alert or notification
      console.error('Supabase certificate health check failed');
    }
    
    return isValid;
  }
};

// Initialize certificate monitoring
export const initializeCertificateMonitoring = () => {
  // Check certificate validity on startup
  CERTIFICATE_MONITORING.checkValidity();
  
  // Set up periodic monitoring (every 24 hours)
  setInterval(() => {
    CERTIFICATE_MONITORING.monitorHealth();
  }, 24 * 60 * 60 * 1000);
  
  console.log('Supabase certificate monitoring initialized');
}; 