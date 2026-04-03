/**
 * Widget System - Draggable, Customizable Dashboard Widgets
 * Allows users to create personalized dashboard layouts
 */

import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  X, 
  Grid, 
  Plus,
  Settings,
  Maximize2,
  Minimize2,
  MoreVertical,
  Trash2,
  Copy
} from 'lucide-react';

/**
 * Widget size presets
 */
const WIDGET_SIZES = {
  small: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' },
  medium: { cols: 2, rows: 1, className: 'col-span-2 row-span-1' },
  large: { cols: 2, rows: 2, className: 'col-span-2 row-span-2' },
  wide: { cols: 3, rows: 1, className: 'col-span-3 row-span-1' },
  tall: { cols: 1, rows: 2, className: 'col-span-1 row-span-2' }
};

/**
 * Base Widget Container
 */
const WidgetContainer = ({ 
  widget, 
  onRemove, 
  onResize, 
  onSettings,
  children 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const size = WIDGET_SIZES[widget.size || 'medium'];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 relative group ${size.className}`}
      style={{ minHeight: widget.size === 'small' ? '150px' : '200px' }}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-cream-200">{widget.title}</h3>
        <div className="flex items-center gap-1">
          {/* Resize button */}
          <button
            onClick={() => {
              const sizes = Object.keys(WIDGET_SIZES);
              const currentIndex = sizes.indexOf(widget.size || 'medium');
              const nextSize = sizes[(currentIndex + 1) % sizes.length];
              onResize(widget.id, nextSize);
            }}
            className="p-1 text-cream-500 hover:text-cream-300 opacity-0 group-hover:opacity-100 transition-all"
            title="Resize"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          
          {/* Settings button */}
          {onSettings && (
            <button
              onClick={() => onSettings(widget.id)}
              className="p-1 text-cream-500 hover:text-cream-300 opacity-0 group-hover:opacity-100 transition-all"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
          
          {/* Remove button */}
          <button
            onClick={() => onRemove(widget.id)}
            className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* Widget Content */}
      <div className="h-[calc(100%-40px)] overflow-auto scrollbar-thin">
        {children}
      </div>
    </motion.div>
  );
};

/**
 * Widget Library Modal
 */
const WidgetLibrary = ({ isOpen, onClose, onAddWidget, availableWidgets }) => {
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
        className="bg-deep-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-600 to-leaf-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Widget Library</h2>
                <p className="text-sm text-sage-200">Add widgets to your dashboard</p>
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
        
        {/* Widget Grid */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-3 gap-3">
            {availableWidgets.map((widget) => (
              <motion.button
                key={widget.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onAddWidget(widget);
                  onClose();
                }}
                className="bg-deep-700/50 hover:bg-deep-700 rounded-xl p-4 text-left transition-colors border border-deep-600 hover:border-sage-500"
              >
                <div className="text-2xl mb-2">{widget.icon}</div>
                <div className="text-sm font-medium text-cream-200 mb-1">{widget.title}</div>
                <div className="text-xs text-cream-500">{widget.description}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Individual Widget Components
 */

// Mood Calendar Heatmap Widget
const MoodCalendarWidget = ({ data = [] }) => {
  const last90Days = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(Date.now() - i * 86400000);
    const entry = data.find(d => 
      new Date(d.date).toDateString() === date.toDateString()
    );
    return {
      date,
      mood: entry?.mood,
      intensity: entry ? 0.3 + Math.random() * 0.7 : 0
    };
  }).reverse();
  
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[repeat(13,1fr)] gap-1">
        {last90Days.map((day, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.5 }}
            className="aspect-square rounded-sm"
            style={{
              background: day.mood 
                ? `rgba(76, 175, 80, ${day.intensity})`
                : 'rgba(255, 255, 255, 0.05)'
            }}
            title={day.date.toLocaleDateString()}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-cream-600">
        <span>Earlier</span>
        <span>Today</span>
      </div>
    </div>
  );
};

// Writing Flow Widget - Qualitative, no numbers
const WritingSpeedWidget = ({ data = [] }) => {
  const avgSpeed = data.length > 0 
    ? data.reduce((sum, d) => sum + (d.wordCount / d.duration || 0), 0) / data.length 
    : 0;
  
  // Qualitative flow status
  const getFlowStatus = (speed) => {
    if (speed >= 40) return { emoji: '🚀', label: 'Flowing freely' };
    if (speed >= 25) return { emoji: '✨', label: 'Good rhythm' };
    if (speed >= 15) return { emoji: '🌿', label: 'Thoughtful pace' };
    return { emoji: '🌱', label: 'Taking time' };
  };
  
  const flowStatus = getFlowStatus(avgSpeed);
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-4xl mb-2">
        {flowStatus.emoji}
      </div>
      <div className="text-sm text-cream-300 font-medium">{flowStatus.label}</div>
      <div className="text-xs text-cream-500 mt-1">Your writing flow</div>
      <div className="w-full mt-4 flex gap-1">
        {data.slice(-7).map((d, i) => (
          <div 
            key={i}
            className="flex-1 bg-sage-500/30 rounded-t"
            style={{ height: `${Math.min((d.wordCount / 500) * 60, 60)}px` }}
          />
        ))}
      </div>
    </div>
  );
};

// Quick Note Widget
const QuickNoteWidget = ({ onSave }) => {
  const [note, setNote] = useState('');
  
  return (
    <div className="flex flex-col h-full">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Quick thoughts..."
        className="flex-1 bg-deep-700/30 border border-deep-600 rounded-lg p-2 text-sm text-cream-200 placeholder-cream-600 outline-none focus:border-sage-500 resize-none"
      />
      <button
        onClick={() => {
          onSave(note);
          setNote('');
        }}
        disabled={!note.trim()}
        className="mt-2 py-1.5 bg-sage-600 hover:bg-sage-500 text-white rounded-lg text-xs disabled:opacity-50"
      >
        Save Note
      </button>
    </div>
  );
};

// Streak Calendar Widget - Qualitative rhythm display
const StreakCalendarWidget = ({ streak = 0, history = [] }) => {
  // Get qualitative rhythm description
  const getRhythmStatus = (s) => {
    if (s >= 30) return { emoji: '🌟', label: 'Flourishing' };
    if (s >= 14) return { emoji: '🌸', label: 'Blooming' };
    if (s >= 7) return { emoji: '🌿', label: 'Growing' };
    if (s >= 3) return { emoji: '🌱', label: 'Sprouting' };
    return { emoji: '✨', label: 'Beginning' };
  };
  
  const status = getRhythmStatus(streak);
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-5xl mb-2">{status.emoji}</div>
      <div className="text-xl font-medium text-cream-200 mb-1">{status.label}</div>
      <div className="text-sm text-cream-500">Your rhythm</div>
      <div className="flex gap-1 mt-4">
        {history.slice(-7).map((day, i) => (
          <div
            key={i}
            className={`w-2 h-8 rounded-full ${
              day ? 'bg-sage-400' : 'bg-deep-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Weather Widget
const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temp: 24,
    condition: 'Clear',
    icon: '☀️'
  });
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-5xl mb-2">{weather.icon}</div>
      <div className="text-3xl font-bold text-cream-200 mb-1">{weather.temp}°</div>
      <div className="text-sm text-cream-500">{weather.condition}</div>
    </div>
  );
};

