/**
 * Authentication Context Provider
 * Manages user authentication state and provides auth methods to components
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  registerWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  logout as firebaseLogout 
} from '../firebase/auth';

// Create the authentication context
const AuthContext = createContext();

/**
 * Custom hook to use the auth context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * Register a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} displayName - User's display name
   */
  const register = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      await registerWithEmail(email, password, displayName);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmail(email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in user with Google
   */
  const signInGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const logout = async () => {
    try {
      setError(null);
      await firebaseLogout();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  /**
   * Clear any authentication errors
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    signIn,
    signInGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};