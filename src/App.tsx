
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
import { AuthProvider } from "./contexts/AuthContext";

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

// Layout for admin dashboard without Navbar and Footer
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
            
            {/* Dashboard routes */}
            <Route 
              path="/dashboard/*" 
              element={<MainLayout><DashboardPage /></MainLayout>} 
            />
            
            {/* Admin Dashboard routes without Navbar and Footer */}
            <Route 
              path="/admin/*" 
              element={<AdminLayout><AdminDashboardPage /></AdminLayout>} 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
