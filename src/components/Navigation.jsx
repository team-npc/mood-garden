/**
 * Navigation Component
 * Forest theme navigation with bento-style elements
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle,
  Award,
  Volume2,
  Sparkles,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AmbientSoundscape from './AmbientSoundscape';

/**
 * Navigation Component
 */
const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
      label: 'Focus', 
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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`
        sticky top-0 z-40 transition-all duration-500
        ${scrolled 
          ? 'bg-white/95 dark:bg-deep-800/95 backdrop-blur-xl border-b border-sage-200 dark:border-deep-600' 
          : 'bg-white/80 dark:bg-deep-800/80 backdrop-blur-md border-b border-sage-100 dark:border-deep-700/50'
        }
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link 
            to="/garden" 
            className="flex items-center space-x-3 group"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 bg-gradient-to-br from-leaf-600 to-leaf-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-leaf-500/20 transition-shadow duration-300"
            >
              <Leaf className="w-6 h-6 text-cream-100" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-display font-bold text-earth-800 dark:text-cream-100 tracking-tight">
                Mood Garden
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-leaf-100 dark:bg-leaf-600/20 text-leaf-700 dark:text-leaf-300' 
                        : 'text-earth-600 dark:text-cream-400 hover:text-earth-900 dark:hover:text-cream-100 hover:bg-sage-100 dark:hover:bg-deep-600/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 w-8 h-1 bg-gradient-to-r from-leaf-500 to-leaf-600 dark:from-leaf-400 dark:to-leaf-500 rounded-full transform -translate-x-1/2"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Ambient Sound Control */}
            <AmbientSoundscape minimal />
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-earth-500 dark:text-cream-400 hover:text-earth-700 dark:hover:text-cream-100 hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Sun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Moon className="w-5 h-5 text-sage-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* Divider */}
            <div className="w-px h-6 bg-sage-200 dark:bg-deep-600 mx-2" />
            
            {/* User Avatar & Menu */}
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-9 h-9 rounded-xl border-2 border-sage-200 dark:border-deep-500 object-cover shadow-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-leaf-600 to-leaf-700 border-2 border-sage-200 dark:border-deep-500 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-cream-100">
                      {(user?.displayName || user?.email || 'G')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-leaf-500 border-2 border-white dark:border-deep-800 rounded-full" />
              </motion.div>
              
              <div className="text-sm hidden lg:block">
                <span className="text-earth-700 dark:text-cream-400">
                  {user?.displayName?.split(' ')[0] || 'Gardener'}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 rounded-xl text-earth-500 dark:text-cream-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-earth-700 dark:text-cream-300 hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-sage-200 dark:border-deep-600">
                <div className="space-y-1">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.path);
                    
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={closeMobileMenu}
                          className={`
                            flex items-center space-x-4 px-4 py-3 rounded-xl
                            transition-all duration-200
                            ${isActive 
                              ? 'bg-leaf-100 dark:bg-leaf-600/20 text-leaf-700 dark:text-leaf-300' 
                              : 'text-earth-600 dark:text-cream-400 hover:bg-sage-100 dark:hover:bg-deep-600/50'
                            }
                          `}
                        >
                          <div className={`
                            p-2 rounded-lg
                            ${isActive 
                              ? 'bg-leaf-600 text-cream-100' 
                              : 'bg-sage-100 dark:bg-deep-600 text-earth-600 dark:text-cream-400'
                            }
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-earth-800 dark:text-cream-200">{item.label}</div>
                            <div className="text-xs text-earth-500 dark:text-cream-500">{item.description}</div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Mobile Actions */}
                <div className="mt-4 pt-4 border-t border-sage-200 dark:border-deep-600 space-y-3">
                  {/* Theme Toggle Mobile */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-sage-50 dark:bg-deep-700/50"
                  >
                    <span className="text-earth-600 dark:text-cream-400">Theme</span>
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-sage-600" />
                    )}
                  </button>
                  
                  {/* User Info */}
                  <div className="px-4 py-3 bg-sage-50 dark:bg-deep-700/50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-xl border-2 border-sage-200 dark:border-deep-500"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-leaf-600 to-leaf-700 flex items-center justify-center">
                            <span className="text-sm font-bold text-cream-100">
                              {(user?.displayName || 'G')[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-earth-800 dark:text-cream-100">
                            {user?.displayName || 'Gardener'}
                          </div>
                          <div className="text-xs text-earth-500 dark:text-cream-500">{user?.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg text-earth-500 dark:text-cream-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;