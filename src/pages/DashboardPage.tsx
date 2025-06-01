
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { 
  Dumbbell, 
  Home, 
  Calendar, 
  User, 
  CreditCard, 
  Apple, 
  MessageSquare, 
  Settings, 
  Bell, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import NutritionPage from "./dashboard/NutritionPage";
import ChatPage from "./dashboard/ChatPage";
import SettingsPage from "./dashboard/SettingsPage";
import ProfilePage from "./dashboard/ProfilePage";
import ClassesPage from "./dashboard/ClassesPage";

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);
  const { user, logout } = useAuth();
  
  // Set a default username if user doesn't have one
  const username = user?.name || "Member";
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-fitness-black flex flex-col">
      {/* Main Dashboard Content */}
      <div className="flex flex-col md:flex-row flex-1 mt-16">
        {/* Sidebar Navigation */}
        <aside className="bg-fitness-darkGray w-full md:w-64 border-r border-gray-800">
          <nav className="p-4 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <Avatar className="h-10 w-10 border border-fitness-red">
                <AvatarImage src={userAvatar} alt={username} />
                <AvatarFallback className="bg-fitness-red text-white">
                  {username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{username}</p>
                <p className="text-xs text-gray-400">Member</p>
              </div>
            </div>
            
            <Separator className="my-2 bg-gray-800" />
            
            <Link to="/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard") && location.pathname === "/dashboard"
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
            
            <Link to="/trainers" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                text-gray-300 hover:bg-gray-800 hover:text-white`}>
              <User className="h-5 w-5" />
              <span>Trainers</span>
            </Link>
            
            <Link to="/membership" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                text-gray-300 hover:bg-gray-800 hover:text-white`}>
              <CreditCard className="h-5 w-5" />
              <span>My Plan</span>
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
            
            <Link to="/dashboard/profile" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/dashboard/profile") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <User className="h-5 w-5" />
              <span>Profile</span>
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
          <Routes>
            <Route path="classes" element={<ClassesPage />} />
            <Route path="nutrition" element={<NutritionPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="/" element={
              // Dashboard homepage content
              <div className="space-y-6">
                <div className="bg-fitness-darkGray rounded-lg p-6 border border-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome, {username}! 👋
                  </h2>
                  <div className="mt-4 bg-fitness-black p-4 rounded-md border border-gray-800">
                    <p className="text-gray-300 text-sm">Your Next Class:</p>
                    <div className="flex items-center mt-1">
                      <span className="text-white font-semibold">HIIT</span>
                      <span className="mx-2 text-gray-500">@</span>
                      <span className="text-fitness-red font-semibold">6:30 PM</span>
                      <span className="ml-2 text-gray-300">
                        with Michael
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
                      <div className="bg-fitness-black p-4 rounded-md border border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white font-medium">Weight Loss</p>
                          <p className="text-fitness-red font-semibold">
                            7.5/10 kg
                          </p>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div 
                            className="bg-fitness-red h-2.5 rounded-full" 
                            style={{ width: `75%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          2.5 kg to go
                        </p>
                      </div>
                      
                      <div className="bg-fitness-black p-4 rounded-md border border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white font-medium">Attendance</p>
                          <p className="text-fitness-red font-semibold">
                            3/4 sessions
                          </p>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div 
                            className="bg-fitness-red h-2.5 rounded-full" 
                            style={{ width: `75%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          1 session to go
                        </p>
                      </div>
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
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
