
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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const steps = [
    {
      title: "Welcome to FoodVrse!",
      content: "Discover amazing rescue meals and help reduce food waste while saving money and the planet",
      targetId: "hero-section",
      icon: <MapPin className="w-5 h-5" />,
      mobilePosition: { top: "15%", left: "50%" },
      desktopPosition: { top: "25%", left: "50%" }
    },
    {
      title: "Mystery Boxes",
      content: "Try our surprise boxes filled with rescued ingredients at great prices - perfect for adventurous foodies!",
      targetId: "mystery-box-section",
      icon: <Gift className="w-5 h-5" />,
      mobilePosition: { top: "35%", left: "50%" },
      desktopPosition: { top: "40%", left: "50%" }
    },
    {
      title: "Mobile Navigation",
      content: "When you sign in, you'll see a bottom navigation bar to explore all features and manage your orders",
      targetId: "mobile-navigation",
      icon: <Navigation className="w-5 h-5" />,
      mobilePosition: { bottom: "120px", left: "50%" },
      desktopPosition: { bottom: "140px", left: "50%" }
    },
    {
      title: "Share Feedback",
      content: "Look for the floating feedback button in the bottom right corner to share your ideas anytime!",
      targetId: "feedback-fab",
      icon: <MessageCircle className="w-5 h-5" />,
      mobilePosition: { bottom: "80px", right: "20px" },
      desktopPosition: { bottom: "100px", right: "80px" }
    },
    {
      title: "Become a Partner",
      content: "Are you a business? Join our mission to reduce food waste and earn money while making a difference",
      targetId: "partner-section",
      icon: <Users className="w-5 h-5" />,
      mobilePosition: { top: "75%", left: "50%" },
      desktopPosition: { top: "70%", left: "50%" }
    }
  ];

  // Update spotlight effect when step changes
  useEffect(() => {
    const updateSpotlight = () => {
      const currentStepData = steps[currentStep];
      let targetElement = document.getElementById(currentStepData.targetId);
      
      // Fallback elements for conditional rendering
      if (!targetElement) {
        switch (currentStepData.targetId) {
          case 'mobile-navigation':
            // If mobile navigation is not rendered, highlight the bottom area
            targetElement = document.createElement('div');
            targetElement.id = 'mobile-navigation-fallback';
            targetElement.style.position = 'fixed';
            targetElement.style.bottom = '0';
            targetElement.style.left = '0';
            targetElement.style.width = '100%';
            targetElement.style.height = '80px';
            targetElement.style.backgroundColor = 'rgba(249, 115, 22, 0.2)';
            targetElement.style.borderTop = '3px solid rgba(249, 115, 22, 0.8)';
            targetElement.style.pointerEvents = 'none';
            targetElement.style.zIndex = '9998';
            document.body.appendChild(targetElement);
            break;
          case 'feedback-fab':
            // If feedback FAB is not visible, create a more visible fallback
            targetElement = document.createElement('div');
            targetElement.id = 'feedback-fab-fallback';
            targetElement.style.position = 'fixed';
            targetElement.style.bottom = '20px';
            targetElement.style.right = '20px';
            targetElement.style.width = '80px';
            targetElement.style.height = '80px';
            targetElement.style.backgroundColor = 'rgba(249, 115, 22, 0.2)';
            targetElement.style.border = '3px solid rgba(249, 115, 22, 0.8)';
            targetElement.style.borderRadius = '50%';
            targetElement.style.pointerEvents = 'none';
            targetElement.style.zIndex = '9998';
            document.body.appendChild(targetElement);
            break;
          case 'partner-section':
            // Try alternative selectors for partner section
            targetElement = document.querySelector('[data-partner-section]') || 
                           document.querySelector('.partner-section') ||
                           document.querySelector('footer');
            break;
          default:
            break;
        }
      }
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Responsive padding based on screen size
        const padding = isMobile ? 12 : isTablet ? 10 : 8;
        
        // Ensure the element is visible in viewport
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Handle fixed positioned elements differently
        let top, left, width, height;
        
                  if (currentStepData.targetId === 'feedback-fab' || targetElement.style.position === 'fixed') {
            // For fixed elements, use viewport coordinates directly
            top = rect.top - padding;
            left = rect.left - padding;
            width = rect.width + (padding * 2);
            height = rect.height + (padding * 2);
          } else {
          // For normal elements, use scroll-adjusted coordinates
          top = rect.top + scrollTop - padding;
          left = rect.left + scrollLeft - padding;
          width = rect.width + (padding * 2);
          height = rect.height + (padding * 2);
        }
        
        // Ensure highlight doesn't go off-screen
        if (top < 0) {
          top = 10;
        }
        if (left < 0) {
          left = 10;
        }
        if (top + height > viewportHeight) {
          height = viewportHeight - top - 10;
        }
        if (left + width > viewportWidth) {
          width = viewportWidth - left - 10;
        }
        
        // Ensure minimum size for visibility
        const minSize = isMobile ? 80 : 60;
        
        const finalStyle = {
          top: Math.max(0, top),
          left: Math.max(0, left),
          width: Math.max(width, minSize),
          height: Math.max(height, minSize),
          borderRadius: isMobile ? '12px' : '8px'
        };
        
        setSpotlightStyle(finalStyle);
        
        // Clean up fallback elements
        if (targetElement.id && (targetElement.id.includes('fallback') || targetElement.id.includes('focused'))) {
          setTimeout(() => {
            if (targetElement && targetElement.parentNode) {
              targetElement.parentNode.removeChild(targetElement);
            }
          }, 200);
        }
      } else {
        setSpotlightStyle(null);
      }
    };

    // Scroll to target element smoothly with responsive offset
    const scrollToTarget = () => {
      const currentStepData = steps[currentStep];
      let targetElement = document.getElementById(currentStepData.targetId);
      
      // Handle special cases for conditional elements
      if (!targetElement) {
        switch (currentStepData.targetId) {
          case 'mobile-navigation':
            // Scroll to bottom for mobile navigation
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
            return;
          case 'feedback-fab':
            // Scroll to bottom right area for feedback FAB
            window.scrollTo({
              top: document.body.scrollHeight - window.innerHeight + 100,
              behavior: 'smooth'
            });
            return;
          case 'game-section':
            // Try to find game section or scroll to mystery box section
            targetElement = document.getElementById('game-section') || document.getElementById('mystery-box-section');
            break;
          case 'partner-section':
            // Try to find partner section or scroll to footer
            targetElement = document.getElementById('partner-section') || document.querySelector('footer');
            break;
          default:
            break;
        }
      }
      
      if (targetElement) {
        const targetRect = targetElement.getBoundingClientRect();
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Responsive offset based on screen size
        const offset = isMobile ? 80 : isTablet ? 100 : 120;
        const targetScrollTop = currentScrollTop + targetRect.top - offset;
        
        // Smooth scroll to the target
        window.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
      }
    };

    // Initial update and scroll with delay for better positioning
    const timer = setTimeout(() => {
      updateSpotlight();
      scrollToTarget();
    }, currentStepData.targetId === 'feedback-fab' ? 300 : 100);

    // Update on window resize with debouncing
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateSpotlight();
      }, 150);
    };

    // Update on scroll with throttling
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        updateSpotlight();
      }, 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      clearTimeout(scrollTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentStep, isMobile, isTablet]);

  // Cleanup function to remove all fallback elements
  const cleanupFallbacks = () => {
    const fallbacks = document.querySelectorAll('[id*="fallback"], [id*="focused"]');
    fallbacks.forEach(fallback => {
      if (fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      cleanupFallbacks();
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    cleanupFallbacks();
    onSkip();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, nextStep, prevStep, onSkip]);

  const currentStepData = steps[currentStep];
  const position = isMobile ? currentStepData.mobilePosition : currentStepData.desktopPosition;

  // Calculate responsive tooltip position
  const getTooltipPosition = () => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const tooltipHeight = isMobile ? 280 : 320; // Approximate tooltip height
    const tooltipWidth = isMobile ? viewportWidth - 32 : 400; // Approximate tooltip width
    
    let finalPosition = { ...position };
    
    // Ensure tooltip doesn't go off-screen
    if (position.top && typeof position.top === 'string') {
      const topPercent = parseInt(position.top);
      if (topPercent > 70) {
        finalPosition.top = '60%';
      }
    }
    
    if (position.bottom && typeof position.bottom === 'string') {
      const bottomPercent = parseInt(position.bottom);
      if (bottomPercent < 120) {
        finalPosition.bottom = '140px';
      }
    }
    
    // Adjust horizontal positioning for mobile
    if (isMobile && position.left === '50%') {
      finalPosition.left = '50%';
    }
    
    return finalPosition;
  };

  return (
    <>
      {/* Dark overlay with spotlight cutout */}
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
        {spotlightStyle && (
          <>
            {/* Simple highlight border - always visible */}
            <div
              className="absolute border-4 border-orange-400 rounded-lg bg-orange-400 bg-opacity-10"
              style={{
                top: `${spotlightStyle.top}px`,
                left: `${spotlightStyle.left}px`,
                width: `${spotlightStyle.width}px`,
                height: `${spotlightStyle.height}px`,
                borderRadius: spotlightStyle.borderRadius,
                zIndex: 55,
                boxShadow: '0 0 20px rgba(249, 115, 22, 0.8)',
              }}
            />
            {/* Glow effect */}
            <div
              className="absolute bg-transparent rounded-lg"
              style={{
                top: `${spotlightStyle.top - 8}px`,
                left: `${spotlightStyle.left - 8}px`,
                width: `${spotlightStyle.width + 16}px`,
                height: `${spotlightStyle.height + 16}px`,
                borderRadius: spotlightStyle.borderRadius,
                boxShadow: `0 0 30px rgba(249, 115, 22, 0.8), 0 0 60px rgba(249, 115, 22, 0.4)`,
                zIndex: 54,
              }}
            />
            {/* Main spotlight cutout */}
            <div
              className="absolute bg-transparent border-4 border-orange-400 rounded-lg"
              style={{
                top: `${spotlightStyle.top}px`,
                left: `${spotlightStyle.left}px`,
                width: `${spotlightStyle.width}px`,
                height: `${spotlightStyle.height}px`,
                borderRadius: spotlightStyle.borderRadius,
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.85)`,
                zIndex: 51,
              }}
            />
            {/* Additional highlight for better visibility */}
            <div
              className="absolute border-2 border-white rounded-lg"
              style={{
                top: `${spotlightStyle.top - 2}px`,
                left: `${spotlightStyle.left - 2}px`,
                width: `${spotlightStyle.width + 4}px`,
                height: `${spotlightStyle.height + 4}px`,
                borderRadius: spotlightStyle.borderRadius,
                zIndex: 56,
              }}
            />
          </>
        )}
      </div>

      {/* Tooltip Card */}
      <Card 
        className={`fixed z-50 bg-card shadow-2xl border-0 ${
          isMobile ? 'w-[calc(100vw-32px)] max-w-sm' : 'w-full max-w-md'
        }`}
        style={{
          ...getTooltipPosition(),
          transform: getTooltipPosition().left === "50%" ? "translateX(-50%)" : "none",
          marginTop: getTooltipPosition().top ? "20px" : undefined,
          marginBottom: getTooltipPosition().bottom ? "20px" : undefined,
        }}
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="text-orange-500">
                {currentStepData.icon}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
                    <h2 id="tour-title" className="text-xl font-bold text-foreground mb-3">
          {currentStepData.title}
        </h2>
        <p id="tour-content" className="text-muted-foreground leading-relaxed text-sm">
          {currentStepData.content}
        </p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                  index <= currentStep ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-muted-foreground border-border hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              {isMobile ? '' : 'Back'}
            </Button>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : (isMobile ? 'Next' : 'Continue')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Skip button */}
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Skip Tour
            </Button>

          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OnboardingTour;
