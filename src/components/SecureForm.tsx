import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { SecurityUtils, SecurityMiddleware, SECURITY_CONFIG } from '@/config/security';
import { toast } from 'sonner';

interface SecureFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void>;
  fields: {
    name: string;
    type: 'text' | 'email' | 'password' | 'phone' | 'card' | 'textarea';
    label: string;
    required?: boolean;
    placeholder?: string;
    validation?: RegExp;
  }[];
  submitText?: string;
  title?: string;
  description?: string;
}

const SecureForm: React.FC<SecureFormProps> = ({
  onSubmit,
  fields,
  submitText = 'Submit',
  title,
  description
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'error'>('secure');

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  }, [fields]);

  // Real-time input validation
  const handleInputChange = (name: string, value: string) => {
    // Sanitize input
    const sanitizedValue = SecurityUtils.sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Real-time validation
    validateField(name, sanitizedValue);
  };

  // Field validation
  const validateField = (name: string, value: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return;

    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.required && !value.trim()) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Pattern validation
    if (value && field.validation && !field.validation.test(value)) {
      isValid = false;
      switch (field.type) {
        case 'email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'password':
          errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
          break;
        case 'phone':
          errorMessage = 'Please enter a valid phone number';
          break;
        case 'card':
          errorMessage = 'Please enter a valid card number';
          break;
        default:
          errorMessage = 'Invalid format';
      }
    }

    // XSS detection
    if (value && (value.includes('<script>') || value.includes('javascript:') || value.includes('onerror='))) {
      isValid = false;
      errorMessage = 'Invalid input detected';
      setSecurityStatus('error');
    }

    // Update errors
    setErrors(prev => ({
      ...prev,
      [name]: isValid ? '' : errorMessage
    }));
  };

  // Form submission with security checks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit('form_submissions', SECURITY_CONFIG.CLIENT.RATE_LIMITS.FORM_SUBMISSIONS, SECURITY_CONFIG.CLIENT.RATE_LIMITS.FORM_TIMEOUT)) {
      toast.error('Too many form submissions. Please wait before trying again.');
      return;
    }

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      validateField(field.name, formData[field.name] || '');
      if (errors[field.name]) {
        newErrors[field.name] = errors[field.name];
      }
    });

    if (Object.keys(newErrors).some(key => newErrors[key])) {
      setErrors(newErrors);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    // Security validation
    const securityValidation = SecurityMiddleware.validateFormData(formData);
    if (!securityValidation.isValid) {
      toast.error('Security validation failed. Please check your input.');
      setSecurityStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSecurityStatus('secure');

    try {
      await onSubmit(formData);
      toast.success('Form submitted successfully!');
      
      // Clear form after successful submission
      const clearedData: Record<string, any> = {};
      fields.forEach(field => {
        clearedData[field.name] = '';
      });
      setFormData(clearedData);
      setErrors({});
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Submission failed. Please try again.');
      setSecurityStatus('warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render input field
  const renderField = (field: any) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isSecure = !error && value;

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name} className="flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
          {isSecure && <CheckCircle className="w-4 h-4 text-green-500" />}
        </Label>
        
        <div className="relative">
          <Input
            id={field.name}
            type={field.type === 'password' ? 'password' : 'text'}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${error ? 'border-red-500' : isSecure ? 'border-green-500' : ''}`}
            disabled={isSubmitting}
          />
          
          {error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Security Status */}
      <div className="mb-6">
        <Alert className={`
          ${securityStatus === 'secure' ? 'border-green-200 bg-green-50' : ''}
          ${securityStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
          ${securityStatus === 'error' ? 'border-red-200 bg-red-50' : ''}
        `}>
          <div className="flex items-center gap-2">
            {securityStatus === 'secure' && <Shield className="w-4 h-4 text-green-600" />}
            {securityStatus === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
            {securityStatus === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
            <AlertDescription className="font-medium">
              {securityStatus === 'secure' && 'Form is secure and ready to submit'}
              {securityStatus === 'warning' && 'Security warning detected'}
              {securityStatus === 'error' && 'Security violation detected'}
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {title && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </div>
        )}

        {fields.map(renderField)}

        <Button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              {submitText}
            </>
          )}
        </Button>
      </form>

      {/* Security Features Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          Security Features Active
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Input sanitization and validation</li>
          <li>• XSS protection</li>
          <li>• Rate limiting</li>
          <li>• CSRF protection</li>
          <li>• Real-time security monitoring</li>
        </ul>
      </div>
    </div>
  );
};

export default SecureForm; 