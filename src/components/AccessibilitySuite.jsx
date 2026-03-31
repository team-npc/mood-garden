/**
 * Accessibility Suite
 * Comprehensive accessibility features and preferences
 */

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility,
  Eye,
  Type,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Contrast,
  Move,
  MousePointer,
  Keyboard,
  X,
  Check,
  RotateCcw,
  Zap
} from 'lucide-react';
import { announceToScreenReader, prefersReducedMotion } from '../utils/helpers';

// Accessibility Preferences
const DEFAULT_PREFERENCES = {
  fontSize: 'medium', // small, medium, large, xlarge
  contrast: 'normal', // normal, high
  reduceMotion: false,
  reduceTransparency: false,
  focusIndicators: true,
  screenReaderOptimized: false,
  keyboardNavigation: true,
  largeClickTargets: false,
  textSpacing: 'normal', // normal, wide
  lineHeight: 'normal', // normal, relaxed
  cursorSize: 'normal', // normal, large
  soundEffects: true,
  hapticFeedback: true,
  colorBlindMode: 'none', // none, protanopia, deuteranopia, tritanopia
};

// Font size mappings
const FONT_SIZES = {
  small: {
    base: '14px',
    scale: 0.875,
    label: 'Small',
  },
  medium: {
    base: '16px',
    scale: 1,
    label: 'Medium (Default)',
  },
  large: {
    base: '18px',
    scale: 1.125,
    label: 'Large',
  },
  xlarge: {
    base: '20px',
    scale: 1.25,
    label: 'Extra Large',
  },
};

// Color blind mode filters
const COLOR_BLIND_FILTERS = {
  none: 'none',
  protanopia: 'url(#protanopia)',
  deuteranopia: 'url(#deuteranopia)',
  tritanopia: 'url(#tritanopia)',
};

