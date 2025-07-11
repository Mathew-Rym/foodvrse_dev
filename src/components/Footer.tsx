
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLinkClick = (path: string, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      navigate("/auth");
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍽️</span>
              </div>
              <span className="text-xl font-bold">FoodVrse</span>
            </div>
            <p className="text-gray-400 text-sm">
              Good food deserves a second chance. Join us in reducing food waste while saving money.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <svg className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => handleLinkClick("/food-waste")}
                  className="hover:text-white text-left"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/partner-application")}
                  className="hover:text-white text-left"
                >
                  Become a Partner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/mystery-boxes", true)}
                  className="hover:text-white text-left"
                >
                  Mystery Boxes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/impact-tracker")}
                  className="hover:text-white text-left"
                >
                  Impact Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => handleLinkClick("/help-center")}
                  className="hover:text-white text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/safety-guidelines")}
                  className="hover:text-white text-left"
                >
                  Safety Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/terms-of-service")}
                  className="hover:text-white text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/privacy-policy")}
                  className="hover:text-white text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@foodvrse.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>0110098266</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 FoodVrse. All rights reserved. | Reducing food waste, one meal at a time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
