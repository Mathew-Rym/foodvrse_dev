import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
    >
      {theme === 'light' ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-sm font-medium">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;