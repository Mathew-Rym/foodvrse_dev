import React, { useEffect } from 'react';
import { useAuth } from '@\/contexts\/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkIfBusinessPartner } from '@\/services\/businessPartnerService';
import { toast } from 'sonner';

interface GoogleOAuthHandlerProps {
  onComplete: () => void;
}

const GoogleOAuthHandler: React.FC<GoogleOAuthHandlerProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      if (!user?.email) {
        navigate('\/discover', { replace: true });
        return;
      }

      try {
        const businessCheck = await Promise.race([
          checkIfBusinessPartner(user.email),
          new Promise(resolve => setTimeout(() => resolve({ isBusinessPartner: false }), 300))
        ]);
        
        if ((businessCheck as any).isBusinessPartner) {
          toast.success(`Welcome ${(businessCheck as any).businessName || 'Business Partner'}!`);
          navigate('\/business-dashboard', { replace: true });
        } else {
          toast.success('Welcome to FoodVrse!');
          navigate('\/discover', { replace: true });
        }
      } catch (error) {
        console.error('Error checking business status:', error);
        navigate('\/discover', { replace: true });
      } finally {
        onComplete();
      }
    };

    handleOAuthRedirect();
  }, [user, navigate, onComplete]);

  return null;
};

export default GoogleOAuthHandler;
