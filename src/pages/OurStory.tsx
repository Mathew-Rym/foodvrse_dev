import { ArrowLeft, Heart, Users, Lightbulb, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OurStory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Story</h1>
          <p className="text-xl text-muted-foreground">
            From a simple idea to a movement that's changing how we think about food waste
          </p>
        </div>

        <div className="space-y-12">
          {/* Hero Section */}
          <section className="text-center py-8">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Foodvrse was born from a simple yet powerful observation: perfectly good food was being wasted 
                while people in our communities were struggling to access affordable, quality meals. We knew there 
                had to be a better way.
              </p>
            </div>
          </section>

          {/* The Beginning */}
          <section>
            <h2 className="text-3xl font-bold mb-6">The Beginning</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground mb-4">
                  In 2023, our founders Sarah and James witnessed firsthand the massive amount of perfectly good food 
                  being discarded by restaurants and bakeries at the end of each day. At the same time, they saw 
                  students and families in their community struggling with rising food costs.
                </p>
                <p className="text-muted-foreground">
                  This sparked an idea: What if we could create a platform that connects food businesses with 
                  conscious consumers, turning waste into opportunity while making quality food more accessible?
                </p>
              </div>
              <Card className="bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Our First Save</h3>
                  <p className="text-sm text-muted-foreground">
                    A local bakery's 50 unsold pastries became mystery bags that fed 25 families and saved 15kg of CO₂
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To eliminate food waste by creating a sustainable ecosystem where businesses can monetize 
                  surplus food while making quality meals accessible to everyone, regardless of their economic situation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Lightbulb className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground">
                  A world where every meal has value, no good food goes to waste, and sustainable consumption 
                  is the norm rather than the exception.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Core Values */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-10 w-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Community First</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe in building strong local communities where businesses and consumers support each other
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-10 w-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Sustainability</h3>
                  <p className="text-sm text-muted-foreground">
                    Every action we take considers its environmental impact and contribution to a sustainable future
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-10 w-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    We're open about our processes, impact, and the journey toward a more sustainable food system
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Impact Timeline */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">2023 - The Idea</h3>
                  <p className="text-muted-foreground">Conceived the concept and built our first prototype</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">Early 2024 - First Partners</h3>
                  <p className="text-muted-foreground">Onboarded our first 10 restaurant partners and saved 1,000 meals</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">Mid 2024 - Community Growth</h3>
                  <p className="text-muted-foreground">Reached 1,000 active users and expanded to 5 cities</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">Today - Scaling Impact</h3>
                  <p className="text-muted-foreground">Over 50 business partners and 10,000+ meals saved from waste</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-8 bg-primary/5 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Join Our Story</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Every mystery bag purchased, every meal saved, and every business partner that joins us adds a new 
              chapter to our story. Together, we're creating a more sustainable and equitable food system.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={() => navigate("/auth")}>Start Saving Food</Button>
              <Button variant="outline" onClick={() => navigate("/partner-application")}>
                Become a Partner
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OurStory;