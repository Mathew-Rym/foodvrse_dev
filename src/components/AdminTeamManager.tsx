import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  initials: string;
  location: string;
  linkedin: string;
  twitter: string;
  email: string;
}

interface AdminTeamManagerProps {
  teamMembers: TeamMember[];
  onUpdateTeam: (members: TeamMember[]) => void;
  isAdmin?: boolean;
}

const AdminTeamManager = ({ teamMembers, onUpdateTeam, isAdmin = false }: AdminTeamManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({});

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({});
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.bio) {
      toast.error("Please fill in all required fields");
      return;
    }

    const initials = formData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    if (editingId) {
      // Update existing member
      const updatedMembers = teamMembers.map(member =>
        member.id === editingId
          ? { ...member, ...formData, initials }
          : member
      );
      onUpdateTeam(updatedMembers);
      setEditingId(null);
      toast.success("Team member updated successfully");
    } else {
      // Add new member
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        avatar: formData.avatar || "/placeholder.svg",
        initials,
        location: formData.location || "Nairobi, Kenya",
        linkedin: formData.linkedin || "#",
        twitter: formData.twitter || "#",
        email: formData.email || ""
      };
      onUpdateTeam([...teamMembers, newMember]);
      setIsAdding(false);
      toast.success("Team member added successfully");
    }
    setFormData({});
  };

  const handleDelete = (id: string) => {
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    onUpdateTeam(updatedMembers);
    toast.success("Team member removed successfully");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Team Members</h3>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Team Member" : "Add New Team Member"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@foodvrse.com"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin || ""}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.twitter || ""}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="Twitter URL"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief description of the team member"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update" : "Add"} Member
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-sm font-semibold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.location}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(member)}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(member.id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminTeamManager; 