import { ArrowLeft, AlertTriangle, Shield, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ReportAbuse = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Report Abuse</h1>
          <p className="text-muted-foreground">Help us maintain a safe and respectful community</p>
        </div>

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Emergency situations:</strong> If you're in immediate danger, please contact local emergency services (999 or 112) immediately.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Report Abuse or Violation
                </CardTitle>
                <CardDescription>
                  Use this form to report any violations of our community guidelines or terms of service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reporter-name">Your Name (Optional)</Label>
                  <Input id="reporter-name" placeholder="Anonymous reporting is allowed" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reporter-email">Your Email (Optional)</Label>
                  <Input id="reporter-email" type="email" placeholder="For follow-up communications" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abuse-type">Type of Abuse</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of abuse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harassment">Harassment or Bullying</SelectItem>
                      <SelectItem value="fraud">Fraud or Scam</SelectItem>
                      <SelectItem value="spam">Spam or Unwanted Content</SelectItem>
                      <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                      <SelectItem value="fake-listing">Fake Listings</SelectItem>
                      <SelectItem value="discrimination">Discrimination</SelectItem>
                      <SelectItem value="violence">Threats or Violence</SelectItem>
                      <SelectItem value="intellectual-property">Intellectual Property Violation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reported-user">Reported User/Business (if applicable)</Label>
                  <Input id="reported-user" placeholder="Username or business name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-url">URL or Location of Incident</Label>
                  <Input id="incident-url" placeholder="Link to listing, profile, or message" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Please provide as much detail as possible about the incident, including dates, times, and any relevant context..."
                    rows={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="evidence">Additional Evidence</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Screenshots, messages, or other evidence (files will be uploaded securely)
                    </p>
                    <Button variant="outline" className="mt-2">Upload Files</Button>
                  </div>
                </div>
                
                <Button className="w-full">Submit Report</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What happens after you report?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Report received</h4>
                    <p className="text-sm text-muted-foreground">We'll acknowledge receipt within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Investigation</h4>
                    <p className="text-sm text-muted-foreground">Our safety team reviews the report thoroughly</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Action taken</h4>
                    <p className="text-sm text-muted-foreground">Appropriate measures are implemented if violations are found</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                  <div>
                    <h4 className="font-medium">Follow-up</h4>
                    <p className="text-sm text-muted-foreground">We'll update you on the outcome if you provided contact details</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Be respectful and courteous to all users</li>
                  <li>• Only list legitimate food items with accurate descriptions</li>
                  <li>• Maintain food safety standards</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• No harassment, discrimination, or hate speech</li>
                  <li>• Report suspicious or inappropriate behavior</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">Read Full Guidelines</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need immediate help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  For urgent safety concerns or if you need immediate assistance
                </p>
                <Button variant="destructive" className="w-full">Emergency Contact</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAbuse;