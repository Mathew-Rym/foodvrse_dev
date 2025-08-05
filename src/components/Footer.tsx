
import { Facebook, Twitter, Instagram, Mail, MapPin, Linkedin, Youtube } from "lucide-react";
import { useState } from "react";
import VideoModal from "./VideoModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import AppInstallPrompt from "./AppInstallPrompt";
import Logo from "./Logo";

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleLinkClick = (path: string, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      navigate("/auth");
    } else {
      navigate(path, { state: { hideNavbar: true } });
    }
  };

  return (
    <footer className="bg-brand-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 min-w-0">
              <Logo size="md" className="flex-shrink-0" />
              <span className="text-lg sm:text-xl font-bold truncate">FoodVrse</span>
            </div>
            <p className="text-gray-400 text-sm">
              Good food deserves a second chance. Join us in reducing food waste while saving money.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61554934846539" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/foodvrse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/foodvrse/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/foodvrse/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Watch our FoodVrse video"
              >
                <Youtube className="w-5 h-5" />
              </button>
              <a 
                href="https://www.tiktok.com/@foodvrse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              </a>
            </div>
            
            {/* App Store Badges */}
            <div className="mt-6 space-y-3">
              <h5 className="text-sm font-medium text-white mb-3">Download Our App</h5>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => navigate('/coming-soon')}
                  className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/coming-soon')}
                  className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => handleLinkClick("/our-story")}
                  className="hover:text-white text-left"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/our-impact")}
                  className="hover:text-white text-left"
                >
                  Our Impact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/meet-the-team")}
                  className="hover:text-white text-left"
                >
                  Meet the Team
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/careers")}
                  className="hover:text-white text-left"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/press")}
                  className="hover:text-white text-left"
                >
                  Press
                </button>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
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
                  Mystery Bags
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
              <li>
                <button 
                  onClick={() => window.open("https://foodvrse.betteruptime.com/", "_blank")}
                  className="hover:text-white text-left"
                >
                  Status
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/partners")}
                  className="hover:text-white text-left"
                >
                  Our Partners
                </button>
              </li>
              <li>
                <span className="text-gray-500">Affiliates (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
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
                  onClick={() => handleLinkClick("/community-guidelines")}
                  className="hover:text-white text-left"
                >
                  Community Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = "mailto:hello@foodvrse.com"}
                  className="hover:text-white text-left"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => handleLinkClick("/privacy-policy")}
                  className="hover:text-white text-left"
                >
                  Privacy Policy
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
                  onClick={() => handleLinkClick("/cookie-policy")}
                  className="hover:text-white text-left"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/report-abuse")}
                  className="hover:text-white text-left"
                >
                  Report Abuse
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick("/report-security")}
                  className="hover:text-white text-left"
                >
                  Report Security Concerns
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* App Install Prompt */}
        <div className="mt-8">
          <AppInstallPrompt />
        </div>

        {/* Bottom Section with toggles and copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Language and Theme Toggles */}
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            
            {/* Copyright */}
            <div className="text-center text-sm text-gray-400">
              <p>&copy; 2025 FoodVrse. All rights reserved. | Reducing food waste, one meal at a time.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://youtu.be/OYe3_kovTrY"
      />
    </footer>
  );
};

export default Footer;
