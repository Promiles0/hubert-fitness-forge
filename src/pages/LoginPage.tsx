
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { login, hasRole } = useAuth();

  useEffect(() => {
    setMounted(true);
    // Check for saved email
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Use the AuthContext login function which handles role-based redirection
      await login(email, password);
      
      // Navigation is handled by the login function in AuthContext
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-dark via-fitness-darkGray to-fitness-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand Header */}
        <div className="text-center mb-8 animate-in fade-in duration-1000">
          <Link to="/" className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-10 w-10 text-fitness-red" />
            <h1 className="text-3xl font-bold text-white">
              <span className="text-fitness-red">HUBERT</span> FITNESS
            </h1>
          </Link>
          <p className="text-gray-400">Your Fitness Journey Starts Here</p>
        </div>

        <Card className="bg-fitness-darkGray/90 border-gray-800 backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="space-y-4 text-center">
            <div className="animate-in zoom-in-50 duration-1000 delay-300">
              <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Sign in to continue your fitness journey
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2 animate-in slide-in-from-left-4 duration-700 delay-500">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-fitness-red" />
                  Email
                  {email && emailValid && <CheckCircle className="h-4 w-4 text-green-500" />}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-fitness-dark border-gray-700 text-white focus:border-fitness-red transition-all duration-300 hover:border-gray-600"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2 animate-in slide-in-from-right-4 duration-700 delay-700">
                <Label htmlFor="password" className="text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-fitness-red" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-fitness-dark border-gray-700 text-white focus:border-fitness-red transition-all duration-300 hover:border-gray-600 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between animate-in slide-in-from-left-4 duration-700 delay-900">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-700 text-fitness-red focus:ring-fitness-red"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-fitness-red hover:text-red-400 transition-colors duration-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-fitness-red hover:bg-red-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom-4 duration-700 delay-1100 group"
                disabled={isLoading || !emailValid}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="animate-in fade-in duration-700 delay-1300">
              <Separator className="bg-gray-700" />
              <div className="text-center mt-4">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-fitness-red hover:text-red-400 font-semibold transition-colors duration-300 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
