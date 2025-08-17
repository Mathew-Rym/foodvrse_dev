import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Award, 
  Star, 
  Target, 
  Crown, 
  Globe, 
  Share2,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from '@/hooks/useGamification';
import { useFriendsProgress } from "@/hooks/useFriendsProgress";
import { GamificationService } from '@/services/gamificationService';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  meals_saved: number;
  co2_saved: number;
  money_saved: number;
  period_type: string;
  period_start: string;
  user_profile: {
    full_name: string;
    avatar_url: string;
  };
}

const GamificationPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
const { friendsProgress, isLoading: friendsLoading } = useFriendsProgress();
  const navigate = useNavigate();
  const {
const { friendsProgress, isLoading: friendsLoading } = useFriendsProgress();
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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [communityStats, setCommunityStats] = useState({
    totalMealsSaved: 0,
    totalCo2Saved: 0,
    totalMoneySaved: 0,
    totalUsers: 0
  });

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

  // Fetch community statistics
  const fetchCommunityStats = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
const { friendsProgress, isLoading: friendsLoading } = useFriendsProgress();
        .from('user_progress')
        .select('total_meals_saved, total_co2_saved, total_money_saved');

      if (progressError) throw progressError;

      const stats = progressData.reduce((acc, progress) => ({
        totalMealsSaved: acc.totalMealsSaved + (progress.total_meals_saved || 0),
        totalCo2Saved: acc.totalCo2Saved + (progress.total_co2_saved || 0),
        totalMoneySaved: acc.totalMoneySaved + (progress.total_money_saved || 0),
        totalUsers: acc.totalUsers + 1
      }), {
        totalMealsSaved: 0,
        totalCo2Saved: 0,
        totalMoneySaved: 0,
        totalUsers: 0
      });

      setCommunityStats(stats);
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  };

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const data = await GamificationService.getLeaderboard('weekly');
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Share functionality
  const shareUrl = `${window.location.origin}/gamification`;
  const shareText = `Check out my FoodVrse progress! I've saved ${userProgress?.total_meals_saved || 0} meals and prevented ${userProgress?.total_co2_saved?.toFixed(1) || 0}kg of CO₂ emissions. Join me in fighting food waste! 🌱`;

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'instagram':
        await handleCopyToClipboard();
        toast.success('Link copied! Share it on Instagram');
        return;
      case 'copy':
        await handleCopyToClipboard();
        return;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  // Simulate meal saved (for testing)
  const simulateMealSaved = async () => {
    if (!userProgress) return;

    try {
      const newMealsSaved = userProgress.total_meals_saved + 1;
      const newCo2Saved = userProgress.total_co2_saved + 2.5;
      const newMoneySaved = userProgress.total_money_saved + 500;
      const newExp = userProgress.experience_points + 10;

      await updateUserProgress({
        total_meals_saved: newMealsSaved,
        total_co2_saved: newCo2Saved,
        total_money_saved: newMoneySaved,
        experience_points: newExp
      });

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

      // Refresh community stats and leaderboard
      fetchCommunityStats();
      fetchLeaderboard();
    } catch (error) {
      console.error('Error simulating meal saved:', error);
      toast.error('Failed to update progress');
    }
  };

  useEffect(() => {
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommunityStats();
      fetchLeaderboard();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join the Food Waste Revolution
          </h2>
          <p className="text-gray-600 mb-6">
            Track your impact, earn badges, and compete with others to save the most food. 
            Every meal you save makes a difference for our planet.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Badge Animation Overlay */}
      {showBadgeAnimation && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-8">
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
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gamification & Achievements</h1>
              <p className="text-sm text-gray-600">Track your food waste impact</p>
            </div>
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Progress
            </Button>
            
            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border p-2 z-10 min-w-[200px]">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="w-full justify-start"
                  >
                    <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="w-full justify-start"
                  >
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('instagram')}
                    className="w-full justify-start"
                  >
                    <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                    Instagram
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className="w-full justify-start"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
n        {/* Friends Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Friends Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : friendsProgress.length > 0 ? (
              <div className="space-y-3">
                {friendsProgress.map((friend, index) => (
                  <div 
                    key={friend.user_id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{friend.display_name}</div>
                        <div className="text-sm text-gray-600">
                          Level {friend.level} • {friend.total_meals_saved} meals saved
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-600">
                        {friend.total_co2_saved?.toFixed(1) || 0}kg CO₂
                      </div>
                      <div className="text-sm text-gray-600">
                        KSh {(friend.total_money_saved || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No friends found.</p>
                <p className="text-sm">Invite friends to see their progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Challenges */}
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
n        {/* Friends Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Friends Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : friendsProgress.length > 0 ? (
              <div className="space-y-3">
                {friendsProgress.map((friend, index) => (
                  <div 
                    key={friend.user_id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{friend.display_name}</div>
                        <div className="text-sm text-gray-600">
                          Level {friend.level} • {friend.total_meals_saved} meals saved
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-600">
                        {friend.total_co2_saved?.toFixed(1) || 0}kg CO₂
                      </div>
                      <div className="text-sm text-gray-600">
                        KSh {(friend.total_money_saved || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No friends found.</p>
                <p className="text-sm">Invite friends to see their progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
          </Card>

          {/* User Badges */}
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
                  {userBadges.map((userBadge) => (
                    <div 
                      key={userBadge.id} 
                      className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-2">{userBadge.badge.icon}</div>
                      <h4 className="font-semibold text-sm mb-1">{userBadge.badge.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{userBadge.badge.description}</p>
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
n        {/* Friends Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Friends Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : friendsProgress.length > 0 ? (
              <div className="space-y-3">
                {friendsProgress.map((friend, index) => (
                  <div 
                    key={friend.user_id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{friend.display_name}</div>
                        <div className="text-sm text-gray-600">
                          Level {friend.level} • {friend.total_meals_saved} meals saved
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-600">
                        {friend.total_co2_saved?.toFixed(1) || 0}kg CO₂
                      </div>
                      <div className="text-sm text-gray-600">
                        KSh {(friend.total_money_saved || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No friends found.</p>
                <p className="text-sm">Invite friends to see their progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Weekly Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.user_id === user?.id ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {entry.user_id === user?.id ? 'You' : entry.user_profile?.full_name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.meals_saved} meals saved
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {entry.co2_saved?.toFixed(1) || 0}kg CO₂
                      </div>
                      <div className="text-sm text-gray-600">
                        KSh {(entry.money_saved || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No leaderboard data available.</p>
                <p className="text-sm">Be the first to save meals and top the leaderboard!</p>
              </div>
            )}
          </CardContent>
n        {/* Friends Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Friends Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : friendsProgress.length > 0 ? (
              <div className="space-y-3">
                {friendsProgress.map((friend, index) => (
                  <div 
                    key={friend.user_id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{friend.display_name}</div>
                        <div className="text-sm text-gray-600">
                          Level {friend.level} • {friend.total_meals_saved} meals saved
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-600">
                        {friend.total_co2_saved?.toFixed(1) || 0}kg CO₂
                      </div>
                      <div className="text-sm text-gray-600">
                        KSh {(friend.total_money_saved || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No friends found.</p>
                <p className="text-sm">Invite friends to see their progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
        </Card>

        {/* Community Impact */}
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
                <div className="text-2xl font-bold text-purple-600">
                  {communityStats.totalMealsSaved.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600">Total Meals Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(communityStats.totalCo2Saved / 1000).toFixed(1)}T
                </div>
                <div className="text-sm text-gray-600">CO₂ Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  KSh {(communityStats.totalMoneySaved / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Money Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {communityStats.totalUsers}+
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </CardContent>
n        {/* Friends Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Friends Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : friendsProgress.length > 0 ? (
              <div className="space-y-3">
                {friendsProgress.map((friend, index) => (
                  <div 
                    key={friend.user_id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{friend.display_name}</div>
                        <div className="text-sm text-gray-600">
                          Level {friend.level} • {friend.total_meals_saved} meals saved
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-600">
                        {friend.total_co2_saved?.toFixed(1) || 0}kg CO₂
                      </div>
                      <div className="text-sm text-gray-600">
                        KSh {(friend.total_money_saved || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No friends found.</p>
                <p className="text-sm">Invite friends to see their progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
        </Card>
      </div>
    </div>
  );
};

export default GamificationPage;
