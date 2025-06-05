
import { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, LogIn, UserPlus, LogOut, User, Calendar } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-fitness-black/95 py-2 shadow-md backdrop-blur-sm' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-fitness-red" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              <span className="text-fitness-red">HUBERT</span> FITNESS
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors">Home</Link>
            <Link to="/about" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors">About</Link>
            <Link to="/programs" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors">Programs</Link>
            <Link to="/membership" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors">Membership</Link>
            <Link to="/trainers" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors">Trainers</Link>
            <Link to="/schedule" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors">Schedule</Link>
            <Link to="/contact" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors">Contact</Link>
            
            {/* Show different UI based on auth state */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-fitness-red">
                      <AvatarImage src={user?.avatar} alt={user?.username || user?.name} />
                      <AvatarFallback className="bg-fitness-red text-white">
                        {user?.username ? user.username.charAt(0).toUpperCase() : user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{user?.username || user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/classes')} className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Classes</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-gray-300 dark:border-white text-gray-700 dark:text-white hover:bg-fitness-red hover:text-white hover:border-fitness-red">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-fitness-black/95 absolute top-full left-0 w-full py-4 animate-fade-in backdrop-blur-sm">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors py-2">Home</Link>
            <Link to="/about" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors py-2">About</Link>
            <Link to="/programs" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors py-2">Programs</Link>
            <Link to="/membership" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors py-2">Membership</Link>
            <Link to="/trainers" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors py-2">Trainers</Link>
            <Link to="/schedule" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors py-2">Schedule</Link>
            <Link to="/contact" className="text-gray-700 dark:text-white hover:text-fitness-red transition-colors py-2">Contact</Link>
            
            {/* Show different UI based on auth state for mobile */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4 py-2">
                  <Avatar className="h-8 w-8 border border-fitness-red">
                    <AvatarImage src={user?.avatar} alt={user?.username || user?.name} />
                    <AvatarFallback className="bg-fitness-red text-white">
                      {user?.username ? user.username.charAt(0).toUpperCase() : user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{user?.username || user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-700 dark:text-white border-gray-300 dark:border-white hover:text-fitness-red hover:border-fitness-red mb-3"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  className="w-full justify-start bg-fitness-red hover:bg-red-700 text-white" 
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link to="/login">
                  <Button variant="outline" className="w-full border-gray-300 dark:border-white text-gray-700 dark:text-white hover:bg-fitness-red hover:text-white hover:border-fitness-red">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-fitness-red hover:bg-red-700 text-white font-bold">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
