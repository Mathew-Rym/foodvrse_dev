
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Building, MapPin, Users, Clock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_CONFIG } from '@/config/recaptcha';

const PartnerApplication = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    name: "",
    phone: "",
    jobTitle: "",
    businessType: "",
    location: "",
    employeeCount: "",
    website: "",
    description: "",
    partnershipInterest: "",
    monthlyWaste: ""
  });

  const [consent, setConsent] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showESGCalculator, setShowESGCalculator] = useState(false);
  const [esgData, setEsgData] = useState({
    monthlyRevenue: 2000000,
    foodWastePercent: 10,
    foodWasteValue: 200000,
    foodVrseRecoveryPercent: 40,
    savingsViaFoodVrse: 80000,
    avgCostPerMysteryBag: 100,
    mysteryBagsSaved: 800,
    foodWeightRecovered: 200,
    co2Prevented: 500
  });

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast.error("Please agree to receive newsletters and information");
      return;
    }


    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare email template parameters
      const templateParams = {
        to_email: 'hello@foodvrse.com',
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company,
        job_title: formData.jobTitle,
        phone: formData.phone,
        business_type: formData.businessType,
        location: formData.location,
        employee_count: formData.employeeCount,
        website: formData.website,
        description: formData.description,
        partnership_interest: formData.partnershipInterest,
        monthly_waste: formData.monthlyWaste,
        message: `
Business Partnership Application from FoodVrse Website:

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Job Title: ${formData.jobTitle}

Business Information:
- Company: ${formData.company}
- Business Type: ${formData.businessType}
- Location: ${formData.location}
- Employee Count: ${formData.employeeCount}
- Website: ${formData.website}

Partnership Details:
- Business Description: ${formData.description}
- Partnership Interest: ${formData.partnershipInterest}
- Monthly Food Waste: ${formData.monthlyWaste}

This application was submitted through the FoodVrse website.
        `
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (result.status === 200) {
        toast.success("Business application submitted successfully! We'll get back to you soon.");
        
        // Reset form
        setFormData({
          email: "",
          company: "",
          name: "",
          phone: "",
          jobTitle: "",
          businessType: "",
          location: "",
          employeeCount: "",
          website: "",
          description: "",
          partnershipInterest: "",
          monthlyWaste: ""
        });
        setConsent(false);
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      toast.error("Failed to submit application. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ESG Calculator functions
  const calculateESGImpact = (monthlyRevenue: number) => {
    const foodWastePercent = 10; // Fixed default
    const foodWasteValue = (monthlyRevenue * foodWastePercent) / 100;
    const foodVrseRecoveryPercent = 40; // Fixed default
    const savingsViaFoodVrse = (foodWasteValue * foodVrseRecoveryPercent) / 100;
    const avgCostPerMysteryBag = 100; // Fixed default
    const mysteryBagsSaved = Math.round(savingsViaFoodVrse / avgCostPerMysteryBag);
    const foodWeightRecovered = Math.round(mysteryBagsSaved * 0.25); // 0.25 kg per bag
    const co2Prevented = Math.round(foodWeightRecovered * 2.5); // 2.5 kg CO2eq per kg food

    setEsgData({
      monthlyRevenue,
      foodWastePercent,
      foodWasteValue,
      foodVrseRecoveryPercent,
      savingsViaFoodVrse,
      avgCostPerMysteryBag,
      mysteryBagsSaved,
      foodWeightRecovered,
      co2Prevented
    });
  };

  const handleESGRevenueChange = (value: number) => {
    calculateESGImpact(value);
  };

  const businessTypes = [
    "Restaurant",
    "Cafe",
    "Bakery",
    "Grocery Store",
    "Supermarket",
    "Hotel",
    "Catering Service",
    "Food Manufacturer",
    "Food Distributor",
    "Other"
  ];

  const employeeCounts = [
    "1-10",
    "11-50",
    "51-100",
    "101-250",
    "251-500",
    "500+"
  ];

  const partnershipInterests = [
    "Reduce food waste",
    "Increase revenue",
    "Sustainability goals",
    "Community impact",
    "Cost savings",
    "All of the above"
  ];

  const monthlyWasteOptions = [
    "Less than 100kg",
    "100-500kg",
    "500kg-1 ton",
    "1-5 tons",
    "5+ tons",
    "Not sure"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">BUSINESS PARTNERSHIP APPLICATION</h1>
          <p className="text-blue-100">Join FoodVrse in reducing food waste and increasing your revenue</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="your.email@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., Manager, Owner, Director"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
                    <option value="+254">+254</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                    <option value="+86">+86</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company/Business Name *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Your business name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Employees
                </label>
                <select
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select employee count</option>
                  {employeeCounts.map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              {/* ESG Impact Calculator Button */}
              <div className="md:col-span-2 flex justify-center pt-4">
                <Button
                  type="button"
                  onClick={() => setShowESGCalculator(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="mr-2">🌱</span>
                  ESG Impact Calculator
                </Button>
              </div>
            </div>
          </div>

          {/* Partnership Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Partnership Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Tell us about your business, what you do, and your target customers..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What interests you most about partnering with FoodVrse? *
                </label>
                <select
                  name="partnershipInterest"
                  required
                  value={formData.partnershipInterest}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select your primary interest</option>
                  {partnershipInterests.map((interest) => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Monthly Food Waste
                </label>
                <select
                  name="monthlyWaste"
                  value={formData.monthlyWaste}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select waste amount</option>
                  {monthlyWasteOptions.map((waste) => (
                    <option key={waste} value={waste}>{waste}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Consent and Verification */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                  I agree to receive newsletters and information from FoodVrse by email and by SMS. I can unsubscribe at any time.
                </label>
              </div>

              <p className="text-sm text-gray-600">
                By submitting this form, you accept the{" "}
                <a 
                  href="/privacy-policy" 
                  className="underline text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/privacy-policy");
                  }}
                >
                  FoodVrse privacy policy
                </a>
                .
              </p>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-700">
                    Verify you are human
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-500">FOODVRSE</div>
                  <div className="flex space-x-2 text-xs">
                    <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy</a>
                    <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms</a>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_CONFIG.SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                  onError={() => {
                    setRecaptchaToken(null);
                    toast.error("reCAPTCHA verification failed. Please try again.");
                  }}
                />
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>SUBMIT APPLICATION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* ESG Impact Calculator Popup */}
      {showESGCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🌱</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">ESG Impact Calculator</h2>
                  <p className="text-sm text-gray-600">Calculate your potential impact with FoodVrse</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowESGCalculator(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Calculator Content */}
            <div className="p-6">
              {/* Input Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Revenue (KSh)
                </label>
                <input
                  type="number"
                  value={esgData.monthlyRevenue}
                  onChange={(e) => handleESGRevenueChange(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-lg font-semibold"
                  placeholder="Enter your monthly revenue"
                />
              </div>

              {/* Results Table */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Calculation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Metric</div>
                    <div className="text-lg font-bold text-gray-900">Example Value</div>
                    <div className="text-xs text-gray-500 mt-1">Calculation / Assumptions</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Monthly Revenue</div>
                    <div className="text-lg font-bold text-green-600">KSh {esgData.monthlyRevenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Input from business</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Food Waste %</div>
                    <div className="text-lg font-bold text-orange-600">{esgData.foodWastePercent}%</div>
                    <div className="text-xs text-gray-500 mt-1">Default average for Kenyan restaurants</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Food Waste Value</div>
                    <div className="text-lg font-bold text-red-600">KSh {esgData.foodWasteValue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">{esgData.monthlyRevenue.toLocaleString()} × {esgData.foodWastePercent}%</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">FoodVrse Recovery %</div>
                    <div className="text-lg font-bold text-blue-600">{esgData.foodVrseRecoveryPercent}%</div>
                    <div className="text-xs text-gray-500 mt-1">Estimated portion that can be sold</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Savings via FoodVrse</div>
                    <div className="text-lg font-bold text-green-600">KSh {esgData.savingsViaFoodVrse.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">{esgData.foodWasteValue.toLocaleString()} × {esgData.foodVrseRecoveryPercent}%</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Avg Cost per Mystery Bag</div>
                    <div className="text-lg font-bold text-purple-600">KSh {esgData.avgCostPerMysteryBag}</div>
                    <div className="text-xs text-gray-500 mt-1">Typical Nairobi meal/snack cost</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Mystery bags Saved</div>
                    <div className="text-lg font-bold text-indigo-600">{esgData.mysteryBagsSaved.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">{esgData.savingsViaFoodVrse.toLocaleString()} ÷ {esgData.avgCostPerMysteryBag}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Food Weight Recovered</div>
                    <div className="text-lg font-bold text-teal-600">{esgData.foodWeightRecovered} kg</div>
                    <div className="text-xs text-gray-500 mt-1">{esgData.mysteryBagsSaved.toLocaleString()} × 0.25 kg per bag</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">CO₂ Prevented</div>
                    <div className="text-lg font-bold text-emerald-600">{esgData.co2Prevented} kg</div>
                    <div className="text-xs text-gray-500 mt-1">{esgData.foodWeightRecovered} kg × 2.5 kg CO₂eq per kg</div>
                  </div>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Your Impact Summary</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Partnering with FoodVrse helps you recover <span className="font-bold text-green-600">KSh {esgData.savingsViaFoodVrse.toLocaleString()}</span> monthly, 
                  serve <span className="font-bold text-blue-600">{esgData.mysteryBagsSaved.toLocaleString()}</span> more meals to the community, 
                  and cut <span className="font-bold text-emerald-600">{esgData.co2Prevented} kg</span> of CO₂ emissions, 
                  all while boosting your ESG impact.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowESGCalculator(false)}
                  className="px-6 py-3"
                >
                  Close Calculator
                </Button>
                <Button
                  onClick={() => {
                    setShowESGCalculator(false);
                    toast.success("ESG impact calculated! Ready to submit your application.");
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  Continue Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerApplication;
