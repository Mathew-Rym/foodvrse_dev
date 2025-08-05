import { Users, Heart, Shield, AlertTriangle, Flag, CheckCircle, ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import BackToTop from "@/components/BackToTop";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const CommunityGuidelines = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.state?.hideNavbar;


  const handleBack = () => {
    navigate(-1);
  };

  const coreGuidelines = [
    {
      icon: Heart,
      title: "Be Respectful and Courteous",
      description: "Treat all users, restaurant staff, and community members with kindness and respect. We're all working together to reduce food waste and help each other.",
      color: "bg-green-100 text-green-600",
      examples: [
        "Use polite language in reviews and communications",
        "Respect pickup times and restaurant staff",
        "Be patient and understanding with delays"
      ]
    },
    {
      icon: Shield,
      title: "Only List Legitimate Food Items",
      description: "Ensure all food listings are accurate, legitimate, and properly described. Honesty builds trust in our community.",
      color: "bg-blue-100 text-blue-600",
      examples: [
        "Provide accurate descriptions of food items",
        "Include proper expiration dates",
        "Don't misrepresent food quality or quantity"
      ]
    },
    {
      icon: CheckCircle,
      title: "Maintain Food Safety Standards",
      description: "Follow proper food handling and safety practices. Your health and the health of others depends on it.",
      color: "bg-orange-100 text-orange-600",
      examples: [
        "Store food at proper temperatures",
        "Check expiration dates before consumption",
        "Report any food safety concerns immediately"
      ]
    },
    {
      icon: Shield,
      title: "Respect Intellectual Property Rights",
      description: "Don't use copyrighted materials, trademarks, or other intellectual property without proper authorization.",
      color: "bg-purple-100 text-purple-600",
      examples: [
        "Don't copy restaurant logos or branding",
        "Respect copyright in reviews and photos",
        "Use original content when possible"
      ]
    },
    {
      icon: Users,
      title: "No Harassment, Discrimination, or Hate Speech",
      description: "We have zero tolerance for harassment, discrimination, or hate speech of any kind. Our community is inclusive and welcoming to all.",
      color: "bg-red-100 text-red-600",
      examples: [
        "No bullying or threatening behavior",
        "No discrimination based on race, gender, religion, etc.",
        "No hate speech or offensive language"
      ]
    },
    {
      icon: Flag,
      title: "Report Suspicious or Inappropriate Behavior",
      description: "Help keep our community safe by reporting any suspicious or inappropriate behavior you encounter.",
      color: "bg-yellow-100 text-yellow-600",
      examples: [
        "Report fake listings or scams",
        "Flag inappropriate reviews or comments",
        "Report serious violations through appropriate channels"
      ]
    }
  ];

  const prohibitedBehaviors = [
    "Creating fake or misleading food listings",
    "Harassing or threatening other users",
    "Discriminatory language or behavior",
    "Spamming or excessive messaging",
    "Attempting to circumvent safety measures",
    "Sharing personal information without consent",
    "Using the platform for illegal activities",
    "Impersonating FoodVrse staff or partners"
  ];

  const reportingProcess = [
    {
      step: 1,
      title: "Identify the Issue",
      description: "Take note of the specific behavior, user, or content that violates our guidelines."
    },
    {
      step: 2,
      title: "Document Evidence",
      description: "Screenshot or save relevant information to help us investigate the issue."
    },
    {
      step: 3,
      title: "Submit Report",
      description: "Use our reporting tools with detailed information about the violation."
    },
    {
      step: 4,
      title: "Follow Up",
      description: "We'll investigate and take appropriate action, keeping you informed of the outcome."
    }
  ];

  const consequences = [
    {
      level: "Warning",
      description: "First-time minor violations result in a warning and educational resources.",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      level: "Temporary Suspension",
      description: "Repeated violations or moderate issues may result in temporary account suspension.",
      color: "bg-orange-100 text-orange-800"
    },
    {
      level: "Permanent Ban",
      description: "Serious violations, harassment, or illegal activities result in permanent account removal.",
      color: "bg-red-100 text-red-800"
    }
  ];

  return (
    <MobileLayout hideNavbar={hideNavbar}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our community guidelines help ensure a safe, respectful, and positive experience for everyone 
            using FoodVrse. Please read and follow these guidelines.
          </p>
        </div>

        {/* Core Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Core Community Guidelines</h2>
          <div className="space-y-6">
            {coreGuidelines.map((guideline, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${guideline.color} flex items-center justify-center flex-shrink-0`}>
                      <guideline.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{guideline.title}</CardTitle>
                      <p className="text-gray-600 mb-4">{guideline.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Examples:</h4>
                        <ul className="space-y-1">
                          {guideline.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Prohibited Behaviors */}
        <section className="mb-12">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <CardTitle className="text-xl text-red-900">Prohibited Behaviors</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                The following behaviors are strictly prohibited and may result in immediate account suspension or termination:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {prohibitedBehaviors.map((behavior, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{behavior}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reporting Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Report Violations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reportingProcess.map((step, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Consequences */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Consequences of Violations</h2>
          <div className="space-y-4">
            {consequences.map((consequence, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className={`${consequence.color} text-sm font-semibold`}>
                        {consequence.level}
                      </Badge>
                      <p className="text-gray-600 mt-2">{consequence.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>



        {/* Footer Note */}
        <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            These guidelines are updated regularly to ensure they reflect our community values and needs. 
            By using FoodVrse, you agree to follow these guidelines and help maintain a positive community environment.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      <BackToTop />
    </MobileLayout>
  );
};

export default CommunityGuidelines; 