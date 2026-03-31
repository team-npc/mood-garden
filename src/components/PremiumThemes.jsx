/**
 * Premium Themes System - Beautiful theme gallery and custom theme builder
 * 10+ pre-built themes with custom theme creation
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Palette,
  Sun,
  Moon,
  Droplet,
  Sparkles,
  Heart,
  Leaf,
  Mountain,
  Cloud,
  Star,
  Zap,
  Check,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

/**
 * Premium Theme Presets
 */
const PREMIUM_THEMES = [
  {
    id: 'forest-grove',
    name: 'Forest Grove',
    description: 'Deep forest greens with natural accents',
    icon: '🌲',
    category: 'nature',
    isPremium: false,
    colors: {
      background: '#0d1a0f',
      surface: '#162419',
      surfaceLight: '#1a2e1f',
      primary: '#4caf50',
      secondary: '#81c784',
      accent: '#5a7a2a',
      text: '#e8f0e9',
      textMuted: '#a5d6a7'
    }
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Calming blues inspired by the sea',
    icon: '🌊',
    category: 'nature',
    isPremium: true,
    colors: {
      background: '#0a1929',
      surface: '#0d2137',
      surfaceLight: '#153047',
      primary: '#2196f3',
      secondary: '#64b5f6',
      accent: '#00acc1',
      text: '#e3f2fd',
      textMuted: '#90caf9'
    }
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    description: 'Warm oranges and terracotta tones',
    icon: '🌅',
    category: 'warm',
    isPremium: true,
    colors: {
      background: '#1a0f0a',
      surface: '#2d1810',
      surfaceLight: '#3d2415',
      primary: '#ff9800',
      secondary: '#ffb74d',
      accent: '#f57c00',
      text: '#fff3e0',
      textMuted: '#ffcc80'
    }
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    description: 'Cool whites and icy blues',
    icon: '❄️',
    category: 'cool',
    isPremium: true,
    colors: {
      background: '#0f1419',
      surface: '#1a2229',
      surfaceLight: '#242d35',
      primary: '#80deea',
      secondary: '#b2ebf2',
      accent: '#26c6da',
      text: '#e0f7fa',
      textMuted: '#b2dfdb'
    }
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    description: 'Soft pinks and spring florals',
    icon: '🌸',
    category: 'warm',
    isPremium: true,
    colors: {
      background: '#1a0f14',
      surface: '#2d1a24',
      surfaceLight: '#3d2430',
      primary: '#e91e63',
      secondary: '#f48fb1',
      accent: '#c2185b',
      text: '#fce4ec',
      textMuted: '#f8bbd0'
    }
  },
  {
    id: 'midnight-garden',
    name: 'Midnight Garden',
    description: 'Deep purples with mystical vibes',
    icon: '🌙',
    category: 'dark',
    isPremium: true,
    colors: {
      background: '#0f0a14',
      surface: '#1a1024',
      surfaceLight: '#241830',
      primary: '#9c27b0',
      secondary: '#ba68c8',
      accent: '#7b1fa2',
      text: '#f3e5f5',
      textMuted: '#ce93d8'
    }
  },
  {
    id: 'autumn-harvest',
    name: 'Autumn Harvest',
    description: 'Rich browns and golden yellows',
    icon: '🍂',
    category: 'warm',
    isPremium: true,
    colors: {
      background: '#1a1410',
      surface: '#2d2418',
      surfaceLight: '#3d3020',
      primary: '#ff9800',
      secondary: '#ffb74d',
      accent: '#f57c00',
      text: '#fff8e1',
      textMuted: '#ffe0b2'
    }
  },
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    description: 'Vibrant greens and turquoise',
    icon: '🏝️',
    category: 'nature',
    isPremium: true,
    colors: {
      background: '#0a1a14',
      surface: '#0f2d1f',
      surfaceLight: '#15382a',
      primary: '#00bfa5',
      secondary: '#26a69a',
      accent: '#009688',
      text: '#e0f2f1',
      textMuted: '#80cbc4'
    }
  },
  {
    id: 'misty-mountains',
    name: 'Misty Mountains',
    description: 'Cool grays with mountain mist',
    icon: '⛰️',
    category: 'cool',
    isPremium: true,
    colors: {
      background: '#141419',
      surface: '#1f2024',
      surfaceLight: '#2a2d32',
      primary: '#607d8b',
      secondary: '#90a4ae',
      accent: '#546e7a',
      text: '#eceff1',
      textMuted: '#b0bec5'
    }
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    description: 'Deep navy with golden stars',
    icon: '🌌',
    category: 'dark',
    isPremium: true,
    colors: {
      background: '#0a0e1a',
      surface: '#0f1524',
      surfaceLight: '#15202e',
      primary: '#ffd700',
      secondary: '#ffeb3b',
      accent: '#ffc107',
      text: '#fffde7',
      textMuted: '#fff9c4'
    }
  }
];

