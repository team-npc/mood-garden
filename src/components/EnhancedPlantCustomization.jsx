/**
 * Enhanced Plant Customization Studio - Advanced plant appearance editor
 * Features: 3D preview, color picker, accessories, backgrounds, animations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Zap,
  Crown,
  Heart,
  Star,
  Glasses as GlassesIcon,
  Music,
  RotateCcw,
  Save,
  Wand2
} from 'lucide-react';

/**
 * Color Picker Component
 */
const ColorPicker = ({ value, onChange, label }) => {
  const presets = [
    { name: 'Forest Green', color: '#4caf50' },
    { name: 'Sky Blue', color: '#2196f3' },
    { name: 'Sunset Orange', color: '#ff9800' },
    { name: 'Rose Pink', color: '#e91e63' },
    { name: 'Royal Purple', color: '#9c27b0' },
    { name: 'Golden Yellow', color: '#ffd700' },
    { name: 'Ocean Teal', color: '#00acc1' },
    { name: 'Cherry Red', color: '#f44336' },
    { name: 'Mint Green', color: '#26a69a' },
    { name: 'Lavender', color: '#ba68c8' }
  ];
  
  return (
    <div className="space-y-2">
      <label className="text-sm text-cream-400">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-deep-600"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-deep-700 border border-deep-600 rounded-lg px-3 py-2 text-cream-200 text-sm"
          placeholder="#4caf50"
        />
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onChange(preset.color)}
            className="w-full aspect-square rounded-lg border-2 border-deep-600 hover:border-sage-500 transition-colors"
            style={{ background: preset.color }}
            title={preset.name}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Pattern Selector
 */
const PatternSelector = ({ value, onChange }) => {
  const patterns = [
    { id: 'solid', name: 'Solid', icon: '⬜' },
    { id: 'gradient', name: 'Gradient', icon: '🌈' },
    { id: 'spots', name: 'Spots', icon: '⚪' },
    { id: 'stripes', name: 'Stripes', icon: '▬' },
    { id: 'sparkle', name: 'Sparkle', icon: '✨' },
    { id: 'galaxy', name: 'Galaxy', icon: '🌌' }
  ];
  
  return (
    <div className="space-y-2">
      <label className="text-sm text-cream-400">Pattern</label>
      <div className="grid grid-cols-3 gap-2">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => onChange(pattern.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              value === pattern.id
                ? 'border-sage-500 bg-sage-500/20'
                : 'border-deep-600 bg-deep-700/30 hover:border-deep-500'
            }`}
          >
            <div className="text-2xl mb-1">{pattern.icon}</div>
            <div className="text-xs text-cream-400">{pattern.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Accessories Shop
 */
const AccessoryShop = ({ selectedAccessories, onToggle }) => {
  const accessories = [
    { id: 'crown', icon: '👑', name: 'Crown', category: 'head', price: 100 },
    { id: 'glasses', icon: '👓', name: 'Glasses', category: 'head', price: 50 },
    { id: 'hat', icon: '🎩', name: 'Top Hat', category: 'head', price: 75 },
    { id: 'flower', icon: '🌸', name: 'Flower', category: 'body', price: 30 },
    { id: 'butterfly', icon: '🦋', name: 'Butterfly', category: 'body', price: 40 },
    { id: 'sparkles', icon: '✨', name: 'Sparkles', category: 'effect', price: 60 },
    { id: 'music', icon: '🎵', name: 'Music', category: 'effect', price: 50 },
    { id: 'heart', icon: '💕', name: 'Hearts', category: 'effect', price: 45 }
  ];
  
  const categories = ['head', 'body', 'effect'];
  
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="text-xs text-cream-500 uppercase mb-2">{category}</h4>
          <div className="grid grid-cols-4 gap-2">
            {accessories
              .filter((acc) => acc.category === category)
              .map((accessory) => {
                const isSelected = selectedAccessories.includes(accessory.id);
                return (
                  <button
                    key={accessory.id}
                    onClick={() => onToggle(accessory.id)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-sage-500 bg-sage-500/20'
                        : 'border-deep-600 bg-deep-700/30 hover:border-deep-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{accessory.icon}</div>
                    <div className="text-[10px] text-cream-500">{accessory.name}</div>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Background Themes
 */
const BackgroundTheme = ({ value, onChange }) => {
  const themes = [
    { id: 'forest', name: 'Forest', gradient: 'from-green-900 to-green-700', emoji: '🌲' },
    { id: 'beach', name: 'Beach', gradient: 'from-blue-400 to-yellow-300', emoji: '🏖️' },
    { id: 'space', name: 'Space', gradient: 'from-indigo-900 to-purple-900', emoji: '🌌' },
    { id: 'sunset', name: 'Sunset', gradient: 'from-orange-500 to-pink-500', emoji: '🌅' },
    { id: 'night', name: 'Night', gradient: 'from-gray-900 to-blue-900', emoji: '🌙' },
    { id: 'spring', name: 'Spring', gradient: 'from-pink-300 to-green-300', emoji: '🌸' }
  ];
  
  return (
    <div className="space-y-2">
      <label className="text-sm text-cream-400">Background</label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`relative overflow-hidden rounded-lg border-2 transition-all aspect-video ${
              value === theme.id ? 'border-sage-500 ring-2 ring-sage-500' : 'border-deep-600'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <span className="text-2xl mb-1">{theme.emoji}</span>
              <span className="text-xs text-white font-medium drop-shadow-lg">{theme.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Animation Style Selector
 */
const AnimationStyle = ({ value, onChange }) => {
  const animations = [
    { id: 'sway', name: 'Gentle Sway', icon: '🍃' },
    { id: 'bounce', name: 'Bounce', icon: '⬆️' },
    { id: 'spin', name: 'Spin', icon: '🔄' },
    { id: 'pulse', name: 'Pulse', icon: '💓' },
    { id: 'float', name: 'Float', icon: '☁️' },
    { id: 'wiggle', name: 'Wiggle', icon: '〰️' }
  ];
  
  return (
    <div className="space-y-2">
      <label className="text-sm text-cream-400">Animation</label>
      <div className="grid grid-cols-3 gap-2">
        {animations.map((anim) => (
          <button
            key={anim.id}
            onClick={() => onChange(anim.id)}
            className={`p-2 rounded-lg border-2 transition-all ${
              value === anim.id
                ? 'border-sage-500 bg-sage-500/20'
                : 'border-deep-600 bg-deep-700/30 hover:border-deep-500'
            }`}
          >
            <div className="text-xl mb-1">{anim.icon}</div>
            <div className="text-xs text-cream-400">{anim.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Plant Preview Component
 */
const PlantPreview = ({ customization }) => {
  const getAnimationClass = () => {
    switch (customization.animation) {
      case 'sway': return 'animate-sway';
      case 'bounce': return 'animate-bounce';
      case 'spin': return 'animate-spin';
      case 'pulse': return 'animate-pulse';
      case 'float': return 'animate-float';
      case 'wiggle': return 'animate-wiggle';
      default: return '';
    }
  };
  
  const getBackgroundGradient = () => {
    switch (customization.background) {
      case 'forest': return 'from-green-900 to-green-700';
      case 'beach': return 'from-blue-400 to-yellow-300';
      case 'space': return 'from-indigo-900 to-purple-900';
      case 'sunset': return 'from-orange-500 to-pink-500';
      case 'night': return 'from-gray-900 to-blue-900';
      case 'spring': return 'from-pink-300 to-green-300';
      default: return 'from-deep-800 to-deep-700';
    }
  };
  
  const getPatternStyle = () => {
    switch (customization.pattern) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`
        };
      case 'spots':
        return {
          background: customization.primaryColor,
          backgroundImage: `radial-gradient(circle, ${customization.secondaryColor} 20%, transparent 20%)`,
          backgroundSize: '20px 20px'
        };
      case 'stripes':
        return {
          background: `repeating-linear-gradient(45deg, ${customization.primaryColor}, ${customization.primaryColor} 10px, ${customization.secondaryColor} 10px, ${customization.secondaryColor} 20px)`
        };
      case 'sparkle':
        return {
          background: customization.primaryColor,
          backgroundImage: `radial-gradient(circle, ${customization.secondaryColor} 1px, transparent 1px)`,
          backgroundSize: '15px 15px'
        };
      case 'galaxy':
        return {
          background: `radial-gradient(ellipse at center, ${customization.primaryColor}, ${customization.secondaryColor}, #000)`
        };
      default:
        return { background: customization.primaryColor };
    }
  };
  
  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${getBackgroundGradient()} rounded-2xl overflow-hidden`}>
      {/* Ambient Effects */}
      {customization.accessories.includes('sparkles') && (
        <div className="absolute inset-0 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
      )}
      
      {/* Plant Container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className={`relative ${getAnimationClass()}`} style={{ animationDuration: '3s' }}>
          {/* Main Plant Body */}
          <div
            className="relative w-32 h-32 rounded-full"
            style={getPatternStyle()}
          >
            {/* Leaves */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <div
                className="w-16 h-20 rounded-t-full"
                style={{ background: customization.primaryColor }}
              />
            </div>
            <div className="absolute top-1/2 -left-8 -translate-y-1/2">
              <div
                className="w-12 h-16 rounded-l-full"
                style={{ background: customization.primaryColor }}
              />
            </div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2">
              <div
                className="w-12 h-16 rounded-r-full"
                style={{ background: customization.primaryColor }}
              />
            </div>
            
            {/* Accessories */}
            {customization.accessories.includes('crown') && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-5xl">👑</div>
            )}
            {customization.accessories.includes('glasses') && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">👓</div>
            )}
            {customization.accessories.includes('hat') && (
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-5xl">🎩</div>
            )}
            {customization.accessories.includes('flower') && (
              <div className="absolute top-2 right-2 text-3xl">🌸</div>
            )}
            {customization.accessories.includes('butterfly') && (
              <div className="absolute -top-4 -right-4 text-3xl animate-float">🦋</div>
            )}
            {customization.accessories.includes('heart') && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-pulse">💕</div>
            )}
            {customization.accessories.includes('music') && (
              <div className="absolute -right-6 top-0 text-2xl animate-bounce">🎵</div>
            )}
          </div>
          
          {/* Pot */}
          <div className="mt-2 flex justify-center">
            <div className="w-24 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Enhanced Plant Customization Studio
 */
const EnhancedPlantCustomization = ({ isOpen, onClose, onSave, initialCustomization = null }) => {
  const [customization, setCustomization] = useState({
    primaryColor: '#4caf50',
    secondaryColor: '#81c784',
    pattern: 'solid',
    accessories: [],
    background: 'forest',
    animation: 'sway',
    expression: 'happy'
  });
  
  const [activeTab, setActiveTab] = useState('colors');
  
  useEffect(() => {
    if (initialCustomization) {
      setCustomization(initialCustomization);
    } else {
      // Load from localStorage
      const saved = localStorage.getItem('plantCustomization');
      if (saved) {
        setCustomization(JSON.parse(saved));
      }
    }
  }, [initialCustomization]);
  
  const handleSave = () => {
    localStorage.setItem('plantCustomization', JSON.stringify(customization));
    onSave?.(customization);
    onClose();
  };
  
  const handleReset = () => {
    setCustomization({
      primaryColor: '#4caf50',
      secondaryColor: '#81c784',
      pattern: 'solid',
      accessories: [],
      background: 'forest',
      animation: 'sway',
      expression: 'happy'
    });
  };
  
  const toggleAccessory = (accessoryId) => {
    setCustomization({
      ...customization,
      accessories: customization.accessories.includes(accessoryId)
        ? customization.accessories.filter(id => id !== accessoryId)
        : [...customization.accessories, accessoryId]
    });
  };
  
  if (!isOpen) return null;
  
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
        className="bg-deep-800 rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex"
      >
        {/* Left: Preview */}
        <div className="w-2/5 bg-deep-900 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-cream-200">Preview</h3>
            <button
              onClick={handleReset}
              className="p-2 text-cream-400 hover:text-cream-200 hover:bg-deep-700 rounded-lg"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <PlantPreview customization={customization} />
          </div>
        </div>
        
        {/* Right: Customization Options */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-600 to-leaf-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wand2 className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Plant Customization Studio</h2>
                  <p className="text-sm text-sage-200">Make your plant unique</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-deep-700">
            {[
              { id: 'colors', icon: Palette, label: 'Colors' },
              { id: 'pattern', icon: Sparkles, label: 'Pattern' },
              { id: 'accessories', icon: Crown, label: 'Accessories' },
              { id: 'background', icon: ImageIcon, label: 'Background' },
              { id: 'animation', icon: Zap, label: 'Animation' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sage-500/20 text-sage-400 border-b-2 border-sage-500'
                    : 'text-cream-500 hover:text-cream-300 hover:bg-deep-700/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <ColorPicker
                  label="Primary Color"
                  value={customization.primaryColor}
                  onChange={(color) => setCustomization({ ...customization, primaryColor: color })}
                />
                <ColorPicker
                  label="Secondary Color"
                  value={customization.secondaryColor}
                  onChange={(color) => setCustomization({ ...customization, secondaryColor: color })}
                />
              </div>
            )}
            
            {activeTab === 'pattern' && (
              <PatternSelector
                value={customization.pattern}
                onChange={(pattern) => setCustomization({ ...customization, pattern })}
              />
            )}
            
            {activeTab === 'accessories' && (
              <AccessoryShop
                selectedAccessories={customization.accessories}
                onToggle={toggleAccessory}
              />
            )}
            
            {activeTab === 'background' && (
              <BackgroundTheme
                value={customization.background}
                onChange={(background) => setCustomization({ ...customization, background })}
              />
            )}
            
            {activeTab === 'animation' && (
              <AnimationStyle
                value={customization.animation}
                onChange={(animation) => setCustomization({ ...customization, animation })}
              />
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 border-t border-deep-700 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-deep-700 hover:bg-deep-600 text-cream-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-gradient-to-r from-sage-600 to-leaf-600 hover:from-sage-500 hover:to-leaf-500 text-white rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedPlantCustomization;
