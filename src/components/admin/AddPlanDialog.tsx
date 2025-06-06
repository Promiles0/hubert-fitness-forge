
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPlanDialog = ({ open, onOpenChange }: AddPlanDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_days: "",
    plan_type: "",
    features: {
      gym_access: false,
      personal_training: false,
      group_classes: false,
      nutrition_plan: false,
      equipment_access: false,
      shower_facilities: false,
      parking: false,
      guest_passes: "",
      class_bookings: ""
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleFeatureChange = (feature: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare features object
      const features = {
        ...formData.features,
        guest_passes: formData.features.guest_passes ? parseInt(formData.features.guest_passes) : 0,
        class_bookings: formData.features.class_bookings ? parseInt(formData.features.class_bookings) : 0
      };

      const { error } = await supabase
        .from('membership_plans')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration_days: parseInt(formData.duration_days),
          plan_type: formData.plan_type as any,
          features: features
        });

      if (error) throw error;

      toast.success('Membership plan added successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        duration_days: "",
        plan_type: "",
        features: {
          gym_access: false,
          personal_training: false,
          group_classes: false,
          nutrition_plan: false,
          equipment_access: false,
          shower_facilities: false,
          parking: false,
          guest_passes: "",
          class_bookings: ""
        }
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Membership Plan</DialogTitle>
          <DialogDescription>
            Create a new membership plan with features and pricing.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan_type">Plan Type *</Label>
              <Select value={formData.plan_type} onValueChange={(value) => setFormData({ ...formData, plan_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Plan Features</Label>
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gym_access"
                    checked={formData.features.gym_access}
                    onCheckedChange={(checked) => handleFeatureChange('gym_access', !!checked)}
                  />
                  <Label htmlFor="gym_access" className="text-sm">Gym Access</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personal_training"
                    checked={formData.features.personal_training}
                    onCheckedChange={(checked) => handleFeatureChange('personal_training', !!checked)}
                  />
                  <Label htmlFor="personal_training" className="text-sm">Personal Training</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="group_classes"
                    checked={formData.features.group_classes}
                    onCheckedChange={(checked) => handleFeatureChange('group_classes', !!checked)}
                  />
                  <Label htmlFor="group_classes" className="text-sm">Group Classes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nutrition_plan"
                    checked={formData.features.nutrition_plan}
                    onCheckedChange={(checked) => handleFeatureChange('nutrition_plan', !!checked)}
                  />
                  <Label htmlFor="nutrition_plan" className="text-sm">Nutrition Plan</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="equipment_access"
                    checked={formData.features.equipment_access}
                    onCheckedChange={(checked) => handleFeatureChange('equipment_access', !!checked)}
                  />
                  <Label htmlFor="equipment_access" className="text-sm">Equipment Access</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shower_facilities"
                    checked={formData.features.shower_facilities}
                    onCheckedChange={(checked) => handleFeatureChange('shower_facilities', !!checked)}
                  />
                  <Label htmlFor="shower_facilities" className="text-sm">Shower Facilities</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={formData.features.parking}
                    onCheckedChange={(checked) => handleFeatureChange('parking', !!checked)}
                  />
                  <Label htmlFor="parking" className="text-sm">Parking</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="guest_passes" className="text-sm">Guest Passes</Label>
                  <Input
                    id="guest_passes"
                    type="number"
                    value={formData.features.guest_passes}
                    onChange={(e) => handleFeatureChange('guest_passes', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="class_bookings" className="text-sm">Class Bookings</Label>
                  <Input
                    id="class_bookings"
                    type="number"
                    value={formData.features.class_bookings}
                    onChange={(e) => handleFeatureChange('class_bookings', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanDialog;