/**
 * Theme Preview Card
 */
const ThemePreviewCard = ({ theme, isActive, onSelect, onPreview }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
        isActive
          ? 'border-sage-500 ring-2 ring-sage-500'
          : 'border-deep-600 hover:border-deep-500'
      }`}
      onClick={() => onSelect(theme)}
    >
      {/* Theme Preview */}
      <div
        className="h-32 p-4 flex flex-col justify-between"
        style={{ background: theme.colors.background }}
      >
        <div className="flex items-center justify-between">
          <div className="text-3xl">{theme.icon}</div>
          {isActive && (
            <div className="p-1.5 bg-sage-500 rounded-full">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          {theme.isPremium && (
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          )}
        </div>
        
        {/* Color Swatches */}
        <div className="flex gap-1">
          <div
            className="w-6 h-6 rounded-full border-2"
            style={{
              background: theme.colors.primary,
              borderColor: theme.colors.background
            }}
          />
          <div
            className="w-6 h-6 rounded-full border-2"
            style={{
              background: theme.colors.secondary,
              borderColor: theme.colors.background
            }}
          />
          <div
            className="w-6 h-6 rounded-full border-2"
            style={{
              background: theme.colors.accent,
              borderColor: theme.colors.background
            }}
          />
        </div>
      </div>
      
      {/* Theme Info */}
      <div className="bg-deep-700/50 p-3 border-t border-deep-600">
        <h3 className="text-cream-200 font-medium text-sm mb-1">{theme.name}</h3>
        <p className="text-cream-600 text-xs">{theme.description}</p>
      </div>
      
      {/* Preview Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPreview(theme);
        }}
        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Sparkles className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

/**
 * Custom Theme Builder
 */
const CustomThemeBuilder = ({ initialTheme, onSave, onCancel }) => {
  const [customTheme, setCustomTheme] = useState(
    initialTheme || {
      name: 'My Custom Theme',
      colors: {
        background: '#0d1a0f',
        surface: '#162419',
        surfaceLight: '#1a2e1f',
        primary: '#4caf50',
        secondary: '#81c784',
        accent: '#5a7a2a',
        text: '#e8f0e9',
        textMuted: '#a5d6a7'
      }
    }
  );
  
  const updateColor = (key, value) => {
    setCustomTheme({
      ...customTheme,
      colors: { ...customTheme.colors, [key]: value }
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Theme Name */}
      <div>
        <label className="block text-sm text-cream-400 mb-2">Theme Name</label>
        <input
          type="text"
          value={customTheme.name}
          onChange={(e) => setCustomTheme({ ...customTheme, name: e.target.value })}
          className="w-full bg-deep-700 border border-deep-600 rounded-lg px-3 py-2 text-cream-200 outline-none focus:border-sage-500"
        />
      </div>
      
      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'background', label: 'Background', icon: Cloud },
          { key: 'surface', label: 'Surface', icon: Droplet },
          { key: 'surfaceLight', label: 'Surface Light', icon: Sun },
          { key: 'primary', label: 'Primary', icon: Star },
          { key: 'secondary', label: 'Secondary', icon: Heart },
          { key: 'accent', label: 'Accent', icon: Zap },
          { key: 'text', label: 'Text', icon: Sparkles },
          { key: 'textMuted', label: 'Text Muted', icon: Moon }
        ].map((color) => (
          <div key={color.key}>
            <label className="flex items-center gap-2 text-sm text-cream-400 mb-2">
              <color.icon className="w-3.5 h-3.5" />
              {color.label}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.colors[color.key]}
                onChange={(e) => updateColor(color.key, e.target.value)}
                className="w-12 h-10 rounded-lg cursor-pointer border-2 border-deep-600"
              />
              <input
                type="text"
                value={customTheme.colors[color.key]}
                onChange={(e) => updateColor(color.key, e.target.value)}
                className="flex-1 bg-deep-700 border border-deep-600 rounded-lg px-3 py-2 text-cream-200 text-sm outline-none focus:border-sage-500"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Preview */}
      <div>
        <label className="block text-sm text-cream-400 mb-2">Preview</label>
        <div
          className="rounded-xl p-6 border-2"
          style={{
            background: customTheme.colors.background,
            borderColor: customTheme.colors.surface
          }}
        >
          <div
            className="rounded-lg p-4 mb-3"
            style={{ background: customTheme.colors.surface }}
          >
            <h3
              className="font-medium mb-2"
              style={{ color: customTheme.colors.text }}
            >
              Preview Text
            </h3>
            <p style={{ color: customTheme.colors.textMuted }}>
              This is how your theme will look
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg"
              style={{ background: customTheme.colors.primary, color: '#fff' }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg"
              style={{ background: customTheme.colors.secondary, color: '#fff' }}
            >
              Secondary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg"
              style={{ background: customTheme.colors.accent, color: '#fff' }}
            >
              Accent Button
            </button>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 bg-deep-700 hover:bg-deep-600 text-cream-300 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(customTheme)}
          className="flex-1 py-2.5 bg-gradient-to-r from-sage-600 to-leaf-600 hover:from-sage-500 hover:to-leaf-500 text-white rounded-lg transition-all"
        >
          Save Theme
        </button>
      </div>
    </div>
  );
};

/**
 * Main Premium Themes Component
 */
const PremiumThemes = ({ isOpen, onClose, onApplyTheme }) => {
  const [activeTheme, setActiveTheme] = useState('forest-grove');
  const [view, setView] = useState('gallery'); // 'gallery' or 'builder'
  const [filterCategory, setFilterCategory] = useState('all');
  const [customThemes, setCustomThemes] = useState([]);
  
  useEffect(() => {
    // Load active theme and custom themes from localStorage
    const saved = localStorage.getItem('activeTheme');
    if (saved) setActiveTheme(saved);
    
    const savedCustom = localStorage.getItem('customThemes');
    if (savedCustom) setCustomThemes(JSON.parse(savedCustom));
  }, []);
  
  const handleSelectTheme = (theme) => {
    setActiveTheme(theme.id);
    localStorage.setItem('activeTheme', theme.id);
    onApplyTheme?.(theme);
  };
  
  const handleSaveCustomTheme = (theme) => {
    const newTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      category: 'custom',
      isPremium: false,
      icon: '🎨'
    };
    const updated = [...customThemes, newTheme];
    setCustomThemes(updated);
    localStorage.setItem('customThemes', JSON.stringify(updated));
    setView('gallery');
  };
  
  const handleExportTheme = (theme) => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${theme.id}-theme.json`;
    link.click();
  };
  
  if (!isOpen) return null;
  
  const allThemes = [...PREMIUM_THEMES, ...customThemes];
  const filteredThemes = filterCategory === 'all'
    ? allThemes
    : allThemes.filter(t => t.category === filterCategory);
  
  const categories = [
    { id: 'all', label: 'All Themes', icon: Sparkles },
    { id: 'nature', label: 'Nature', icon: Leaf },
    { id: 'warm', label: 'Warm', icon: Sun },
    { id: 'cool', label: 'Cool', icon: Droplet },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'custom', label: 'Custom', icon: Palette }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-deep-800 rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Premium Themes</h2>
                <p className="text-sm text-purple-200">Personalize your garden experience</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('builder')}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Create Custom
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {view === 'gallery' ? (
            <>
              {/* Sidebar Categories */}
              <div className="w-48 bg-deep-900 border-r border-deep-700 p-4">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        filterCategory === cat.id
                          ? 'bg-sage-500/20 text-sage-400'
                          : 'text-cream-500 hover:text-cream-300 hover:bg-deep-700/30'
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Theme Gallery */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-4">
                  {filteredThemes.map((theme) => (
                    <ThemePreviewCard
                      key={theme.id}
                      theme={theme}
                      isActive={activeTheme === theme.id}
                      onSelect={handleSelectTheme}
                      onPreview={(t) => console.log('Preview', t)}
                    />
                  ))}
                </div>
                
                {filteredThemes.length === 0 && (
                  <div className="text-center py-12">
                    <Palette className="w-16 h-16 text-cream-600 mx-auto mb-4" />
                    <h3 className="text-xl text-cream-300 font-medium mb-2">
                      No themes in this category
                    </h3>
                    <p className="text-cream-500">
                      Try a different category or create a custom theme
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-cream-200">Create Custom Theme</h3>
                  <button
                    onClick={() => setView('gallery')}
                    className="text-cream-400 hover:text-cream-200"
                  >
                    ← Back to Gallery
                  </button>
                </div>
                <CustomThemeBuilder
                  onSave={handleSaveCustomTheme}
                  onCancel={() => setView('gallery')}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumThemes;
export { PREMIUM_THEMES };
