
import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export const SignupHeader = () => {
  return (
    <div className="text-center mb-8 animate-in fade-in duration-1000">
      <Link to="/" className="flex items-center justify-center gap-3 mb-4">
        <Dumbbell className="h-10 w-10 text-fitness-red" />
        <h1 className="text-3xl font-bold text-white">
          <span className="text-fitness-red">HUBERT</span> FITNESS
        </h1>
      </Link>
      <p className="text-gray-400">Join the Fitness Revolution</p>
    </div>
  );
};
