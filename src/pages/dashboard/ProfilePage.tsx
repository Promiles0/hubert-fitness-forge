
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Phone, Calendar, MapPin, Target, AlertCircle, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditProfileDialog } from "@/components/EditProfileDialog";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        if (profileData) {
          setProfile(profileData);
          
          // Handle avatar URL
          if (profileData.avatar) {
            if (profileData.avatar.startsWith('http')) {
              setAvatarUrl(profileData.avatar);
            } else if (profileData.avatar.includes('avatars/')) {
              const fileName = profileData.avatar.split('avatars/')[1];
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
              setAvatarUrl(data.publicUrl);
            } else {
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(profileData.avatar);
              setAvatarUrl(data.publicUrl);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    fetchProfile();
    setEditDialogOpen(false);
    toast.success("Profile updated successfully!");
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.name) {
      return profile.name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-fitness-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information and preferences</p>
      </div>

      {/* Profile Header */}
      <Card className="bg-white dark:bg-fitness-darkGray border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-fitness-red text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-fitness-red rounded-full p-2 shadow-md">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getDisplayName()}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-fitness-red/10 text-fitness-red border border-fitness-red/20">
                  Active Member
                </Badge>
                {profile?.fitness_goals && (
                  <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
                    {profile.fitness_goals.split(',')[0]} {/* Show first goal only */}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button 
              onClick={() => setEditDialogOpen(true)}
              className="bg-fitness-red hover:bg-red-700 text-white shadow-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-fitness-darkGray border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your basic personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-fitness-red/10 dark:bg-fitness-red/20">
                <Mail className="h-5 w-5 text-fitness-red" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
              </div>
            </div>
            
            {profile?.phone && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-fitness-red/10 dark:bg-fitness-red/20">
                  <Phone className="h-5 w-5 text-fitness-red" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{profile.phone}</p>
                </div>
              </div>
            )}
            
            {profile?.date_of_birth && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-fitness-red/10 dark:bg-fitness-red/20">
                  <Calendar className="h-5 w-5 text-fitness-red" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatDate(profile.date_of_birth)}</p>
                </div>
              </div>
            )}
            
            {profile?.address && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-fitness-red/10 dark:bg-fitness-red/20">
                  <MapPin className="h-5 w-5 text-fitness-red" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-900 dark:text-white font-medium">{profile.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-fitness-darkGray border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Fitness Information</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your fitness goals and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.fitness_goals && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-fitness-red/10 dark:bg-fitness-red/20">
                  <Target className="h-5 w-5 text-fitness-red" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fitness Goals</p>
                  <p className="text-gray-900 dark:text-white font-medium">{profile.fitness_goals}</p>
                </div>
              </div>
            )}
            
            {profile?.medical_notes && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-fitness-red/10 dark:bg-fitness-red/20">
                  <AlertCircle className="h-5 w-5 text-fitness-red mt-0.5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medical Notes</p>
                  <p className="text-gray-900 dark:text-white font-medium">{profile.medical_notes}</p>
                </div>
              </div>
            )}
            
            {profile?.emergency_contact && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-fitness-red/10 dark:bg-fitness-red/20">
                  <Phone className="h-5 w-5 text-fitness-red" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Emergency Contact</p>
                  <p className="text-gray-900 dark:text-white font-medium">{profile.emergency_contact}</p>
                </div>
              </div>
            )}
            
            {!profile?.fitness_goals && !profile?.medical_notes && !profile?.emergency_contact && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 italic mb-4">No fitness information provided yet.</p>
                <Button 
                  onClick={() => setEditDialogOpen(true)}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Add Information
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={user}
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default ProfilePage;
