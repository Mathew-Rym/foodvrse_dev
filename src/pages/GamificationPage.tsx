import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Users, 
  Star, 
  Target, 
  Crown, 
  Globe, 
  Share2,
  ArrowLeft,
  TrendingUp,
  Flame,
  Trophy,
  Leaf,
  DollarSign,
  Clock,
  Zap,
  Heart,
  Medal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import MobileLayout from "@/components/MobileLayout";

const GamificationPage = () => {
  const { isAuthenticated, user, userProfile, userImpact } = useAuth();
  const navigate = useNavigate();
  
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [communityStats, setCommunityStats] = useState({
    totalMealsSaved: 0,
    totalCo2Saved: 0,
    totalMoneySaved: 0,
    totalUsers: 0
  });

  // Authentication check - redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  // Calculate level and experience
  const calculateLevel = (exp: number) => {
    if (exp < 100) return { level: 1, expToNext: 100 - exp, progress: (exp / 100) * 100 };
    if (exp < 300) return { level: 2, expToNext: 300 - exp, progress: ((exp - 100) / 200) * 100 };
    if (exp < 600) return { level: 3, expToNext: 600 - exp, progress: ((exp - 300) / 300) * 100 };
    if (exp < 1000) return { level: 4, expToNext: 1000 - exp, progress: ((exp - 600) / 400) * 100 };
    if (exp < 1500) return { level: 5, expToNext: 1500 - exp, progress: ((exp - 1000) / 500) * 100 };
    return { level: 6, expToNext: 0, progress: 100 };
  };

  const levelInfo = userImpact ? calculateLevel(userImpact.experience_points || 0) : { level: 1, expToNext: 100, progress: 0 };

  // Badges data
  const badges = [
    {
      id: 'first-meal',
      name: 'First Meal Saver',
      description: 'Save your first meal',
      icon: '🍽️',
      color: 'bg-green-500',
      earned: (userImpact?.total_meals_saved || 0) >= 1,
      progress: Math.min(userImpact?.total_meals_saved || 0, 1),
      maxProgress: 1
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      color: 'bg-orange-500',
      earned: (userImpact?.current_streak || 0) >= 7,
      progress: Math.min(userImpact?.current_streak || 0, 7),
      maxProgress: 7
    },
    {
      id: 'co2-100',
      name: 'Climate Champion',
      description: 'Save 100kg of CO₂',
      icon: '🌱',
      color: 'bg-emerald-500',
      earned: (userImpact?.total_co2_saved_kg || 0) >= 100,
      progress: Math.min(userImpact?.total_co2_saved_kg || 0, 100),
      maxProgress: 100
    },
    {
      id: 'money-1000',
      name: 'Money Saver',
      description: 'Save KSh 1,000',
      icon: '💰',
      color: 'bg-yellow-500',
      earned: (userImpact?.total_money_saved_ksh || 0) >= 1000,
      progress: Math.min(userImpact?.total_money_saved_ksh || 0, 1000),
      maxProgress: 1000
    }
  ];

  // Load leaderboard data
  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_impact')
        .select(`
          id,
          user_id,
          total_meals_saved,
          total_co2_saved_kg,
          total_money_saved_ksh,
          level,
          experience_points,
          current_streak,
          user_profiles (
            display_name,
            avatar_url
          )
        `)
        .order('experience_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Load community stats
  const loadCommunityStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_impact')
        .select('total_meals_saved, total_co2_saved_kg, total_money_saved_ksh');

      if (error) throw error;

      const stats = data?.reduce((acc, user) => ({
        totalMealsSaved: acc.totalMealsSaved + (user.total_meals_saved || 0),
        totalCo2Saved: acc.totalCo2Saved + (user.total_co2_saved_kg || 0),
        totalMoneySaved: acc.totalMoneySaved + (user.total_money_saved_ksh || 0),
        totalUsers: acc.totalUsers + 1
      }), { totalMealsSaved: 0, totalCo2Saved: 0, totalMoneySaved: 0, totalUsers: 0 });

      setCommunityStats(stats || { totalMealsSaved: 0, totalCo2Saved: 0, totalMoneySaved: 0, totalUsers: 0 });
    } catch (error) {
      console.error('Error loading community stats:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadLeaderboard();
      loadCommunityStats();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-8">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Award className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your impact</h2>
              <p className="text-gray-700 mb-4">Track your food waste reduction journey and compete with others</p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-green to-brand-yellow px-4 py-6 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">My Impact</h1>
              <p className="text-white/90 text-sm">Track your food waste reduction journey</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Personal Stats */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-5 h-5 text-brand-green" />
                Your Impact Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Level Progress */}
              <div className="bg-gradient-to-r from-brand-green to-brand-yellow rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">Level {levelInfo.level}</span>
                  <span className="text-sm">{userImpact?.experience_points || 0} XP</span>
                </div>
                <Progress value={levelInfo.progress} className="h-2 bg-white/20" />
                <p className="text-sm mt-1">
                  {levelInfo.expToNext > 0 ? `${levelInfo.expToNext} XP to next level` : 'Max level reached!'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-brand-green mb-1">
                    {userImpact?.total_meals_saved || 0}
                  </div>
                  <div className="text-sm text-gray-700">Meals Saved</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {userImpact?.total_co2_saved_kg || 0}kg
                  </div>
                  <div className="text-sm text-gray-700">CO₂ Saved</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    KSh {userImpact?.total_money_saved_ksh || 0}
                  </div>
                  <div className="text-sm text-gray-700">Money Saved</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {userImpact?.current_streak || 0}
                  </div>
                  <div className="text-sm text-gray-700">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Medal className="w-5 h-5 text-yellow-600" />
                Badges & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      badge.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-3xl mb-2 ${badge.earned ? 'opacity-100' : 'opacity-50'}`}>
                        {badge.icon}
                      </div>
                      <h3 className={`font-semibold text-sm mb-1 ${
                        badge.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {badge.name}
                      </h3>
                      <p className={`text-xs mb-2 ${
                                                                badge.earned ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {badge.description}
                      </p>
                      <Progress 
                        value={(badge.progress / badge.maxProgress) * 100} 
                        className="h-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {badge.progress}/{badge.maxProgress}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Globe className="w-5 h-5 text-brand-green" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    {communityStats.totalMealsSaved.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Total Meals Saved</div>
                </div>
                <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    {communityStats.totalCo2Saved.toFixed(1)}kg
                  </div>
                  <div className="text-sm text-blue-600">Total CO₂ Saved</div>
                </div>
                <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700 mb-1">
                    KSh {communityStats.totalMoneySaved.toLocaleString()}
                  </div>
                  <div className="text-sm text-yellow-600">Total Money Saved</div>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700 mb-1">
                    {communityStats.totalUsers}
                  </div>
                  <div className="text-sm text-purple-600">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Crown className="w-5 h-5 text-yellow-600" />
                Top Food Savers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto"></div>
                  <p className="text-gray-700 mt-2">Loading leaderboard...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        entry.user_id === user?.id
                          ? 'bg-brand-green/10 border border-brand-green/20'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {entry.user_profiles?.display_name || 'Anonymous'}
                          {entry.user_id === user?.id && (
                            <Badge className="ml-2 bg-brand-green text-white text-xs">You</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Level {entry.level} • {entry.experience_points} XP
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {entry.total_meals_saved} meals
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.total_co2_saved_kg}kg CO₂
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default GamificationPage;
