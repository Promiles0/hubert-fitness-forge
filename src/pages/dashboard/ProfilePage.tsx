
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Mail, Phone, MapPin, User, Camera, Save, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fitness Street, Gym City, GC 12345",
    dateOfBirth: "1990-01-15",
    gender: "male",
    fitnessGoals: "Lose weight and build muscle strength",
    medicalNotes: "No known allergies or medical conditions",
    emergencyContact: "Jane Doe - +1 (555) 987-6543"
  });

  const membershipInfo = {
    plan: "Gold Membership",
    status: "Active",
    joinDate: "January 15, 2024",
    expiryDate: "January 15, 2025",
    trainer: "Michael Thompson"
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload to the backend
      console.log("Uploading image:", file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your personal information and preferences</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-fitness-red hover:bg-red-700"}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-fitness-red">
                  <AvatarImage src={user?.avatar} alt={`${profileData.firstName} ${profileData.lastName}`} />
                  <AvatarFallback className="bg-fitness-red text-white text-2xl">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-fitness-red rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-400">{profileData.email}</p>
                <Badge className="bg-green-600 text-white mt-2">
                  {membershipInfo.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Information */}
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-gray-400 text-sm">Current Plan</Label>
                <p className="text-white font-medium">{membershipInfo.plan}</p>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Join Date</Label>
                <p className="text-white">{membershipInfo.joinDate}</p>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Expiry Date</Label>
                <p className="text-white">{membershipInfo.expiryDate}</p>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Assigned Trainer</Label>
                <p className="text-white">{membershipInfo.trainer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-fitness-black rounded-lg">
                <p className="text-2xl font-bold text-fitness-red">24</p>
                <p className="text-xs text-gray-400">Classes Attended</p>
              </div>
              <div className="text-center p-3 bg-fitness-black rounded-lg">
                <p className="text-2xl font-bold text-fitness-red">12</p>
                <p className="text-xs text-gray-400">Weeks Active</p>
              </div>
              <div className="text-center p-3 bg-fitness-black rounded-lg">
                <p className="text-2xl font-bold text-fitness-red">8.5</p>
                <p className="text-xs text-gray-400">Avg Rating</p>
              </div>
              <div className="text-center p-3 bg-fitness-black rounded-lg">
                <p className="text-2xl font-bold text-fitness-red">85%</p>
                <p className="text-xs text-gray-400">Goal Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information Form */}
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
          <CardDescription className="text-gray-400">
            {isEditing ? "Edit your personal details below" : "Your personal information on file"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">First Name</Label>
              <Input
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Last Name</Label>
              <Input
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Phone</Label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Date of Birth</Label>
              <Input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Gender</Label>
              <Select 
                value={profileData.gender} 
                onValueChange={(value) => setProfileData({...profileData, gender: value})}
                disabled={!isEditing}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white disabled:opacity-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Address</Label>
            <Input
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Emergency Contact</Label>
            <Input
              value={profileData.emergencyContact}
              onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Fitness Goals</Label>
            <Textarea
              value={profileData.fitnessGoals}
              onChange={(e) => setProfileData({...profileData, fitnessGoals: e.target.value})}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Medical Notes</Label>
            <Textarea
              value={profileData.medicalNotes}
              onChange={(e) => setProfileData({...profileData, medicalNotes: e.target.value})}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white disabled:opacity-60"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
