import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    container: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/60 dark:text-green-100',
    icon: CheckCircle2
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-100',
    icon: XCircle
  },
  warning: {
    container: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-100',
    icon: AlertTriangle
  },
  info: {
    container: 'border-sage-200 bg-sage-50 text-sage-900 dark:border-sage-700 dark:bg-sage-900/60 dark:text-sage-100',
    icon: Info
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 3500, action = null }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, title, message, type, action }]);

    if (duration > 0) {
      window.setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, [dismissToast]);

  const value = useMemo(() => ({ addToast, dismissToast }), [addToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${style.container}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                  {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
                  {toast.action && (
                    <button
                      type="button"
                      onClick={() => {
                        toast.action.callback();
                        dismissToast(toast.id);
                      }}
                      className="mt-2 text-sm font-medium underline hover:opacity-80 transition-opacity"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
