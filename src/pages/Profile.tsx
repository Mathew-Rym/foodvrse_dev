
import { User, Settings, Heart, HelpCircle, LogOut, MapPin, Bell, CreditCard, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MobileLayout from "@/components/MobileLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const menuItems = [
    { icon: Settings, label: "Account Settings", action: "settings" },
    { icon: MapPin, label: "Delivery Addresses", action: "addresses" },
    { icon: Bell, label: "Notifications", action: "notifications" },
    { icon: CreditCard, label: "Payment Methods", action: "payment" },
    { icon: Heart, label: "Favorite Restaurants", action: "favorites" },
    { icon: HelpCircle, label: "Help & Support", action: "help" },
  ];

  const handlePartnerClick = () => {
    navigate("/partner-application");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setIsEditingProfile(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        updateProfile({ photo: photoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 px-4 py-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer">
                <Camera className="w-3 h-3 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h1 className="text-xl font-bold">{user?.name}</h1>
              <p className="text-white/90">{user?.email}</p>
              <Badge className="bg-white/20 text-white mt-2">Food Saver Level 3</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">47</p>
              <p className="text-sm text-white/80">Meals Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">28kg</p>
              <p className="text-sm text-white/80">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">KSh 12K</p>
              <p className="text-sm text-white/80">Money Saved</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.action === 'settings') {
                      setIsEditingProfile(true);
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                    index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="flex-1 text-gray-900">{item.label}</span>
                  <span className="text-gray-400">›</span>
                </button>
              );
            })}
          </div>

          {/* Become Partner */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white mb-4">
            <h3 className="font-semibold mb-2">Become a Partner</h3>
            <p className="text-sm text-white/90 mb-3">
              Join our mission to reduce food waste. List your restaurant and start making an impact.
            </p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={handlePartnerClick}
            >
              Learn More
            </Button>
          </div>

          {/* Logout */}
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default Profile;
