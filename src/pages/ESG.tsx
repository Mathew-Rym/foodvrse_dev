import React from 'react';
import { ArrowLeft, Leaf, Users, Shield, Target, Heart, Globe, Award, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";

const ESG = () => {
  const environmentalMetrics = [
    { label: "CO2 Saved", value: "2,500+ kg", icon: Leaf, color: "text-green-600" },
    { label: "Water Conserved", value: "200,000+ L", icon: Globe, color: "text-blue-600" },
    { label: "Energy Saved", value: "2,500+ kWh", icon: TrendingUp, color: "text-yellow-600" },
    { label: "Meals Rescued", value: "1,000+", icon: Heart, color: "text-red-600" }
  ];

  const socialInitiatives = [
    {
      title: "Community Food Security",
      description: "Providing affordable, nutritious meals to underserved communities while reducing food waste.",
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Local Business Support",
      description: "Partnering with local restaurants and food businesses to create sustainable revenue streams.",
      icon: Heart,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Education & Awareness",
      description: "Raising awareness about food waste and sustainable consumption practices.",
      icon: Target,
      color: "bg-green-100 text-green-600"
    }
  ];

  const governancePrinciples = [
    {
      title: "Transparency",
      description: "Open communication about our impact metrics and business practices.",
      icon: Shield,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Ethical Operations",
      description: "Maintaining high standards of integrity in all business relationships.",
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Stakeholder Engagement",
      description: "Regular engagement with customers, partners, and community members.",
      icon: Users,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">ESG Commitment</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Environmental, Social & Governance</h2>
              <p className="text-green-100 leading-relaxed">
                As a mission-driven company, we are deeply committed to both our purpose and our approach. 
                Our passion for creating a positive impact on the world is at the heart of everything we do.
              </p>
            </div>
          </div>

          {/* Environmental Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {environmentalMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <metric.icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Our Environmental Mission</h4>
                <p className="text-sm text-green-700">
                  By rescuing surplus food, we prevent it from ending up in landfills where it would 
                  produce harmful greenhouse gases. Every meal we save contributes to a more sustainable future.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Social Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialInitiatives.map((initiative, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${initiative.color}`}>
                    <initiative.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{initiative.title}</h4>
                    <p className="text-sm text-gray-600">{initiative.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Governance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {governancePrinciples.map((principle, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${principle.color}`}>
                    <principle.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{principle.title}</h4>
                    <p className="text-sm text-gray-600">{principle.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Join Our Mission</h3>
              <p className="text-green-100 mb-4">
                Together, we can create a more sustainable and equitable food system. 
                Every action counts towards a better future.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="secondary" 
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => window.location.href = '/discover'}
                >
                  Start Saving Food
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-600"
                  onClick={() => window.location.href = '/partner-application'}
                >
                  Become a Partner
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ESG; 