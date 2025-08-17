import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Award, Target, Award } from 'lucide-react';
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
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Impact Journey
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your progress, earn badges, and compete with friends as you save food and reduce waste.
          </p>
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
