
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Droplets, Zap, Target, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddMealDialog } from "@/components/AddMealDialog";

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

const NutritionPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMealOpen, setAddMealOpen] = useState(false);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [targetCalories] = useState(2200);
  const [waterIntake] = useState(6);
  const [targetWater] = useState(8);

  const macros = {
    protein: { current: 120, target: 150, unit: "g" },
    carbs: { current: 180, target: 250, unit: "g" },
    fat: { current: 65, target: 80, unit: "g" }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('time', { ascending: true });

      if (error) throw error;

      const mealsData = data || [];
      setMeals(mealsData);
      
      // Calculate total calories for today
      const totalCalories = mealsData.reduce((sum, meal) => sum + meal.calories, 0);
      setDailyCalories(totalCalories);
    } catch (error: any) {
      toast.error("Failed to load meals");
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealTypeEmoji = (type: string) => {
    const emojis = {
      breakfast: "🌅",
      lunch: "☀️",
      dinner: "🌙",
      snack: "🍎"
    };
    return emojis[type as keyof typeof emojis] || "🍽️";
  };

  const groupMealsByType = () => {
    const grouped = meals.reduce((acc, meal) => {
      if (!acc[meal.meal_type]) {
        acc[meal.meal_type] = [];
      }
      acc[meal.meal_type].push(meal);
      return acc;
    }, {} as Record<string, Meal[]>);

    return grouped;
  };

  const formatMealType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Nutrition Tracking</h1>
        <p className="text-gray-400">Monitor your daily nutrition and reach your fitness goals</p>
      </div>

      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Daily Calories</CardTitle>
            <Zap className="h-4 w-4 text-fitness-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dailyCalories}</div>
            <p className="text-xs text-gray-400">of {targetCalories} kcal</p>
            <Progress value={(dailyCalories / targetCalories) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Water Intake</CardTitle>
            <Droplets className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{waterIntake}</div>
            <p className="text-xs text-gray-400">of {targetWater} glasses</p>
            <Progress value={(waterIntake / targetWater) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Goal Progress</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {targetCalories > 0 ? Math.round((dailyCalories / targetCalories) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-400">Daily target</p>
            <Progress value={targetCalories > 0 ? (dailyCalories / targetCalories) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="bg-fitness-darkGray border-gray-800">
          <TabsTrigger value="today" className="text-white data-[state=active]:bg-fitness-red">Today</TabsTrigger>
          <TabsTrigger value="macros" className="text-white data-[state=active]:bg-fitness-red">Macros</TabsTrigger>
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-fitness-red">History</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Today's Meals</h3>
              <Button 
                className="bg-fitness-red hover:bg-red-700"
                onClick={() => setAddMealOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-fitness-red border-t-transparent"></div>
              </div>
            ) : meals.length > 0 ? (
              Object.entries(groupMealsByType()).map(([mealType, typeMeals]) => (
                <Card key={mealType} className="bg-fitness-darkGray border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{getMealTypeEmoji(mealType)}</span>
                      <h4 className="font-semibold text-white text-lg">{formatMealType(mealType)}</h4>
                      <Badge variant="secondary" className="ml-auto">
                        {typeMeals.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {typeMeals.map((meal, index) => (
                        <div key={index} className="border-l-2 border-fitness-red pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-white">{meal.name}</h5>
                              <p className="text-sm text-gray-400">{meal.time}</p>
                              {meal.items && meal.items.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {meal.items.map((item: string, itemIndex: number) => (
                                    <Badge key={itemIndex} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">{meal.calories}</div>
                              <div className="text-xs text-gray-400">kcal</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-fitness-darkGray border-gray-800">
                <CardContent className="p-8 text-center">
                  <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No meals logged today</h3>
                  <p className="text-gray-400 mb-4">Start tracking your nutrition by adding your first meal</p>
                  <Button 
                    className="bg-fitness-red hover:bg-red-700"
                    onClick={() => setAddMealOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Meal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="macros" className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Macronutrients</h3>
          <div className="grid gap-4">
            {Object.entries(macros).map(([macro, data]) => (
              <Card key={macro} className="bg-fitness-darkGray border-gray-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-white capitalize">{macro}</h4>
                    <span className="text-white">
                      {data.current}/{data.target}{data.unit}
                    </span>
                  </div>
                  <Progress value={(data.current / data.target) * 100} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Nutrition History</h3>
          <Card className="bg-fitness-darkGray border-gray-800">
            <CardContent className="p-6">
              <div className="text-center text-gray-400">
                <Apple className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nutrition history will appear here as you track your meals</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Meal Dialog */}
      <AddMealDialog
        open={addMealOpen}
        onOpenChange={setAddMealOpen}
        onMealAdded={fetchMeals}
      />
    </div>
  );
};

export default NutritionPage;
