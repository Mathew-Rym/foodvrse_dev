import { ArrowLeft, Leaf, Users, Utensils, DollarSign, TreePine, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const OurImpact = () => {
  const navigate = useNavigate();

  // Sample data - in real app this would come from API
  const impactStats = {
    mealsRescued: 12547,
    co2Saved: 8.2, // tonnes
    moneySaved: 847300, // KSH
    businessPartners: 156,
    activeUsers: 8432,
    waterSaved: 125000, // liters
    energySaved: 15.6, // MWh
  };

  const monthlyGrowth = {
    meals: 18,
    partners: 12,
    users: 25
  };

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
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Impact</h1>
          <p className="text-xl text-muted-foreground">
            Together, we're making a real difference in fighting food waste and building sustainable communities
          </p>
        </div>

        {/* Key Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-2">
                {impactStats.mealsRescued.toLocaleString()}
              </div>
              <p className="text-muted-foreground">Meals Rescued</p>
              <div className="mt-2 text-sm text-green-600">
                +{monthlyGrowth.meals}% this month
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Leaf className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <div className="text-3xl font-bold text-foreground mb-2">
                {impactStats.co2Saved}t
              </div>
              <p className="text-muted-foreground">CO₂ Emissions Saved</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Equivalent to 36 trees planted
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <div className="text-3xl font-bold text-foreground mb-2">
                KSH {(impactStats.moneySaved / 1000).toFixed(0)}K
              </div>
              <p className="text-muted-foreground">Money Saved by Users</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Average 60% savings per meal
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <div className="text-3xl font-bold text-foreground mb-2">
                {impactStats.businessPartners}
              </div>
              <p className="text-muted-foreground">Business Partners</p>
              <div className="mt-2 text-sm text-green-600">
                +{monthlyGrowth.partners}% this month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Environmental Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TreePine className="h-6 w-6 text-green-600" />
                  Carbon Footprint Reduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CO₂ Saved</span>
                      <span>{impactStats.co2Saved}t / 10t goal</span>
                    </div>
                    <Progress value={(impactStats.co2Saved / 10) * 100} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Every rescued meal prevents an average of 0.65kg of CO₂ emissions from food waste decomposition.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplets className="h-6 w-6 text-blue-600" />
                  Water Conservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Water Saved</span>
                      <span>{(impactStats.waterSaved / 1000).toFixed(0)}K / 200K liters</span>
                    </div>
                    <Progress value={(impactStats.waterSaved / 200000) * 100} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rescuing food saves the water that was used in production, processing, and transportation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="h-6 w-6 text-yellow-600" />
                  Energy Conservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Energy Saved</span>
                      <span>{impactStats.energySaved} / 25 MWh</span>
                    </div>
                    <Progress value={(impactStats.energySaved / 25) * 100} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Preventing food waste saves the energy used in food production and reduces landfill methane.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Impact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Social Impact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Community Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Food Savers</span>
                  <span className="font-semibold">{impactStats.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Savings per User</span>
                  <span className="font-semibold">KSH {Math.round(impactStats.moneySaved / impactStats.activeUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cities Served</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Monthly New Users</span>
                  <span className="font-semibold text-green-600">+{monthlyGrowth.users}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Partner Restaurants</span>
                  <span className="font-semibold">{impactStats.businessPartners}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Revenue Recovery</span>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Waste Reduction</span>
                  <span className="font-semibold">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Satisfaction</span>
                  <span className="font-semibold">4.8/5⭐</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact Stories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Impact Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">"Reducing waste while helping our community"</h3>
                <p className="text-muted-foreground mb-4">
                  "Since joining Foodvrse, we've reduced our food waste by 75% and generated additional 
                  revenue of KSH 45,000 monthly. It feels great knowing our unsold items are helping 
                  families instead of going to landfill."
                </p>
                <div className="text-sm">
                  <p className="font-medium">Maria Kiprotich</p>
                  <p className="text-muted-foreground">Owner, Savannah Bakery</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">"Affordable quality food for our family"</h3>
                <p className="text-muted-foreground mb-4">
                  "As a student, Foodvrse has been a game-changer. I can enjoy quality meals from 
                  my favorite restaurants at 60% off while contributing to environmental conservation. 
                  I've saved over KSH 12,000 this semester!"
                </p>
                <div className="text-sm">
                  <p className="font-medium">David Wanjiku</p>
                  <p className="text-muted-foreground">University Student & Food Saver</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8 bg-primary/5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Be Part of the Solution</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every mystery bag you buy makes a difference. Join thousands of food savers in building 
            a more sustainable and equitable food system.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => navigate("/auth")}>
              Start Saving Food Today
            </Button>
            <Button variant="outline" onClick={() => navigate("/partner-application")}>
              Partner With Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OurImpact;