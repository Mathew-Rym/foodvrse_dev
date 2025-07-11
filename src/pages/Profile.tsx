import { User, Settings, Heart, HelpCircle, LogOut, MapPin, Bell, CreditCard, Camera, Receipt, Trash2, Edit3 } from "lucide-react";
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

  // Mock data for favorites and payment methods
  const [favorites, setFavorites] = useState([
    { id: 1, name: "Mama's Kitchen", location: "Downtown", rating: 4.8 },
    { id: 2, name: "Green Cafe", location: "Westlands", rating: 4.5 },
    { id: 3, name: "Pizza Corner", location: "CBD", rating: 4.7 }
  ]);

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
    // Update profile in Supabase
    toast.success('Profile updated successfully!');
    setIsEditingProfile(false);
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

  const handleRemoveFavorite = (id: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
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
        setShowFavorites(true);
        break;
      case 'help':
        // Open WhatsApp support
        window.open('https://wa.me/1234567890?text=Hello, I need help with my FoodVrse account', '_blank');
        toast.success('Opening WhatsApp support...');
        break;
      default:
        console.log('Unknown action:', action);
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
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
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
              <h1 className="text-xl font-bold">{userProfile?.display_name || user?.email}</h1>
              <p className="text-white/90">{user?.email}</p>
              <Badge className="bg-white/20 text-white mt-2">{userImpact?.level ? `Food Saver Level ${userImpact.level}` : 'Food Saver Level 1'}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{userImpact?.total_meals_saved || 0}</p>
              <p className="text-sm text-white/80">Meals Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userImpact?.total_co2_saved_kg || 0}kg</p>
              <p className="text-sm text-white/80">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">KSh {userImpact?.total_money_saved_ksh || 0}</p>
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
                  onClick={() => handleMenuClick(item.action)}
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
                    <p className="font-medium">{favorite.name}</p>
                    <p className="text-sm text-gray-600">{favorite.location}</p>
                    <p className="text-sm text-yellow-600">⭐ {favorite.rating}</p>
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
