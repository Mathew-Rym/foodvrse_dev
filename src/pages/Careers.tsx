import { ArrowLeft, MapPin, Clock, Users, Briefcase, Heart, Coffee, Rocket, Handshake, Upload, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CVPopup from "@/components/CVPopup";
import AdminJobManager from "@/components/AdminJobManager";
import { useAuth } from "@/contexts/AuthContext";

const Careers = () => {
  const navigate = useNavigate();
  const [isCVPopupOpen, setIsCVPopupOpen] = useState(false);
  const { isBusinessUser } = useAuth();

  const [openPositions, setOpenPositions] = useState([
    {
      id: "1",
      title: "Executive Partner - Business Development",
      department: "Partnerships",
      location: "Nairobi / Remote",
      type: "Full-time",
      description: "Lead strategic partnerships and business development initiatives to expand FoodVrse's impact across Kenya and East Africa.",
      requirements: [
        "5+ years experience in business development or partnerships",
        "Strong network in food industry, retail, or sustainability sector",
        "Proven track record of closing high-value partnerships",
        "Excellent communication and negotiation skills",
        "Passion for sustainability and social impact"
      ],
      posted: "2 days ago"
    },
    {
      id: "2",
      title: "Executive Partner - Technology & Innovation",
      department: "Engineering",
      location: "Nairobi / Remote",
      type: "Full-time",
      description: "Drive technological innovation and platform development to enhance user experience and operational efficiency.",
      requirements: [
        "7+ years experience in software development or technical leadership",
        "Experience with React, Node.js, and cloud platforms",
        "Strong understanding of mobile app development",
        "Experience with AI/ML integration preferred",
        "Leadership experience in fast-growing tech companies"
      ],
      posted: "1 week ago"
    },
    {
      id: "3",
      title: "Executive Partner - Marketing & Growth",
      department: "Marketing",
      location: "Nairobi / Remote",
      type: "Full-time",
      description: "Lead marketing strategies and growth initiatives to expand FoodVrse's user base and brand presence.",
      requirements: [
        "5+ years experience in digital marketing and growth",
        "Experience with social media, content marketing, and paid advertising",
        "Strong analytical skills and data-driven decision making",
        "Experience in food tech or sustainability sector preferred",
        "Creative mindset with strong brand development skills"
      ],
      posted: "3 days ago"
    },
    {
      id: "4",
      title: "Executive Partner - Operations & Strategy",
      department: "Operations",
      location: "Nairobi",
      type: "Full-time",
      description: "Optimize operational processes and develop strategic initiatives to scale FoodVrse's impact efficiently.",
      requirements: [
        "5+ years experience in operations management or strategy",
        "Experience in food industry or logistics preferred",
        "Strong project management and process optimization skills",
        "Experience with data analysis and performance metrics",
        "Leadership experience in startup or scale-up environment"
      ],
      posted: "5 days ago"
    }
  ]);

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: Coffee,
      title: "Flexible Work",
      description: "Remote work options and flexible schedules"
    },
    {
      icon: Users,
      title: "Learning & Growth",
      description: "Professional development budget and mentorship programs"
    },
    {
      icon: Briefcase,
      title: "Competitive Package",
      description: "Competitive salary and equity participation"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-4">Careers at FoodVrse</h1>
          <p className="text-xl text-muted-foreground">
            Join our mission to eliminate food waste and build sustainable communities across Kenya
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-12">
          <Card className="bg-primary/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Work with Purpose</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                At FoodVrse, every line of code, every partnership, and every customer interaction contributes 
                to fighting food waste and creating a more sustainable future. Join a team that's making a real 
                difference in the world.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Executive Partner Highlight */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 border-2 border-brand-green/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-brand-green mb-2">🚀 Executive Partner Opportunities</h2>
                <p className="text-lg text-muted-foreground">
                  We're looking for experienced leaders to join us as Executive Partners and help scale FoodVrse's impact
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-green">What We Offer:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Equity participation and competitive compensation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Leadership role in a fast-growing startup
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Direct impact on sustainability and social change
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Flexible work arrangements and remote options
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-green">What We're Looking For:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Proven leadership experience (5+ years)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Passion for sustainability and social impact
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Strong network and industry expertise
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-brand-green">•</span>
                      Entrepreneurial mindset and growth orientation
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Admin Job Manager */}
        {isBusinessUser && (
          <section className="mb-12">
            <AdminJobManager 
              jobPositions={openPositions}
              onUpdateJobs={setOpenPositions}
              isAdmin={isBusinessUser}
            />
          </section>
        )}

        {/* Open Positions */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">🚀 Open Positions</h2>
            <p className="text-lg text-muted-foreground">
              Join our team and help us build a sustainable future
            </p>
          </div>
          {openPositions.length > 0 ? (
            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-brand-green/20">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl mb-2 text-brand-green">{position.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-brand-green/10 text-brand-green border-brand-green/20">
                            {position.department}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {position.location}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {position.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Posted {position.posted}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{position.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-brand-green">Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-2">
                            <span className="text-brand-green mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full md:w-auto bg-brand-green hover:bg-brand-green/90 text-white font-semibold"
                      onClick={() => setIsCVPopupOpen(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Apply for this position
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Open Positions at the Moment</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We're not currently hiring, but we're always interested in connecting with talented individuals 
                  who are passionate about sustainability and making a positive impact.
                </p>
                <Button onClick={() => setIsCVPopupOpen(true)} className="bg-brand-green hover:bg-brand-green/90">
                  <Send className="w-4 h-4 mr-2" />
                  Send Your CV for Future Opportunities
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Application Process */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Application Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Apply</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your application with CV and cover letter
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our team reviews your application (usually within 3-5 days)
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Video interview with hiring manager and team members
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Welcome</h3>
                <p className="text-sm text-muted-foreground">
                  Join the team and start making an impact!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Culture */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">🌍 Impact-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Every team member contributes to our mission of reducing food waste and creating 
                  positive environmental impact.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  Fast-Growing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Join a rapidly expanding startup where you can take ownership, learn quickly, 
                  and see the direct impact of your work.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-green-600" />
                  Collaborative
                </h3>
                <p className="text-sm text-muted-foreground">
                  We believe in teamwork, open communication, and supporting each other's 
                  professional growth and success.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center py-8 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 rounded-lg border-2 border-brand-green/20">
          <h2 className="text-2xl font-bold mb-4 text-brand-green">Don't See the Right Role?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always interested in connecting with talented individuals who are passionate about 
            sustainability and making a positive impact. Send us your CV and tell us how you'd like to contribute.
          </p>
          <Button 
            onClick={() => setIsCVPopupOpen(true)} 
            className="bg-brand-green hover:bg-brand-green/90"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Your CV
          </Button>
        </section>
      </div>
      <CVPopup 
        isOpen={isCVPopupOpen} 
        onClose={() => setIsCVPopupOpen(false)} 
      />
    </div>
  );
};

export default Careers;