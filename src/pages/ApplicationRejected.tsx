import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, Mail, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ApplicationRejected = () => {
  const navigate = useNavigate();
  const { user, businessProfile } = useAuth();

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect if user is not a business
    if (!businessProfile) {
      navigate('/discover');
      return;
    }

    // Redirect if business is approved
    if (businessProfile.status === 'approved') {
      navigate('/business-dashboard');
      return;
    }

    // Redirect if business is pending
    if (businessProfile.status === 'pending_approval') {
      navigate('/pending-approval');
      return;
    }
  }, [user, businessProfile, navigate]);

  if (!user || !businessProfile) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Application Not Approved
          </CardTitle>
          <CardDescription className="text-gray-600">
            We've reviewed your application but couldn't approve it at this time
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Message */}
          <div className="rounded-lg bg-red-50 p-4">
            <h4 className="font-medium text-red-900 mb-2">Why wasn't my application approved?</h4>
            <p className="text-sm text-red-800">
              This could be due to various factors including location coverage, 
              business type compatibility, or current partnership capacity. 
              We appreciate your interest in reducing food waste with us.
            </p>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900 mb-2">What can I do next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Contact us to discuss your specific situation</li>
              <li>• Reapply in the future when we expand coverage</li>
              <li>• Consider other ways to reduce food waste</li>
              <li>• Stay updated on our expansion plans</li>
            </ul>
          </div>

          {/* Contact Options */}
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = 'mailto:partner@foodvrse.com?subject=Application%20Rejection%20Inquiry'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            
            <Button 
              onClick={() => window.location.href = 'tel:+254700000000'}
              variant="outline"
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </Button>
          </div>

          {/* Alternative Actions */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/discover')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Browse Marketplace
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Contact Info */}
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <h4 className="font-medium text-gray-900 mb-2">Need to discuss this?</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Email:</strong> partner@foodvrse.com</p>
              <p><strong>Phone:</strong> +254 700 000 000</p>
              <p><strong>Hours:</strong> Mon-Fri, 9AM-5PM EAT</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationRejected;
