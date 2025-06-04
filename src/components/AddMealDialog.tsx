
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Clock, Utensils } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Meal {
  id: string;
  user_id: string;
  name: string;
  meal_type: string;
  calories: number;
  items: string[];
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
}

interface AddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealAdded: () => void;
  editMeal?: Meal | null;
}

export const AddMealDialog = ({ open, onOpenChange, onMealAdded, editMeal }: AddMealDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    meal_type: "breakfast",
    calories: "",
    time: new Date().toTimeString().slice(0, 5),
    date: new Date().toISOString().split('T')[0],
  });
  const [items, setItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState("");

  const mealTypes = [
    { value: "breakfast", label: "Breakfast", emoji: "🌅" },
    { value: "lunch", label: "Lunch", emoji: "☀️" },
    { value: "dinner", label: "Dinner", emoji: "🌙" },
    { value: "snack", label: "Snack", emoji: "🍎" },
  ];

  // Reset or populate form when dialog opens or editMeal changes
  useEffect(() => {
    if (open) {
      if (editMeal) {
        setFormData({
          name: editMeal.name,
          meal_type: editMeal.meal_type,
          calories: editMeal.calories.toString(),
          time: editMeal.time,
          date: editMeal.date,
        });
        setItems(editMeal.items || []);
      } else {
        setFormData({
          name: "",
          meal_type: "breakfast",
          calories: "",
          time: new Date().toTimeString().slice(0, 5),
          date: new Date().toISOString().split('T')[0],
        });
        setItems([]);
      }
      setCurrentItem("");
    }
  }, [open, editMeal]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    if (currentItem.trim()) {
      setItems(prev => [...prev, currentItem.trim()]);
      setCurrentItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!formData.name.trim()) {
        toast.error("Please enter a meal name");
        return;
      }

      if (!formData.calories || parseInt(formData.calories) < 0) {
        toast.error("Please enter valid calories");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add meals");
        return;
      }

      const mealData = {
        user_id: user.id,
        name: formData.name.trim(),
        meal_type: formData.meal_type,
        calories: parseInt(formData.calories),
        items: items,
        date: formData.date,
        time: formData.time,
      };

      if (editMeal) {
        // Update existing meal
        const { error } = await supabase
          .from('meals')
          .update(mealData)
          .eq('id', editMeal.id);

        if (error) throw error;
        toast.success("Meal updated successfully!");
      } else {
        // Create new meal
        const { error } = await supabase
          .from('meals')
          .insert([mealData]);

        if (error) throw error;
        toast.success("Meal added successfully!");
      }

      onMealAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(editMeal ? "Failed to update meal" : "Failed to add meal");
      console.error('Error saving meal:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedMealType = mealTypes.find(type => type.value === formData.meal_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fitness-darkGray border-gray-800 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-fitness-red" />
            {editMeal ? "Edit Meal" : "Add New Meal"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editMeal ? "Update your meal details" : "Track your nutrition by adding meal details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Type Selection */}
          <div className="space-y-3">
            <Label className="text-white">Meal Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('meal_type', type.value)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-center ${
                    formData.meal_type === type.value
                      ? 'border-fitness-red bg-fitness-red/20 text-white'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Meal Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Meal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-fitness-dark border-gray-700 text-white"
              placeholder="e.g., Grilled Chicken Salad"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-fitness-dark border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="bg-fitness-dark border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Calories */}
          <div className="space-y-2">
            <Label htmlFor="calories" className="text-white">Calories</Label>
            <Input
              id="calories"
              type="number"
              min="0"
              value={formData.calories}
              onChange={(e) => handleInputChange('calories', e.target.value)}
              className="bg-fitness-dark border-gray-700 text-white"
              placeholder="Enter calories"
            />
          </div>

          {/* Food Items */}
          <div className="space-y-3">
            <Label className="text-white">Food Items</Label>
            <div className="flex gap-2">
              <Input
                value={currentItem}
                onChange={(e) => setCurrentItem(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-fitness-dark border-gray-700 text-white flex-1"
                placeholder="Add food item (e.g., Chicken breast)"
              />
              <Button
                type="button"
                onClick={addItem}
                size="sm"
                className="bg-fitness-red hover:bg-red-700 px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-700 text-white flex items-center gap-1"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="bg-fitness-red hover:bg-red-700"
            >
              {loading ? (editMeal ? "Updating..." : "Adding...") : (editMeal ? "Update Meal" : "Add Meal")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
