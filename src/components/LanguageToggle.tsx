import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-10">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLanguage(language);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                currentLanguage.code === language.code ? 'bg-gray-700' : ''
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium whitespace-nowrap">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;