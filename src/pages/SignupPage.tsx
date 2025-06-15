
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupHeader } from "@/components/auth/SignupHeader";
import { SignupForm } from "@/components/auth/SignupForm";

const SignupPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupHeader />

        <Card className="bg-fitness-darkGray/90 border-gray-800 backdrop-blur-sm shadow-xl animate-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="space-y-4 text-center">
            <div className="animate-in zoom-in-50 duration-1000 delay-300">
              <CardTitle className="text-3xl font-bold text-white">Join Hubert Fitness</CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Start your fitness journey today
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
