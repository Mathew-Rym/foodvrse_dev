import { ArrowLeft, MapPin, Clock, Users, Briefcase, Heart, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CVPopup from "@/components/CVPopup";

const Careers = () => {
  const navigate = useNavigate();
  const [isCVPopupOpen, setIsCVPopupOpen] = useState(false);

  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Nairobi / Remote",
      type: "Full-time",
      description: "Lead our frontend development efforts using React, TypeScript, and modern web technologies. Help build the future of food waste reduction.",
      requirements: [
        "5+ years of React development experience",
        "Strong TypeScript and modern JavaScript skills",
        "Experience with responsive design and mobile development",
        "Knowledge of state management (Redux, Context API)",
        "Bachelor's degree in Computer Science or equivalent"
      ],
      posted: "2 days ago"
    },
    {
      title: "Business Development Manager",
      department: "Partnerships",
      location: "Nairobi",
      type: "Full-time",
      description: "Drive growth by building relationships with restaurants, cafes, and food businesses. Help expand our partner network across Kenya.",
      requirements: [
        "3+ years in business development or sales",
        "Experience in hospitality or food industry",
        "Strong networking and relationship building skills",
        "Excellent communication and presentation skills",
        "Bachelor's degree in Business or related field"
      ],
      posted: "1 week ago"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive and beautiful user experiences for our web and mobile applications. Help create interfaces that make food saving effortless.",
      requirements: [
        "3+ years of UX/UI design experience",
        "Proficiency in Figma and design systems",
        "Experience with user research and testing",
        "Portfolio showcasing mobile and web design",
        "Understanding of accessibility principles"
      ],
      posted: "3 days ago"
    },
    {
      title: "Marketing Coordinator",
      department: "Marketing",
      location: "Nairobi",
      type: "Full-time",
      description: "Support our marketing initiatives to spread awareness about food waste reduction and grow our user base across Kenya.",
      requirements: [
        "2+ years in digital marketing",
        "Experience with social media marketing",
        "Content creation and copywriting skills",
        "Knowledge of SEO and analytics tools",
        "Passion for sustainability and social impact"
      ],
      posted: "5 days ago"
    },
    {
      title: "Customer Success Intern",
      department: "Operations",
      location: "Nairobi",
      type: "Internship",
      description: "Help ensure our users and business partners have an amazing experience with Foodvrse. Learn about operations in a fast-growing startup.",
      requirements: [
        "Currently pursuing a degree in Business, Communications, or related field",
        "Excellent communication skills in English and Swahili",
        "Interest in customer service and operations",
        "Basic computer skills and willingness to learn",
        "Passion for environmental sustainability"
      ],
      posted: "1 week ago"
    }
  ];

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
          <h1 className="text-4xl font-bold text-foreground mb-4">Careers at Foodvrse</h1>
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
                At Foodvrse, every line of code, every partnership, and every customer interaction contributes 
                to fighting food waste and creating a more sustainable future. Join a team that's making a real 
                difference in the world.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{position.department}</Badge>
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
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    Apply for this position
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Application Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Apply</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your application with CV and cover letter
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our team reviews your application (usually within 3-5 days)
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Video interview with hiring manager and team members
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
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
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">🌍 Impact-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Every team member contributes to our mission of reducing food waste and creating 
                  positive environmental impact.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">🚀 Fast-Growing</h3>
                <p className="text-sm text-muted-foreground">
                  Join a rapidly expanding startup where you can take ownership, learn quickly, 
                  and see the direct impact of your work.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">🤝 Collaborative</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in teamwork, open communication, and supporting each other's 
                  professional growth and success.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center py-8 bg-primary/5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always interested in connecting with talented individuals who are passionate about 
            sustainability and making a positive impact. Send us your CV and tell us how you'd like to contribute.
          </p>
          <Button onClick={() => setIsCVPopupOpen(true)}>
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