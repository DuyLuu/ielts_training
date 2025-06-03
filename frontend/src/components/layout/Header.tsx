import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be controlled by your auth system

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">YouPass</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/courses" className="text-gray-700 hover:text-indigo-600">
              Courses
            </Link>
            <Link to="/tests" className="text-gray-700 hover:text-indigo-600">
              Practice Tests
            </Link>
            <Link to="/forum" className="text-gray-700 hover:text-indigo-600">
              Community
            </Link>
            <Link to="/study-groups" className="text-gray-700 hover:text-indigo-600">
              Study Groups
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                  Dashboard
                </Link>
                <button 
                  onClick={() => setIsLoggedIn(false)} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/courses" className="block text-gray-700 hover:text-indigo-600">
              Courses
            </Link>
            <Link to="/tests" className="block text-gray-700 hover:text-indigo-600">
              Practice Tests
            </Link>
            <Link to="/forum" className="block text-gray-700 hover:text-indigo-600">
              Community
            </Link>
            <Link to="/study-groups" className="block text-gray-700 hover:text-indigo-600">
              Study Groups
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-indigo-600">
                  Dashboard
                </Link>
                <button 
                  onClick={() => setIsLoggedIn(false)} 
                  className="block w-full text-left text-gray-700 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-700 hover:text-indigo-600">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 