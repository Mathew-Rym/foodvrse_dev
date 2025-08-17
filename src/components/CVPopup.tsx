import React, { useState, useRef } from 'react';
import { X, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_CONFIG } from '@/config/recaptcha';

interface CVPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CVPopup = ({ isOpen, onClose }: CVPopupProps) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setCvFile(file);
      toast.success('CV file uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    
    if (!cvFile) {
      toast.error('Please upload your CV');
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert file to base64 for email attachment
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          // Prepare email template parameters
          const templateParams = {
            to_email: 'hello@foodvrse.com',
            from_name: email.split('@')[0], // Use email prefix as name
            from_email: email,
            subject: `CV Submission - ${subject}`,
            message: `
CV Submission from FoodVrse Careers Page:

Email: ${email}
Subject: ${subject}
Message: ${message || 'No additional message provided'}

CV File Details:
- File Name: ${cvFile.name}
- File Size: ${(cvFile.size / 1024 / 1024).toFixed(1)}MB
- File Type: ${cvFile.type}

This CV was submitted through the FoodVrse careers page.
Please contact the applicant at: ${email}
            `,
            cv_file_name: cvFile.name,
            cv_file_size: `${(cvFile.size / 1024 / 1024).toFixed(1)}MB`,
            cv_file_type: cvFile.type
          };

          // Send email using EmailJS
          const result = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
          );

          if (result.status === 200) {
            toast.success('CV sent successfully! We will get back to you soon.');
            
            // Reset form
            setEmail('');
            setSubject('');
            setMessage('');
            setCvFile(null);
            setRecaptchaToken(null);
            recaptchaRef.current?.reset();
            onClose();
          } else {
            throw new Error('Email sending failed');
          }
        } catch (error) {
          console.error('Email submission error:', error);
          toast.error('Failed to send CV. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };

      fileReader.onerror = () => {
        toast.error('Failed to read CV file. Please try again.');
        setIsSubmitting(false);
      };

      // Read file as base64
      fileReader.readAsDataURL(cvFile);
      
    } catch (error) {
      console.error('CV submission error:', error);
      toast.error('Failed to send CV. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    // Reset file input
    const fileInput = document.getElementById('cv-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-8">
              <Card className="w-full max-w-lg bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-foreground">
            Send Your CV
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium mb-2 block">
                Subject *
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Job Application - [Position Name]"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium mb-2 block">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about yourself and why you're interested in joining FoodVrse..."
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Upload CV/Resume *
              </Label>
              
              {cvFile ? (
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{cvFile.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(cvFile.size / 1024 / 1024).toFixed(1)}MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, or DOCX (max 5MB)
                  </p>
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById('cv-file-input')?.click()}
                    disabled={isSubmitting}
                  >
                    Choose File
                  </Button>
                </div>
              )}
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_CONFIG.SITE_KEY}
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
                onError={() => {
                  setRecaptchaToken(null);
                  toast.error("reCAPTCHA verification failed. Please try again.");
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send CV
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVPopup;