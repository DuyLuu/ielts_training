import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be controlled by your auth system
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Courses', path: '/courses' },
    { name: 'Practice Tests', path: '/tests' },
    { name: 'Community', path: '/forum' },
    { name: 'Study Groups', path: '/study-groups' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center relative z-10"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              YouPass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-indigo-600 bg-indigo-50' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => setIsLoggedIn(false)} 
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden relative z-10 p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-6 flex flex-col items-end justify-center gap-1.5">
              <span 
                className={`block h-0.5 rounded-full bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'
                }`} 
              />
              <span 
                className={`block h-0.5 rounded-full bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'w-4'
                }`} 
              />
              <span 
                className={`block h-0.5 rounded-full bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'
                }`} 
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <div 
          className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="px-6 py-6 border-b">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                YouPass
              </span>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-indigo-600 bg-indigo-50' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="p-6 border-t">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link 
                    to="/dashboard" 
                    className="block w-full px-4 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 text-center transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => setIsLoggedIn(false)} 
                    className="block w-full px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center hover:shadow-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    className="block w-full px-4 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 text-center transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center hover:shadow-lg transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 