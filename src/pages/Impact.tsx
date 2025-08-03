
import { Leaf, Trophy, Users, TrendingUp, Share2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";

const Impact = () => {
  const stats = [
    { icon: Leaf, label: "Meals Saved", value: "47", color: "text-green-600" },
    { icon: TrendingUp, label: "CO₂ Prevented", value: "28.2kg", color: "text-blue-600" },
    { icon: Trophy, label: "Money Saved", value: "KSh 12,400", color: "text-yellow-600" },
    { icon: Users, label: "Rank", value: "#23", color: "text-purple-600" },
  ];

  const achievements = [
    { title: "First Saver", description: "Saved your first meal", earned: true },
    { title: "Eco Warrior", description: "Saved 25 meals", earned: true },
    { title: "Planet Hero", description: "Prevented 20kg CO₂", earned: true },
    { title: "Century Club", description: "Save 100 meals", earned: false },
  ];

  const friends = [
    { name: "Sarah K.", meals: 63, rank: 1 },
    { name: "John M.", meals: 52, rank: 2 },
    { name: "You", meals: 47, rank: 3 },
    { name: "Emma L.", meals: 41, rank: 4 },
    { name: "Alex R.", meals: 38, rank: 5 },
  ];

  const handleShareImpact = () => {
    const shareText = `I've saved 47 meals and prevented 28.2kg of CO₂ emissions with FoodVrse! Join me in fighting food waste. #FoodWasteWarrior #SaveTheFood`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Food Waste Impact',
        text: shareText,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      alert('Impact shared to clipboard!');
    }
  };

  const handleInviteFriends = () => {
    const inviteText = `Join me on FoodVrse and help fight food waste together! We can save food, money, and the environment. ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join FoodVrse',
        text: inviteText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(inviteText);
      alert('Invite link copied to clipboard!');
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Your Impact</h1>
          <p className="text-muted-foreground mt-1">See how you're helping save the planet</p>
        </div>

        {/* Stats Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-card rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              onClick={handleShareImpact}
              className="bg-brand-green text-white hover:bg-brand-green/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Impact
            </Button>
            <Button 
              onClick={handleInviteFriends}
              className="bg-brand-yellow text-brand-green hover:bg-brand-yellow/90"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Friends
            </Button>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-card rounded-lg p-4 shadow-sm flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                          achievement.earned ? "bg-yellow-100 dark:bg-yellow-900" : "bg-muted"
                  }`}>
                    <Trophy className={`w-5 h-5 ${achievement.earned ? "text-yellow-600" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-green-100 text-green-600">Earned</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Friends Leaderboard</h2>
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              {friends.map((friend, index) => (
                <div key={index} className={`flex items-center gap-3 p-4 ${
                  friend.name === "You" ? "bg-orange-50 dark:bg-orange-900" : ""
                } ${index !== friends.length - 1 ? "border-b border-border" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    friend.rank === 1 ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200" :
                    friend.rank === 2 ? "bg-muted text-muted-foreground" :
                    friend.rank === 3 ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    #{friend.rank}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${friend.name === "You" ? "text-orange-600" : "text-gray-900"}`}>
                      {friend.name}
                    </p>
                    <p className="text-sm text-gray-600">{friend.meals} meals saved</p>
                  </div>
                  {friend.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Impact;
