import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Red segment - main vertical stem */}
        <path 
          d="M4 2 L4 20 L8 20 L8 16 L12 16 L12 12 L8 12 L8 8 L12 8 L12 4 L8 4 L8 2 Z" 
          fill="#DC2626"
        />
        {/* Green segment - top horizontal bar */}
        <path 
          d="M8 4 L20 4 L20 8 L12 8 L12 4 Z" 
          fill="#16A34A"
        />
        {/* Yellow segment - middle accent */}
        <path 
          d="M12 8 L16 8 L16 12 L12 12 Z" 
          fill="#FCDA5B"
        />
      </svg>
    </div>
  );
};

export default Logo; 