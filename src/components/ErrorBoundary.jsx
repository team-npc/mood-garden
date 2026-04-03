/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */

import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown } from 'lucide-react';
import { GardenLoader } from './LazyLoading';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log error to analytics/monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error)
      this.logError(error, errorInfo);
    }
  }

  logError = (error, errorInfo) => {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
    
    // Store in localStorage for debugging
    const existingLogs = JSON.parse(localStorage.getItem('mood-garden-error-logs') || '[]');
    existingLogs.push(errorLog);
    // Keep only last 10 errors
    if (existingLogs.length > 10) {
      existingLogs.shift();
    }
    localStorage.setItem('mood-garden-error-logs', JSON.stringify(existingLogs));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const subject = encodeURIComponent('Bug Report: Mood Garden Error');
    const body = encodeURIComponent(`
Error: ${this.state.error?.message}
Page: ${window.location.href}
Time: ${new Date().toISOString()}

Please describe what you were doing when the error occurred:

    `);
    window.open(`mailto:support@moodgarden.app?subject=${subject}&body=${body}`);
  };

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { fallback, children, level = 'page' } = this.props;

    if (!hasError) {
      return children;
    }

    // Use custom fallback if provided
    if (fallback) {
      return fallback({ error, reset: () => this.setState({ hasError: false }) });
    }

    // Component-level error (smaller, inline)
    if (level === 'component') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Something went wrong loading this component
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    // Full page error
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-sage-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          {/* Error Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden">
            {/* Header */}
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
              >
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Don't worry, your garden is safe. We just hit a small bump in the road.
              </p>
            </div>

            {/* Actions */}
            <div className="px-8 pb-6 space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </button>
              
              <button
                onClick={this.handleReportBug}
                className="w-full py-3 px-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Bug className="w-5 h-5" />
                Report This Issue
              </button>
            </div>

            {/* Error Details (Collapsible) */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => this.setState({ showDetails: !showDetails })}
                className="w-full px-8 py-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span>Technical Details</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>
              
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-8 pb-6"
                >
                  <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl font-mono text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                    <p className="text-red-500 mb-2">{error?.message}</p>
                    <pre className="whitespace-pre-wrap">
                      {error?.stack?.split('\n').slice(0, 5).join('\n')}
                    </pre>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Encouraging message */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            🌱 Your plant is still growing while we fix this!
          </p>
        </motion.div>
      </div>
    );
  }
}

// Functional wrapper for use with Suspense
export const withErrorBoundary = (Component, fallback) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Async Error Boundary for Suspense
export const AsyncBoundary = ({ children, fallback, loading }) => {
  return (
    <ErrorBoundary fallback={fallback}>
      <React.Suspense fallback={loading || <LoadingFallback />}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
};

// Loading Fallback Component
const LoadingFallback = () => {
  return <GardenLoader message="Loading..." size="small" />;
};

export default ErrorBoundary;
