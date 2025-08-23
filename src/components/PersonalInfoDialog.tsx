import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedDatePicker } from "@/components/ui/enhanced-date-picker";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PersonalInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: any;
  onSave: (data: any) => void;
}

const countries = [
  "Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "South Sudan",
  "Ethiopia", "Somalia", "Djibouti", "Eritrea", "United States", "United Kingdom",
  "Canada", "Australia", "Germany", "France", "Netherlands", "South Africa"
];

const PersonalInfoDialog = ({ open, onOpenChange, profileData, onSave }: PersonalInfoDialogProps) => {
  const { user, refreshUserData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profileData.name || "",
    email: profileData.email || "",
    phone: profileData.phone || "",
    country: profileData.country || "",
    birthday: profileData.birthday ? new Date(profileData.birthday) : undefined,
    gender: profileData.gender || "",
    dietaryPreferences: profileData.dietaryPreferences || ""
  });

  // Update form data when profileData changes
  useEffect(() => {
    setFormData({
      name: profileData.name || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
      country: profileData.country || "",
      birthday: profileData.birthday ? new Date(profileData.birthday) : undefined,
      gender: profileData.gender || "",
      dietaryPreferences: profileData.dietaryPreferences || ""
    });
  }, [profileData]);

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save changes");
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare the data for Supabase
      const updateData: any = {
        display_name: formData.name.trim(),
        phone: formData.phone.trim(),
        country: formData.country,
        gender: formData.gender,
        dietary_preferences: formData.dietaryPreferences.trim(),
        updated_at: new Date().toISOString()
      };

      // Add birthday if selected
      if (formData.birthday) {
        updateData.birthday = formData.birthday.toISOString();
      }

      // Validate required fields
      if (!updateData.display_name) {
        toast.error('Name is required');
        setIsSaving(false);
        return;
      }

      // Update in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile', {
          description: error.message || 'Please try again'
        });
        return;
      }

      // Refresh user data to get updated profile
      await refreshUserData();
      
      // Call the parent onSave callback with updated data
      onSave({
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        dietaryPreferences: formData.dietaryPreferences.trim()
      });
      
      toast.success('Profile updated successfully!', {
        description: 'Your information has been saved'
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: error.message || 'Please check your connection and try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] w-[95vw] sm:w-[425px] bg-white rounded-lg shadow-xl border overflow-hidden flex flex-col">
        <div className="flex-shrink-0 bg-white border-b border-gray-100 rounded-t-lg p-6 pb-4">
          <DialogHeader>
            <DialogTitle>Personal Information</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 p-6 pt-0">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSaving}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSaving}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label>Country</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })} disabled={isSaving}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Birthday</Label>
            <EnhancedDatePicker
              selectedDate={formData.birthday}
              onDateChange={(date) => setFormData({ ...formData, birthday: date })}
              placeholder="Select your birthday"
              showQuickSelect={false}
            />
          </div>

          <div>
            <Label>Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })} disabled={isSaving}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dietary">Dietary Preferences</Label>
            <Input
              id="dietary"
              value={formData.dietaryPreferences}
              onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
              placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies"
              disabled={isSaving}
            />
          </div>

        </div>
        
        <div className="flex-shrink-0 bg-white border-t border-gray-100 p-6 pt-4 rounded-b-lg">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalInfoDialog;
