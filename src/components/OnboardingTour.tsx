import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, MapPin, Gift, Users, Navigation, MessageCircle } from "lucide-react";
import { useMediaQuery } from '@/hooks/use-mobile';

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTour = ({ onComplete, onSkip }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    borderRadius?: string;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  }>({});
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const steps = [
    {
      title: "Welcome to FoodVrse!",
      content: "Discover amazing rescue meals and help reduce food waste while saving money and the planet",
      targetId: "hero-section",
      icon: <MapPin className="w-5 h-5" />
    },
    {
      title: "Mystery Bags",
      content: "Try our surprise bags filled with rescued ingredients at great prices - perfect for adventurous foodies!",
      targetId: "mystery-box-section",
      icon: <Gift className="w-5 h-5" />
    },
    {
      title: "Mobile Navigation",
      content: "When you sign in, you'll see a bottom navigation bar to explore all features and manage your orders",
      targetId: "mobile-navigation",
      icon: <Navigation className="w-5 h-5" />
    },
    {
      title: "Share Feedback",
      content: "Look for the floating feedback button in the bottom right corner to share your ideas anytime!",
      targetId: "feedback-fab",
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      title: "Track Your Impact",
      content: "See how much food waste you've helped prevent and the positive environmental impact you're making",
      targetId: "partner-section",
      icon: <Users className="w-5 h-5" />
    }
  ];

  // Simple and accurate tooltip positioning
  const calculateTooltipPosition = () => {
    if (!spotlightStyle) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const tooltipHeight = isMobile ? 280 : isTablet ? 300 : 320;
    const tooltipWidth = isMobile ? Math.min(viewportWidth - 40, 320) : isTablet ? 360 : 400;

    const elementRect = {
      top: spotlightStyle.top,
      left: spotlightStyle.left,
      width: spotlightStyle.width,
      height: spotlightStyle.height,
      right: spotlightStyle.left + spotlightStyle.width,
      bottom: spotlightStyle.top + spotlightStyle.height,
      centerX: spotlightStyle.left + spotlightStyle.width / 2,
      centerY: spotlightStyle.top + spotlightStyle.height / 2
    };

    // Calculate available space in each direction
    const spaceBelow = viewportHeight - elementRect.bottom;
    const spaceAbove = elementRect.top;
    const spaceRight = viewportWidth - elementRect.right;
    const spaceLeft = elementRect.left;

    // Determine best position
    if (spaceBelow >= tooltipHeight + 20) {
      // Position below the element
      return {
        top: `${elementRect.bottom + 20}px`,
        left: `${Math.max(20, Math.min(viewportWidth - tooltipWidth - 20, elementRect.centerX - tooltipWidth / 2))}px`
      };
    } else if (spaceAbove >= tooltipHeight + 20) {
      // Position above the element
      return {
        top: `${Math.max(20, elementRect.top - tooltipHeight - 20)}px`,
        left: `${Math.max(20, Math.min(viewportWidth - tooltipWidth - 20, elementRect.centerX - tooltipWidth / 2))}px`
      };
    } else if (spaceRight >= tooltipWidth + 20) {
      // Position to the right
      return {
        left: `${elementRect.right + 20}px`,
        top: `${Math.max(20, Math.min(viewportHeight - tooltipHeight - 20, elementRect.centerY - tooltipHeight / 2))}px`
      };
    } else if (spaceLeft >= tooltipWidth + 20) {
      // Position to the left
      return {
        left: `${Math.max(20, elementRect.left - tooltipWidth - 20)}px`,
        top: `${Math.max(20, Math.min(viewportHeight - tooltipHeight - 20, elementRect.centerY - tooltipHeight / 2))}px`
      };
    } else {
      // Fallback to center
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  // Update spotlight and tooltip position
  useEffect(() => {
    const updateSpotlight = () => {
      const currentStepData = steps[currentStep];
      let targetElement = document.getElementById(currentStepData.targetId);
      
      // Create fallback elements for missing targets
      if (!targetElement) {
        switch (currentStepData.targetId) {
          case 'mobile-navigation':
            targetElement = document.createElement('div');
            targetElement.id = 'mobile-navigation-fallback';
            targetElement.style.position = 'fixed';
            targetElement.style.bottom = '0';
            targetElement.style.left = '0';
            targetElement.style.width = '100%';
            targetElement.style.height = '70px';
            targetElement.style.backgroundColor = 'rgba(61, 108, 86, 0.15)';
            targetElement.style.borderTop = '3px solid #3D6C56';
            targetElement.style.pointerEvents = 'none';
            targetElement.style.zIndex = '9998';
            document.body.appendChild(targetElement);
            break;
          case 'feedback-fab':
            targetElement = document.createElement('div');
            targetElement.id = 'feedback-fab-fallback';
            targetElement.style.position = 'fixed';
            targetElement.style.bottom = '100px';
            targetElement.style.right = '24px';
            targetElement.style.width = '56px';
            targetElement.style.height = '56px';
            targetElement.style.backgroundColor = 'rgba(252, 218, 91, 0.1)';
            targetElement.style.border = '3px solid #FCDA5B';
            targetElement.style.borderRadius = '50%';
            targetElement.style.pointerEvents = 'none';
            targetElement.style.zIndex = '9998';
            document.body.appendChild(targetElement);
            break;
          default:
            // Try to find similar elements
            targetElement = document.querySelector('main') || 
                           document.querySelector('section') ||
                           document.body;
            break;
        }
      }
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const padding = isMobile ? 16 : 12;
        
        const style = {
          top: Math.max(0, rect.top - padding),
          left: Math.max(0, rect.left - padding),
          width: Math.max(100, rect.width + padding * 2),
          height: Math.max(100, rect.height + padding * 2),
          borderRadius: currentStepData.targetId === 'feedback-fab' ? '50%' : '8px'
        };
        
        setSpotlightStyle(style);
        setTooltipPosition(calculateTooltipPosition());
      }
    };

    updateSpotlight();
    
    // Cleanup fallback elements
    return () => {
      ['mobile-navigation-fallback', 'feedback-fab-fallback'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.remove();
        }
      });
    };
  }, [currentStep, isMobile, isTablet]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (spotlightStyle) {
        setTooltipPosition(calculateTooltipPosition());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [spotlightStyle]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!spotlightStyle) return null;

  return (
    <>
      {/* Spotlight overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9999] pointer-events-none">
        <div
          className="absolute bg-transparent border-2 border-white/80 shadow-2xl pointer-events-none"
          style={{
            top: spotlightStyle.top,
            left: spotlightStyle.left,
            width: spotlightStyle.width,
            height: spotlightStyle.height,
            borderRadius: spotlightStyle.borderRadius,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[10000] pointer-events-auto"
        style={tooltipPosition}
      >
        <Card className="w-full max-w-sm shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                {steps[currentStep].icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {steps[currentStep].content}
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Skip
                </Button>
              </div>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                {currentStep === steps.length - 1 ? (
                  'Get Started'
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OnboardingTour;
