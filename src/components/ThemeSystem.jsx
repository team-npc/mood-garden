/**
 * Custom Themes System
 * Theme selection, preview, and custom color picker
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Check, 
  Lock, 
  Sparkles,
  Moon,
  Sun,
  Eye,
  X,
  Sliders
} from 'lucide-react';

// Predefined theme packs
const THEME_PACKS = {
  default: {
    id: 'default',
    name: 'Garden Classic',
    description: 'The original Mood Garden experience',
    icon: '🌿',
    unlocked: true,
    colors: {
      primary: '#68a67d',
      secondary: '#8b7355',
      accent: '#d4af37',
      background: '#f8faf7',
      surface: '#ffffff',
      text: '#2d3e2f'
    },
    dark: {
      background: '#1a1f1a',
      surface: '#242924',
      text: '#e8ebe8'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Calming blues and teals',
    icon: '🌊',
    unlocked: true,
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#38bdf8',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e'
    },
    dark: {
      background: '#0c1929',
      surface: '#0f2942',
      text: '#e0f2fe'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Warm oranges and pinks',
    icon: '🌅',
    unlocked: true,
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#fbbf24',
      background: '#fffbeb',
      surface: '#ffffff',
      text: '#7c2d12'
    },
    dark: {
      background: '#1c1410',
      surface: '#2a1f18',
      text: '#fef3c7'
    }
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Fields',
    description: 'Soft purples and lilacs',
    icon: '💜',
    unlocked: true,
    colors: {
      primary: '#a855f7',
      secondary: '#c084fc',
      accent: '#e879f9',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#581c87'
    },
    dark: {
      background: '#1a0f29',
      surface: '#261439',
      text: '#f3e8ff'
    }
  },
  forest: {
    id: 'forest',
    name: 'Deep Forest',
    description: 'Rich greens and earth tones',
    icon: '🌲',
    unlocked: false,
    unlockRequirement: 'Grow a flourishing garden',
    colors: {
      primary: '#15803d',
      secondary: '#166534',
      accent: '#84cc16',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#14532d'
    },
    dark: {
      background: '#0a1f0d',
      surface: '#112912',
      text: '#dcfce7'
    }
  },
  cherry: {
    id: 'cherry',
    name: 'Cherry Blossom',
    description: 'Delicate pinks and whites',
    icon: '🌸',
    unlocked: false,
    unlockRequirement: 'Reach blooming stage',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fda4af',
      background: '#fdf2f8',
      surface: '#ffffff',
      text: '#831843'
    },
    dark: {
      background: '#1f0a14',
      surface: '#2a1019',
      text: '#fce7f3'
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Cosmos',
    description: 'Deep blues with star accents',
    icon: '🌌',
    unlocked: false,
    unlockRequirement: 'Write at night 10 times',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#a5b4fc',
      background: '#eef2ff',
      surface: '#ffffff',
      text: '#1e3a8a'
    },
    dark: {
      background: '#0a0e1f',
      surface: '#111827',
      text: '#e0e7ff'
    }
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn Harvest',
    description: 'Warm reds and golden browns',
    icon: '🍂',
    unlocked: false,
    unlockRequirement: 'Write during autumn',
    colors: {
      primary: '#dc2626',
      secondary: '#ea580c',
      accent: '#fbbf24',
      background: '#fef9e7',
      surface: '#ffffff',
      text: '#7c2d12'
    },
    dark: {
      background: '#1c1008',
      surface: '#2a1a0e',
      text: '#fef3c7'
    }
  },
  rose: {
    id: 'rose',
    name: 'Rose Gold',
    description: 'Elegant rose and gold accents',
    icon: '🌹',
    unlocked: false,
    unlockRequirement: 'Get 10 achievements',
    colors: {
      primary: '#be185d',
      secondary: '#db2777',
      accent: '#d4af37',
      background: '#fff1f2',
      surface: '#ffffff',
      text: '#881337'
    },
    dark: {
      background: '#1f0a12',
      surface: '#2a1019',
      text: '#ffe4e6'
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Clean black and white',
    icon: '⚪',
    unlocked: true,
    colors: {
      primary: '#525252',
      secondary: '#737373',
      accent: '#a3a3a3',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#171717'
    },
    dark: {
      background: '#0a0a0a',
      surface: '#171717',
      text: '#f5f5f5'
    }
  }
};

// Theme Context
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customColors, setCustomColors] = useState(null);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('mood-garden-theme');
    const savedDarkMode = localStorage.getItem('mood-garden-dark-mode');
    const savedCustomColors = localStorage.getItem('mood-garden-custom-colors');
    
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedDarkMode) setIsDarkMode(savedDarkMode === 'true');
    if (savedCustomColors) setCustomColors(JSON.parse(savedCustomColors));
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = THEME_PACKS[currentTheme] || THEME_PACKS.default;
    const colors = customColors || theme.colors;
    const darkColors = theme.dark;
    
    const root = document.documentElement;
    
    // Set CSS variables
    if (isDarkMode) {
      root.style.setProperty('--color-background', darkColors.background);
      root.style.setProperty('--color-surface', darkColors.surface);
      root.style.setProperty('--color-text', darkColors.text);
    } else {
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--color-surface', colors.surface);
      root.style.setProperty('--color-text', colors.text);
    }
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    
    // Save to localStorage
    localStorage.setItem('mood-garden-theme', currentTheme);
    localStorage.setItem('mood-garden-dark-mode', isDarkMode.toString());
    if (customColors) {
      localStorage.setItem('mood-garden-custom-colors', JSON.stringify(customColors));
    }
  }, [currentTheme, isDarkMode, customColors]);

  const selectTheme = (themeId) => {
    const theme = THEME_PACKS[themeId];
    if (theme && theme.unlocked) {
      setCurrentTheme(themeId);
      setCustomColors(null);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const setCustomThemeColors = (colors) => {
    setCustomColors(colors);
  };

  const resetToDefault = () => {
    setCurrentTheme('default');
    setCustomColors(null);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      isDarkMode,
      customColors,
      themes: THEME_PACKS,
      selectTheme,
      toggleDarkMode,
      setCustomThemeColors,
      resetToDefault
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Card Component
const ThemeCard = ({ theme, isSelected, onSelect }) => {
  const colors = theme.colors;

  return (
    <motion.button
      whileHover={{ scale: theme.unlocked ? 1.03 : 1 }}
      whileTap={{ scale: theme.unlocked ? 0.98 : 1 }}
      onClick={() => theme.unlocked && onSelect(theme.id)}
      className={`
        relative p-4 rounded-2xl border-2 transition-all text-left w-full
        ${isSelected 
          ? 'border-sage-500 shadow-lg shadow-sage-200 dark:shadow-sage-900/30' 
          : 'border-gray-200 dark:border-gray-700'
        }
        ${theme.unlocked 
          ? 'cursor-pointer hover:border-sage-300' 
          : 'cursor-not-allowed opacity-60'
        }
        bg-white dark:bg-gray-800
      `}
    >
      {/* Color Preview */}
      <div className="flex gap-1 mb-3">
        <div 
          className="w-8 h-8 rounded-lg" 
          style={{ backgroundColor: colors.primary }}
        />
        <div 
          className="w-8 h-8 rounded-lg" 
          style={{ backgroundColor: colors.secondary }}
        />
        <div 
          className="w-8 h-8 rounded-lg" 
          style={{ backgroundColor: colors.accent }}
        />
        <div 
          className="w-8 h-8 rounded-lg border border-gray-200" 
          style={{ backgroundColor: colors.background }}
        />
      </div>

      {/* Theme Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{theme.icon}</span>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {theme.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {theme.description}
          </p>
        </div>
        
        {isSelected && theme.unlocked && (
          <div className="p-1 bg-sage-500 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Locked Overlay */}
      {!theme.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl">
          <div className="text-center">
            <Lock className="w-6 h-6 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">{theme.unlockRequirement}</p>
          </div>
        </div>
      )}
    </motion.button>
  );
};

