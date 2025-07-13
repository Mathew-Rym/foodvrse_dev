import { ArrowLeft, Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CVPopup from "@/components/CVPopup";

const MeetTheTeam = () => {
  const navigate = useNavigate();
  const [isCVPopupOpen, setIsCVPopupOpen] = useState(false);

  const teamMembers = [
    {
      name: "Rym Njuguna",
      role: "Founder CTO & CEO",
      bio: "Former Mechtronics Eng. consultant with 8 years of experience in business and sustainable food systems. Combines technical expertise with deep understanding of food industry operations & Passionate about creating technology solutions for environmental challenges.",
      avatar: "/placeholder.svg",
      initials: "RN",
      location: "Nairobi, Kenya",
      linkedin: "#",
      twitter: "#",
      email: "rym@foodvrse.com"
    },
  ,
    {
      name: "Amina Hassan",
      role: "Head of Partnerships",
      bio: "Former business development manager at leading hospitality group. Expert in building relationships with restaurants and food businesses.",
      avatar: "/placeholder.svg",
      initials: "AH",
      location: "Nairobi, Kenya",
      linkedin: "#",
      twitter: "#",
      email: "amina@foodvrse.com"
    },
    {
      name: "Peter Mwangi",
      role: "Lead Developer",
      bio: "Senior software engineer with expertise in React and mobile development. Previously worked at top fintech companies in Kenya.",
      avatar: "/placeholder.svg",
      initials: "PM",
      location: "Nakuru, Kenya",
      linkedin: "#",
      twitter: "#",
      email: "peter@foodvrse.com"
    },
    {
      name: "Grace Wanjiru",
      role: "Operations Manager",
      bio: "Operations specialist with background in logistics and supply chain. Ensures smooth operations between businesses and customers.",
      avatar: "/placeholder.svg",
      initials: "GW",
      location: "Nairobi, Kenya",
      linkedin: "#",
      twitter: "#",
      email: "grace@foodvrse.com"
    },
    {
      name: "Michael Kiprotich",
      role: "Marketing Lead",
      bio: "Digital marketing expert with focus on sustainable brands. Helps spread awareness about food waste reduction and community impact.",
      avatar: "/placeholder.svg",
      initials: "MK",
      location: "Eldoret, Kenya",
      linkedin: "#",
      twitter: "#",
      email: "michael@foodvrse.com"
    }
  ];

  const advisors = [
    {
      name: "Dr. Rachel Nyong'o",
      role: "Sustainability Advisor",
      bio: "Environmental scientist and food systems expert. PhD in Sustainable Agriculture from University of Nairobi.",
      avatar: "/placeholder.svg",
      initials: "RN"
    },
    {
      name: "David Kinyanjui",
      role: "Business Advisor",
      bio: "Serial entrepreneur and investor. Founded three successful startups in Kenya's tech ecosystem.",
      avatar: "/placeholder.svg",
      initials: "DK"
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Meet the Team</h1>
          <p className="text-xl text-muted-foreground">
            The passionate people behind Foodvrse, working to eliminate food waste and build sustainable communities
          </p>
        </div>

        {/* Core Team */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Core Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" />
                      {member.location}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Advisors */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Advisors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {advisors.map((advisor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={advisor.avatar} alt={advisor.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {advisor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-foreground">{advisor.name}</h3>
                    <p className="text-primary font-medium mb-3">{advisor.role}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {advisor.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Company Culture */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-semibold mb-2">Sustainability First</h3>
                <p className="text-sm text-muted-foreground">
                  Every decision we make considers its environmental impact and contribution to a sustainable future
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Collaborative Spirit</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in the power of teamwork and actively support each other's growth and success
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-semibold mb-2">Innovation Driven</h3>
                <p className="text-sm text-muted-foreground">
                  We embrace creativity and encourage innovative solutions to complex environmental challenges
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Join Us */}
        <section className="text-center py-8 bg-primary/5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Want to Join Our Mission?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for passionate individuals who share our vision of eliminating food waste 
            and building sustainable communities. Check out our open positions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate("/careers")}>
              View Open Positions
            </Button>
            <Button variant="outline" onClick={() => setIsCVPopupOpen(true)}>
              Send Your CV
            </Button>
          </div>
                  </section>
        </div>
        <CVPopup 
          isOpen={isCVPopupOpen} 
          onClose={() => setIsCVPopupOpen(false)} 
        />
      </div>
    );
  };

export default MeetTheTeam;