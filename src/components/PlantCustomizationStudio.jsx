/**
 * Plant Customization Studio
 * Customize plant appearance, pot style, and garden decorations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Flower2,
  Box,
  Sparkles,
  Mountain,
  Sun,
  Droplets,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lock,
  Check,
  Star
} from 'lucide-react';

// Plant customization options
const PLANT_COLORS = [
  { id: 'sage', name: 'Sage', primary: '#88A77F', secondary: '#6B9362', gradient: 'linear-gradient(135deg, #88A77F 0%, #6B9362 100%)' },
  { id: 'emerald', name: 'Emerald', primary: '#50C878', secondary: '#2E8B57', gradient: 'linear-gradient(135deg, #50C878 0%, #2E8B57 100%)' },
  { id: 'forest', name: 'Forest', primary: '#228B22', secondary: '#006400', gradient: 'linear-gradient(135deg, #228B22 0%, #006400 100%)' },
  { id: 'teal', name: 'Teal', primary: '#008080', secondary: '#006666', gradient: 'linear-gradient(135deg, #008080 0%, #006666 100%)' },
  { id: 'jade', name: 'Jade', primary: '#00A86B', secondary: '#007B5F', gradient: 'linear-gradient(135deg, #00A86B 0%, #007B5F 100%)' },
  { id: 'spring', name: 'Spring', primary: '#98FB98', secondary: '#90EE90', gradient: 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)' },
  { id: 'autumn', name: 'Autumn', primary: '#CD853F', secondary: '#8B4513', gradient: 'linear-gradient(135deg, #CD853F 0%, #8B4513 100%)' },
  { id: 'sunset', name: 'Sunset', primary: '#FF6B6B', secondary: '#FF8C94', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C94 100%)' },
  { id: 'lavender', name: 'Lavender', primary: '#9B7BB8', secondary: '#7B5D99', gradient: 'linear-gradient(135deg, #9B7BB8 0%, #7B5D99 100%)' },
  { id: 'golden', name: 'Golden', primary: '#D4AF37', secondary: '#B8860B', gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', premium: true },
  { id: 'cosmic', name: 'Cosmic', primary: '#6B5B95', secondary: '#4A0080', gradient: 'linear-gradient(135deg, #6B5B95 0%, #4A0080 100%)', premium: true },
  { id: 'rainbow', name: 'Rainbow', primary: '#FF0000', secondary: '#0000FF', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 25%, #4ECDC4 50%, #45B7D1 75%, #9B59B6 100%)', premium: true },
];

const POT_STYLES = [
  { id: 'classic', name: 'Classic', shape: 'rounded', emoji: '🪴', unlocked: true },
  { id: 'terracotta', name: 'Terracotta', shape: 'cylinder', emoji: '🏺', unlocked: true },
  { id: 'modern', name: 'Modern', shape: 'cube', emoji: '🔲', unlocked: true },
  { id: 'ceramic', name: 'Ceramic', shape: 'bowl', emoji: '🥣', unlocked: true },
  { id: 'hanging', name: 'Hanging', shape: 'basket', emoji: '🧺', unlocked: false, requirement: 'Build a steady rhythm' },
  { id: 'crystal', name: 'Crystal', shape: 'prism', emoji: '💎', unlocked: false, requirement: 'Grow a flourishing garden' },
  { id: 'zen', name: 'Zen Garden', shape: 'tray', emoji: '🪨', unlocked: false, requirement: 'Practice gratitude regularly' },
  { id: 'floating', name: 'Floating', shape: 'levitate', emoji: '✨', unlocked: false, requirement: 'Premium' },
];

const SOIL_COLORS = [
  { id: 'brown', name: 'Rich Brown', color: '#5D4E37' },
  { id: 'dark', name: 'Dark Earth', color: '#2C2416' },
  { id: 'red', name: 'Red Clay', color: '#8B4513' },
  { id: 'sandy', name: 'Sandy', color: '#C2B280' },
  { id: 'moss', name: 'Mossy', color: '#4A5D23' },
];

const DECORATIONS = [
  { id: 'rocks', name: 'Zen Rocks', icon: Mountain, emoji: '🪨', unlocked: true },
  { id: 'mushrooms', name: 'Mushrooms', icon: Sparkles, emoji: '🍄', unlocked: true },
  { id: 'flowers', name: 'Wildflowers', icon: Flower2, emoji: '🌸', unlocked: true },
  { id: 'lantern', name: 'Lantern', icon: Sun, emoji: '🏮', unlocked: false, requirement: 'Start your rhythm' },
  { id: 'butterfly', name: 'Butterfly', icon: Sparkles, emoji: '🦋', unlocked: false, requirement: 'Nurture your garden' },
  { id: 'dewdrops', name: 'Dew Drops', icon: Droplets, emoji: '💧', unlocked: true },
  { id: 'fairy', name: 'Fairy Lights', icon: Star, emoji: '✨', unlocked: false, requirement: 'Grow a flourishing garden' },
  { id: 'gnome', name: 'Garden Gnome', icon: Sparkles, emoji: '🧙', unlocked: false, requirement: 'Premium' },
];

const BACKGROUNDS = [
  { id: 'garden', name: 'Garden', gradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', unlocked: true },
  { id: 'sunset', name: 'Sunset', gradient: 'linear-gradient(135deg, #FFE5B4 0%, #FFB347 100%)', unlocked: true },
  { id: 'night', name: 'Night Sky', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', unlocked: true },
  { id: 'forest', name: 'Forest', gradient: 'linear-gradient(135deg, #2d5016 0%, #1a4d2e 100%)', unlocked: true },
  { id: 'ocean', name: 'Ocean', gradient: 'linear-gradient(135deg, #006994 0%, #40E0D0 100%)', unlocked: false, requirement: 'Build a steady rhythm' },
  { id: 'sakura', name: 'Sakura', gradient: 'linear-gradient(135deg, #FFB7C5 0%, #FF85A2 100%)', unlocked: false, requirement: 'Spring event' },
  { id: 'aurora', name: 'Aurora', gradient: 'linear-gradient(135deg, #00C9A7 0%, #845EC2 50%, #FF6F91 100%)', unlocked: false, requirement: 'Premium' },
];

// Custom hook for plant customization
const usePlantCustomization = () => {
  const [customization, setCustomization] = useState({
    plantColor: 'sage',
    potStyle: 'classic',
    soilColor: 'brown',
    decorations: ['rocks'],
    background: 'garden',
    accessories: [],
    effects: [],
  });

  const [savedStyles, setSavedStyles] = useState([]);
  const [activeStyleIndex, setActiveStyleIndex] = useState(-1);

  // Load saved customization
  useEffect(() => {
    const saved = localStorage.getItem('mood-garden-plant-customization');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomization(parsed.current || customization);
        setSavedStyles(parsed.saved || []);
      } catch (e) {
        console.error('Failed to load plant customization');
      }
    }
  }, []);

  // Save customization
  useEffect(() => {
    localStorage.setItem('mood-garden-plant-customization', JSON.stringify({
      current: customization,
      saved: savedStyles,
    }));
  }, [customization, savedStyles]);

  const updateCustomization = useCallback((key, value) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
    setActiveStyleIndex(-1); // Custom changes deselect presets
  }, []);

  const toggleDecoration = useCallback((decorationId) => {
    setCustomization(prev => ({
      ...prev,
      decorations: prev.decorations.includes(decorationId)
        ? prev.decorations.filter(d => d !== decorationId)
        : [...prev.decorations, decorationId],
    }));
  }, []);

  const saveCurrentStyle = useCallback((name) => {
    const newStyle = {
      id: Date.now(),
      name,
      ...customization,
    };
    setSavedStyles(prev => [...prev, newStyle]);
    return newStyle;
  }, [customization]);

  const loadStyle = useCallback((style, index) => {
    const { id, name, ...styleData } = style;
    setCustomization(styleData);
    setActiveStyleIndex(index);
  }, []);

  const deleteStyle = useCallback((styleId) => {
    setSavedStyles(prev => prev.filter(s => s.id !== styleId));
    setActiveStyleIndex(-1);
  }, []);

  const resetToDefaults = useCallback(() => {
    setCustomization({
      plantColor: 'sage',
      potStyle: 'classic',
      soilColor: 'brown',
      decorations: ['rocks'],
      background: 'garden',
      accessories: [],
      effects: [],
    });
    setActiveStyleIndex(-1);
  }, []);

  return {
    customization,
    updateCustomization,
    toggleDecoration,
    savedStyles,
    activeStyleIndex,
    saveCurrentStyle,
    loadStyle,
    deleteStyle,
    resetToDefaults,
  };
};

// Plant Preview Component
const PlantPreview = ({ customization, className = '' }) => {
  const color = PLANT_COLORS.find(c => c.id === customization.plantColor) || PLANT_COLORS[0];
  const pot = POT_STYLES.find(p => p.id === customization.potStyle) || POT_STYLES[0];
  const soil = SOIL_COLORS.find(s => s.id === customization.soilColor) || SOIL_COLORS[0];
  const background = BACKGROUNDS.find(b => b.id === customization.background) || BACKGROUNDS[0];
  const decorations = DECORATIONS.filter(d => customization.decorations?.includes(d.id));

  return (
    <motion.div
      className={`relative aspect-square rounded-3xl overflow-hidden ${className}`}
      style={{ background: background.gradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Decorations */}
      <div className="absolute inset-0 flex items-end justify-center pb-24">
        {decorations.map((dec, index) => (
          <motion.span
            key={dec.id}
            className="text-2xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{
              position: 'absolute',
              left: `${20 + index * 15}%`,
              bottom: '30%',
            }}
          >
            {dec.emoji}
          </motion.span>
        ))}
      </div>

      {/* Plant */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Pot */}
          <div 
            className="w-24 h-16 rounded-b-3xl rounded-t-lg mx-auto relative overflow-hidden"
            style={{ backgroundColor: '#C2B280', boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)' }}
          >
            {/* Soil */}
            <div 
              className="absolute top-0 left-0 right-0 h-6 rounded-t-lg"
              style={{ backgroundColor: soil.color }}
            />
            {/* Pot decoration */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-lg">
              {pot.emoji}
            </div>
          </div>

          {/* Stem and leaves */}
          <motion.div
            className="absolute bottom-14 left-1/2 -translate-x-1/2"
            style={{ 
              width: '8px', 
              height: '80px',
              borderRadius: '4px',
              background: color.gradient,
            }}
            animate={{ rotateZ: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Leaves */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '40px',
                  height: '20px',
                  borderRadius: '50% 0 50% 50%',
                  background: color.gradient,
                  left: i % 2 === 0 ? '-35px' : '8px',
                  top: `${15 + i * 15}px`,
                  transform: `rotate(${i % 2 === 0 ? '-30deg' : '30deg'})`,
                  transformOrigin: i % 2 === 0 ? 'right center' : 'left center',
                }}
                animate={{
                  rotate: i % 2 === 0 ? [-30, -35, -30] : [30, 35, 30],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Effects overlay */}
      {customization.effects?.includes('sparkle') && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 text-yellow-300"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Color Picker Section
const ColorPicker = ({ selected, onSelect, title, options }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !option.premium && onSelect(option.id)}
            className={`
              relative w-10 h-10 rounded-full border-2 transition-all
              ${selected === option.id 
                ? 'border-white ring-2 ring-sage-500' 
                : 'border-transparent hover:border-gray-300'
              }
              ${option.premium ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            style={{ background: option.gradient || option.color }}
            title={option.name}
          >
            {selected === option.id && (
              <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
            )}
            {option.premium && (
              <Lock className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-md" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Option Grid Section
const OptionGrid = ({ selected, onSelect, title, options, multiple = false }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="grid grid-cols-4 gap-2">
        {options.map((option) => {
          const isSelected = multiple 
            ? selected?.includes(option.id) 
            : selected === option.id;
          const isLocked = option.unlocked === false;

          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: isLocked ? 1 : 1.05 }}
              whileTap={{ scale: isLocked ? 1 : 0.95 }}
              onClick={() => !isLocked && onSelect(option.id)}
              className={`
                relative p-3 rounded-xl border-2 transition-all text-center
                ${isSelected
                  ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }
                ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span className="text-2xl block mb-1">{option.emoji}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 block">
                {option.name}
              </span>
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <Check className="w-4 h-4 text-sage-500" />
                </div>
              )}
              {isLocked && (
                <div className="absolute top-1 right-1">
                  <Lock className="w-3 h-3 text-gray-400" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Saved Styles Section
const SavedStyles = ({ styles, activeIndex, onLoad, onDelete, onSave }) => {
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newStyleName, setNewStyleName] = useState('');

  const handleSave = () => {
    if (newStyleName.trim()) {
      onSave(newStyleName.trim());
      setNewStyleName('');
      setShowSaveInput(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Saved Styles</h3>
        <button
          onClick={() => setShowSaveInput(true)}
          className="text-sm text-sage-600 hover:text-sage-700 dark:text-sage-400"
        >
          + Save Current
        </button>
      </div>

      <AnimatePresence>
        {showSaveInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newStyleName}
              onChange={(e) => setNewStyleName(e.target.value)}
              placeholder="Style name..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-sage-500 text-white rounded-lg text-sm hover:bg-sage-600"
            >
              Save
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {styles.map((style, index) => (
          <motion.button
            key={style.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLoad(style, index)}
            className={`
              relative flex-shrink-0 px-4 py-2 rounded-xl border-2 text-sm
              ${activeIndex === index
                ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30'
                : 'border-gray-200 dark:border-gray-700'
              }
            `}
          >
            {style.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(style.id);
              }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs"
            >
              ×
            </button>
          </motion.button>
        ))}
        {styles.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No saved styles yet
          </p>
        )}
      </div>
    </div>
  );
};

// Main Plant Customization Studio Component
const PlantCustomizationStudio = ({ isOpen, onClose }) => {
  const {
    customization,
    updateCustomization,
    toggleDecoration,
    savedStyles,
    activeStyleIndex,
    saveCurrentStyle,
    loadStyle,
    deleteStyle,
    resetToDefaults,
  } = usePlantCustomization();

  const [activeTab, setActiveTab] = useState('plant');

  const tabs = [
    { id: 'plant', label: 'Plant', icon: Flower2 },
    { id: 'pot', label: 'Pot', icon: Box },
    { id: 'decor', label: 'Decor', icon: Sparkles },
    { id: 'background', label: 'Scene', icon: Mountain },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Palette className="w-6 h-6 text-sage-500" />
              Plant Studio
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaults}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                title="Reset to defaults"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview Panel */}
          <div className="w-1/2 p-6 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
            <PlantPreview 
              customization={customization} 
              className="flex-1"
            />
            
            {/* Saved Styles */}
            <div className="mt-4">
              <SavedStyles
                styles={savedStyles}
                activeIndex={activeStyleIndex}
                onLoad={loadStyle}
                onDelete={deleteStyle}
                onSave={saveCurrentStyle}
              />
            </div>
          </div>

          {/* Options Panel */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {activeTab === 'plant' && (
                  <ColorPicker
                    title="Plant Color"
                    selected={customization.plantColor}
                    onSelect={(id) => updateCustomization('plantColor', id)}
                    options={PLANT_COLORS}
                  />
                )}

                {activeTab === 'pot' && (
                  <>
                    <OptionGrid
                      title="Pot Style"
                      selected={customization.potStyle}
                      onSelect={(id) => updateCustomization('potStyle', id)}
                      options={POT_STYLES}
                    />
                    <ColorPicker
                      title="Soil Color"
                      selected={customization.soilColor}
                      onSelect={(id) => updateCustomization('soilColor', id)}
                      options={SOIL_COLORS}
                    />
                  </>
                )}

                {activeTab === 'decor' && (
                  <OptionGrid
                    title="Decorations"
                    selected={customization.decorations}
                    onSelect={toggleDecoration}
                    options={DECORATIONS}
                    multiple
                  />
                )}

                {activeTab === 'background' && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Scene Background</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {BACKGROUNDS.map((bg) => {
                        const isLocked = bg.unlocked === false;
                        const isSelected = customization.background === bg.id;

                        return (
                          <motion.button
                            key={bg.id}
                            whileHover={{ scale: isLocked ? 1 : 1.02 }}
                            whileTap={{ scale: isLocked ? 1 : 0.98 }}
                            onClick={() => !isLocked && updateCustomization('background', bg.id)}
                            className={`
                              relative aspect-video rounded-xl border-2 overflow-hidden
                              ${isSelected ? 'border-sage-500 ring-2 ring-sage-200' : 'border-gray-200 dark:border-gray-700'}
                              ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            style={{ background: bg.gradient }}
                          >
                            <span className="absolute inset-x-0 bottom-0 bg-black/30 text-white text-xs py-1 text-center">
                              {bg.name}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1 right-1">
                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                              </div>
                            )}
                            {isLocked && (
                              <div className="absolute top-1 right-1">
                                <Lock className="w-3 h-3 text-white drop-shadow-md" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Save and close
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-sage-500 text-white hover:bg-sage-600 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { PlantPreview, usePlantCustomization };
export default PlantCustomizationStudio;
