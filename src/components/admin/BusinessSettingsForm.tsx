
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { Building, Mail, Smartphone, Clock, Globe, Database } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const BusinessSettingsForm = () => {
  const { settings, isLoading, updateSetting } = useSystemSettings();
  const [formData, setFormData] = useState({
    business_name: '',
    business_logo: '',
    business_contact: '',
    currency: 'USD',
    email_enabled: true,
    sms_enabled: false,
    class_duration_default: 60,
    class_capacity_limit: 50,
    language: 'en',
    timezone: 'UTC',
    backup_enabled: true
  });

  // Update form data when settings load
  useState(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || '',
        business_logo: settings.business_logo || '',
        business_contact: settings.business_contact || '',
        currency: settings.currency || 'USD',
        email_enabled: settings.email_enabled || true,
        sms_enabled: settings.sms_enabled || false,
        class_duration_default: settings.class_duration_default || 60,
        class_capacity_limit: settings.class_capacity_limit || 50,
        language: settings.language || 'en',
        timezone: settings.timezone || 'UTC',
        backup_enabled: settings.backup_enabled || true
      });
    }
  });

  const handleSave = (key: string, value: any) => {
    updateSetting({ key, value });
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="flex items-center justify-center h-96" />;
  }

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                onBlur={() => handleSave('business_name', formData.business_name)}
                placeholder="Enter business name"
              />
            </div>
            <div>
              <Label htmlFor="business_contact">Contact Email</Label>
              <Input
                id="business_contact"
                value={formData.business_contact}
                onChange={(e) => setFormData(prev => ({ ...prev, business_contact: e.target.value }))}
                onBlur={() => handleSave('business_contact', formData.business_contact)}
                placeholder="contact@business.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="business_logo">Logo URL</Label>
            <Input
              id="business_logo"
              value={formData.business_logo}
              onChange={(e) => setFormData(prev => ({ ...prev, business_logo: e.target.value }))}
              onBlur={() => handleSave('business_logo', formData.business_logo)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => handleSave('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Communication Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label>Email Notifications</Label>
            </div>
            <Switch
              checked={formData.email_enabled}
              onCheckedChange={(checked) => handleSave('email_enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <Label>SMS Notifications</Label>
            </div>
            <Switch
              checked={formData.sms_enabled}
              onCheckedChange={(checked) => handleSave('sms_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Class Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Class Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class_duration">Default Class Duration (minutes)</Label>
              <Input
                id="class_duration"
                type="number"
                value={formData.class_duration_default}
                onChange={(e) => setFormData(prev => ({ ...prev, class_duration_default: parseInt(e.target.value) }))}
                onBlur={() => handleSave('class_duration_default', formData.class_duration_default)}
              />
            </div>
            <div>
              <Label htmlFor="class_capacity">Default Class Capacity</Label>
              <Input
                id="class_capacity"
                type="number"
                value={formData.class_capacity_limit}
                onChange={(e) => setFormData(prev => ({ ...prev, class_capacity_limit: parseInt(e.target.value) }))}
                onBlur={() => handleSave('class_capacity_limit', formData.class_capacity_limit)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={(value) => handleSave('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleSave('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <Label>Automatic Backups</Label>
            </div>
            <Switch
              checked={formData.backup_enabled}
              onCheckedChange={(checked) => handleSave('backup_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettingsForm;
