import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: any;
  onSave: (data: any) => void;
}

const LocationsDialog = ({ open, onOpenChange, locations, onSave }: LocationsDialogProps) => {
  const [formData, setFormData] = useState({
    home: locations.home || "",
    work: locations.work || ""
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>My Locations</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="home">Home Address</Label>
            <Input
              id="home"
              value={formData.home}
              onChange={(e) => setFormData({ ...formData, home: e.target.value })}
              placeholder="Enter your home address"
            />
          </div>

          <div>
            <Label htmlFor="work">Work Address</Label>
            <Input
              id="work"
              value={formData.work}
              onChange={(e) => setFormData({ ...formData, work: e.target.value })}
              placeholder="Enter your work address"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Locations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationsDialog;