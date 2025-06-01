
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, User, CreditCard, Moon, Sun, Globe } from "lucide-react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    workoutReminders: true,
    classBookings: true,
    promotions: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showProgress: false,
    allowMessages: true
  });

  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-fitness-darkGray border-gray-800">
          <TabsTrigger value="general" className="text-white data-[state=active]:bg-fitness-red">
            <User className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-fitness-red">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-white data-[state=active]:bg-fitness-red">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-white data-[state=active]:bg-fitness-red">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-fitness-darkGray border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Appearance</CardTitle>
              <CardDescription className="text-gray-400">
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Theme</Label>
                  <p className="text-sm text-gray-400">Choose your preferred theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-700" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Language</Label>
                  <p className="text-sm text-gray-400">Select your preferred language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-fitness-darkGray border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Account Security</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Current Password</Label>
                <Input type="password" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">New Password</Label>
                <Input type="password" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Confirm New Password</Label>
                <Input type="password" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <Button className="bg-fitness-red hover:bg-red-700">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-fitness-darkGray border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium">Communication Methods</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">SMS Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications via text message</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h4 className="text-white font-medium">Notification Types</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Workout Reminders</Label>
                    <p className="text-sm text-gray-400">Get reminded about your scheduled workouts</p>
                  </div>
                  <Switch 
                    checked={notifications.workoutReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, workoutReminders: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Class Bookings</Label>
                    <p className="text-sm text-gray-400">Updates about your class bookings</p>
                  </div>
                  <Switch 
                    checked={notifications.classBookings}
                    onCheckedChange={(checked) => setNotifications({...notifications, classBookings: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Promotions & Offers</Label>
                    <p className="text-sm text-gray-400">Special offers and promotional content</p>
                  </div>
                  <Switch 
                    checked={notifications.promotions}
                    onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-fitness-darkGray border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Privacy Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Profile Visibility</Label>
                  <p className="text-sm text-gray-400">Make your profile visible to other members</p>
                </div>
                <Switch 
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Show Progress</Label>
                  <p className="text-sm text-gray-400">Allow others to see your fitness progress</p>
                </div>
                <Switch 
                  checked={privacy.showProgress}
                  onCheckedChange={(checked) => setPrivacy({...privacy, showProgress: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Allow Messages</Label>
                  <p className="text-sm text-gray-400">Allow other members to send you messages</p>
                </div>
                <Switch 
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-fitness-darkGray border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Billing Information</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your billing details and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-fitness-black p-4 rounded-lg border border-gray-700">
                <p className="text-white font-medium mb-2">Current Plan: Gold Membership</p>
                <p className="text-gray-400 text-sm">Next billing: March 15, 2024</p>
                <p className="text-gray-400 text-sm">Amount: $49.99/month</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  Update Payment Method
                </Button>
                <Button className="bg-fitness-red hover:bg-red-700">
                  View Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