// Accessibility Context
const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('mood-garden-accessibility');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse accessibility preferences');
      }
    }

    // Detect system preferences
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');

    if (mediaQueryReducedMotion.matches) {
      setPreferences(prev => ({ ...prev, reduceMotion: true }));
    }
    if (mediaQueryHighContrast.matches) {
      setPreferences(prev => ({ ...prev, contrast: 'high' }));
    }

    setIsLoaded(true);
  }, []);

  // Apply preferences to document
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;

    // Font size
    const fontSize = FONT_SIZES[preferences.fontSize];
    root.style.setProperty('--a11y-font-size', fontSize.base);
    root.style.setProperty('--a11y-font-scale', fontSize.scale.toString());

    // Reduce motion
    if (preferences.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // High contrast
    if (preferences.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduce transparency
    if (preferences.reduceTransparency) {
      root.classList.add('reduce-transparency');
    } else {
      root.classList.remove('reduce-transparency');
    }

    // Focus indicators
    if (preferences.focusIndicators) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Large click targets
    if (preferences.largeClickTargets) {
      root.classList.add('large-targets');
    } else {
      root.classList.remove('large-targets');
    }

    // Text spacing
    if (preferences.textSpacing === 'wide') {
      root.style.setProperty('--a11y-letter-spacing', '0.05em');
      root.style.setProperty('--a11y-word-spacing', '0.1em');
    } else {
      root.style.setProperty('--a11y-letter-spacing', 'normal');
      root.style.setProperty('--a11y-word-spacing', 'normal');
    }

    // Line height
    if (preferences.lineHeight === 'relaxed') {
      root.style.setProperty('--a11y-line-height', '1.8');
    } else {
      root.style.setProperty('--a11y-line-height', '1.5');
    }

    // Large cursor
    if (preferences.cursorSize === 'large') {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }

    // Color blind filter
    root.style.setProperty('--a11y-color-filter', COLOR_BLIND_FILTERS[preferences.colorBlindMode]);

    // Save preferences
    localStorage.setItem('mood-garden-accessibility', JSON.stringify(preferences));

  }, [preferences, isLoaded]);

  // Update preference
  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    announceToScreenReader(`${key} set to ${value}`);
  }, []);

  // Reset all preferences
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    announceToScreenReader('Accessibility preferences reset to defaults');
  }, []);

  // Check if motion should be reduced
  const shouldReduceMotion = preferences.reduceMotion || prefersReducedMotion();

  // Get animation props (returns empty object if motion reduced)
  const getAnimationProps = useCallback((props) => {
    if (shouldReduceMotion) {
      return {};
    }
    return props;
  }, [shouldReduceMotion]);

  return (
    <AccessibilityContext.Provider value={{
      preferences,
      updatePreference,
      resetPreferences,
      shouldReduceMotion,
      getAnimationProps,
      isLoaded,
    }}>
      {/* SVG Filters for Color Blindness */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="
              0.567, 0.433, 0,     0, 0
              0.558, 0.442, 0,     0, 0
              0,     0.242, 0.758, 0, 0
              0,     0,     0,     1, 0
            "/>
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="
              0.625, 0.375, 0,   0, 0
              0.7,   0.3,   0,   0, 0
              0,     0.3,   0.7, 0, 0
              0,     0,     0,   1, 0
            "/>
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="
              0.95, 0.05,  0,     0, 0
              0,    0.433, 0.567, 0, 0
              0,    0.475, 0.525, 0, 0
              0,    0,     0,     1, 0
            "/>
          </filter>
        </defs>
      </svg>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label, description }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2
          ${enabled ? 'bg-sage-500' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

// Select Component
const SelectOption = ({ value, selected, onChange, options, label }) => {
  return (
    <div>
      <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${selected === option.value
                ? 'bg-sage-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Accessibility Settings Panel
const AccessibilityPanel = ({ isOpen, onClose }) => {
  const { preferences, updatePreference, resetPreferences } = useAccessibility();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-title"
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 id="a11y-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Accessibility className="w-6 h-6 text-sage-500" />
              Accessibility
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={resetPreferences}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                aria-label="Reset to defaults"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)] space-y-8">
          {/* Vision Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-sage-500" />
              Vision
            </h3>
            
            <div className="space-y-6">
              <SelectOption
                label="Text Size"
                value={preferences.fontSize}
                onChange={(v) => updatePreference('fontSize', v)}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                  { value: 'xlarge', label: 'X-Large' },
                ]}
              />

              <SelectOption
                label="Contrast"
                value={preferences.contrast}
                onChange={(v) => updatePreference('contrast', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'high', label: 'High Contrast' },
                ]}
              />

              <SelectOption
                label="Color Blind Mode"
                value={preferences.colorBlindMode}
                onChange={(v) => updatePreference('colorBlindMode', v)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'protanopia', label: 'Protanopia' },
                  { value: 'deuteranopia', label: 'Deuteranopia' },
                  { value: 'tritanopia', label: 'Tritanopia' },
                ]}
              />

              <ToggleSwitch
                enabled={preferences.reduceTransparency}
                onChange={(v) => updatePreference('reduceTransparency', v)}
                label="Reduce Transparency"
                description="Reduce transparent backgrounds for better readability"
              />
            </div>
          </section>

          {/* Motion Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Move className="w-5 h-5 text-sage-500" />
              Motion
            </h3>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={preferences.reduceMotion}
                onChange={(v) => updatePreference('reduceMotion', v)}
                label="Reduce Motion"
                description="Minimize animations and transitions"
              />
            </div>
          </section>

          {/* Text Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-sage-500" />
              Text & Spacing
            </h3>
            
            <div className="space-y-6">
              <SelectOption
                label="Text Spacing"
                value={preferences.textSpacing}
                onChange={(v) => updatePreference('textSpacing', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'wide', label: 'Wide' },
                ]}
              />

              <SelectOption
                label="Line Height"
                value={preferences.lineHeight}
                onChange={(v) => updatePreference('lineHeight', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'relaxed', label: 'Relaxed' },
                ]}
              />
            </div>
          </section>

          {/* Input Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-sage-500" />
              Input & Navigation
            </h3>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={preferences.focusIndicators}
                onChange={(v) => updatePreference('focusIndicators', v)}
                label="Enhanced Focus Indicators"
                description="Show clear outlines when navigating with keyboard"
              />

              <ToggleSwitch
                enabled={preferences.largeClickTargets}
                onChange={(v) => updatePreference('largeClickTargets', v)}
                label="Large Click Targets"
                description="Increase size of buttons and interactive elements"
              />

              <SelectOption
                label="Cursor Size"
                value={preferences.cursorSize}
                onChange={(v) => updatePreference('cursorSize', v)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            </div>
          </section>

          {/* Audio Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-sage-500" />
              Audio & Feedback
            </h3>
            
            <div className="space-y-4">
              <ToggleSwitch
                enabled={preferences.soundEffects}
                onChange={(v) => updatePreference('soundEffects', v)}
                label="Sound Effects"
                description="Play sounds for actions and notifications"
              />

              <ToggleSwitch
                enabled={preferences.hapticFeedback}
                onChange={(v) => updatePreference('hapticFeedback', v)}
                label="Haptic Feedback"
                description="Vibration feedback on mobile devices"
              />

              <ToggleSwitch
                enabled={preferences.screenReaderOptimized}
                onChange={(v) => updatePreference('screenReaderOptimized', v)}
                label="Screen Reader Optimized"
                description="Enhanced announcements for screen readers"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ♿ These settings are saved locally and will persist across sessions
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Skip to Content Link
export const SkipToContent = ({ targetId = 'main-content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
        focus:px-4 focus:py-2 focus:bg-sage-500 focus:text-white focus:rounded-xl
        focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2
      "
    >
      Skip to main content
    </a>
  );
};

// Accessible Button Component
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled,
  ariaLabel,
  className = '',
  ...props 
}) => {
  const { preferences } = useAccessibility();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${className}
        ${preferences.largeClickTargets ? 'min-h-[48px] min-w-[48px]' : ''}
        focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Live Region for Announcements
export const LiveRegion = ({ children, priority = 'polite' }) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
};

export { AccessibilityPanel, ToggleSwitch, SelectOption };
export default AccessibilityPanel;
