
import { Trophy, Users, Award, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./Logo";

interface UserChallenge {
  current_count: number;
  week_start_date: string;
  week_end_date: string;
  completed: boolean;
  badge_awarded: boolean;
}

interface ChallengeSettings {
  goal_value: number;
  badge_name: string;
}

interface UserBadge {
  badge: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
}

const GameSection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [userChallenge, setUserChallenge] = useState<UserChallenge | null>(null);
  const [challengeSettings, setChallengeSettings] = useState<ChallengeSettings | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchChallengeData();
      setupRealtimeSubscription();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [userChallenge]);

  const fetchChallengeData = async () => {
    if (!user) return;

    try {
      // Get challenge settings
      const { data: settings } = await supabase
        .from('challenge_settings')
        .select('*')
        .eq('challenge_type', 'weekly_rescue')
        .single();

      setChallengeSettings(settings);

      // Get current week's challenge
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
      currentWeekStart.setHours(0, 0, 0, 0);

      const { data: challenge } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_type', 'weekly_rescue')
        .eq('week_start_date', currentWeekStart.toISOString().split('T')[0])
        .single();

      setUserChallenge(challenge);

      // Get user badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select(`
          badge:badges(name, description, icon, color)
        `)
        .eq('user_id', user.id);

      setUserBadges(badges || []);

    } catch (error) {
      console.error('Error fetching challenge data:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('user-challenge-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_challenges',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setUserChallenge(payload.new as UserChallenge);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_badges',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchChallengeData(); // Refresh badges when new one is awarded
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateTimeLeft = () => {
    if (!userChallenge) return;

    const endDate = new Date(userChallenge.week_end_date + 'T23:59:59');
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft('Challenge ended');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      setTimeLeft(`${days} days`);
    } else if (hours > 0) {
      setTimeLeft(`${hours}h ${minutes}m`);
    } else {
      setTimeLeft(`${minutes}m`);
    }
  };

  const handleInviteFriends = () => {
    if (!isAuthenticated) {
      // Store redirect path to go to impact page after login
      sessionStorage.setItem('redirectAfterAuth', '/impact');
      navigate("/auth");
      return;
    }
    navigate("/impact");
  };
  const userStats = {
    rank: 3,
    mealsSaved: 127,
    co2Saved: 15.2,
    streak: 12
  };

  const leaderboard = [
    { rank: 1, name: "Sarah K.", mealsSaved: 234, avatar: "🌟" },
    { rank: 2, name: "Mike R.", mealsSaved: 189, avatar: "🏆" },
    { rank: 3, name: "You", mealsSaved: 127, avatar: "logo" },
    { rank: 4, name: "Emma L.", mealsSaved: 98, avatar: "🌱" },
    { rank: 5, name: "David M.", mealsSaved: 76, avatar: "♻️" }
  ];

  const achievements = [
    { id: 1, title: "First Rescue", description: "Saved your first meal", completed: true, icon: "🎯" },
    { id: 2, title: "Eco Warrior", description: "Saved 50 meals", completed: true, icon: "🌍" },
    { id: 3, title: "Streak Master", description: "10-day saving streak", completed: true, icon: "🔥" },
    { id: 4, title: "Century Club", description: "Save 100 meals", completed: true, icon: "💯" },
    { id: 5, title: "Legendary Saver", description: "Save 500 meals", completed: false, icon: "👑" }
  ];

  const friends = [
    { name: "Sarah K.", status: "Just saved 3 meals!", mealsSaved: 234, isOnline: true },
    { name: "Mike R.", status: "On a 15-day streak!", mealsSaved: 189, isOnline: true },
    { name: "Emma L.", status: "Discovered a new bakery", mealsSaved: 98, isOnline: false }
  ];

  return (
    <section className="py-12 lg:py-16 bg-brand-light-green overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-green mb-4">
            Food Saving Challenge
          </h2>
          <p className="text-lg text-brand-green/80 max-w-2xl mx-auto">
            Compete with friends, earn achievements, and climb the leaderboard while making a difference!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Stats Card */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-brand-green rounded-full mx-auto flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Your Rank</CardTitle>
              <p className="text-3xl font-bold text-brand-green">#{userStats.rank}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Meals Saved</span>
                <span className="font-bold text-lg">{userStats.mealsSaved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">CO₂ Saved</span>
                <span className="font-bold text-lg">{userStats.co2Saved} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Streak</span>
                <span className="font-bold text-lg flex items-center">
                  {userStats.streak} <span className="ml-1">🔥</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-brand-green" />
                <span>Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name === 'You' ? 'bg-brand-light-green border-2 border-brand-green' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {user.avatar === "logo" ? (
                        <Logo size="sm" />
                      ) : (
                        <span className="text-2xl">{user.avatar}</span>
                      )}
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.mealsSaved} meals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-brand-green">#{user.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Friends Activity */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-brand-green" />
                <span>Friends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friends.map((friend, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <div className="relative">
                      <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{friend.name.charAt(0)}</span>
                      </div>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">{friend.status}</p>
                      <p className="text-xs text-brand-green font-medium">{friend.mealsSaved} meals saved</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-4 bg-brand-yellow text-brand-green font-semibold hover:bg-brand-yellow/90 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleInviteFriends}
              >
                Invite Friends
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">Achievements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`text-center p-4 transition-all hover:scale-105 ${
                  achievement.completed 
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' 
                    : 'bg-muted border-border'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
                {achievement.completed && (
                  <div className="mt-2">
                    <Award className="w-4 h-4 text-yellow-600 mx-auto" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Challenge Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8">
            <h3 className="text-2xl font-bold mb-4">Weekly Challenge</h3>
            <p className="text-lg mb-4">
              Save {challengeSettings?.goal_value || 10} meals this week to earn the "{challengeSettings?.badge_name || 'Weekly Hero'}" badge!
            </p>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{userChallenge?.current_count || 0}</p>
                <p className="text-sm">Meals Saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {Math.max(0, (challengeSettings?.goal_value || 10) - (userChallenge?.current_count || 0))}
                </p>
                <p className="text-sm">To Go!</p>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-6">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${Math.min(100, ((userChallenge?.current_count || 0) / (challengeSettings?.goal_value || 10)) * 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-sm opacity-90">
              {userChallenge?.completed ? 'Challenge completed!' : `Challenge ends in ${timeLeft}`}
            </p>
            {userChallenge?.badge_awarded && (
              <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                <p className="text-sm font-semibold">🏆 Badge Earned!</p>
                <p className="text-xs opacity-90">You've earned the {challengeSettings?.badge_name} badge!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GameSection;
