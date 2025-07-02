
import { Trophy, Users, Award, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GameSection = () => {
  const userStats = {
    rank: 3,
    mealsSaved: 127,
    co2Saved: 15.2,
    streak: 12
  };

  const leaderboard = [
    { rank: 1, name: "Sarah K.", mealsSaved: 234, avatar: "🌟" },
    { rank: 2, name: "Mike R.", mealsSaved: 189, avatar: "🏆" },
    { rank: 3, name: "You", mealsSaved: 127, avatar: "🍽️" },
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
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Food Saving Challenge
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compete with friends, earn achievements, and climb the leaderboard while making a difference!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Stats Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Your Rank</CardTitle>
              <p className="text-3xl font-bold text-purple-600">#{userStats.rank}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Meals Saved</span>
                <span className="font-bold text-lg">{userStats.mealsSaved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CO₂ Saved</span>
                <span className="font-bold text-lg">{userStats.co2Saved} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-bold text-lg flex items-center">
                  {userStats.streak} <span className="ml-1">🔥</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name === 'You' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{user.avatar}</span>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.mealsSaved} meals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-purple-600">#{user.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Friends Activity */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Friends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friends.map((friend, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{friend.name.charAt(0)}</span>
                      </div>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{friend.name}</p>
                      <p className="text-xs text-gray-600">{friend.status}</p>
                      <p className="text-xs text-purple-600 font-medium">{friend.mealsSaved} meals saved</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                Invite Friends
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">Achievements</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`text-center p-4 transition-all hover:scale-105 ${
                  achievement.completed 
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' 
                    : 'bg-gray-100 border-gray-200'
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
            <p className="text-lg mb-4">Save 10 meals this week to earn the "Weekly Hero" badge!</p>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold">7</p>
                <p className="text-sm">Meals Saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm">To Go!</p>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-6">
              <div className="bg-white h-3 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-sm opacity-90">Challenge ends in 3 days</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GameSection;
