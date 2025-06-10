
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, Settings, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (hasRole('admin')) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Programs', href: '/programs' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Membership', href: '/membership' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-fitness-black shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-fitness-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-white font-bold text-xl">FitLife</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar || undefined} />
                      <AvatarFallback>
                        {profile?.username?.charAt(0) || profile?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.username || profile?.username || profile?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {hasRole('admin') && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-fitness-red">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-fitness-darkGray">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={profile?.avatar || undefined} />
                      <AvatarFallback>
                        {profile?.username?.charAt(0) || profile?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {profile?.username || profile?.username || profile?.name || 'User'}
                      </div>
                      <div className="text-xs text-gray-400">{user?.email}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        handleDashboardClick();
                        setIsOpen(false);
                      }}
                      className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard/profile');
                        setIsOpen(false);
                      }}
                      className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Profile
                    </button>
                    {hasRole('admin') && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setIsOpen(false);
                        }}
                        className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-4 space-y-1">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
