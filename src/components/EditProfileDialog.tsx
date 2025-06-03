
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  profile: any;
  onProfileUpdate: () => void;
}

export const EditProfileDialog = ({ open, onOpenChange, user, profile, onProfileUpdate }: EditProfileDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    address: profile?.address || "",
    fitness_goals: profile?.fitness_goals || "",
    medical_notes: profile?.medical_notes || "",
    emergency_contact: profile?.emergency_contact || "",
  });

  // Update avatarUrl when profile changes
  useEffect(() => {
    if (profile?.avatar) {
      if (profile.avatar.startsWith('http')) {
        setAvatarUrl(profile.avatar);
      } else if (profile.avatar.includes('avatars/')) {
        const fileName = profile.avatar.split('avatars/')[1];
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        setAvatarUrl(data.publicUrl);
      } else {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(profile.avatar);
        setAvatarUrl(data.publicUrl);
      }
    }
  }, [profile?.avatar]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      setLoading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(data.publicUrl);
      toast.success("Avatar uploaded successfully!");
    } catch (error: any) {
      toast.error("Failed to upload avatar");
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // For avatar, store the full storage path for better handling
      let avatarToStore = avatarUrl;
      if (avatarUrl && avatarUrl.includes('/storage/v1/object/public/avatars/')) {
        // Extract just the filename from the full URL for storage
        const urlParts = avatarUrl.split('/avatars/');
        if (urlParts.length > 1) {
          avatarToStore = urlParts[1];
        }
      }

      // Prepare the profile data
      const profileData = {
        ...formData,
        avatar: avatarToStore,
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        updated_at: new Date().toISOString(),
      };

      // Update or insert profile
      const { error } = await supabase
        .from('profiles')
        .upsert([{ id: user.id, ...profileData }], { onConflict: 'id' });

      if (error) throw error;

      onProfileUpdate();
    } catch (error: any) {
      toast.error("Failed to update profile");
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    const firstName = formData.first_name || user?.user_metadata?.first_name || "";
    const lastName = formData.last_name || user?.user_metadata?.last_name || "";
    const email = user?.email || "";
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update your personal information and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-fitness-red text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8 bg-fitness-red hover:bg-red-700"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? "Uploading..." : "Change Avatar"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-gray-900 dark:text-white">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-gray-900 dark:text-white">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 dark:text-white">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth" className="text-gray-900 dark:text-white">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-900 dark:text-white">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-fitness-dark border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact" className="text-gray-900 dark:text-white">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact}
                onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-900 dark:text-white">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitness_goals" className="text-gray-900 dark:text-white">Fitness Goals</Label>
            <Textarea
              id="fitness_goals"
              value={formData.fitness_goals}
              onChange={(e) => handleInputChange('fitness_goals', e.target.value)}
              className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              rows={2}
              placeholder="e.g., Weight loss, Muscle gain, Improved endurance..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_notes" className="text-gray-900 dark:text-white">Medical Notes</Label>
            <Textarea
              id="medical_notes"
              value={formData.medical_notes}
              onChange={(e) => handleInputChange('medical_notes', e.target.value)}
              className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              rows={2}
              placeholder="Any medical conditions, allergies, or notes..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="bg-fitness-red hover:bg-red-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
