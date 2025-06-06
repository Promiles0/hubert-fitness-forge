
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProgramsPage from "./pages/ProgramsPage";
import TrainersPage from "./pages/TrainersPage";
import MembershipPage from "./pages/MembershipPage";
import SchedulePage from "./pages/SchedulePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import MembersManagementPage from "./pages/admin/MembersManagementPage";
import ClassesManagementPage from "./pages/admin/ClassesManagementPage";
import TrainersManagementPage from "./pages/admin/TrainersManagementPage";
import PaymentsManagementPage from "./pages/admin/PaymentsManagementPage";
import PlansManagementPage from "./pages/admin/PlansManagementPage";
import MessagesManagementPage from "./pages/admin/MessagesManagementPage";
import ReportsManagementPage from "./pages/admin/ReportsManagementPage";
import StoreManagementPage from "./pages/admin/StoreManagementPage";
import SettingsManagementPage from "./pages/admin/SettingsManagementPage";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardClassesPage from "./pages/dashboard/ClassesPage";
import DashboardChatPage from "./pages/dashboard/ChatPage";
import DashboardProfilePage from "./pages/dashboard/ProfilePage";
import DashboardNutritionPage from "./pages/dashboard/NutritionPage";
import DashboardSettingsPage from "./pages/dashboard/SettingsPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoadingSpinner from "./components/LoadingSpinner";
import { Suspense } from "react";

const queryClient = new QueryClient();

// Layout component to wrap routes that need Navbar and Footer
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Layout for auth pages without Navbar and Footer
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
  </>
);

// Layout for dashboard pages without Navbar and Footer
const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
  </>
);

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-fitness-black">
    <LoadingSpinner size={40} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes with Navbar and Footer */}
                <Route
                  path="/"
                  element={<MainLayout><HomePage /></MainLayout>}
                />
                <Route
                  path="/about"
                  element={<MainLayout><AboutPage /></MainLayout>}
                />
                <Route
                  path="/contact"
                  element={<MainLayout><ContactPage /></MainLayout>}
                />
                <Route
                  path="/programs"
                  element={<MainLayout><ProgramsPage /></MainLayout>}
                />
                <Route
                  path="/trainers"
                  element={<MainLayout><TrainersPage /></MainLayout>}
                />
                <Route
                  path="/membership"
                  element={<MainLayout><MembershipPage /></MainLayout>}
                />
                <Route
                  path="/schedule"
                  element={<MainLayout><SchedulePage /></MainLayout>}
                />
                
                {/* Auth routes without Navbar and Footer */}
                <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
                
                {/* Dashboard routes without Navbar and Footer */}
                <Route 
                  path="/dashboard" 
                  element={<DashboardLayout><DashboardPage /></DashboardLayout>}
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="classes" element={<DashboardClassesPage />} />
                  <Route path="nutrition" element={<DashboardNutritionPage />} />
                  <Route path="chat" element={<DashboardChatPage />} />
                  <Route path="profile" element={<DashboardProfilePage />} />
                  <Route path="settings" element={<DashboardSettingsPage />} />
                </Route>
                
                {/* Admin Dashboard routes without Navbar and Footer */}
                <Route path="/admin" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/members" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/classes" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/trainers" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/payments" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/membership-plans" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/messages" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/reports" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/store" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                <Route path="/admin/settings" element={<DashboardLayout><AdminDashboardPage /></DashboardLayout>} />
                
                {/* Catch-all route */}
                <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
