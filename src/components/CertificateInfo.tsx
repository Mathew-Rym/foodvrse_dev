import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Calendar, Building, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { SUPABASE_CERTIFICATE, CERTIFICATE_MONITORING } from '@/config/certificates';

interface CertificateInfoProps {
  showDetails?: boolean;
}

const CertificateInfo: React.FC<CertificateInfoProps> = ({ showDetails = false }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(0);

  useEffect(() => {
    const checkCertificate = () => {
      const valid = CERTIFICATE_MONITORING.checkValidity();
      setIsValid(valid);
      
      const now = new Date();
      const validTo = new Date(SUPABASE_CERTIFICATE.validTo);
      const days = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilExpiry(days);
    };

    checkCertificate();
    const interval = setInterval(checkCertificate, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isValid === null) return 'bg-gray-100 text-gray-600';
    if (isValid) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusIcon = () => {
    if (isValid === null) return <Clock className="w-4 h-4" />;
    if (isValid) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getExpiryColor = () => {
    if (daysUntilExpiry > 365) return 'text-green-600';
    if (daysUntilExpiry > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-blue-600" />
          Supabase Root 2021 CA Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <Badge className={`flex items-center gap-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            {isValid === null ? 'Checking...' : isValid ? 'Valid' : 'Invalid'}
          </Badge>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-500">Issuer</span>
            <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.issuer}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Common Name</span>
            <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.subject.commonName}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Country</span>
            <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.subject.country}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Organization</span>
            <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.subject.organization}</p>
          </div>
        </div>

        {/* Validity Period */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Validity Period</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Valid From</span>
              <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.validFrom}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Valid To</span>
              <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.validTo}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Days Until Expiry</span>
            <p className={`text-sm font-medium ${getExpiryColor()}`}>
              {daysUntilExpiry} days
            </p>
          </div>
        </div>

        {/* Certificate Details */}
        {showDetails && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <span className="text-xs text-gray-500">Serial Number</span>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                {SUPABASE_CERTIFICATE.serialNumber}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">Key Algorithm</span>
                <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.publicKey.algorithm}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Key Size</span>
                <p className="text-sm font-medium">{SUPABASE_CERTIFICATE.publicKey.keySize} bits</p>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500">SHA-1 Fingerprint</span>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                {SUPABASE_CERTIFICATE.fingerprints.sha1}
              </p>
            </div>

            <div>
              <span className="text-xs text-gray-500">MD5 Fingerprint</span>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                {SUPABASE_CERTIFICATE.fingerprints.md5}
              </p>
            </div>

            <div>
              <span className="text-xs text-gray-500">Subject Key Identifier</span>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                {SUPABASE_CERTIFICATE.subjectKeyIdentifier}
              </p>
            </div>

            <div>
              <span className="text-xs text-gray-500">Key Usage</span>
              <div className="mt-1">
                {SUPABASE_CERTIFICATE.keyUsage.map((usage, index) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                    {usage}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t pt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => CERTIFICATE_MONITORING.monitorHealth()}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" />
            Check Health
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://supabase.com/docs/guides/platform/security', '_blank')}
            className="flex-1"
          >
            <Building className="w-4 h-4 mr-2" />
            Security Docs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateInfo; 