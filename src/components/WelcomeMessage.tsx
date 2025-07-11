import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const WelcomeMessage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the welcome message on load
    setIsVisible(true);
    
    // Auto-hide after 7 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto shadow-2xl animate-scale-in">
        <div className="text-center">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to FoodVrse!
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Discover delicious surplus, save money, and turn it into legends.
            </p>
            <p className="text-orange-500 font-medium">
              ✨ Tap to explore. Swipe to save. Your next zero-waste meal awaits!
            </p>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Let's Get Started!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;