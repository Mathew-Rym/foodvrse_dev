
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Clock, Users, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const PartnerApplication = () => {
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const [showHoursDialog, setShowHoursDialog] = useState(false);
  const [showSurplusDialog, setShowSurplusDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    businessType: "",
    description: "",
    operatingHours: "",
    expectedWaste: ""
  });

  // Operating hours state
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
  ];

  const surplusRanges = [
    "5-10 kg",
    "10-20 kg", 
    "20-50 kg",
    "50-100 kg",
    "100+ kg"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const subject = encodeURIComponent("New Partner Application - " + formData.businessName);
    const body = encodeURIComponent(`
New Partner Application:

Business Name: ${formData.businessName}
Owner Name: ${formData.ownerName}
Email: ${formData.email}
Phone: ${formData.phone}
Business Type: ${formData.businessType}
Address: ${formData.address}
Operating Hours: ${formData.operatingHours}
Expected Daily Surplus: ${formData.expectedWaste}
Business Description: ${formData.description}

Please review this application.
    `);
    
    const mailtoLink = `mailto:partner@foodvrse.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    toastHook({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 2-3 business days.",
    });
    
    // Redirect back to home after submission
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleHoursSave = () => {
    if (selectedDays.length === 0 || !openTime || !closeTime) {
      toast.error("Please select days and operating hours");
      return;
    }
    
    const hoursText = `${selectedDays.join(", ")} from ${openTime} to ${closeTime}`;
    setFormData(prev => ({ ...prev, operatingHours: hoursText }));
    setShowHoursDialog(false);
  };

  const handleSurplusSelect = (range: string) => {
    setFormData(prev => ({ ...prev, expectedWaste: range }));
    setShowSurplusDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Become a Partner</h1>
        </div>
        <p className="text-white/90 text-sm">
          Join FoodVrse and help reduce food waste while growing your business
        </p>
      </div>

      {/* Benefits Section */}
      <div className="p-4">
                  <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Why Partner with Us?</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">💰</span>
              </div>
              <span className="text-sm text-gray-700">Make money on surplus food while reducing waste costs by up to 70%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Reach new customers in your area</span>
            </div>
            <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-light-green rounded-full flex items-center justify-center">
              <span className="text-brand-green text-sm">🌱</span>
              </div>
              <span className="text-sm text-gray-700">Make a positive environmental impact</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Building2 className="w-4 h-4" />
              Business Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your restaurant or business name"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toast.success('Google Maps search coming soon!')}
                  >
                    🗺️
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  required
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (e.target.value === 'other') {
                      toast.info('Please describe your business type in the "Tell us about your business" section below. Examples: Food truck, Catering service, Hotel restaurant, etc.');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="bakery">Bakery</option>
                  <option value="cafe">Cafe</option>
                  <option value="grocery">Grocery Store</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

                      <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4" />
                Contact Information
              </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="business@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Street, City, Kenya"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => toast.success('Map location selector coming soon!')}
                  >
                    📍
                  </Button>
                </div>
              </div>
            </div>
          </div>

                      <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Clock className="w-4 h-4" />
                Additional Details
              </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operating Hours *
                </label>
                <Dialog open={showHoursDialog} onOpenChange={setShowHoursDialog}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between text-left"
                    >
                      <span className={formData.operatingHours ? "text-gray-900" : "text-gray-500"}>
                        {formData.operatingHours || "Select operating days and hours"}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select Operating Hours</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Operating Days</label>
                        <div className="grid grid-cols-2 gap-2">
                          {days.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={selectedDays.includes(day)}
                                onCheckedChange={() => handleDayToggle(day)}
                              />
                              <label htmlFor={day} className="text-sm">{day}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Opening Time</label>
                          <Select value={openTime} onValueChange={setOpenTime}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              {timeSlots.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Closing Time</label>
                          <Select value={closeTime} onValueChange={setCloseTime}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              {timeSlots.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button onClick={handleHoursSave} className="w-full">
                        Save Operating Hours
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Daily Food Surplus *
                </label>
                <Dialog open={showSurplusDialog} onOpenChange={setShowSurplusDialog}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between text-left"
                    >
                      <span className={formData.expectedWaste ? "text-gray-900" : "text-gray-500"}>
                        {formData.expectedWaste || "Select expected daily surplus range"}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select Daily Food Surplus Range</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {surplusRanges.map((range) => (
                        <Button
                          key={range}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleSurplusSelect(range)}
                        >
                          {range}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us about your business *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Brief description of your business and why you want to partner with us"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3"
            size="lg"
          >
            Submit Application
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Questions? Contact us at partner@foodvrse.com</p>
        </div>
      </div>
    </div>
  );
};

export default PartnerApplication;