/**
 * Available Widget Types
 */
export const WIDGET_CATALOG = [
  {
    type: 'mood-calendar',
    title: 'Mood Calendar',
    description: '90-day mood heatmap',
    icon: '📅',
    component: MoodCalendarWidget,
    defaultSize: 'large'
  },
  {
    type: 'writing-speed',
    title: 'Writing Speed',
    description: 'Track words per minute',
    icon: '⚡',
    component: WritingSpeedWidget,
    defaultSize: 'medium'
  },
  {
    type: 'streak-calendar',
    title: 'Streak Counter',
    description: 'Your writing streak',
    icon: '🔥',
    component: StreakCalendarWidget,
    defaultSize: 'small'
  },
  {
    type: 'quick-note',
    title: 'Quick Note',
    description: 'Fast note taking',
    icon: '📝',
    component: QuickNoteWidget,
    defaultSize: 'medium'
  },
  {
    type: 'weather',
    title: 'Weather',
    description: 'Current weather',
    icon: '🌤️',
    component: WeatherWidget,
    defaultSize: 'small'
  }
];

/**
 * Main Widget System Component
 */
const WidgetSystem = ({ entries = [], plant = null }) => {
  const [widgets, setWidgets] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Load widgets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    if (saved) {
      setWidgets(JSON.parse(saved));
    } else {
      // Default widgets
      setWidgets([
        { id: '1', type: 'mood-calendar', size: 'large', title: 'Mood Calendar' },
        { id: '2', type: 'streak-calendar', size: 'small', title: 'Streak Counter' },
        { id: '3', type: 'weather', size: 'small', title: 'Weather' }
      ]);
    }
  }, []);
  
  // Save widgets to localStorage
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    }
  }, [widgets]);
  
  const handleAddWidget = (widgetTemplate) => {
    const newWidget = {
      id: Date.now().toString(),
      type: widgetTemplate.type,
      title: widgetTemplate.title,
      size: widgetTemplate.defaultSize
    };
    setWidgets([...widgets, newWidget]);
  };
  
  const handleRemoveWidget = (id) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };
  
  const handleResizeWidget = (id, newSize) => {
    setWidgets(widgets.map(w => 
      w.id === id ? { ...w, size: newSize } : w
    ));
  };
  
  const renderWidget = (widget) => {
    const widgetDef = WIDGET_CATALOG.find(w => w.type === widget.type);
    if (!widgetDef) return null;
    
    const WidgetComponent = widgetDef.component;
    
    return (
      <WidgetContainer
        key={widget.id}
        widget={widget}
        onRemove={handleRemoveWidget}
        onResize={handleResizeWidget}
      >
        <WidgetComponent 
          data={entries}
          streak={plant?.currentStreak || 0}
          history={entries.map(e => !!e.content)}
        />
      </WidgetContainer>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-cream-200">Dashboard Widgets</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isEditing
                ? 'bg-sage-600 text-white'
                : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
            }`}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className="px-3 py-1.5 bg-sage-600 hover:bg-sage-500 text-white rounded-lg text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Widget
          </button>
        </div>
      </div>
      
      {/* Widget Grid */}
      <div className="grid grid-cols-3 auto-rows-fr gap-4">
        {widgets.map(renderWidget)}
      </div>
      
      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12 bg-deep-700/30 rounded-xl">
          <Grid className="w-12 h-12 text-cream-600 mx-auto mb-3" />
          <h3 className="text-cream-300 font-medium mb-2">No widgets yet</h3>
          <p className="text-cream-500 text-sm mb-4">
            Add widgets to personalize your dashboard
          </p>
          <button
            onClick={() => setShowLibrary(true)}
            className="px-4 py-2 bg-sage-600 hover:bg-sage-500 text-white rounded-lg"
          >
            Browse Widgets
          </button>
        </div>
      )}
      
      {/* Widget Library Modal */}
      <WidgetLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onAddWidget={handleAddWidget}
        availableWidgets={WIDGET_CATALOG}
      />
    </div>
  );
};

export default WidgetSystem;
export { WidgetContainer, WIDGET_CATALOG };