// Theme Preview Component
const ThemePreview = ({ theme, isDark }) => {
  const colors = isDark ? { ...theme.colors, ...theme.dark } : theme.colors;

  return (
    <div 
      className="rounded-2xl p-4 space-y-3"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div 
        className="h-3 w-20 rounded"
        style={{ backgroundColor: colors.primary }}
      />
      
      {/* Card */}
      <div 
        className="rounded-xl p-3 space-y-2"
        style={{ backgroundColor: colors.surface }}
      >
        <div 
          className="h-2 w-16 rounded"
          style={{ backgroundColor: colors.text, opacity: 0.7 }}
        />
        <div 
          className="h-2 w-24 rounded"
          style={{ backgroundColor: colors.text, opacity: 0.4 }}
        />
      </div>

      {/* Button */}
      <div 
        className="h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <div 
          className="h-2 w-12 rounded"
          style={{ backgroundColor: '#ffffff' }}
        />
      </div>
    </div>
  );
};

// Custom Color Picker
const ColorPicker = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase"
        />
      </div>
    </div>
  );
};

// Theme Selector Modal
const ThemeSelector = ({ isOpen, onClose }) => {
  const { 
    currentTheme, 
    isDarkMode, 
    themes, 
    selectTheme, 
    toggleDarkMode,
    setCustomThemeColors,
    resetToDefault
  } = useTheme();

  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#68a67d',
    secondary: '#8b7355',
    accent: '#d4af37',
    background: '#f8faf7',
    surface: '#ffffff',
    text: '#2d3e2f'
  });

  const handleApplyCustom = () => {
    setCustomThemeColors(customColors);
    setShowCustomizer(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Palette className="w-6 h-6 text-sage-500" />
              Themes
            </h2>
            
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
          <AnimatePresence mode="wait">
            {showCustomizer ? (
              <motion.div
                key="customizer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Custom Colors
                  </h3>
                  <button
                    onClick={() => setShowCustomizer(false)}
                    className="text-sm text-sage-600 hover:text-sage-700"
                  >
                    ← Back to themes
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Color Pickers */}
                  <div className="space-y-4">
                    <ColorPicker
                      label="Primary Color"
                      value={customColors.primary}
                      onChange={(v) => setCustomColors({ ...customColors, primary: v })}
                    />
                    <ColorPicker
                      label="Secondary Color"
                      value={customColors.secondary}
                      onChange={(v) => setCustomColors({ ...customColors, secondary: v })}
                    />
                    <ColorPicker
                      label="Accent Color"
                      value={customColors.accent}
                      onChange={(v) => setCustomColors({ ...customColors, accent: v })}
                    />
                    <ColorPicker
                      label="Background"
                      value={customColors.background}
                      onChange={(v) => setCustomColors({ ...customColors, background: v })}
                    />
                    <ColorPicker
                      label="Surface"
                      value={customColors.surface}
                      onChange={(v) => setCustomColors({ ...customColors, surface: v })}
                    />
                    <ColorPicker
                      label="Text"
                      value={customColors.text}
                      onChange={(v) => setCustomColors({ ...customColors, text: v })}
                    />
                  </div>

                  {/* Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Preview
                    </h4>
                    <ThemePreview 
                      theme={{ colors: customColors, dark: customColors }}
                      isDark={isDarkMode}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={resetToDefault}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    Reset to Default
                  </button>
                  <button
                    onClick={handleApplyCustom}
                    className="px-4 py-2 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors"
                  >
                    Apply Custom Theme
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="themes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Custom Theme Button */}
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-sage-400 dark:hover:border-sage-500 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400"
                >
                  <Sliders className="w-5 h-5" />
                  <span>Create Custom Theme</span>
                </button>

                {/* Theme Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.values(themes).map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      isSelected={currentTheme === theme.id}
                      onSelect={selectTheme}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { THEME_PACKS, ThemeCard, ThemePreview, ThemeSelector };
export default ThemeSelector;
