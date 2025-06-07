
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, Clock, Globe, Database, Save } from "lucide-react";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
}

const SystemSettingsManager = () => {
  const queryClient = useQueryClient();
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, any>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert array to object for easier access
      const settingsMap: Record<string, any> = {};
      data?.forEach(setting => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      
      return settingsMap;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      setUnsavedChanges({});
      toast({
        title: "Settings Updated",
        description: "System settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error('Settings update error:', error);
    },
  });

  const handleInputChange = (settingKey: string, field: string, value: any) => {
    const currentSetting = settings?.[settingKey] || {};
    const updatedSetting = { ...currentSetting, [field]: value };
    
    setUnsavedChanges(prev => ({
      ...prev,
      [settingKey]: updatedSetting
    }));
  };

  const saveSettings = async () => {
    for (const [key, value] of Object.entries(unsavedChanges)) {
      await updateSettingMutation.mutateAsync({ key, value });
    }
  };

  const getSettingValue = (settingKey: string, field: string) => {
    return unsavedChanges[settingKey]?.[field] ?? settings?.[settingKey]?.[field] ?? '';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Save Button */}
      {Object.keys(unsavedChanges).length > 0 && (
        <div className="sticky top-0 z-10 bg-fitness-darkGray border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-yellow-400">You have unsaved changes</p>
            <Button 
              onClick={saveSettings}
              disabled={updateSettingMutation.isPending}
              className="bg-fitness-red hover:bg-red-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSettingMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}

      {/* Business Information */}
      <Card className="bg-fitness-darkGray border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-fitness-red" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={getSettingValue('business_info', 'name')}
                onChange={(e) => handleInputChange('business_info', 'name', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={getSettingValue('business_info', 'currency')}
                onValueChange={(value) => handleInputChange('business_info', 'currency', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              value={getSettingValue('business_info', 'logo')}
              onChange={(e) => handleInputChange('business_info', 'logo', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="contact-info">Contact Information</Label>
            <Textarea
              id="contact-info"
              value={getSettingValue('business_info', 'contact')}
              onChange={(e) => handleInputChange('business_info', 'contact', e.target.value)}
              placeholder="Phone, email, address..."
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card className="bg-fitness-darkGray border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-fitness-red" />
            Email & SMS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={getSettingValue('email_config', 'smtp_host')}
                onChange={(e) => handleInputChange('email_config', 'smtp_host', e.target.value)}
                placeholder="smtp.gmail.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                type="number"
                value={getSettingValue('email_config', 'smtp_port')}
                onChange={(e) => handleInputChange('email_config', 'smtp_port', parseInt(e.target.value))}
                placeholder="587"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-user">SMTP Username</Label>
              <Input
                id="smtp-user"
                value={getSettingValue('email_config', 'smtp_user')}
                onChange={(e) => handleInputChange('email_config', 'smtp_user', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="smtp-pass">SMTP Password</Label>
              <Input
                id="smtp-pass"
                type="password"
                value={getSettingValue('email_config', 'smtp_pass')}
                onChange={(e) => handleInputChange('email_config', 'smtp_pass', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <Separator className="bg-gray-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sms-provider">SMS Provider</Label>
              <Select
                value={getSettingValue('sms_config', 'provider')}
                onValueChange={(value) => handleInputChange('sms_config', 'provider', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  <SelectItem value="nexmo">Nexmo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sms-api-key">SMS API Key</Label>
              <Input
                id="sms-api-key"
                type="password"
                value={getSettingValue('sms_config', 'api_key')}
                onChange={(e) => handleInputChange('sms_config', 'api_key', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Duration & Limits */}
      <Card className="bg-fitness-darkGray border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-fitness-red" />
            Class Duration & Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="default-duration">Default Duration (minutes)</Label>
              <Input
                id="default-duration"
                type="number"
                value={getSettingValue('class_settings', 'default_duration')}
                onChange={(e) => handleInputChange('class_settings', 'default_duration', parseInt(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="max-capacity">Max Capacity</Label>
              <Input
                id="max-capacity"
                type="number"
                value={getSettingValue('class_settings', 'max_capacity')}
                onChange={(e) => handleInputChange('class_settings', 'max_capacity', parseInt(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="booking-limit">Booking Limit (hours)</Label>
              <Input
                id="booking-limit"
                type="number"
                value={getSettingValue('class_settings', 'booking_limit')}
                onChange={(e) => handleInputChange('class_settings', 'booking_limit', parseInt(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Time Zone */}
      <Card className="bg-fitness-darkGray border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-fitness-red" />
            Language & Time Zone Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={getSettingValue('system_settings', 'language')}
                onValueChange={(value) => handleInputChange('system_settings', 'language', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Time Zone</Label>
              <Select
                value={getSettingValue('system_settings', 'timezone')}
                onValueChange={(value) => handleInputChange('system_settings', 'timezone', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={getSettingValue('system_settings', 'theme')}
                onValueChange={(value) => handleInputChange('system_settings', 'theme', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Backup & Restore */}
      <Card className="bg-fitness-darkGray border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-fitness-red" />
            System Backup & Restore Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Restore Backup
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Backup options will export your data for safekeeping. Restore allows you to recover from a previous backup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettingsManager;
