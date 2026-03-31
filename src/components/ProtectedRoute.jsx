/**
 * Protected Route Component
 * Redirects unauthenticated users to the login page
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GardenLoader } from './LazyLoading';

/**
 * ProtectedRoute wrapper component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to protect
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <GardenLoader message="Loading your garden..." size="large" fullScreen={true} />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;