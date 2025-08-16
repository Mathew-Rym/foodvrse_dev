
import { Trophy, Users, Award, Star, TrendingUp, Sparkles, Leaf, Recycle, Flame, Target, Crown, Globe, Zap, Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useGamification } from '@/hooks/useGamification';
import { GamificationService } from '@/services/gamificationService';
import { toast } from "sonner";
import Logo from "./Logo";

const GameSection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const {
    userProgress,
    userBadges,
    weeklyChallenges,
    isLoading,
    updateUserProgress,
    awardBadge,
    updateWeeklyChallenge
  } = useGamification();

  const [showBadgeAnimation, setShowBadgeAnimation] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Calculate level and experience
  const calculateLevel = (exp: number) => {
    if (exp < 100) return { level: 1, expToNext: 100 - exp };
    if (exp < 300) return { level: 2, expToNext: 300 - exp };
    if (exp < 600) return { level: 3, expToNext: 600 - exp };
    if (exp < 1000) return { level: 4, expToNext: 1000 - exp };
    if (exp < 1500) return { level: 5, expToNext: 1500 - exp };
    if (exp < 2100) return { level: 6, expToNext: 2100 - exp };
    if (exp < 2800) return { level: 7, expToNext: 2800 - exp };
    if (exp < 3600) return { level: 8, expToNext: 3600 - exp };
    if (exp < 4500) return { level: 9, expToNext: 4500 - exp };
    return { level: 10, expToNext: 0 };
  };

  const levelInfo = userProgress ? calculateLevel(userProgress.experience_points) : { level: 1, expToNext: 100 };

  // Update time left for weekly challenge
  const updateTimeLeft = () => {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const timeDiff = endOfWeek.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    setTimeLeft(`${days}d ${hours}h ${minutes}m`);
  };

  useEffect(() => {
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock function to simulate meal saved (for testing)
  const simulateMealSaved = async () => {
    if (!userProgress) return;

    try {
      const newMealsSaved = userProgress.total_meals_saved + 1;
      const newCo2Saved = userProgress.total_co2_saved + 2.5; // 2.5kg CO2 per meal
      const newMoneySaved = userProgress.total_money_saved + 500; // KSh 500 per meal
      const newExp = userProgress.experience_points + 10;

      // Update progress
      await updateUserProgress({
        total_meals_saved: newMealsSaved,
        total_co2_saved: newCo2Saved,
        total_money_saved: newMoneySaved,
        experience_points: newExp
      });

      // Update weekly challenge
      await updateWeeklyChallenge('meals_saved', 1);

      // Check for badges
      if (newMealsSaved === 1) {
        setShowBadgeAnimation('First Saver');
        setTimeout(() => setShowBadgeAnimation(null), 3000);
      } else if (newMealsSaved === 25) {
        setShowBadgeAnimation('Eco Warrior');
        setTimeout(() => setShowBadgeAnimation(null), 3000);
      } else if (newMealsSaved === 100) {
        setShowBadgeAnimation('Century Club');
        setTimeout(() => setShowBadgeAnimation(null), 3000);
      }

      toast.success('🥗 Meal saved!', {
        description: `+10 XP | +2.5kg CO₂ saved | +KSh 500 saved`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error simulating meal saved:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleViewProgress = () => {
    navigate('/impact');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join the Food Waste Revolution
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Track your impact, earn badges, and compete with others to save the most food. 
              Every meal you save makes a difference for our planet.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge Animation Overlay */}
        {showBadgeAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Badge Earned!
              </h3>
              <p className="text-lg text-gray-700">{showBadgeAnimation}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Food Waste Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress, earn badges, and compete with the community to save the most food.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Progress Card */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-600" />
                Level {levelInfo.level} Food Waste Warrior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Experience Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Experience Points: {userProgress?.experience_points || 0}</span>
                    <span>{levelInfo.expToNext} XP to next level</span>
                  </div>
                  <Progress 
                    value={((userProgress?.experience_points || 0) % 100) / 100 * 100} 
                    className="h-3"
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">
                      {userProgress?.total_meals_saved || 0}
                    </div>
                    <div className="text-sm text-gray-600">Meals Saved</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">
                      {userProgress?.total_co2_saved?.toFixed(1) || 0}kg
                    </div>
                    <div className="text-sm text-gray-600">CO₂ Saved</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-yellow-600">
                      KSh {(userProgress?.total_money_saved || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Money Saved</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">
                      {userProgress?.current_streak || 0}
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>

                {/* Test Button */}
                <Button 
                  onClick={simulateMealSaved}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  🥗 Simulate Meal Saved (Test)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Challenges Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Weekly Challenges
                <Badge variant="outline" className="ml-auto">
                  {timeLeft} left
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyChallenges.length > 0 ? (
                  weeklyChallenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold capitalize">
                          {challenge.challenge_type.replace('_', ' ')}
                        </h4>
                        <Badge variant={challenge.is_completed ? "default" : "secondary"}>
                          {challenge.is_completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress: {challenge.current_value}/{challenge.goal_value}</span>
                        <span>{Math.round((challenge.current_value / challenge.goal_value) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(challenge.current_value / challenge.goal_value) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No active challenges.</p>
                    <p className="text-sm">Start saving meals to begin your weekly challenge!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Your Badges ({userBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {userBadges.slice(0, 6).map((userBadge) => (
                    <div 
                      key={userBadge.id} 
                      className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-2">{userBadge.badge.icon}</div>
                      <h4 className="font-semibold text-sm mb-1">{userBadge.badge.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {userBadge.badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No badges earned yet.</p>
                  <p className="text-sm">Start saving meals to earn your first badge!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button 
            onClick={handleViewProgress}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            View Full Progress
          </Button>
          <Button 
            onClick={handleViewLeaderboard}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            View Leaderboard
          </Button>
        </div>

        {/* Community Impact */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12,000+</div>
                  <div className="text-sm text-gray-600">Total Meals Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2.5T</div>
                  <div className="text-sm text-gray-600">CO₂ Reduced</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">KSh 580K</div>
                  <div className="text-sm text-gray-600">Money Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Partner Restaurants</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GameSection;
