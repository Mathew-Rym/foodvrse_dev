
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
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
                  onClick={() => handleLinkClick("/")}
                  className="hover:text-white text-left"
                >
                  Mystery Boxes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/impact")}
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
                  onClick={() => handleLinkClick("/profile")}
                  className="hover:text-white text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/food-waste")}
                  className="hover:text-white text-left"
                >
                  Safety Guidelines
                </button>
              </li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@foodvrse.co.ke</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+254 700 123 456</span>
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
