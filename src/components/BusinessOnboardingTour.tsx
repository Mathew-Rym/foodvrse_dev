import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Plus, BarChart3, DollarSign, Leaf } from "lucide-react";

interface BusinessOnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const BusinessOnboardingTour = ({ onComplete, onSkip }: BusinessOnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your Business Dashboard!",
      content: "Manage your food rescue listings and track your environmental impact",
      targetId: "business-header",
      position: { top: "20%", left: "50%" } as const,
      icon: (
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full shadow-sm border border-green-300">
          <DollarSign className="w-4 h-4 text-green-700" />
        </div>
      )
    },
    {
      title: "Track Your Impact",
      content: "Monitor your sales, CO₂ savings, and customer ratings in real-time",
      targetId: "stats-overview",
      position: { top: "35%", left: "50%" } as const,
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Add Your First Item",
      content: "Click here to list your first food rescue item with AI-powered suggestions",
      targetId: "add-item-button",
      position: { top: "50%", left: "50%" } as const,
              icon: <Plus className="w-6 h-6 text-brand-green" />
    },
    {
      title: "Carbon Credits Coming Soon",
      content: "Your CO₂ savings will soon be convertible to carbon credits for additional income!",
      targetId: "co2-stats",
      position: { top: "40%", left: "50%" } as const,
      icon: <Leaf className="w-6 h-6 text-green-600" />
    },
    {
      title: "Manage Your Listings",
      content: "View, edit, and track performance of all your active food rescue listings",
      targetId: "active-listings",
      position: { top: "65%", left: "50%" } as const,
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />
    },
    {
      title: "Ready to Start!",
      content: "You're all set! Start adding items and making an environmental impact while earning money.",
      targetId: "business-header",
      position: { top: "50%", left: "50%" } as const,
      icon: <ArrowRight className="w-6 h-6 text-green-600" />
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
          className="fixed z-50 pointer-events-none border-2 border-brand-green rounded-lg"
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
          marginBottom: "20px",
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
            <div className="flex items-center gap-3 mb-3">
              {currentStepData.icon}
              <h2 className="text-xl font-bold text-gray-900">
                {currentStepData.title}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full flex-1 ${
                  index <= currentStep ? 'bg-brand-green' : 'bg-gray-200'
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
              {currentStep === steps.length - 1 ? 'Start Selling!' : 'Next'}
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

export default BusinessOnboardingTour;