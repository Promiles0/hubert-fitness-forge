
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, User, Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const { signup, isLoading } = useAuth();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    await signup(data.name, data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-fitness-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <Dumbbell className="h-10 w-10 text-[#dc2626]" />
            <h1 className="text-3xl font-bold text-white">
              <span className="text-[#dc2626]">HUBERT</span> FITNESS
            </h1>
          </Link>
          <p className="text-gray-400 mt-2">Create your account to start your fitness journey</p>
        </div>
        
        <Card className="bg-fitness-darkGray border-gray-700 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl text-white">Sign Up</CardTitle>
            <CardDescription className="text-gray-400">
              Join HUBERT FITNESS and transform your life
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                          <Input
                            placeholder="John Doe"
                            className="pl-10 bg-fitness-black border-gray-700 text-white"
                            {...field}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                          <Input
                            placeholder="you@example.com"
                            className="pl-10 bg-fitness-black border-gray-700 text-white"
                            {...field}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                          <Input
                            type="password"
                            placeholder="Create a strong password"
                            className="pl-10 bg-fitness-black border-gray-700 text-white"
                            {...field}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="data-[state=checked]:bg-[#dc2626] data-[state=checked]:border-[#dc2626]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-300">
                          I agree to the{" "}
                          <Link to="/terms" className="text-[#dc2626] hover:underline transition-colors">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy" className="text-[#dc2626] hover:underline transition-colors">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage className="text-red-400" />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#dc2626] hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <div className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-[#dc2626] hover:underline transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col space-y-2 items-center">
            <h3 className="text-white font-medium">Why join HUBERT FITNESS?</h3>
            <div className="flex flex-col space-y-2 mt-2 text-sm">
              <div className="flex items-center text-gray-300">
                <CheckCircle className="h-4 w-4 text-[#dc2626] mr-2" />
                <span>Personalized workout plans</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="h-4 w-4 text-[#dc2626] mr-2" />
                <span>Expert trainer guidance</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="h-4 w-4 text-[#dc2626] mr-2" />
                <span>Track your fitness progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
