
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Droplets, Zap, Target, Plus } from "lucide-react";

const NutritionPage = () => {
  const [dailyCalories] = useState(1850);
  const [targetCalories] = useState(2200);
  const [waterIntake] = useState(6);
  const [targetWater] = useState(8);

  const macros = {
    protein: { current: 120, target: 150, unit: "g" },
    carbs: { current: 180, target: 250, unit: "g" },
    fat: { current: 65, target: 80, unit: "g" }
  };

  const meals = [
    { name: "Breakfast", calories: 450, time: "8:00 AM", items: ["Oatmeal", "Banana", "Almonds"] },
    { name: "Lunch", calories: 650, time: "12:30 PM", items: ["Grilled Chicken", "Rice", "Vegetables"] },
    { name: "Snack", calories: 200, time: "3:00 PM", items: ["Greek Yogurt", "Berries"] },
    { name: "Dinner", calories: 550, time: "7:00 PM", items: ["Salmon", "Sweet Potato", "Salad"] }
  ];

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
            <div className="text-2xl font-bold text-white">84%</div>
            <p className="text-xs text-gray-400">Weekly target</p>
            <Progress value={84} className="mt-2" />
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
              <Button className="bg-fitness-red hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </div>
            
            {meals.map((meal, index) => (
              <Card key={index} className="bg-fitness-darkGray border-gray-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">{meal.name}</h4>
                      <p className="text-sm text-gray-400">{meal.time}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {meal.items.map((item, itemIndex) => (
                          <Badge key={itemIndex} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{meal.calories}</div>
                      <div className="text-xs text-gray-400">kcal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
};

export default NutritionPage;
