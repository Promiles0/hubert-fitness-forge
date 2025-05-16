
import { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-fitness-black/95 py-2 shadow-md' : 'bg-transparent py-4'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-fitness-red" />
            <h1 className="text-2xl font-bold text-white">
              <span className="text-fitness-red">HUBERT</span> FITNESS
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-fitness-red transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-fitness-red transition-colors">About</Link>
            <Link to="/programs" className="text-white hover:text-fitness-red transition-colors">Programs</Link>
            <Link to="/membership" className="text-white hover:text-fitness-red transition-colors">Membership</Link>
            <Link to="/trainers" className="text-white hover:text-fitness-red transition-colors">Trainers</Link>
            <Link to="/contact" className="text-white hover:text-fitness-red transition-colors">Contact</Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-fitness-red hover:text-white hover:border-fitness-red">
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
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-fitness-red transition-colors"
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
            <Link to="/" className="text-white hover:text-fitness-red transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-white hover:text-fitness-red transition-colors py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/programs" className="text-white hover:text-fitness-red transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Programs</Link>
            <Link to="/membership" className="text-white hover:text-fitness-red transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Membership</Link>
            <Link to="/trainers" className="text-white hover:text-fitness-red transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Trainers</Link>
            <Link to="/contact" className="text-white hover:text-fitness-red transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-white text-white hover:bg-fitness-red hover:text-white hover:border-fitness-red">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-fitness-red hover:bg-red-700 text-white font-bold">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
