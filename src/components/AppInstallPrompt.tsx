import React from 'react';
import { Smartphone, Monitor, Tablet, Plus } from 'lucide-react';

const AppInstallPrompt: React.FC = () => {
  const handleInstallPrompt = () => {
    // For demonstration - in a real app, you'd use the BeforeInstallPrompt event
    if (navigator.userAgent.includes('Mobile')) {
      alert('To add FoodVrse to your home screen:\n\n1. Tap the share button\n2. Select "Add to Home Screen"\n3. Tap "Add" to confirm');
    } else {
      alert('To add FoodVrse to your desktop:\n\n1. Click the install button in your browser\'s address bar\n2. Or use Ctrl+Shift+A (Chrome) to install\n3. Enjoy quick access to FoodVrse!');
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm mb-1">Add to Home Screen</h4>
          <p className="text-xs opacity-90">
            Install FoodVrse for quick access
          </p>
        </div>
        <button
          onClick={handleInstallPrompt}
          className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-medium">Install</span>
        </button>
      </div>
      <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-white border-opacity-20">
        <div className="flex items-center space-x-1">
          <Smartphone className="w-4 h-4 opacity-75" />
          <span className="text-xs">Phone</span>
        </div>
        <div className="flex items-center space-x-1">
          <Tablet className="w-4 h-4 opacity-75" />
          <span className="text-xs">Tablet</span>
        </div>
        <div className="flex items-center space-x-1">
          <Monitor className="w-4 h-4 opacity-75" />
          <span className="text-xs">Desktop</span>
        </div>
      </div>
    </div>
  );
};

export default AppInstallPrompt;