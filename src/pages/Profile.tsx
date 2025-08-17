import { User, Settings, Heart, HelpCircle, LogOut, MapPin, Bell, CreditCard, Camera, Receipt, Trash2, Edit3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PersonalInfoDialog from "@/components/PersonalInfoDialog";
import LocationsDialog from "@/components/LocationsDialog";
import MobileLayout from "@/components/MobileLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, userProfile, userImpact, refreshUserData } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile?.display_name || user?.email || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    country: '',
    birthday: '',
    gender: '',
    dietaryPreferences: ''
  });

  const [locations, setLocations] = useState({
    home: '',
    work: ''
  });

  const [newPaymentData, setNewPaymentData] = useState({
    type: 'M-Pesa',
    number: ''
  });


  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "M-Pesa", number: "254712345678", default: true },
    { id: 2, type: "Credit Card", number: "**** **** **** 1234", default: false }
  ]);

  const menuItems = [
    { icon: Receipt, label: "My Orders", action: "orders" },
    { icon: User, label: "Personal Info", action: "personalInfo" },
    { icon: MapPin, label: "My Locations", action: "locations" },
    { icon: Bell, label: "Notifications", action: "notifications" },
    { icon: CreditCard, label: "Payment Methods", action: "payment" },
    { icon: Heart, label: "Favorite Restaurants", action: "favorites" },
{ icon: Trophy, label: "Gamification & Achievements", action: "gamification" },
    { icon: HelpCircle, label: "Help & Support", action: "help" },
  ];

  const handlePartnerClick = () => {
    navigate("/partner-application");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: profileData.name,
          phone: profileData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return;
      }

      // Refresh user data to get updated profile
      await refreshUserData();
      
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real app, you'd upload to Supabase storage
        toast.success('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchUserFavorites = async () => {
    if (!user) return;
    
    setLoadingFavorites(true);
    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          id,
          business_id,
          created_at,
          business_profiles (
            id,
            business_name,
            location,
            address,
            rating,
            category
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to load favorites");
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error removing favorite:", error);
        toast.error("Failed to remove favorite");
        return;
      }

      setFavorites(prev => prev.filter(fav => fav.id !== id));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
    toast.success('Removed from favorites');
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentData.number) {
      toast.error('Please enter payment details');
      return;
    }

    const newMethod = {
      id: Date.now(),
      type: newPaymentData.type,
      number: newPaymentData.number,
      default: paymentMethods.length === 0
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    setNewPaymentData({ type: 'M-Pesa', number: '' });
    setShowAddPayment(false);
    toast.success('Payment method added!');
  };

  const handleEditPaymentMethod = (method: any) => {
    setEditingPayment({ ...method });
  };

  const handleSaveEditPayment = () => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === editingPayment.id ? editingPayment : method
      )
    );
    setEditingPayment(null);
    toast.success('Payment method updated!');
  };

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    toast.success('Payment method removed!');
  };

  const handleSetDefaultPayment = (id: number) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        default: method.id === id
      }))
    );
    toast.success('Default payment method updated!');
  };

  const handleMenuClick = (action: string) => {
    switch (action) {
      case 'orders':
        navigate('/orders');
        break;
      case 'personalInfo':
        setShowPersonalInfo(true);
        break;
      case 'locations':
        setShowLocations(true);
        break;
      case 'notifications':
        setShowNotifications(true);
        break;
      case 'payment':
        setShowPaymentMethods(true);
        break;
      case 'favorites':
      fetchUserFavorites();
        setShowFavorites(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-brand-green to-brand-yellow px-4 py-8 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-lg">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{userProfile?.display_name || user?.email}</h1>
              <p className="text-white/90 text-sm mb-2">{user?.email}</p>
              <Badge className="bg-white/30 text-white font-semibold text-sm px-3 py-1 border border-white/20">
                {userImpact?.level ? `Food Saver Level ${userImpact.level}` : 'Food Saver Level 1'}
              </Badge>
            </div>
          </div>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center bg-white/20 rounded-xl p-4 backdrop-blur-sm border-2 border-white/30 shadow-lg">
              <p className="text-4xl font-black text-white mb-2">{userImpact?.total_meals_saved || 0}</p>
              <p className="text-sm text-white font-bold uppercase tracking-wide">Meals Saved</p>
            </div>
            <div className="text-center bg-white/20 rounded-xl p-4 backdrop-blur-sm border-2 border-white/30 shadow-lg">
              <p className="text-4xl font-black text-white mb-2">{userImpact?.total_co2_saved_kg || 0}kg</p>
              <p className="text-sm text-white font-bold uppercase tracking-wide">CO₂ Saved</p>
            </div>
            <div className="text-center bg-white/20 rounded-xl p-4 backdrop-blur-sm border-2 border-white/30 shadow-lg">
              <p className="text-4xl font-black text-white mb-2">KSh {userImpact?.total_money_saved_ksh || 0}</p>
              <p className="text-sm text-white font-bold uppercase tracking-wide">Money Saved</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.action)}
                  className={`w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-all duration-200 ${
                    index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <span className="flex-1 text-gray-900 font-semibold text-base">{item.label}</span>
                  <span className="text-gray-400 text-lg font-bold">›</span>
                </button>
              );
            })}
          </div>

          {/* Become Partner */}
          <div className="bg-gradient-to-r from-brand-green to-brand-yellow rounded-xl p-6 text-white shadow-lg border border-brand-green/20">
            <h3 className="font-bold text-lg mb-3 text-white">Become a Partner</h3>
            <p className="text-white/90 mb-4 text-base leading-relaxed">
              Join our mission to reduce food waste. List your restaurant and start making an impact.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-brand-green hover:bg-gray-100 font-bold px-6 py-3 shadow-lg"
              onClick={handlePartnerClick}
            >
              Learn More
            </Button>
          </div>

          {/* Logout */}
          <Button 
            variant="outline" 
            size="lg"
            className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 font-semibold py-4 text-base shadow-sm"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
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

        {/* Notifications Dialog */}
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification Settings</DialogTitle>
              <DialogDescription>
                Manage your notification preferences
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Push Notifications</label>
                  <p className="text-sm text-gray-600">Get notified about order updates</p>
                </div>
                <Switch 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Email Notifications</label>
                  <p className="text-sm text-gray-600">Receive deals via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">SMS Notifications</label>
                  <p className="text-sm text-gray-600">Get SMS for urgent updates</p>
                </div>
                <Switch />
              </div>
              <Button onClick={() => setShowNotifications(false)} className="w-full">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Payment Methods Dialog */}
        <Dialog open={showPaymentMethods} onOpenChange={setShowPaymentMethods}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Methods</DialogTitle>
              <DialogDescription>
                Manage your payment options
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{method.type}</p>
                    <p className="text-sm text-gray-600">{method.number}</p>
                    {method.default && <Badge className="mt-1 bg-green-100 text-green-700">Default</Badge>}
                  </div>
                  <div className="flex gap-2">
                    {!method.default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefaultPayment(method.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPaymentMethod(method)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {paymentMethods.length === 0 && (
                <p className="text-center text-gray-500 py-4">No payment methods added yet</p>
              )}
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowAddPayment(true)}
                className="flex-1"
              >
                Add Payment Method
              </Button>
              <Button onClick={() => setShowPaymentMethods(false)} variant="outline">
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Payment Method Dialog */}
        <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment option
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Type</label>
                <select 
                  value={newPaymentData.type}
                  onChange={(e) => setNewPaymentData({ ...newPaymentData, type: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {newPaymentData.type === 'M-Pesa' ? 'Phone Number' : 'Card Number'}
                </label>
                <Input
                  value={newPaymentData.number}
                  onChange={(e) => setNewPaymentData({ ...newPaymentData, number: e.target.value })}
                  placeholder={newPaymentData.type === 'M-Pesa' ? '254700000000' : '**** **** **** 1234'}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPaymentMethod} className="flex-1">
                  Add Payment Method
                </Button>
                <Button variant="outline" onClick={() => setShowAddPayment(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Payment Method Dialog */}
        <Dialog open={!!editingPayment} onOpenChange={() => setEditingPayment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
              <DialogDescription>
                Update your payment information
              </DialogDescription>
            </DialogHeader>
            {editingPayment && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Type</label>
                  <select 
                    value={editingPayment.type}
                    onChange={(e) => setEditingPayment({ ...editingPayment, type: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {editingPayment.type === 'M-Pesa' ? 'Phone Number' : 'Card Number'}
                  </label>
                  <Input
                    value={editingPayment.number}
                    onChange={(e) => setEditingPayment({ ...editingPayment, number: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEditPayment} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPayment(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Favorites Dialog */}
        <Dialog open={showFavorites} onOpenChange={setShowFavorites}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Favorite Restaurants</DialogTitle>
              <DialogDescription>
                Your saved restaurants
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{favorite.business_profiles?.business_name || "Unknown Restaurant"}</p>
                    <p className="text-sm text-gray-600">{favorite.business_profiles?.location || "Location not available"}</p>
                    <p className="text-sm text-yellow-600 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {favorite.business_profiles?.rating || "N/A"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {favorites.length === 0 && (
                <p className="text-center text-gray-500 py-4">No favorite restaurants yet</p>
              )}
            </div>
            <Button onClick={() => setShowFavorites(false)} className="w-full">
              Done
            </Button>
          </DialogContent>
        </Dialog>

        {/* Personal Info Dialog */}
        <PersonalInfoDialog
          open={showPersonalInfo}
          onOpenChange={setShowPersonalInfo}
          profileData={profileData}
          onSave={(data) => {
            setProfileData(data);
            // Update profile in Supabase here
            toast.success('Personal information updated!');
          }}
        />

        {/* Locations Dialog */}
        <LocationsDialog
          open={showLocations}
          onOpenChange={setShowLocations}
          locations={locations}
          onSave={(data) => {
            setLocations(data);
            toast.success('Locations updated!');
          }}
        />
      </div>
    </MobileLayout>
  );
};

export default Profile;
