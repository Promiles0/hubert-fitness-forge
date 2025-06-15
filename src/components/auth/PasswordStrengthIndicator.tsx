
interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: number;
}

export const PasswordStrengthIndicator = ({ password, passwordStrength }: PasswordStrengthIndicatorProps) => {
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">Password strength:</span>
        <span className={`text-sm ${passwordStrength >= 75 ? 'text-green-500' : passwordStrength >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
          {getPasswordStrengthText()}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`} 
          style={{ width: `${passwordStrength}%` }} 
        />
      </div>
    </div>
  );
};
