
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PartnerApplication = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    name: "",
    phone: "",
    jobTitle: ""
  });

  const [consent, setConsent] = useState(false);
  const [humanVerification, setHumanVerification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast.error("Please agree to receive newsletters and information");
      return;
    }

    if (!humanVerification) {
      toast.error("Please verify you are human");
      return;
    }
    
    // Create mailto link with form data
    const subject = encodeURIComponent("Business Enquiry - " + formData.company);
    const body = encodeURIComponent(`
Business Enquiry Form Submission:

Email: ${formData.email}
Company: ${formData.company}
Name: ${formData.name}
Phone: ${formData.phone}
Job Title: ${formData.jobTitle}

This enquiry was submitted through the FoodVrse website.
    `);
    
    const mailtoLink = `mailto:hello@foodvrse.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    toast.success("Enquiry submitted! We'll get back to you soon.");
    
    // Reset form
    setFormData({
      email: "",
      company: "",
      name: "",
      phone: "",
      jobTitle: ""
    });
    setConsent(false);
    setHumanVerification(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-green to-brand-yellow text-white p-6">
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
          <h1 className="text-3xl font-bold text-white mb-2">BUSINESS ENQUIRY FORM</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-brand-green rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white"
              placeholder="Email"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company *
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-brand-green rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white"
              placeholder="Name"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-brand-green rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white"
              placeholder="Name"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone number
            </label>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-brand-green rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white">
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
                className="flex-1 px-3 py-2 border border-brand-green rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white"
                placeholder="Your phone number"
              />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-brand-green rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white"
              placeholder="Job title"
            />
          </div>

          {/* Consent Checkbox */}
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

          {/* Privacy Policy */}
          <p className="text-sm text-gray-600">
            By signing up you accept the{" "}
            <a 
              href="/privacy-policy" 
              className="underline text-brand-green hover:text-brand-yellow"
              onClick={(e) => {
                e.preventDefault();
                navigate("/privacy-policy");
              }}
            >
              FoodVrse privacy policy
            </a>
            .
          </p>

          {/* Human Verification */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="human"
                checked={humanVerification}
                onCheckedChange={(checked) => setHumanVerification(checked as boolean)}
              />
              <label htmlFor="human" className="text-sm font-medium text-gray-700">
                Verify you are human
              </label>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500">FOODVRSE</div>
              <div className="flex space-x-2 text-xs">
                <a href="/privacy-policy" className="text-brand-green hover:text-brand-yellow">Privacy</a>
                <a href="/terms" className="text-brand-green hover:text-brand-yellow">Terms</a>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
            size="lg"
          >
            <span>SUBMIT</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PartnerApplication;
