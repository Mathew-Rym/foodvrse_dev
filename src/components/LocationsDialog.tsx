import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: any;
  onSave: (data: any) => void;
}

const LocationsDialog = ({ open, onOpenChange, locations, onSave }: LocationsDialogProps) => {
  const { user, refreshUserData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const { user, refreshUserData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    home: locations.home || "",
    work: locations.work || ""
  });

  // Update form data when locations prop changes
  useEffect(() => {
    setFormData({
      home: locations.home || "",
      work: locations.work || ""
    });
  }, [locations]);

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save changes");
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          home_address: formData.home.trim(),
          work_address: formData.work.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating locations:', error);
        toast.error('Failed to update locations');
        return;
      }

      await refreshUserData();
      onSave(formData);
      toast.success('Locations updated successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating locations:', error);
      toast.error('Failed to update locations');
    } finally {
      setIsSaving(false);
    }
    if (!user) {
      toast.error("You must be logged in to save changes");
      return;
    }

    setIsSaving(true);
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({
          home_address: formData.home.trim(),
          work_address: formData.work.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating locations:', error);
        toast.error('Failed to update locations', {
          description: error.message || 'Please try again'
        });
        return;
      }

      // Refresh user data to get updated profile
      await refreshUserData();
      
      // Call the parent onSave callback with updated data
      onSave(formData);
      
      toast.success('Locations updated successfully!', {
        description: 'Your addresses have been saved'
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating locations:', error);
      toast.error('Failed to update locations', {
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
            <DialogTitle>My Locations</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 p-6 pt-0">
          <div>
            <Label htmlFor="home">Home Address</Label>
            <Input
              id="home"
              value={formData.home}
              onChange={(e) => setFormData({ ...formData, home: e.target.value })}
              placeholder="Enter your home address"
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="work">Work Address</Label>
            <Input
              id="work"
              value={formData.work}
              onChange={(e) => setFormData({ ...formData, work: e.target.value })}
              placeholder="Enter your work address"
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
              {isSaving ? "Saving..." : "Save Locations"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationsDialog;