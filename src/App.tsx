
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
import { AuthProvider } from "./contexts/AuthContext";
import { Fragment } from "react";

const queryClient = new QueryClient();

// Create layout components for consistent navigation
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <Fragment>
    <Navbar />
    {children}
    <Footer />
  </Fragment>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <Fragment>
    {children}
  </Fragment>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes with layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
            </Route>
            
            {/* Auth routes without Navbar and Footer */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
            
            {/* Dashboard already has its own layout */}
            <Route path="/dashboard/*" element={<DashboardPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
