import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { checkIfBusinessPartner } from '@/services/businessPartnerService';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Fast redirect - don't wait for complex logic
      try {
        if (user?.email) {
          // Quick business partner check
          const partnerCheck = await Promise.race([
            checkIfBusinessPartner(user.email),
            new Promise(resolve => setTimeout(() => resolve({ isBusinessPartner: false }), 500))
          ]);
          
          if ((partnerCheck as any).isBusinessPartner) {
            navigate('/business-dashboard', { replace: true });
          } else {
            navigate('/discover', { replace: true });
          }
        } else {
          // Fallback redirect
          navigate('/discover', { replace: true });
        }
      } catch (error) {
        console.warn('Callback redirect error:', error);
        navigate('/discover', { replace: true });
      }
    };

    // Very fast redirect
    const timer = setTimeout(handleCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-start justify-center p-4 pt-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Successful!</h2>
        <p className="text-gray-600">Setting up your dashboard...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
