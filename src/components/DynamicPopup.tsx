import React, { useState, useEffect } from 'react';
import { useDynamicPosition } from '@/hooks/useDynamicPosition';

interface DynamicPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  clickEvent?: React.MouseEvent | MouseEvent;
  popupWidth?: number;
  popupHeight?: number;
  className?: string;
}

const DynamicPopup: React.FC<DynamicPopupProps> = ({
  isOpen,
  onClose,
  children,
  clickEvent,
  popupWidth = 400,
  popupHeight = 500,
  className = ""
}) => {
  const { position, calculatePosition } = useDynamicPosition({ 
    popupWidth, 
    popupHeight 
  });

  useEffect(() => {
    if (isOpen && clickEvent) {
      calculatePosition(clickEvent);
    }
  }, [isOpen, clickEvent, calculatePosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div 
        className={`absolute bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${className}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${popupWidth}px`,
          maxWidth: `calc(100vw - 20px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DynamicPopup;
