import { ArrowLeft, Download, Calendar, ExternalLink, FileText, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { Skeleton } from "@/components/ui/skeleton";

const Press = () => {
  const navigate = useNavigate();
  const metrics = useRealTimeMetrics();

  const pressReleases = [
    {
      title: "Foodvrse Saves Over 10,000 Meals from Waste in First Year",
      date: "January 15, 2025",
      summary: "Kenyan food waste reduction platform reaches major milestone, preventing 6.5 tonnes of CO₂ emissions while helping families save money on quality food.",
      category: "Milestone",
      readTime: "3 min read"
    },
    {
      title: "Foodvrse Expands to 12 Cities Across Kenya",
      date: "December 8, 2024",
      summary: "Food rescue platform announces expansion to major urban centers including Mombasa, Kisumu, and Nakuru, partnering with over 150 local businesses.",
      category: "Expansion",
      readTime: "2 min read"
    },
    {
      title: "Partnership with Kenya Restaurant Association Announced",
      date: "November 20, 2024",
      summary: "Strategic partnership aims to reduce food waste across Kenya's hospitality sector while providing affordable meal options to communities.",
      category: "Partnership",
      readTime: "4 min read"
    },
    {
      title: "Foodvrse Wins Kenya Climate Innovation Challenge 2024",
      date: "October 15, 2024",
      summary: "Climate tech startup recognized for innovative approach to food waste reduction and community impact in Kenya's sustainability sector.",
      category: "Award",
      readTime: "3 min read"
    }
  ];

  const mediaKit = [
    {
      name: "Company Logo Package",
      description: "High-resolution logos in various formats (PNG, SVG, EPS)",
      type: "ZIP",
      size: "2.3 MB"
    },
    {
      name: "Product Screenshots",
      description: "High-quality app screenshots and interface designs",
      type: "ZIP",
      size: "15.2 MB"
    },
    {
      name: "Company Fact Sheet",
      description: "Key statistics, milestones, and company information",
      type: "PDF",
      size: "1.1 MB"
    }
  ];

  const executiveTeamPhotos = [
    {
      name: "Rym Njuguna",
      role: "CEO & Co-Founder",
      image: "/team/rym-njuguna.jpg",
      filename: "rym-njuguna.jpg"
    },
    {
      name: "Rachel Wangu",
      role: "Co- Founder and Chief Sustainability Officer (CSO) ", 
      image: "/team/rachel-wangu.jpg",
      filename: "rachel-wangu.jpg"
    },
    {
      name: "Hebrew Simeon",
      role: "Co- Founder and Head of Strategic Partnerships",
      image: "/team/hebrew-simeon.jpg",
      filename: "hebrew-simeon.jpg"
    },
    {
      name: "Charity W. Kiarie",
      role: "Sustainability Advisor",
      image: "/team/charity-kiarie.jpg",
      filename: "charity-kiarie.jpg"
    }
  ];

  const mediaContacts = [
    {
      name: "Hebrew Simeon",
      role: "Co- Founder and Head of Strategic Partnerships",
      email: "hebrew@foodvrse.com",
      focus: "Manages PR, partnerships, and media relations."
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Press & Media</h1>
          <p className="text-xl text-muted-foreground">
            Latest news, press releases, and media resources about Foodvrse
          </p>
        </div>

        {/* Company Overview */}
        <section className="mb-12">
          <Card className="bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">About Foodvrse</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Foodvrse is Kenya's leading food waste reduction platform that connects restaurants, cafes, 
                and food businesses with conscious consumers through "mystery bags" of surplus food.                 Founded 
                in 2024, we've saved over {metrics.isLoading ? '...' : metrics.totalMealsRescued.toLocaleString()} meals from waste, prevented {metrics.isLoading ? '...' : metrics.totalCo2SavedTonnes.toFixed(1)} tonnes of CO₂ emissions, 
                and helped users save more than KSH {metrics.isLoading ? '...' : (metrics.totalMoneySavedKsh / 1000).toFixed(0)}K on quality food.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to eliminate food waste by creating a sustainable ecosystem where businesses 
                can monetize surplus food while making quality meals accessible to everyone, regardless of 
                their economic situation.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Quick Facts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Quick Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                {metrics.isLoading ? (
                  <Skeleton className="h-8 w-20 mx-auto mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-primary mb-2">{metrics.totalMealsRescued.toLocaleString()}</div>
                )}
                <p className="text-muted-foreground">Meals Rescued</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                {metrics.isLoading ? (
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-primary mb-2">{metrics.totalBusinessPartners}</div>
                )}
                <p className="text-muted-foreground">Business Partners</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                {metrics.isLoading ? (
                  <Skeleton className="h-8 w-8 mx-auto mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-primary mb-2">{metrics.citiesServed}</div>
                )}
                <p className="text-muted-foreground">Cities Served</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                {metrics.isLoading ? (
                  <Skeleton className="h-8 w-12 mx-auto mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-blue-700 mb-2">{metrics.totalCo2SavedTonnes.toFixed(1)}t</div>
                )}
                <p className="text-blue-600 font-medium">CO₂ Saved</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{release.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {release.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2 hover:text-primary cursor-pointer">
                        {release.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {release.date}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read More
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{release.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Media Kit</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {item.type === "ZIP" ? (
                        <Image className="h-8 w-8 text-primary mt-1" />
                      ) : (
                        <FileText className="h-8 w-8 text-primary mt-1" />
                      )}
                      <div>
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{item.type}</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Executive Team Photos */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Executive Team Photos</h2>
          <p className="text-muted-foreground mb-6">
            Professional headshots of our leadership team. High-resolution images available for download.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {executiveTeamPhotos.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{member.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{member.role}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = member.image;
                      link.download = member.filename;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Media Contacts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Media Contacts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaContacts.map((contact, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{contact.name}</h3>
                  <p className="text-primary font-medium mb-3">{contact.role}</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                        {contact.email}
                      </a>
                    </p>

                    <p>
                      <strong>Focus:</strong> {contact.focus}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Media Guidelines */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Media Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Logo Usage</h4>
                  <p className="text-muted-foreground">
                    Please use our official logo files without modification. Maintain clear space around the logo 
                    and ensure sufficient contrast with background colors.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Company Name</h4>
                  <p className="text-muted-foreground">
                    Always refer to us as "Foodvrse" (one word, with capital F). Avoid "Food Verse" or "FoodVerse".
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Photography</h4>
                  <p className="text-muted-foreground">
                    High-resolution product screenshots and team photos are available in our media kit. 
                    Please contact us for custom photography requests.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Interview Requests</h4>
                  <p className="text-muted-foreground">
                    For interview requests with our leadership team, please contact our media team at least 
                    48 hours in advance. We're happy to accommodate various time zones and formats.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact CTA */}
        <section className="text-center py-8 bg-primary/5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our media team is here to help with press inquiries, interview requests, and additional resources. 
            We typically respond within 24 hours.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild>
              <a href="mailto:hebrew@foodvrse.com?subject=Media Inquiry - FoodVrse">
                Contact Media Team
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:hebrew@foodvrse.com?subject=Interview Request - FoodVrse">
                Interview Request
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Press;