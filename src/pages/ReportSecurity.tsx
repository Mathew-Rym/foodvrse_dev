import { ArrowLeft, Shield, Lock, Bug, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const ReportSecurity = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Report Security Concerns</h1>
          <p className="text-muted-foreground">Help us keep Foodvrse secure for everyone</p>
        </div>

        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            We take security seriously. All reports are handled confidentially and investigated promptly by our security team.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Security Vulnerability Report
                </CardTitle>
                <CardDescription>
                  Report security vulnerabilities, bugs, or suspicious activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reporter-name">Your Name (Optional)</Label>
                  <Input id="reporter-name" placeholder="Anonymous reporting is allowed" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reporter-email">Your Email</Label>
                  <Input id="reporter-email" type="email" placeholder="For follow-up and credit" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="security-type">Type of Security Issue</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of security concern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data-breach">Data Breach</SelectItem>
                      <SelectItem value="vulnerability">Security Vulnerability</SelectItem>
                      <SelectItem value="phishing">Phishing Attempt</SelectItem>
                      <SelectItem value="malware">Malware or Virus</SelectItem>
                      <SelectItem value="account-compromise">Account Compromise</SelectItem>
                      <SelectItem value="payment-fraud">Payment Fraud</SelectItem>
                      <SelectItem value="sql-injection">SQL Injection</SelectItem>
                      <SelectItem value="xss">Cross-Site Scripting (XSS)</SelectItem>
                      <SelectItem value="authentication">Authentication Bypass</SelectItem>
                      <SelectItem value="other">Other Security Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="How severe is this issue?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical - Immediate action required</SelectItem>
                      <SelectItem value="high">High - Significant security risk</SelectItem>
                      <SelectItem value="medium">Medium - Moderate security risk</SelectItem>
                      <SelectItem value="low">Low - Minor security concern</SelectItem>
                      <SelectItem value="info">Informational - No immediate risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="affected-url">Affected URL or Component</Label>
                  <Input id="affected-url" placeholder="Where did you find this issue?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="steps">Steps to Reproduce</Label>
                  <Textarea 
                    id="steps" 
                    placeholder="Please provide detailed steps to reproduce the issue:
1. Go to...
2. Click on...
3. Enter...
4. Observe..."
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="impact">Potential Impact</Label>
                  <Textarea 
                    id="impact" 
                    placeholder="What could an attacker potentially do with this vulnerability?"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="proof">Proof of Concept (if applicable)</Label>
                  <Textarea 
                    id="proof" 
                    placeholder="Please provide any proof of concept code, screenshots, or evidence (remove any sensitive data)"
                    rows={4}
                  />
                </div>
                
                <Button className="w-full">Submit Security Report</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Responsible Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We appreciate security researchers who help make our platform safer. We follow responsible disclosure practices:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">1</Badge>
                    <div>
                      <p className="text-sm"><strong>Report privately</strong> - Don't publicly disclose vulnerabilities before we've had a chance to fix them</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">2</Badge>
                    <div>
                      <p className="text-sm"><strong>Give us time</strong> - We aim to acknowledge reports within 48 hours and provide updates within 7 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">3</Badge>
                    <div>
                      <p className="text-sm"><strong>Work with us</strong> - We may need additional information or clarification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">4</Badge>
                    <div>
                      <p className="text-sm"><strong>Get recognized</strong> - We'll credit you (with your permission) when the issue is resolved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bug Bounty Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  We offer rewards for valid security vulnerabilities based on their severity and impact.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Critical vulnerabilities:</span>
                    <Badge variant="destructive">KSh 75,000 - KSh 300,000</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>High severity:</span>
                    <Badge variant="secondary">KSh 30,000 - KSh 75,000</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium severity:</span>
                    <Badge variant="outline">KSh 7,500 - KSh 30,000</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Low severity:</span>
                    <Badge variant="outline">KSh 3,000 - KSh 7,500</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  For urgent security matters, you can also contact us directly:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> security@foodvrse.com</p>
                  <p><strong>PGP Key:</strong> Available on request</p>
                  <p><strong>Response time:</strong> Within 48 hours</p>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Please note:</strong> This form is for security vulnerabilities only. For general bugs or feature requests, please use our regular support channels.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSecurity;