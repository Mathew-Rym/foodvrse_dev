import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Award, Target, Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const GameSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    userProgress,
    userBadges,
    weeklyChallenges,
    isLoading,
  } = useGamification();

  const handleViewGamification = () => {
    navigate('/gamification');
  };

  const handleViewLeaderboard = () => {
    navigate('/gamification');
  };

  if (!user || isLoading) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Impact Journey
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your progress, earn badges, and compete with friends as you save food and reduce waste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Meals Saved</span>
                  <span className="font-semibold">{userProgress?.total_meals_saved || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CO₂ Saved</span>
                  <span className="font-semibold">{userProgress?.total_co2_saved || 0} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Money Saved</span>
                  <span className="font-semibold">KSh {userProgress?.total_money_saved || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <span className="font-semibold">{userProgress?.current_streak || 0} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Weekly Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyChallenges.length > 0 ? (
                  weeklyChallenges.slice(0, 2).map((challenge) => (
                    <div key={challenge.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm capitalize">
                          {challenge.challenge_type.replace('_', ' ')}
                        </h4>
                        <Badge variant={challenge.is_completed ? "default" : "secondary"}>
                          {challenge.is_completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
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
                  <div className="text-center py-4 text-gray-500">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No active challenges.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Your Badges ({userBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {userBadges.slice(0, 4).map((userBadge) => (
                    <div 
                      key={userBadge.id} 
                      className="text-center p-2 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-2xl mb-1">{userBadge.badge.icon}</div>
                      <h4 className="font-semibold text-xs mb-1">{userBadge.badge.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {userBadge.badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Award className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No badges earned yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleViewGamification}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            View Full Gamification
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
      </div>
    </section>
  );
};

export default GameSection;
