import { Search, Phone, Mail, MessageCircle, HelpCircle, Clock, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MobileLayout from "@/components/MobileLayout";
import BackToTop from "@/components/BackToTop";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.state?.hideNavbar;

  const handleBack = () => {
    navigate(-1);
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      questions: [
        {
          q: "How do I create an account?",
          a: "Download the FoodVrse app and tap 'Sign Up'. Enter your email, create a password, and verify your account through the email we send you."
        },
        {
          q: "What is a mystery bag?",
          a: "A mystery bag contains surplus food from restaurants and stores that would otherwise go to waste. You'll know the restaurant and approximate value, but the specific items are a surprise!"
        },
        {
          q: "How much can I save?",
          a: "You can save up to 70% off regular prices. Mystery bags are typically priced at 30-50% of their original retail value."
        }
      ]
    },
    {
      title: "Orders & Pickup",
      icon: MapPin,
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse available mystery bags, select one you like, choose your pickup time, and complete payment through the app."
        },
        {
          q: "Can I cancel my order?",
          a: "You can cancel your order up to 1 hour before your selected pickup time for a full refund."
        },
        {
          q: "What if I'm late for pickup?",
          a: "Pickup windows are usually 30 minutes. If you're running late, contact the restaurant directly. Late pickups may result in your order being given away."
        },
        {
          q: "What should I bring for pickup?",
          a: "Bring your phone with the FoodVrse app and your order confirmation. Some restaurants may ask for ID verification."
        }
      ]
    },
    {
      title: "Payment & Refunds",
      icon: CreditCard,
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept M-Pesa, credit/debit cards, and mobile money. All payments are processed securely through our app."
        },
        {
          q: "When am I charged?",
          a: "You're charged immediately when you place your order to reserve your mystery bag."
        },
        {
          q: "How do refunds work?",
          a: "Refunds are processed within 3-5 business days to your original payment method. Cancellations made within the allowed time frame receive full refunds."
        }
      ]
    },
    {
      title: "Food Safety",
      icon: Clock,
      questions: [
        {
          q: "Is the food safe to eat?",
          a: "Yes! All food is prepared on the same day and follows strict food safety standards. We work only with licensed, regulated restaurants and stores."
        },
        {
          q: "How long does the food last?",
          a: "This varies by item. Fresh items should be consumed the same day, while packaged goods may last longer. Always check expiration dates and use your judgment."
        },
        {
          q: "What if I have food allergies?",
          a: "Set your dietary preferences in your profile. However, always inform the restaurant about severe allergies when collecting your order, as cross-contamination can occur."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "hello@foodvrse.com",
      action: "Send Email"
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <MobileLayout hideNavbar={hideNavbar}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          </div>
          <p className="text-lg text-gray-600">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {contactOptions.map((option, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-4">
              <option.icon className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{option.description}</p>
              <Button variant="outline" size="sm">
                {option.action}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
          
          {(searchQuery ? filteredFAQs : faqCategories).map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-brand-light-green rounded-lg flex items-center justify-center">
              <category.icon className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
              </div>
              
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((qa, qIndex) => (
                  <AccordionItem key={qIndex} value={`${categoryIndex}-${qIndex}`} className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">
                      {qa.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4">
                      {qa.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            Contact Support
          </Button>
        </div>
      </div>
      <BackToTop />
    </MobileLayout>
  );
};

export default HelpCenter;