/**
 * Lazy Loading Configuration
 * Code splitting and lazy loading for production performance
 */

import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

// Garden Loading Spinner - Consistent leaf animation used throughout the app
export const GardenLoader = ({ message = 'Loading your garden...', size = 'medium', fullScreen = false }) => {
  const sizes = {
    small: { icon: 'w-8 h-8', text: 'text-sm' },
    medium: { icon: 'w-16 h-16', text: 'text-base' },
    large: { icon: 'w-20 h-20', text: 'text-lg' },
  };

  const content = (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`${sizes[size].icon} mx-auto mb-4`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Leaf className="w-full h-full text-leaf-600 dark:text-leaf-400" />
      </motion.div>
      {message && (
        <p className={`text-earth-600 dark:text-cream-400 ${sizes[size].text}`}>
          {message}
        </p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50 dark:from-deep-900 dark:to-deep-800 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

// Inline loader for small components
export const InlineLoader = ({ message }) => (
  <div className="flex items-center justify-center gap-3 py-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <Leaf className="w-5 h-5 text-leaf-500" />
    </motion.div>
    {message && (
      <span className="text-sm text-earth-600 dark:text-cream-400">{message}</span>
    )}
  </div>
);

// Legacy exports for backward compatibility
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} ${className}`}
    >
      <Leaf className="w-full h-full text-leaf-500" />
    </motion.div>
  );
};

// Full Page Loading Component
export const PageLoader = ({ message = 'Loading your garden...' }) => (
  <GardenLoader message={message} size="large" fullScreen={true} />
);

// Component Loading Skeleton
export const ComponentLoader = ({ height = '200px', message = 'Loading...' }) => (
  <div 
    className="flex items-center justify-center"
    style={{ minHeight: height }}
  >
    <GardenLoader message={message} size="small" />
  </div>
);

// Card Skeleton
export const CardSkeleton = () => (
  <div className="bg-white dark:bg-deep-800 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-sage-200 dark:bg-deep-700 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-sage-200 dark:bg-deep-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-sage-200 dark:bg-deep-700 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-sage-200 dark:bg-deep-700 rounded" />
      <div className="h-3 bg-sage-200 dark:bg-deep-700 rounded w-5/6" />
      <div className="h-3 bg-sage-200 dark:bg-deep-700 rounded w-4/6" />
    </div>
  </div>
);

// Lazy load wrapper with retry logic
const lazyWithRetry = (importFn, retries = 3, delay = 1000) => {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attempt = (attemptsLeft) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (attemptsLeft <= 1) {
              reject(error);
              return;
            }
            setTimeout(() => attempt(attemptsLeft - 1), delay);
          });
      };
      attempt(retries);
    });
  });
};

// Preload function for routes
export const preloadComponent = (importFn) => {
  importFn();
};

// Lazy loaded page components with retry logic
export const LazyPages = {
  // Main Pages
  WelcomePage: lazyWithRetry(() => import('../pages/WelcomePage')),
  GardenPage: lazyWithRetry(() => import('../pages/GardenPage')),
  JournalPage: lazyWithRetry(() => import('../pages/JournalPage')),
};

// Lazy loaded feature components
export const LazyComponents = {
  AmbientSoundscape: lazyWithRetry(() => import('./AmbientSoundscape')),
  ParticleSystem: lazyWithRetry(() => import('./ParticleSystem')),
  AchievementSystem: lazyWithRetry(() => import('./AchievementSystem')),
  PlantSpecies: lazyWithRetry(() => import('./PlantSpecies')),
  PhotoJournaling: lazyWithRetry(() => import('./PhotoJournaling')),
  MoodTimeline: lazyWithRetry(() => import('./MoodTimeline')),
  FocusMode: lazyWithRetry(() => import('./FocusMode')),
  ThemeSystem: lazyWithRetry(() => import('./ThemeSystem')),
  WeatherIntegration: lazyWithRetry(() => import('./WeatherIntegration')),
  DailyChallenges: lazyWithRetry(() => import('./DailyChallenges')),
  VoiceJournaling: lazyWithRetry(() => import('./VoiceJournaling')),
  DrawingCanvas: lazyWithRetry(() => import('./DrawingCanvas')),
  SeasonalEvents: lazyWithRetry(() => import('./SeasonalEvents')),
  WidgetDashboard: lazyWithRetry(() => import('./WidgetDashboard')),
  AccessibilityPanel: lazyWithRetry(() => import('./AccessibilitySuite').then(m => ({ default: m.AccessibilityPanel }))),
  PlantCustomizationStudio: lazyWithRetry(() => import('./PlantCustomizationStudio')),
  MentalHealthResources: lazyWithRetry(() => import('./MentalHealthResources')),
};

// Suspense wrapper component
export const SuspenseWrapper = ({ 
  children, 
  fallback, 
  type = 'component' 
}) => {
  const defaultFallback = type === 'page' 
    ? <PageLoader /> 
    : <ComponentLoader />;

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

// Create lazy component with fallback
export const createLazyComponent = (importFn, fallback = null) => {
  const LazyComponent = lazyWithRetry(importFn);
  
  return (props) => (
    <Suspense fallback={fallback || <ComponentLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Route-based code splitting configuration
export const routeConfig = [
  {
    path: '/',
    component: LazyPages.WelcomePage,
    preload: () => preloadComponent(() => import('../pages/WelcomePage')),
  },
  {
    path: '/garden',
    component: LazyPages.GardenPage,
    preload: () => preloadComponent(() => import('../pages/GardenPage')),
  },
  {
    path: '/journal',
    component: LazyPages.JournalPage,
    preload: () => preloadComponent(() => import('../pages/JournalPage')),
  },
];

// Preload on hover/focus for instant navigation
export const useRoutePreload = () => {
  const preloadRoute = (path) => {
    const route = routeConfig.find(r => r.path === path);
    if (route?.preload) {
      route.preload();
    }
  };

  return { preloadRoute };
};

// Intersection Observer for lazy loading below-fold components
export const useLazyLoad = (ref, options = {}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      rootMargin: '100px',
      ...options
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
};

// Lazy image component
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderColor = '#e5e7eb',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
        />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-sage-100 dark:bg-deep-800">
          <span className="text-earth-400 dark:text-cream-500 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
};

export default {
  GardenLoader,
  InlineLoader,
  LazyPages,
  LazyComponents,
  SuspenseWrapper,
  PageLoader,
  ComponentLoader,
  CardSkeleton,
  createLazyComponent,
  useRoutePreload,
  useLazyLoad,
  LazyImage,
};
