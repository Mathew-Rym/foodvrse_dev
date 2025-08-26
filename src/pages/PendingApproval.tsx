import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PendingApproval = () => {
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

    // Redirect if business is already approved
    if (businessProfile.status === 'approved') {
      navigate('/business-dashboard');
      return;
    }

    // Redirect if business is rejected
    if (businessProfile.status === 'rejected') {
      navigate('/application-rejected');
      return;
    }
  }, [user, businessProfile, navigate]);

  if (!user || !businessProfile) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Application Under Review
          </CardTitle>
          <CardDescription className="text-gray-600">
            We're currently reviewing your business partnership application
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Timeline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Application Submitted</p>
                <p className="text-sm text-gray-500">Your application has been received</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Under Review</p>
                <p className="text-sm text-gray-500">Our team is evaluating your application</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 opacity-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-400">Decision</p>
                <p className="text-sm text-gray-400">You'll be notified of our decision</p>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll review your business information</li>
              <li>• Check your location and business type</li>
              <li>• Verify your food waste reduction potential</li>
              <li>• Contact you within 2-3 business days</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-medium text-gray-900 mb-2">Need help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you have questions about your application, contact our partnership team:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <strong>Email:</strong> partner@foodvrse.com
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> +254 700 000 000
              </p>
            </div>
          </div>

          {/* Actions */}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
