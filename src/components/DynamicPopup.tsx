import React from 'react';
import { useDynamicPosition } from '@/hooks/useDynamicPosition';

interface DynamicPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  clickEvent?: React.MouseEvent;
}

export const DynamicPopup: React.FC<DynamicPopupProps> = ({
  isOpen,
  onClose,
  children,
  clickEvent
}) => {
  const { position, calculatePosition } = useDynamicPosition();

  React.useEffect(() => {
    if (isOpen && clickEvent) {
      calculatePosition(clickEvent);
    }
  }, [isOpen, clickEvent, calculatePosition]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div
        className="fixed z-50"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%)',
          marginTop: '-10px'
        }}
      >
        {children}
      </div>
    </>
  );
};
