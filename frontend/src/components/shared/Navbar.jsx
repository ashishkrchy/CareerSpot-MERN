import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  LogOut,
  User2,
  Menu,
  X,
  Briefcase,
  Home,
  Search,
  Heart,
} from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout, verifyToken } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import { USER_API_END_POINT } from '@/utils/backendApiEndpoint';

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(verifyToken({ valid: true, user }));
    }
    setActiveLink(location.pathname);
  }, [dispatch, user, location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await axios.delete(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(
        error.response?.data?.message || 'Logout failed. Please try again.'
      );
      dispatch(logout());
      localStorage.removeItem('token');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const studentNavLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { path: '/browse', label: 'Browse', icon: <Search className="w-4 h-4" /> },
  ];

  const adminNavLinks = [
    {
      path: '/admin/companies',
      label: 'Companies',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      path: '/admin/jobs',
      label: 'Jobs',
      icon: <Briefcase className="w-4 h-4" />,
    },
  ];

  const navLinks = user
    ? user.role === 'student'
      ? studentNavLinks
      : adminNavLinks
    : [];

  if (loading) {
    return (
      <div className="bg-black border-b-2 border-red-600 h-16 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border-b-2 border-red-600 shadow-lg">
      <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          Career <span className="text-red-500">Spot</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-red-500" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {user && (
            <ul className="flex gap-6 items-center font-medium">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-1 ${
                      activeLink === link.path
                        ? 'text-red-500'
                        : 'text-gray-300 hover:text-blue-400'
                    } transition-colors`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!user ? (
            <div className="flex gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="bg-transparent text-white border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signUp">
                <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                  SignUp
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border border-white transition-all hover:border-red-600">
                  <AvatarImage
                    src={
                      user.profile?.profilePicture || 'https://github.com/100'
                    }
                    alt={user.fullname || 'User'}
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {user.fullname?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 space-y-6 bg-black border border-gray-800">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        user.profile?.profilePicture || 'https://github.com/100'
                      }
                      alt={user.fullname || 'User'}
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.fullname?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-lg text-white">
                      {user.fullname}
                    </h4>
                    <p className="text-sm text-red-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {user.role === 'student' && (
                    <>
                      <Link to="/profile">
                        <Button
                          variant="outline"
                          className="w-full flex gap-2 justify-start text-white bg-transparent border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer"
                        >
                          <User2 className="w-4 h-4" />
                          View Profile
                        </Button>
                      </Link>
                      <Link to="/wishlist">
                        <Button
                          variant="outline"
                          className="w-full flex gap-2 justify-start text-white bg-transparent border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-red-600" />
                          Wishlist
                        </Button>
                      </Link>
                    </>
                  )}

                  <Button
                    variant="destructive"
                    className="w-full flex gap-2 justify-start bg-red-600 hover:bg-red-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-black border-t border-gray-800">
          <ul className="flex flex-col gap-1 font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 py-2 px-3 rounded-md ${
                    activeLink === link.path
                      ? 'bg-gray-900 text-red-500'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-blue-400'
                  } transition-colors`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {!user ? (
            <div className="flex flex-col gap-2 mt-3">
              <Link to="/login" onClick={closeMobileMenu}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-white border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signUp" onClick={closeMobileMenu}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  SignUp
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-900 rounded-md">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profile?.profilePicture} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {user.fullname?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.fullname}
                  </p>
                  <p className="text-xs text-red-500 truncate">{user.email}</p>
                </div>
              </div>

              {user.role === 'student' && (
                <>
                  {' '}
                  <Link to="/profile" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className="w-full mt-2 bg-transparent text-white border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <User2 className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Link to="/wishlist" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className="w-full mt-2 bg-transparent text-white border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <Heart className="w-4 h-4 mr-2 text-red-600" />
                      Wishlist
                    </Button>
                  </Link>
                </>
              )}

              <Button
                variant="destructive"
                className="w-full mt-2 bg-red-600 hover:bg-red-700 cursor-pointer"
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
