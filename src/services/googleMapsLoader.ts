import { API_CONFIG } from '@/config/api';

export interface GoogleMapsLoaderOptions {
  libraries?: string[];
  retryAttempts?: number;
  retryDelay?: number;
}

class GoogleMapsLoaderService {
  private static instance: GoogleMapsLoaderService;
  private loadingPromise: Promise<typeof google> | null = null;
  private isLoaded = false;
  private loadError: Error | null = null;

  private constructor() {}

  static getInstance(): GoogleMapsLoaderService {
    if (!GoogleMapsLoaderService.instance) {
      GoogleMapsLoaderService.instance = new GoogleMapsLoaderService();
    }
    return GoogleMapsLoaderService.instance;
  }

  /**
   * Load Google Maps API if not already loaded
   */
  async load(options: GoogleMapsLoaderOptions = {}): Promise<typeof google> {
    const {
      libraries = ['places'],
      retryAttempts = 3,
      retryDelay = 1000
    } = options;

    // Return existing Google Maps if already loaded
    if (this.isLoaded && window.google?.maps) {
      return window.google;
    }

    // Return existing loading promise if currently loading
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Check if API key is available
    if (!API_CONFIG.GOOGLE_MAPS_API_KEY) {
      const error = new Error('Google Maps API key is not configured');
      this.loadError = error;
      throw error;
    }

    // Start loading
    this.loadingPromise = this.loadWithRetry(libraries, retryAttempts, retryDelay);

    try {
      const result = await this.loadingPromise;
      this.isLoaded = true;
      this.loadError = null;
      return result;
    } catch (error) {
      this.loadError = error as Error;
      this.loadingPromise = null;
      throw error;
    }
  }

  private async loadWithRetry(
    libraries: string[],
    attempts: number,
    delay: number
  ): Promise<typeof google> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await this.loadScript(libraries);
      } catch (error) {
        console.warn(`Google Maps loading attempt ${i + 1} failed:`, error);
        
        if (i === attempts - 1) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Failed to load Google Maps after all retry attempts');
  }

  private loadScript(libraries: string[]): Promise<typeof google> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.maps) {
        resolve(window.google);
        return;
      }

      // Remove any existing Google Maps scripts to prevent conflicts
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      existingScripts.forEach(script => script.remove());

      // Create and configure script
      const script = document.createElement('script');
      const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_CONFIG.GOOGLE_MAPS_API_KEY}${librariesParam}&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Set up global callback
      (window as any).initGoogleMaps = () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject(new Error('Google Maps API loaded but not available'));
        }
        // Clean up global callback
        delete (window as any).initGoogleMaps;
      };

      // Handle script loading errors
      script.onerror = () => {
        script.remove();
        delete (window as any).initGoogleMaps;
        reject(new Error('Failed to load Google Maps script'));
      };

      // Add script to document
      document.head.appendChild(script);

      // Timeout fallback
      setTimeout(() => {
        if (!window.google?.maps) {
          script.remove();
          delete (window as any).initGoogleMaps;
          reject(new Error('Google Maps loading timeout'));
        }
      }, 10000); // 10 second timeout
    });
  }

  /**
   * Check if Google Maps is loaded
   */
  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!window.google?.maps;
  }

  /**
   * Get the last loading error
   */
  getLastError(): Error | null {
    return this.loadError;
  }

  /**
   * Reset the loader state (useful for testing)
   */
  reset(): void {
    this.loadingPromise = null;
    this.isLoaded = false;
    this.loadError = null;
  }
}

// Export singleton instance
export const googleMapsLoader = GoogleMapsLoaderService.getInstance();

// Convenience functions
export const loadGoogleMaps = (options?: GoogleMapsLoaderOptions) => 
  googleMapsLoader.load(options);

export const isGoogleMapsLoaded = () => 
  googleMapsLoader.isGoogleMapsLoaded();