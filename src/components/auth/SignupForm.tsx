
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, User, Lock, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailValid, setEmailValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const getButtonDisabledReason = () => {
    if (isLoading) return "Form is submitting...";
    if (!emailValid) return "Email is not valid";
    if (passwordStrength < 50) return "Password is too weak";
    if (password !== confirmPassword) return "Passwords don't match";
    return null;
  };

  const isButtonDisabled = isLoading || !emailValid || passwordStrength < 50 || password !== confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (passwordStrength < 50) {
      toast.error("Please choose a stronger password");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            name: `${firstName} ${lastName}`
          }
        }
      });
      if (error) throw error;
      if (data.user) {
        toast.success("Account created successfully! Please check your email to verify your account.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 animate-in slide-in-from-left-4 duration-700 delay-500">
          <Label htmlFor="firstName" className="text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-fitness-red" />
            First Name
          </Label>
          <Input 
            id="firstName" 
            type="text" 
            placeholder="Enter your first name" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)} 
            className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-fitness-red dark:focus:border-fitness-red transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600" 
            required 
          />
        </div>
        <div className="space-y-2 animate-in slide-in-from-right-4 duration-700 delay-500">
          <Label htmlFor="lastName" className="text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-fitness-red" />
            Last Name
          </Label>
          <Input 
            id="lastName" 
            type="text" 
            placeholder="Enter your last name" 
            value={lastName} 
            onChange={e => setLastName(e.target.value)} 
            className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-fitness-red dark:focus:border-fitness-red transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600" 
            required 
          />
        </div>
      </div>

      <div className="space-y-2 animate-in slide-in-from-left-4 duration-700 delay-700">
        <Label htmlFor="email" className="text-gray-900 dark:text-white flex items-center gap-2">
          <Mail className="h-4 w-4 text-fitness-red" />
          Email
          {email && (emailValid ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />)}
        </Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Enter your email address" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-fitness-red dark:focus:border-fitness-red transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600" 
          required 
        />
      </div>

      <div className="space-y-2 animate-in slide-in-from-right-4 duration-700 delay-900">
        <Label htmlFor="password" className="text-gray-900 dark:text-white flex items-center gap-2">
          <Lock className="h-4 w-4 text-fitness-red" />
          Password
        </Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="Create a strong password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-fitness-red dark:focus:border-fitness-red transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600 pr-10" 
            required 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrengthIndicator password={password} passwordStrength={passwordStrength} />
      </div>

      <div className="space-y-2 animate-in slide-in-from-left-4 duration-700 delay-1100">
        <Label htmlFor="confirmPassword" className="text-gray-900 dark:text-white flex items-center gap-2">
          <Lock className="h-4 w-4 text-fitness-red" />
          Confirm Password
          {confirmPassword && (password === confirmPassword ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />)}
        </Label>
        <div className="relative">
          <Input 
            id="confirmPassword" 
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Confirm your password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className="bg-white dark:bg-fitness-dark border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-fitness-red dark:focus:border-fitness-red transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600 pr-10" 
            required 
          />
          <button 
            type="button" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {getButtonDisabledReason() && (
        <div className="text-sm text-yellow-400 text-center bg-yellow-400/10 p-2 rounded">
          Button disabled: {getButtonDisabledReason()}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isButtonDisabled}
        className="w-full text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom-4 duration-700 delay-1300 group bg-red-700 hover:bg-red-600"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <>
            Create Account
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      <div className="animate-in fade-in duration-700 delay-1500">
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-fitness-red hover:text-red-600 dark:hover:text-red-400 font-semibold transition-colors duration-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};
