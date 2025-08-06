
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Building, MapPin, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { EMAILJS_CONFIG } from '@/config/emailjs';
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
    </div>
  );
};

export default PartnerApplication;
