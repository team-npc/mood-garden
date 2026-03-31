/**
 * Premium Toast Notification System
 * Beautiful, animated toast notifications
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  X,
  Sparkles,
  Heart,
  Leaf
} from 'lucide-react';

const ToastContext = createContext(null);

// Toast configurations
const TOAST_CONFIGS = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    borderColor: 'border-green-200 dark:border-green-800',
    progressColor: 'bg-green-500'
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    progressColor: 'bg-red-500'
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    progressColor: 'bg-yellow-500'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    progressColor: 'bg-blue-500'
  },
  achievement: {
    icon: Sparkles,
    iconColor: 'text-gold-500',
    bgColor: 'bg-gradient-to-r from-gold-50 to-amber-50 dark:from-gold-900/30 dark:to-amber-900/30',
    borderColor: 'border-gold-300 dark:border-gold-700',
    progressColor: 'bg-gold-500'
  },
  plant: {
    icon: Leaf,
    iconColor: 'text-sage-500',
    bgColor: 'bg-gradient-to-r from-sage-50 to-green-50 dark:from-sage-900/30 dark:to-green-900/30',
    borderColor: 'border-sage-200 dark:border-sage-800',
    progressColor: 'bg-sage-500'
  },
  love: {
    icon: Heart,
    iconColor: 'text-rose-500',
    bgColor: 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30',
    borderColor: 'border-rose-200 dark:border-rose-800',
    progressColor: 'bg-rose-500'
  }
};

// Single Toast Component
const Toast = ({ toast, onRemove }) => {
  const config = TOAST_CONFIGS[toast.type] || TOAST_CONFIGS.info;
  const Icon = config.icon;
  const duration = toast.duration || 5000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className={`
        relative w-full max-w-sm overflow-hidden rounded-2xl border shadow-luxury
        backdrop-blur-xl
        ${config.bgColor} ${config.borderColor}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 p-1 ${config.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {toast.title}
              </h4>
            )}
            {toast.message && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {toast.message}
              </p>
            )}
            
            {/* Action Button */}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-sm font-medium text-sage-600 hover:text-sage-700 dark:text-sage-400"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${config.progressColor}`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        onAnimationComplete={() => onRemove(toast.id)}
      />
    </motion.div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast = {
      id,
      type: 'info',
      duration: 5000,
      ...options
    };

    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((title, message, options = {}) => {
    return addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const error = useCallback((title, message, options = {}) => {
    return addToast({ type: 'error', title, message, ...options });
  }, [addToast]);

  const warning = useCallback((title, message, options = {}) => {
    return addToast({ type: 'warning', title, message, ...options });
  }, [addToast]);

  const info = useCallback((title, message, options = {}) => {
    return addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  const achievement = useCallback((title, message, options = {}) => {
    return addToast({ type: 'achievement', title, message, duration: 8000, ...options });
  }, [addToast]);

  const plant = useCallback((title, message, options = {}) => {
    return addToast({ type: 'plant', title, message, ...options });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      clearToasts,
      success,
      error,
      warning,
      info,
      achievement,
      plant
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
