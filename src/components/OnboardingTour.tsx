
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
      content: "Tap a dish to learn its story",
      highlight: "meal-cards",
      position: { top: "45%", left: "50%" }
    },
    {
      title: "Start Saving Food",
      content: "Tap meals to explore and discover amazing rescue dishes",
      highlight: "start-saving",
      position: { top: "35%", left: "25%" }
    },
    {
      title: "Reserve Meals",
      content: "Reserve your favorite rescue meals before they're gone",
      highlight: "reserve-now",
      position: { top: "55%", left: "75%" }
    },
    {
      title: "Mystery Boxes",
      content: "Try our surprise boxes filled with rescued ingredients",
      highlight: "mystery-box",
      position: { top: "65%", left: "50%" }
    },
    {
      title: "Become a Partner",
      content: "Businesses can join our mission to reduce food waste",
      highlight: "business-partner",
      position: { top: "20%", right: "20px" }
    },
    {
      title: "Navigate Easily",
      content: "Use the bottom navigation to explore all features",
      highlight: "navigation",
      position: { bottom: "100px", left: "50%" }
    },
    {
      title: "Make an Impact!",
      content: "Every meal you view supports the fight against food waste!",
      highlight: "impact",
      position: { top: "50%", left: "50%" }
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

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50" />
      
      {/* Spotlight effect for highlighted element */}
      <div 
        className="fixed z-50 pointer-events-none animate-pulse"
        style={{
          ...currentStepData.position,
          transform: currentStepData.position.left === "50%" ? "translateX(-50%)" : "none",
          width: "200px",
          height: "120px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "3px solid #f97316",
          borderRadius: "12px",
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Tooltip Card */}
      <Card 
        className="fixed z-50 w-full max-w-sm bg-white shadow-2xl"
        style={{
          ...currentStepData.position,
          transform: currentStepData.position.left === "50%" ? "translateX(-50%)" : "none",
          marginTop: currentStepData.position.top ? "140px" : undefined,
          marginBottom: currentStepData.position.bottom ? "140px" : undefined,
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
