
import { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, LogIn, UserPlus, LogOut, User } from 'lucide-react';
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-fitness-black/95 py-2 shadow-md' : 'bg-transparent py-4'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-[#dc2626]" />
            <h1 className="text-2xl font-bold text-white">
              <span className="text-[#dc2626]">HUBERT</span> FITNESS
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#dc2626] transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-[#dc2626] transition-colors">About</Link>
            <Link to="/programs" className="text-white hover:text-[#dc2626] transition-colors">Programs</Link>
            <Link to="/membership" className="text-white hover:text-[#dc2626] transition-colors">Membership</Link>
            <Link to="/trainers" className="text-white hover:text-[#dc2626] transition-colors">Trainers</Link>
            <Link to="/contact" className="text-white hover:text-[#dc2626] transition-colors">Contact</Link>
            
            {/* Show different UI based on auth state */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-[#dc2626]">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-[#dc2626] text-white">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
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
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626]">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#dc2626] hover:bg-red-700 text-white font-bold" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#dc2626] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-fitness-black/95 absolute top-full left-0 w-full py-4 animate-fade-in">
          <div className="container-custom flex flex-col space-y-4">
            <Link to="/" className="text-white hover:text-[#dc2626] transition-colors py-2">Home</Link>
            <Link to="/about" className="text-white hover:text-[#dc2626] transition-colors py-2">About</Link>
            <Link to="/programs" className="text-white hover:text-[#dc2626] transition-colors py-2">Programs</Link>
            <Link to="/membership" className="text-white hover:text-[#dc2626] transition-colors py-2">Membership</Link>
            <Link to="/trainers" className="text-white hover:text-[#dc2626] transition-colors py-2">Trainers</Link>
            <Link to="/contact" className="text-white hover:text-[#dc2626] transition-colors py-2">Contact</Link>
            
            {/* Show different UI based on auth state for mobile */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center space-x-3 mb-4 py-2">
                  <Avatar className="h-8 w-8 border border-[#dc2626]">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-[#dc2626] text-white">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-white border-white hover:text-[#dc2626] hover:border-[#dc2626] mb-3"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  className="w-full justify-start bg-[#dc2626] hover:bg-red-700 text-white" 
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-2 border-t border-gray-700">
                <Link to="/login">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626]">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-[#dc2626] hover:bg-red-700 text-white font-bold">
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
