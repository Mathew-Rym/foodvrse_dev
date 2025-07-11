import { Shield, CheckCircle, AlertTriangle, Users, Clock, Thermometer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/MobileLayout";
import BackToTop from "@/components/BackToTop";
import { useLocation, useNavigate } from "react-router-dom";

const SafetyGuidelines = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.state?.hideNavbar;

  const handleBack = () => {
    navigate(-1);
  };
  const safetyMeasures = [
    {
      icon: Shield,
      title: "Partner Verification",
      description: "All restaurants and stores undergo strict verification including valid licenses, health permits, and food safety certifications.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Clock,
      title: "Same-Day Preparation",
      description: "Food is prepared fresh on the day of collection. We ensure all items meet our freshness standards before being made available.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Thermometer,
      title: "Temperature Control",
      description: "Partners maintain proper food storage temperatures and follow cold chain protocols to ensure food safety.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Users,
      title: "Regular Inspections",
      description: "Our team conducts regular quality checks and maintains ongoing relationships with all partner establishments.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const userGuidelines = [
    "Check expiration dates and use your best judgment",
    "Consume fresh items on the same day when possible",
    "Store perishable items properly after collection",
    "Inform restaurants about severe allergies during pickup",
    "Report any concerns to our support team immediately",
    "Follow standard food safety practices at home"
  ];

  const qualityStandards = [
    {
      title: "Licensed Partners Only",
      description: "We work exclusively with licensed restaurants and certified food retailers"
    },
    {
      title: "Health Department Compliance",
      description: "All partners maintain current health department certifications and ratings"
    },
    {
      title: "Food Safety Training",
      description: "Partner staff receive ongoing food safety and handling training"
    },
    {
      title: "Quality Monitoring",
      description: "Continuous monitoring system to ensure consistent food quality standards"
    },
    {
      title: "Rapid Response",
      description: "Immediate action protocol for any food safety concerns or incidents"
    },
    {
      title: "Transparent Reporting",
      description: "Clear communication about any issues and resolution steps taken"
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
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Safety Guidelines</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your safety is our priority. Learn how we ensure all food meets the highest safety standards 
            and what you can do to stay safe.
          </p>
        </div>

        {/* Our Safety Measures */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How We Ensure Food Safety</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {safetyMeasures.map((measure, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className={`w-12 h-12 rounded-lg ${measure.color} flex items-center justify-center mb-4`}>
                  <measure.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{measure.title}</h3>
                <p className="text-gray-600">{measure.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Standards */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Quality Standards</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {qualityStandards.map((standard, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{standard.title}</h4>
                  <p className="text-sm text-gray-600">{standard.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Guidelines */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Guidelines for Users</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Important Reminders</h3>
            </div>
            <div className="space-y-3">
              {userGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Food Safety Tips */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">General Food Safety Tips</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Storage</h4>
              <ul className="space-y-1">
                <li>• Refrigerate perishables within 2 hours</li>
                <li>• Keep cold foods below 4°C (40°F)</li>
                <li>• Store raw and cooked foods separately</li>
                <li>• Use airtight containers when possible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Consumption</h4>
              <ul className="space-y-1">
                <li>• Check appearance, smell, and texture</li>
                <li>• When in doubt, don't consume</li>
                <li>• Reheat food to proper temperatures</li>
                <li>• Follow your dietary restrictions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact for Concerns */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Have a Safety Concern?</h3>
          <p className="text-gray-600 mb-4">
            If you have any concerns about food safety or quality, please contact us immediately via email.
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">Email Support</p>
            <button 
              onClick={() => window.location.href = "mailto:hello@foodvrse.com"}
              className="text-lg font-bold text-red-600 hover:underline"
            >
              hello@foodvrse.com
            </button>
            <p className="text-sm text-gray-600">We respond to safety concerns promptly</p>
          </div>
        </div>
      </div>
      <BackToTop />
    </MobileLayout>
  );
};

export default SafetyGuidelines;