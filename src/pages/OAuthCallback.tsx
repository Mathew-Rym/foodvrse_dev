import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@\/contexts\/AuthContext';
import { checkIfBusinessPartner } from '@\/services\/businessPartnerService';
import { toast } from 'sonner';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (user?.email) {
          const partnerCheck = await Promise.race([
            checkIfBusinessPartner(user.email),
            new Promise(resolve => setTimeout(() => resolve({ isBusinessPartner: false }), 300))
          ]);
          
          if ((partnerCheck as any).isBusinessPartner) {
            toast.success(`Welcome ${(partnerCheck as any).businessName || 'Business Partner'}!`);
            navigate('\/business-dashboard', { replace: true });
          } else {
            toast.success('Welcome to FoodVrse!');
            navigate('\/discover', { replace: true });
          }
        } else {
          navigate('\/discover', { replace: true });
        }
      } catch (error) {
        console.warn('Callback redirect error:', error);
        navigate('\/discover', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, user]);

  return null;
};

export default OAuthCallback;
