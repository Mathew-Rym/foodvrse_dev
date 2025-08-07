import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Plus,
  Edit,
  Eye,
  BarChart3,
  Trash2,
  LogOut,
  Leaf,
  Star,
  History,
  CreditCard,
  AlertTriangle,
  Heart,
  Bot,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import AddItemModal from "@/components/AddItemModal";
import Analytics from "@/components/Analytics";
import BusinessOnboardingTour from "@/components/BusinessOnboardingTour";
import GoogleMapsLocationPicker from "@/components/GoogleMapsLocationPicker";
import GoogleAddressSelector from "@/components/GoogleAddressSelector";
import { toast } from "sonner";

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCarbonCredit, setShowCarbonCredit] = useState(false);
  const [showPreviousListings, setShowPreviousListings] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [businessStats, setBusinessStats] = useState({
    totalSales: 0,
    itemsSold: 0,
    co2Saved: 0,
    avgRating: 0,
    monthlyGrowth: 0,
    co2Missed: 0
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;
      
      try {
        // Get business profile
        const { data: profile, error: profileError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;
        setBusinessProfile(profile);

        // Get business listings
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*')
          .eq('business_id', profile.id)
          .order('created_at', { ascending: false });

        if (listingsError) throw listingsError;
        setListings(listingsData || []);

        // Set stats from profile
        setBusinessStats({
          totalSales: profile.total_revenue || 0,
          itemsSold: profile.total_sales || 0,
          co2Saved: profile.total_co2_saved_kg || 0,
          avgRating: profile.average_rating || 0,
          monthlyGrowth: ((profile.last_month_revenue || 0) / Math.max(profile.total_revenue || 1, 1)) * 100,
          co2Missed: profile.co2_missed_kg || 0
        });

        // Check if user should see onboarding
        const hasSeenOnboarding = localStorage.getItem('business_onboarding_seen');
        if (!hasSeenOnboarding && listingsData?.length === 0) {
          setShowOnboarding(true);
        }

      } catch (error) {
        console.error('Error fetching business data:', error);
        toast.error('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();

    // Set up real-time subscriptions
    const listingsChannel = supabase
      .channel('business-listings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'listings',
        filter: businessProfile ? `business_id=eq.${businessProfile.id}` : undefined
      }, () => {
        fetchBusinessData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(listingsChannel);
    };
  }, [user, businessProfile?.id]);

  const handleAddItem = async (newItem: any) => {
    if (!businessProfile) return;
    
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([{
          business_id: businessProfile.id,
          item_name: newItem.name,
          description: newItem.description,
          original_price: newItem.originalPrice,
          price: newItem.discountPrice,
          quantity: newItem.quantity,
          initial_quantity: newItem.quantity,
          category: newItem.category,
          tags: newItem.tags || [],
          pickup_start: newItem.pickupStart,
          pickup_end: newItem.pickupEnd,
          co2_saved_per_item_kg: 0.8,
          thumbnail_url: newItem.thumbnailUrl,
          business_thumbnail_url: newItem.businessThumbnailUrl
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Item added and now visible to customers!');
      setListings(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (updates: any) => {
    if (!editingItem) return;
    
    try {
      const { error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', editingItem.id);

      if (error) throw error;
      
      setEditingItem(null);
      toast.success('Item updated successfully!');
      
      // Update local state
      setListings(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Item deleted successfully!');
      setListings(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };



  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Signed out successfully');
  };

  const calculateCO2Missed = (listing: any) => {
    if (listing.status === 'sold-out' && listing.updated_at) {
      const hoursSinceUpdate = (Date.now() - new Date(listing.updated_at).getTime()) / (1000 * 60 * 60);
      if (hoursSinceUpdate >= 1) {
        return listing.initial_quantity * 0.8; // CO2 that could have been saved
      }
    }
    return 0;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageType: 'logo' | 'thumbnail') => {
    const file = event.target.files?.[0];
    if (!file || !businessProfile) return;

    try {
      // Upload to Supabase Storage
      const fileName = `${businessProfile.id}/${imageType}_${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-images')
        .getPublicUrl(fileName);
      
      const updateField = imageType === 'logo' ? 'business_logo_url' : 'business_thumbnail_url';
      
      const { error } = await supabase
        .from('business_profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', businessProfile.id);

      if (error) throw error;

      setBusinessProfile(prev => ({ ...prev, [updateField]: publicUrl }));
      toast.success(`Business ${imageType} uploaded successfully!`);
      
      // Update all existing listings with the new business thumbnail
      if (imageType === 'thumbnail') {
        await supabase
          .from('listings')
          .update({ business_thumbnail_url: publicUrl })
          .eq('business_id', businessProfile.id);
          
        // Update local listings state
        setListings(prev => prev.map(listing => ({
          ...listing,
          business_thumbnail_url: publicUrl
        })));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload ${imageType}`);
    }
  };

  const handleRemoveImage = async (imageType: 'logo' | 'thumbnail') => {
    if (!businessProfile) return;

    try {
      const updateField = imageType === 'logo' ? 'business_logo_url' : 'business_thumbnail_url';
      const currentUrl = businessProfile[updateField];
      
      // Remove from storage if exists
      if (currentUrl) {
        const fileName = currentUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('business-images')
            .remove([`${businessProfile.id}/${fileName}`]);
        }
      }
      
      const { error } = await supabase
        .from('business_profiles')
        .update({ [updateField]: null })
        .eq('id', businessProfile.id);

      if (error) throw error;

      setBusinessProfile(prev => ({ ...prev, [updateField]: null }));
      toast.success(`Business ${imageType} removed successfully!`);
      
      // Update all existing listings to remove the business thumbnail
      if (imageType === 'thumbnail') {
        await supabase
          .from('listings')
          .update({ business_thumbnail_url: null })
          .eq('business_id', businessProfile.id);
          
        // Update local listings state
        setListings(prev => prev.map(listing => ({
          ...listing,
          business_thumbnail_url: null
        })));
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(`Failed to remove ${imageType}`);
    }
  };

  const handleLocationUpdate = (location: { lat: number; lng: number; address: string }) => {
    setBusinessProfile(prev => prev ? {
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
      location: location.address
    } : null);
    
    // Update existing listings with new location
    if (businessProfile) {
      supabase
        .from('listings')
        .update({
          latitude: location.lat,
          longitude: location.lng
        })
        .eq('business_id', businessProfile.id)
        .then(() => {
          // Update local listings state
          setListings(prev => prev.map(listing => ({
            ...listing,
            latitude: location.lat,
            longitude: location.lng
          })));
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p>Loading your business dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
              <div id="business-header" className="bg-brand-green text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Business Dashboard</h1>
              <p className="text-white/90 text-sm">{businessProfile?.business_name || "Your Business"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 text-white">Active Partner</Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

        {/* Stats Overview */}
        <div className="p-4">
          <div id="stats-overview" className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full shadow-sm border border-green-300">
                  <DollarSign className="w-3 h-3 text-green-700" />
                </div>
                <span className="text-sm text-muted-foreground">Total Sales</span>
              </div>
              <p className="text-xl font-bold text-foreground">KSh {businessStats.totalSales.toLocaleString()}</p>
              <p className={`text-xs ${businessStats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {businessStats.monthlyGrowth >= 0 ? '+' : ''}{businessStats.monthlyGrowth.toFixed(1)}% this month
              </p>
            </div>

            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Items Sold</span>
              </div>
              <p className="text-xl font-bold text-foreground">{businessStats.itemsSold}</p>
              <p className="text-xs text-blue-600">This month</p>
            </div>

            <div id="co2-stats" className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">CO₂ Saved</span>
              </div>
              <p className="text-xl font-bold text-blue-700">{businessStats.co2Saved.toFixed(1)}kg</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-blue-600">Environmental impact</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  onClick={() => setShowCarbonCredit(true)}
                >
                  Carbon Market
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Rating</span>
              </div>
              <p className="text-xl font-bold text-foreground">{businessStats.avgRating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Based on reviews</p>
            </div>
          </div>

          {/* CO2 Missed Alert */}
          {businessStats.co2Missed > 0 && (
            <div className="bg-brand-light-green border border-brand-green rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-brand-green" />
                <span className="font-medium text-brand-green">CO₂ Impact Missed</span>
              </div>
              <p className="text-sm text-brand-green/80 mb-3">
                {businessStats.co2Missed.toFixed(1)}kg of CO₂ could have been saved from unsold items. 
                Recommend FoodVrse to more customers to maximize your environmental impact!
              </p>
              <Button 
                size="sm" 
                className="bg-brand-green hover:bg-brand-green/90 text-white"
                onClick={() => toast.info('Referral program coming soon!')}
              >
                Share with Friends
              </Button>
            </div>
          )}

          {/* Business Profile Images */}
          <div className="bg-card rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-3 text-foreground">Business Images</h3>
            <p className="text-sm text-muted-foreground mb-4">Add your business logo and thumbnail that will appear on all your listings</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Business Logo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Business Logo</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-muted">
                  {businessProfile?.business_logo_url ? (
                    <div className="space-y-2">
                      <img 
                        src={businessProfile.business_logo_url} 
                        alt="Business Logo" 
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveImage('logo')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        Upload Logo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Thumbnail */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Business Thumbnail</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                  {businessProfile?.business_thumbnail_url ? (
                    <div className="space-y-2">
                      <img 
                        src={businessProfile.business_thumbnail_url} 
                        alt="Business Thumbnail" 
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveImage('thumbnail')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Thumbnail
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('thumbnail-upload')?.click()}
                      >
                        Upload Thumbnail
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Business Location */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Business Location</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                >
                  {businessProfile?.latitude ? 'Update Location' : 'Set Location'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddressSelector(true)}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  Advanced Address
                </Button>
              </div>
            </div>
            
            {businessProfile?.latitude ? (
              <div className="text-sm text-gray-600">
                <p><strong>Address:</strong> {businessProfile.address || 'Address not set'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Coordinates: {businessProfile.latitude.toFixed(6)}, {businessProfile.longitude?.toFixed(6)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No location set. Customers won't be able to find your store easily.
              </p>
            )}
            
            {showLocationPicker && (
              <div className="mt-4">
                <GoogleMapsLocationPicker
                  businessId={businessProfile?.id || ''}
                  currentLocation={
                    businessProfile?.latitude ? {
                      lat: businessProfile.latitude,
                      lng: businessProfile.longitude || 0,
                      address: businessProfile.address || ''
                    } : undefined
                  }
                  onLocationUpdate={handleLocationUpdate}
                />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                id="add-item-button"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowAnalytics(true)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowPreviousListings(true)}
              >
                <History className="w-4 h-4 mr-2" />
                Previous Listings
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowOnboarding(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Tour Guide
              </Button>
            </div>
          </div>

          {/* Active Listings */}
          <div id="active-listings" className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Active Listings ({listings.length})</h3>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">No active listings yet</p>
                <p className="text-sm mb-4">Add your first item to start selling!</p>
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                      <div className="flex items-center gap-2">
                        {item.favorited_by_user_ids?.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-pink-600">
                            <Heart className="w-3 h-3 fill-current" />
                            <span>{item.favorited_by_user_ids.length}</span>
                          </div>
                        )}
                        <Badge 
                          variant={item.status === 'active' ? 'default' : 'destructive'}
                          className={
                            item.status === 'active' ? 'bg-green-100 text-green-700' : 
                            item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }
                        >
                          {item.status === 'active' ? 'Active' : 
                           item.status === 'low-stock' ? 'Low Stock' : 'Sold Out'}
                        </Badge>
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-4">
                        <span>
                          <span className="line-through">KSh {item.original_price}</span>
                          <span className="ml-2 font-medium text-brand-green">KSh {item.price}</span>
                        </span>
                        <span>Qty: {item.quantity}/{item.initial_quantity}</span>
                        <span className="text-green-600">
                          CO₂: {(item.quantity * (item.co2_saved_per_item_kg || 0.8)).toFixed(1)}kg
                        </span>
                      </div>
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full">
                          <Clock className="w-2.5 h-2.5 text-gray-600" />
                        </div>
                        <span>
                          {new Date(item.pickup_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {new Date(item.pickup_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Support */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-white/90 mb-3">
            Contact our partner support team for assistance with your listings or account.
          </p>

        </div>
      </div>

        {/* Onboarding Tour */}
        {showOnboarding && (
          <BusinessOnboardingTour
            onComplete={() => {
              setShowOnboarding(false);
              localStorage.setItem('business_onboarding_seen', 'true');
            }}
            onSkip={() => {
              setShowOnboarding(false);
              localStorage.setItem('business_onboarding_seen', 'true');
            }}
          />
        )}

        {/* Add Item Modal */}
        <AddItemModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddItem={handleAddItem}
        />

        {/* Analytics Modal */}
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Business Analytics</DialogTitle>
            </DialogHeader>
            <Analytics />
          </DialogContent>
        </Dialog>

        {/* Carbon Credit Modal */}
        <Dialog open={showCarbonCredit} onOpenChange={setShowCarbonCredit}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Carbon Credits Marketplace - Coming Soon!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Turn Your Environmental Impact Into Income</h3>
                <p className="text-green-700 text-sm mb-4">
                  Every kilogram of CO₂ you save by preventing food waste can be converted into carbon credits. 
                  These credits are sold to companies looking to offset their carbon footprint, putting money directly in your pocket.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{businessStats.co2Saved.toFixed(1)}kg</p>
                      <p className="text-sm text-blue-700">CO₂ Saved So Far</p>
                    </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">KSh {(businessStats.co2Saved * 1200).toFixed(0)}</p>
                    <p className="text-sm text-green-700">Potential Earnings*</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">*Based on current carbon credit market rates (~$15/tonne CO₂)</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Continue rescuing food and tracking your CO₂ impact</li>
                  <li>We verify and certify your environmental contributions</li>
                  <li>Your CO₂ savings are converted to tradeable credits</li>
                  <li>Credits are sold to corporations for their sustainability goals</li>
                  <li>You receive payment directly to your account</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Join the Waitlist</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Be the first to know when our carbon credits marketplace launches. Early adopters get premium rates!
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  onClick={() => toast.success('Added to carbon credits waitlist!')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Join Waitlist
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Previous Listings Modal */}
        <Dialog open={showPreviousListings} onOpenChange={setShowPreviousListings}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Previous Listings & Performance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">Listing History Coming Soon</p>
                <p className="text-sm">Track your best performing items and get AI-powered suggestions for optimal pricing and timing.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Item Modal */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full mt-1 p-2 border rounded"
                    defaultValue={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Price (KSh)</label>
                  <input 
                    type="number" 
                    className="w-full mt-1 p-2 border rounded"
                    defaultValue={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded"
                    defaultValue={editingItem.status}
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingItem(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleUpdateItem(editingItem)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Google Address Selector */}
        <GoogleAddressSelector
          isOpen={showAddressSelector}
          onClose={() => setShowAddressSelector(false)}
          onAddressSelect={(address, lat, lng) => {
            handleLocationUpdate({ lat, lng, address });
            setShowAddressSelector(false);
            toast.success('Address selected successfully!');
          }}
          title="Select Business Address"
          description="Use Google's address selection tool to precisely set your business location"
        />
    </div>
  );
};

export default BusinessDashboard;
