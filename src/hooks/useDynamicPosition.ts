import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDynamicPositionProps {
  popupWidth?: number;
  popupHeight?: number;
  offset?: number;
}

export const useDynamicPosition = ({
  popupWidth = 400,
  popupHeight = 500,
  offset = 10
}: UseDynamicPositionProps = {}) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const calculatePosition = useCallback((clickEvent: React.MouseEvent | MouseEvent) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get click coordinates
    const clickX = clickEvent.clientX;
    const clickY = clickEvent.clientY;
    
    // Calculate initial position (popup appears near click)
    let x = clickX + offset;
    let y = clickY + offset;
    
    // Adjust horizontal position if popup would go off-screen
    if (x + popupWidth > viewportWidth) {
      x = clickX - popupWidth - offset;
    }
    
    // Ensure popup doesn't go off the left edge
    if (x < 0) {
      x = offset;
    }
    
    // Adjust vertical position if popup would go off-screen
    if (y + popupHeight > viewportHeight) {
      y = clickY - popupHeight - offset;
    }
    
    // Ensure popup doesn't go off the top edge
    if (y < 0) {
      y = offset;
    }
    
    // If popup is still too large for viewport, center it
    if (popupWidth > viewportWidth - 20) {
      x = 10;
    }
    if (popupHeight > viewportHeight - 20) {
      y = 10;
    }
    
    setPosition({ x, y });
  }, [popupWidth, popupHeight, offset]);

  return {
    position,
    calculatePosition,
    setPosition
  };
};
