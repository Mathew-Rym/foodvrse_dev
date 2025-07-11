
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTour = ({ onComplete, onSkip }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to FoodVrse!",
      content: "Discover amazing rescue meals and help reduce food waste",
      targetId: "hero-section",
      position: { top: "30%", left: "50%" }
    },
    {
      title: "Browse Rescue Meals",
      content: "Tap on meal cards to view details and reserve your favorites",
      targetId: "food-listings",
      position: { top: "45%", left: "50%" }
    },
    {
      title: "Mystery Boxes",
      content: "Try our surprise boxes filled with rescued ingredients at great prices",
      targetId: "mystery-box-section",
      position: { top: "60%", left: "50%" }
    },
    {
      title: "Become a Partner",
      content: "Businesses can join our mission to reduce food waste",
      targetId: "business-partner-link",
      position: { top: "20%", right: "20px" }
    },
    {
      title: "Navigation",
      content: "Use the bottom navigation to explore all features when signed in",
      targetId: "mobile-navigation",
      position: { bottom: "140px", left: "50%" }
    },
    {
      title: "Share Feedback",
      content: "Got ideas? Use this button to share feedback anytime!",
      targetId: "feedback-fab",
      position: { bottom: "100px", right: "80px" }
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  // Create spotlight effect for the target element
  const createSpotlight = () => {
    const targetElement = document.getElementById(currentStepData.targetId);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      return {
        top: rect.top - 10,
        left: rect.left - 10,
        width: rect.width + 20,
        height: rect.height + 20,
      };
    }
    return null;
  };

  const spotlightStyle = createSpotlight();

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50" />
      
      {/* Simple highlight border for current element */}
      {spotlightStyle && (
        <div 
          className="fixed z-50 pointer-events-none border-2 border-orange-400 rounded-lg"
          style={{
            top: `${spotlightStyle.top}px`,
            left: `${spotlightStyle.left}px`,
            width: `${spotlightStyle.width}px`,
            height: `${spotlightStyle.height}px`,
          }}
        />
      )}

      {/* Tooltip Card */}
      <Card 
        className="fixed z-50 w-full max-w-sm bg-white shadow-2xl"
        style={{
          ...currentStepData.position,
          transform: currentStepData.position.left === "50%" ? "translateX(-50%)" : "none",
          marginTop: currentStepData.position.top ? "20px" : undefined,
          marginBottom: currentStepData.position.bottom ? "20px" : undefined,
        }}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full flex-1 ${
                  index <= currentStep ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
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
