import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  posted: string;
}

interface AdminJobManagerProps {
  jobPositions: JobPosition[];
  onUpdateJobs: (jobs: JobPosition[]) => void;
  isAdmin?: boolean;
}

const AdminJobManager = ({ jobPositions, onUpdateJobs, isAdmin = false }: AdminJobManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<JobPosition>>({});
  const [newRequirement, setNewRequirement] = useState("");

  const departments = [
    "Engineering", "Design", "Marketing", "Sales", "Operations", 
    "Partnerships", "Customer Success", "Finance", "HR", "Legal"
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ requirements: [] });
  };

  const handleEdit = (job: JobPosition) => {
    setEditingId(job.id);
    setFormData(job);
  };

  const handleSave = () => {
    if (!formData.title || !formData.department || !formData.description || !formData.requirements?.length) {
      toast.error("Please fill in all required fields");
      return;
    }

    const getPostedDate = () => {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - new Date().getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 14) return "1 week ago";
      if (diffDays < 21) return "2 weeks ago";
      return "1 month ago";
    };

    if (editingId) {
      // Update existing job
      const updatedJobs = jobPositions.map(job =>
        job.id === editingId
          ? { ...job, ...formData }
          : job
      );
      onUpdateJobs(updatedJobs);
      setEditingId(null);
      toast.success("Job position updated successfully");
    } else {
      // Add new job
      const newJob: JobPosition = {
        id: Date.now().toString(),
        title: formData.title,
        department: formData.department,
        location: formData.location || "Nairobi",
        type: formData.type || "Full-time",
        description: formData.description,
        requirements: formData.requirements || [],
        posted: getPostedDate()
      };
      onUpdateJobs([...jobPositions, newJob]);
      setIsAdding(false);
      toast.success("Job position added successfully");
    }
    setFormData({});
  };

  const handleDelete = (id: string) => {
    const updatedJobs = jobPositions.filter(job => job.id !== id);
    onUpdateJobs(updatedJobs);
    toast.success("Job position removed successfully");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
    setNewRequirement("");
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const requirements = formData.requirements || [];
      setFormData({ ...formData, requirements: [...requirements, newRequirement.trim()] });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    const requirements = formData.requirements || [];
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: updatedRequirements });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Job Positions</h3>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Position
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Job Position" : "Add New Job Position"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Nairobi / Remote"
                />
              </div>
              <div>
                <Label htmlFor="type">Job Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and responsibilities"
                rows={4}
              />
            </div>
            <div>
              <Label>Requirements *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add a requirement"
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button type="button" onClick={addRequirement} size="sm">
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.requirements || []).map((req, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="text-sm flex-1">• {req}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update" : "Add"} Position
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Positions List */}
      <div className="space-y-4">
        {jobPositions.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">{job.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{job.department}</Badge>
                  <Badge variant="outline">{job.location}</Badge>
                  <Badge variant="outline">{job.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(job)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(job.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {jobPositions.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="font-semibold mb-2">No Job Positions</h4>
              <p className="text-sm text-muted-foreground">
                Add your first job position to start receiving applications.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminJobManager; 