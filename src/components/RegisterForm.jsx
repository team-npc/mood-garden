/**
 * Register Component
 * Handles user registration with email/password and Google
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Register Form Component
 * @param {Object} props - Component props
 * @param {Function} props.onToggleMode - Function to toggle between login/register
 */
const RegisterForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { register, signInGoogle, error, clearError } = useAuth();

  /**
   * Validate form fields
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation errors object
   */
  const validateForm = (data) => {
    const errors = {};

    if (!data.displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (data.displayName.trim().length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    }

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    clearError();
  };

  /**
   * Handle form submission for email/password registration
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.displayName.trim());
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google sign in
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bento-item max-w-md mx-auto p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-leaf-600/20 rounded-2xl mb-4">
          <Leaf className="w-8 h-8 text-leaf-400" />
        </div>
        <h2 className="text-2xl font-bold text-earth-800 dark:text-cream-100 mb-2">Plant Your Garden</h2>
        <p className="text-earth-500 dark:text-cream-500">Create an account to begin your mindful journey</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="displayName" className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-1">
            Display Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={`input-field pl-10 ${validationErrors.displayName ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
              placeholder="What should we call you?"
              required
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400 dark:text-cream-500" />
          </div>
          {validationErrors.displayName && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{validationErrors.displayName}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field pl-10 ${validationErrors.email ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
              placeholder="Enter your email"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400 dark:text-cream-500" />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{validationErrors.email}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field pl-10 pr-10 ${validationErrors.password ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
              placeholder="Create a password"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400 dark:text-cream-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth-400 dark:text-cream-500 hover:text-earth-600 dark:hover:text-cream-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{validationErrors.password}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field pl-10 pr-10 ${validationErrors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
              placeholder="Confirm your password"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400 dark:text-cream-500" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth-400 dark:text-cream-500 hover:text-earth-600 dark:hover:text-cream-300"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sage-300 dark:border-deep-500"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-deep-700 text-earth-500 dark:text-cream-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mt-4 w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Sign up with Google</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-earth-500 dark:text-cream-500">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-leaf-600 dark:text-leaf-400 hover:text-leaf-500 dark:hover:text-leaf-300 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;