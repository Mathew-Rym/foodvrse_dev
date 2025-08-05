import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, Download } from 'lucide-react';

const AppInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    
    if (!isInstalled) {
      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Show prompt after a delay if no beforeinstallprompt event
      const timer = setTimeout(() => {
        if (!deferredPrompt) {
          setShowPrompt(true);
        }
      }, 3000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    }
  }, [deferredPrompt]);

  const handleInstallPrompt = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      if (navigator.userAgent.includes('Mobile')) {
        alert('To add FoodVrse to your home screen:\n\n1. Tap the share button (📤)\n2. Select "Add to Home Screen"\n3. Tap "Add" to confirm\n\nOr look for the "Install" button in your browser menu.');
      } else {
        alert('To add FoodVrse to your desktop:\n\n1. Click the install button (📥) in your browser\'s address bar\n2. Or use Ctrl+Shift+A (Chrome) to install\n3. Or look for "Install FoodVrse" in your browser menu\n\nEnjoy quick access to FoodVrse!');
      }
    }
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-brand-yellow to-yellow-100 rounded-lg p-4 text-yellow-900 shadow-lg border border-yellow-400">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm mb-1 text-white">Add to Home Screen</h4>
          <p className="text-xs text-white/90">
            Install FoodVrse for quick access
          </p>
        </div>
        <button
          onClick={handleInstallPrompt}
          className="flex items-center space-x-2 bg-yellow-700 hover:bg-yellow-800 text-white px-3 py-2 rounded-lg transition-all duration-200 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="text-xs font-medium">Install</span>
        </button>
      </div>
      <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-white/30">
        <div className="flex items-center space-x-1">
          <Smartphone className="w-4 h-4 text-white/80" />
          <span className="text-xs text-white/90">Phone</span>
        </div>
        <div className="flex items-center space-x-1">
          <Tablet className="w-4 h-4 text-white/80" />
          <span className="text-xs text-white/90">Tablet</span>
        </div>
        <div className="flex items-center space-x-1">
          <Monitor className="w-4 h-4 text-white/80" />
          <span className="text-xs text-white/90">Desktop</span>
        </div>
      </div>
    </div>
  );
};

export default AppInstallPrompt;