import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useDynamicPosition = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const calculatePosition = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate center of the clicked element
    let x = rect.left + rect.width / 2;
    let y = rect.top + rect.height / 2;
    
    // Ensure popup stays within viewport bounds
    const popupWidth = 400; // Approximate popup width
    const popupHeight = 600; // Approximate popup height
    
    // Adjust horizontal position if popup would go off-screen
    if (x + popupWidth / 2 > viewportWidth) {
      x = viewportWidth - popupWidth / 2;
    } else if (x - popupWidth / 2 < 0) {
      x = popupWidth / 2;
    }
    
    // Adjust vertical position if popup would go off-screen
    if (y - popupHeight < 0) {
      // If popup would go above viewport, position it below the element
      y = rect.bottom + popupHeight / 2;
    } else if (y + popupHeight / 2 > viewportHeight) {
      // If popup would go below viewport, position it above the element
      y = rect.top - popupHeight / 2;
    }
    
    setPosition({ x, y });
  }, []);

  return { position, calculatePosition };
};
