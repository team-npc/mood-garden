/**
 * Application Configuration
 * Centralized configuration for scalability and environment management
 */

// Environment detection
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// Feature flags for gradual rollouts
export const FEATURES = {
  voiceJournaling: true,
  drawingCanvas: true,
  aiWritingCoach: true,
  anonymousGallery: true,
  seasonalEvents: true,
  hapticFeedback: true,
  offlineMode: true,
  analytics: ENV.isProduction,
  debugMode: ENV.isDevelopment,
};

// API endpoints
export const API = {
  weather: 'https://api.open-meteo.com/v1/forecast',
};

// App constants
export const APP_CONFIG = {
  name: 'Mood Garden',
  version: '2.0.0',
  description: 'A mindful journaling app that grows with you',
  
  plant: {
    maxHealth: 100,
    healthDecayRate: 5,
    healthRecoveryRate: 15,
    streakBonus: 5,
    stages: ['seed', 'sprout', 'plant', 'blooming', 'tree', 'fruitingTree'],
    daysPerStage: [0, 3, 7, 14, 30, 60],
  },
  
  journal: {
    maxEntryLength: 50000,
    minEntryLength: 1,
    autoSaveInterval: 30000,
    maxPhotosPerEntry: 10,
    maxPhotoSize: 5 * 1024 * 1024,
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  achievements: {
    streakMilestones: [3, 7, 14, 30, 60, 100, 365],
    entryMilestones: [1, 5, 10, 25, 50, 100, 500, 1000],
    wordMilestones: [100, 500, 1000, 5000, 10000, 50000],
  },
  
  ui: {
    toastDuration: 5000,
    animationDuration: 300,
    debounceDelay: 300,
    maxRecentMoods: 10,
    particleDensity: { low: 10, medium: 25, high: 50 },
  },
  
  storage: {
    theme: 'mood-garden-theme',
    darkMode: 'mood-garden-dark-mode',
    soundPrefs: 'mood-garden-sound-prefs',
    achievements: 'mood-garden-achievements',
    plantSpecies: 'mood-garden-plant-species',
    challenges: 'mood-garden-challenges',
    weather: 'mood-garden-weather',
    offlineQueue: 'mood-garden-offline-queue',
    userPrefs: 'mood-garden-user-prefs',
  },
  
  cache: {
    weatherTTL: 30 * 60 * 1000,
    entriesTTL: 5 * 60 * 1000,
    achievementsTTL: 60 * 60 * 1000,
  },
};

// Accessibility settings
export const A11Y_CONFIG = {
  reducedMotion: typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false,
  highContrast: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-contrast: high)').matches
    : false,
  focusVisible: true,
  screenReaderAnnouncements: true,
};

// Performance settings
export const PERF_CONFIG = {
  lazyLoadThreshold: 0.1,
  imageQuality: 0.8,
  maxConcurrentRequests: 6,
  virtualListOverscan: 5,
  debounceMs: 150,
  throttleMs: 100,
};

export default APP_CONFIG;
