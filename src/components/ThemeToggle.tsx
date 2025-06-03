
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle = ({ className = '', size = 'md' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`${sizeClasses[size]} border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        <Sun 
          className={`${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'} absolute transition-all duration-300 text-yellow-500`} 
          size={iconSizes[size]} 
        />
        <Moon 
          className={`${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'} transition-all duration-300 text-blue-500`} 
          size={iconSizes[size]} 
        />
      </div>
    </Button>
  );
};

export default ThemeToggle;
