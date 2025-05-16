
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Dumbbell, 
  Home, 
  Calendar, 
  User, 
  CreditCard, 
  BarChart2, 
  Apple, 
  MessageSquare, 
  Settings, 
  Bell, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);
  
  // Mock user data - in a real app, this would come from your auth/state management
  const user = {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg", // Placeholder for now
    nextClass: {
      name: "HIIT",
      time: "6:30 PM",
      trainer: "Michael"
    },
    goals: [
      { name: "Weight Loss", current: 7.5, target: 10, unit: "kg" },
      { name: "Attendance", current: 3, target: 4, unit: "sessions" }
    ]
  };

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-fitness-black flex flex-col">
      {/* Top Navigation */}
      <header className="bg-fitness-darkGray border-b border-gray-800 py-4">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Dumbbell className="h-7 w-7 text-fitness-red" />
              <h1 className="text-2xl font-bold text-white">
                <span className="text-fitness-red">HUBERT</span> FITNESS
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="text-gray-300 hover:text-white transition-colors">
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-fitness-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-fitness-red text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar Navigation */}
        <aside className="bg-fitness-darkGray w-full md:w-64 border-r border-gray-800">
          <nav className="p-4 space-y-1">
            <Link to="/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link to="/dashboard/classes" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/classes") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Calendar className="h-5 w-5" />
              <span>My Classes</span>
            </Link>
            
            <Link to="/dashboard/trainers" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/trainers") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <User className="h-5 w-5" />
              <span>Trainers</span>
            </Link>
            
            <Link to="/dashboard/membership" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/membership") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <CreditCard className="h-5 w-5" />
              <span>My Plan</span>
            </Link>
            
            <Link to="/dashboard/progress" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/progress") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <BarChart2 className="h-5 w-5" />
              <span>Progress</span>
            </Link>
            
            <Link to="/dashboard/nutrition" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/nutrition") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Apple className="h-5 w-5" />
              <span>Nutrition</span>
            </Link>
            
            <Link to="/dashboard/chat" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/chat") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <MessageSquare className="h-5 w-5" />
              <span>Chat</span>
            </Link>
            
            <Link to="/dashboard/settings" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/settings") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            
            <Separator className="my-2 bg-gray-800" />
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-gray-300 hover:bg-gray-800 hover:text-white">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-fitness-black">
          {/* If a specific dashboard page is selected, render the Outlet */}
          {location.pathname !== "/dashboard" ? (
            <Outlet />
          ) : (
            /* Otherwise, show the dashboard homepage */
            <div className="space-y-6">
              <div className="bg-fitness-darkGray rounded-lg p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome, {user.name}! 👋
                </h2>
                <div className="mt-4 bg-fitness-black p-4 rounded-md border border-gray-800">
                  <p className="text-gray-300 text-sm">Your Next Class:</p>
                  <div className="flex items-center mt-1">
                    <span className="text-white font-semibold">{user.nextClass.name}</span>
                    <span className="mx-2 text-gray-500">@</span>
                    <span className="text-fitness-red font-semibold">{user.nextClass.time}</span>
                    <span className="ml-2 text-gray-300">
                      with {user.nextClass.trainer}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weekly Progress Chart */}
                <div className="bg-fitness-darkGray rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Weekly Progress
                  </h3>
                  <div className="h-48 bg-fitness-black rounded-md border border-gray-800 flex items-center justify-center">
                    <p className="text-gray-400">Progress chart will appear here</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-fitness-black p-3 rounded-md border border-gray-800">
                      <p className="text-gray-400 text-sm">Calories burned</p>
                      <p className="text-white font-bold text-lg">3,250</p>
                    </div>
                    <div className="bg-fitness-black p-3 rounded-md border border-gray-800">
                      <p className="text-gray-400 text-sm">Sessions attended</p>
                      <p className="text-white font-bold text-lg">6/8</p>
                    </div>
                  </div>
                </div>

                {/* My Goals */}
                <div className="bg-fitness-darkGray rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4">My Goals</h3>
                  
                  <div className="space-y-4">
                    {user.goals.map((goal, index) => (
                      <div key={index} className="bg-fitness-black p-4 rounded-md border border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white font-medium">{goal.name}</p>
                          <p className="text-fitness-red font-semibold">
                            {goal.current}/{goal.target} {goal.unit}
                          </p>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div 
                            className="bg-fitness-red h-2.5 rounded-full" 
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          {goal.target - goal.current} {goal.unit} to go
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4 bg-fitness-red hover:bg-red-700">
                    Add New Goal
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-fitness-darkGray rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Upcoming Classes
                  </h3>
                  <ul className="space-y-3 mt-4">
                    <li className="bg-fitness-black p-3 rounded-md border border-gray-800">
                      <p className="text-white font-medium">Yoga</p>
                      <p className="text-gray-400 text-sm">Tomorrow, 9:00 AM</p>
                    </li>
                    <li className="bg-fitness-black p-3 rounded-md border border-gray-800">
                      <p className="text-white font-medium">Strength Training</p>
                      <p className="text-gray-400 text-sm">Wed, 5:30 PM</p>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4 border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                    View All Classes
                  </Button>
                </div>
                
                <div className="bg-fitness-darkGray rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Nutritional Tips
                  </h3>
                  <div className="bg-fitness-black p-4 rounded-md border border-gray-800 mt-4">
                    <p className="text-white font-medium">Protein Intake</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Aim for 1.6-2.0g of protein per kg of bodyweight for optimal muscle recovery.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                    View Nutrition Plan
                  </Button>
                </div>
                
                <div className="bg-fitness-darkGray rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    My Trainer
                  </h3>
                  <div className="flex items-center mt-4 bg-fitness-black p-4 rounded-md border border-gray-800">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-fitness-red text-white">
                        MT
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-white font-medium">Michael Thompson</p>
                      <p className="text-gray-400 text-sm">Strength Specialist</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                    Message Trainer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
