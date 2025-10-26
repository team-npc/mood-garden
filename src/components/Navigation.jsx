/**
 * Navigation Component
 * Main navigation bar with menu items and user actions
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  Home, 
  BookOpen, 
  User, 
  Menu, 
  X,
  LogOut,
  Moon,
  Sun,
  Target,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Navigation Component
 */
const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Check if a route is active
   * @param {string} path - Route path
   * @returns {boolean} Whether the route is active
   */
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { 
      path: '/garden', 
      label: 'Garden', 
      icon: Home,
      description: 'Your plant dashboard'
    },
    { 
      path: '/journal', 
      label: 'Journal', 
      icon: BookOpen,
      description: 'View your entries'
    },
    { 
      path: '/focus', 
      label: 'Focus Mode', 
      icon: Target,
      description: 'Pomodoro timer'
    },
    { 
      path: '/help', 
      label: 'Help', 
      icon: HelpCircle,
      description: 'Plant growth guide'
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: User,
      description: 'Settings & account'
    }
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-sage-100 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/garden" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-sage-600" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Mood Garden</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-sage-100 text-sage-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            {/* User Avatar & Name */}
            <div className="flex items-center space-x-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-sage-300 dark:border-sage-600 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-100 to-earth-100 dark:from-sage-700 dark:to-earth-700 border-2 border-sage-300 dark:border-sage-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-sage-600 dark:text-sage-300">
                    {(user?.displayName || user?.email || 'G')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.displayName?.split(' ')[0] || 'Gardener'}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActiveRoute(item.path)
                        ? 'bg-sage-100 text-sage-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
              
              {/* Mobile User Info & Logout */}
              <div className="px-4 py-3 border-t border-gray-200 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {user?.displayName || 'Anonymous Gardener'}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;