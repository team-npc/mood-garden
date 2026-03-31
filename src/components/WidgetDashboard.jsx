/**
 * Widget Dashboard System
 * Customizable dashboard with draggable widgets
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  LayoutGrid,
  Plus,
  Settings,
  X,
  GripVertical,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Calendar,
  Target,
  Leaf,
  Cloud,
  Trophy,
  Clock,
  Quote,
  Heart,
  Flame
} from 'lucide-react';

// Available Widget Types
const WIDGET_TYPES = {
  PLANT_STATUS: 'plant-status',
  STREAK_COUNTER: 'streak-counter',
  MOOD_SUMMARY: 'mood-summary',
  QUICK_ENTRY: 'quick-entry',
  DAILY_CHALLENGE: 'daily-challenge',
  WEATHER: 'weather',
  ACHIEVEMENTS: 'achievements',
  RECENT_ENTRIES: 'recent-entries',
  INSPIRATION: 'inspiration',
  STATS_OVERVIEW: 'stats-overview',
  SEASONAL_EVENT: 'seasonal-event',
  GRATITUDE: 'gratitude',
};

// Widget Configurations
const WIDGET_CONFIGS = {
  [WIDGET_TYPES.PLANT_STATUS]: {
    id: WIDGET_TYPES.PLANT_STATUS,
    name: 'Plant Status',
    icon: Leaf,
    description: 'View your plant health and stage',
    size: 'medium',
    color: 'sage',
  },
  [WIDGET_TYPES.STREAK_COUNTER]: {
    id: WIDGET_TYPES.STREAK_COUNTER,
    name: 'Streak Counter',
    icon: Flame,
    description: 'Track your writing streak',
    size: 'small',
    color: 'sage',
  },
  [WIDGET_TYPES.MOOD_SUMMARY]: {
    id: WIDGET_TYPES.MOOD_SUMMARY,
    name: 'Mood Summary',
    icon: Heart,
    description: 'Recent mood patterns',
    size: 'medium',
    color: 'sage',
  },
  [WIDGET_TYPES.QUICK_ENTRY]: {
    id: WIDGET_TYPES.QUICK_ENTRY,
    name: 'Quick Entry',
    icon: Plus,
    description: 'Fast journal entry button',
    size: 'small',
    color: 'blue',
  },
  [WIDGET_TYPES.DAILY_CHALLENGE]: {
    id: WIDGET_TYPES.DAILY_CHALLENGE,
    name: 'Daily Challenge',
    icon: Target,
    description: 'Today\'s writing challenge',
    size: 'medium',
    color: 'sage',
  },
  [WIDGET_TYPES.WEATHER]: {
    id: WIDGET_TYPES.WEATHER,
    name: 'Weather',
    icon: Cloud,
    description: 'Current weather and prompts',
    size: 'small',
    color: 'sage',
  },
  [WIDGET_TYPES.ACHIEVEMENTS]: {
    id: WIDGET_TYPES.ACHIEVEMENTS,
    name: 'Achievements',
    icon: Trophy,
    description: 'Recent badges earned',
    size: 'medium',
    color: 'sage',
  },
  [WIDGET_TYPES.RECENT_ENTRIES]: {
    id: WIDGET_TYPES.RECENT_ENTRIES,
    name: 'Recent Entries',
    icon: Clock,
    description: 'Your latest journal entries',
    size: 'large',
    color: 'earth',
  },
  [WIDGET_TYPES.INSPIRATION]: {
    id: WIDGET_TYPES.INSPIRATION,
    name: 'Daily Inspiration',
    icon: Quote,
    description: 'Motivational quotes',
    size: 'medium',
    color: 'sage',
  },
  [WIDGET_TYPES.STATS_OVERVIEW]: {
    id: WIDGET_TYPES.STATS_OVERVIEW,
    name: 'Stats Overview',
    icon: TrendingUp,
    description: 'Your journaling statistics',
    size: 'large',
    color: 'green',
  },
  [WIDGET_TYPES.SEASONAL_EVENT]: {
    id: WIDGET_TYPES.SEASONAL_EVENT,
    name: 'Seasonal Events',
    icon: Calendar,
    description: 'Current season and events',
    size: 'medium',
    color: 'sage',
  },
  [WIDGET_TYPES.GRATITUDE]: {
    id: WIDGET_TYPES.GRATITUDE,
    name: 'Gratitude Journal',
    icon: Sparkles,
    description: 'Quick gratitude entries',
    size: 'medium',
    color: 'sage',
  },
};

// Default widget layout
const DEFAULT_LAYOUT = [
  { id: 'plant-status-1', type: WIDGET_TYPES.PLANT_STATUS, visible: true },
  { id: 'streak-counter-1', type: WIDGET_TYPES.STREAK_COUNTER, visible: true },
  { id: 'quick-entry-1', type: WIDGET_TYPES.QUICK_ENTRY, visible: true },
  { id: 'daily-challenge-1', type: WIDGET_TYPES.DAILY_CHALLENGE, visible: true },
  { id: 'mood-summary-1', type: WIDGET_TYPES.MOOD_SUMMARY, visible: true },
  { id: 'inspiration-1', type: WIDGET_TYPES.INSPIRATION, visible: true },
];

// Color mappings
const COLOR_CLASSES = {
  sage: 'bg-sage-100 dark:bg-sage-900/30 border-sage-200 dark:border-sage-800',
  earth: 'bg-stone-100 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800',
  blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  green: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
};

const ICON_COLOR_CLASSES = {
  sage: 'text-sage-600 dark:text-sage-400',
  earth: 'text-stone-600 dark:text-stone-400',
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
};

// Widget size classes
const SIZE_CLASSES = {
  small: 'col-span-1',
  medium: 'col-span-1 md:col-span-1',
  large: 'col-span-1 md:col-span-2',
};

// Custom Hook for Dashboard
const useDashboard = () => {
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [isEditing, setIsEditing] = useState(false);

  // Load saved layout
  useEffect(() => {
    const saved = localStorage.getItem('mood-garden-dashboard-layout');
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved layout');
      }
    }
  }, []);

  // Save layout changes
  useEffect(() => {
    localStorage.setItem('mood-garden-dashboard-layout', JSON.stringify(layout));
  }, [layout]);

  const addWidget = useCallback((type) => {
    const config = WIDGET_CONFIGS[type];
    if (!config) return;

    const newWidget = {
      id: `${type}-${Date.now()}`,
      type,
      visible: true,
    };

    setLayout(prev => [...prev, newWidget]);
  }, []);

  const removeWidget = useCallback((id) => {
    setLayout(prev => prev.filter(w => w.id !== id));
  }, []);

  const toggleWidgetVisibility = useCallback((id) => {
    setLayout(prev => prev.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  }, []);

  const reorderWidgets = useCallback((newOrder) => {
    setLayout(newOrder);
  }, []);

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_LAYOUT);
  }, []);

  return {
    layout,
    isEditing,
    setIsEditing,
    addWidget,
    removeWidget,
    toggleWidgetVisibility,
    reorderWidgets,
    resetLayout,
    visibleWidgets: layout.filter(w => w.visible),
  };
};

// Individual Widget Component
const Widget = ({ 
  widget, 
  isEditing, 
  onRemove, 
  onToggleVisibility,
  renderContent,
  onClick
}) => {
  const config = WIDGET_CONFIGS[widget.type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: widget.visible ? 1 : 0.5, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        relative rounded-2xl border-2 overflow-hidden
        ${SIZE_CLASSES[config.size]}
        ${COLOR_CLASSES[config.color]}
        ${isEditing ? 'cursor-grab active:cursor-grabbing' : onClick ? 'cursor-pointer' : ''}
        transition-shadow hover:shadow-lg
      `}
      onClick={!isEditing ? onClick : undefined}
    >
      {/* Edit Mode Controls */}
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility?.(widget.id);
            }}
            className="p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            {widget.visible ? (
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(widget.id);
            }}
            className="p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Drag Handle */}
      {isEditing && (
        <div className="absolute top-2 left-2 z-10 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-lg">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Widget Content */}
      <div className={`p-4 ${isEditing ? 'pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${ICON_COLOR_CLASSES[config.color]}`} />
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            {config.name}
          </h3>
        </div>

        {/* Custom Content */}
        {renderContent ? renderContent(widget, config) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {config.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Add Widget Modal
const AddWidgetModal = ({ isOpen, onClose, onAdd, currentWidgets }) => {
  const availableTypes = Object.values(WIDGET_CONFIGS);

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
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sage-500" />
              Add Widget
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {availableTypes.map((config) => {
              const Icon = config.icon;
              
              return (
                <motion.button
                  key={config.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAdd(config.id);
                    onClose();
                  }}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${COLOR_CLASSES[config.color]}
                    hover:shadow-md
                  `}
                >
                  <Icon className={`w-6 h-6 mb-2 ${ICON_COLOR_CLASSES[config.color]}`} />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {config.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {config.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Dashboard Component
const WidgetDashboard = ({ 
  widgetRenderers = {},
  onWidgetClick = {}
}) => {
  const {
    layout,
    isEditing,
    setIsEditing,
    addWidget,
    removeWidget,
    toggleWidgetVisibility,
    reorderWidgets,
    resetLayout,
    visibleWidgets,
  } = useDashboard();

  const [showAddModal, setShowAddModal] = useState(false);

  const displayWidgets = isEditing ? layout : visibleWidgets;

  return (
    <div className="space-y-4">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-sage-500" />
          Dashboard
        </h2>

        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 text-sage-600 hover:bg-sage-100 dark:hover:bg-sage-900/30 rounded-lg transition-colors"
                title="Add widget"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={resetLayout}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Reset layout"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`
              p-2 rounded-lg transition-colors
              ${isEditing 
                ? 'bg-sage-500 text-white' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
            title={isEditing ? 'Done editing' : 'Edit dashboard'}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-sage-100 dark:bg-sage-900/30 rounded-xl text-center"
          >
            <p className="text-sm text-sage-700 dark:text-sage-300">
              Drag widgets to reorder • Click 👁 to hide • Click ✕ to remove
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Grid */}
      {isEditing ? (
        <Reorder.Group
          axis="y"
          values={displayWidgets}
          onReorder={reorderWidgets}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {displayWidgets.map((widget) => (
            <Reorder.Item key={widget.id} value={widget}>
              <Widget
                widget={widget}
                isEditing={isEditing}
                onRemove={removeWidget}
                onToggleVisibility={toggleWidgetVisibility}
                renderContent={widgetRenderers[widget.type]}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {displayWidgets.map((widget) => (
              <Widget
                key={widget.id}
                widget={widget}
                isEditing={false}
                renderContent={widgetRenderers[widget.type]}
                onClick={onWidgetClick[widget.type]}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {displayWidgets.length === 0 && (
        <div className="text-center py-12">
          <LayoutGrid className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No widgets to display
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors"
          >
            Add your first widget
          </button>
        </div>
      )}

      {/* Add Widget Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddWidgetModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={addWidget}
            currentWidgets={layout}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export { 
  WIDGET_TYPES, 
  WIDGET_CONFIGS, 
  useDashboard, 
  Widget, 
  AddWidgetModal 
};
export default WidgetDashboard;
