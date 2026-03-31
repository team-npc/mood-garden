/**
 * Seasonal Events System
 * Time-based events, themes, and special content
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Gift,
  Calendar,
  Star,
  Heart,
  Snowflake,
  Sun,
  Leaf,
  Moon,
  Flower2,
  X
} from 'lucide-react';

// Seasonal configurations
const SEASONS = {
  spring: {
    id: 'spring',
    name: 'Spring',
    icon: Flower2,
    months: [2, 3, 4], // March, April, May
    theme: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fbcfe8',
      gradient: 'from-pink-400 via-rose-300 to-pink-200',
    },
    particleType: 'petals',
    greeting: 'Spring has bloomed! 🌸',
    prompts: [
      'What new beginnings are you embracing this spring?',
      'Describe how nature is awakening around you.',
      'What seeds of change are you planting in your life?',
    ],
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    icon: Sun,
    months: [5, 6, 7], // June, July, August
    theme: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#fef3c7',
      gradient: 'from-yellow-400 via-orange-300 to-amber-200',
    },
    particleType: 'fireflies',
    greeting: 'Summer sunshine awaits! ☀️',
    prompts: [
      'What adventures are you looking forward to this summer?',
      'Describe your perfect summer day.',
      'What warmth and light are you bringing to others?',
    ],
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    icon: Leaf,
    months: [8, 9, 10], // September, October, November
    theme: {
      primary: '#dc2626',
      secondary: '#ea580c',
      accent: '#fed7aa',
      gradient: 'from-red-400 via-orange-400 to-amber-300',
    },
    particleType: 'leaves',
    greeting: 'Autumn colors surround you! 🍂',
    prompts: [
      'What are you grateful for as the year winds down?',
      'What are you ready to let go of, like falling leaves?',
      'How are you preparing for the quieter months ahead?',
    ],
  },
  winter: {
    id: 'winter',
    name: 'Winter',
    icon: Snowflake,
    months: [11, 0, 1], // December, January, February
    theme: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#dbeafe',
      gradient: 'from-blue-400 via-cyan-300 to-blue-200',
    },
    particleType: 'snow',
    greeting: 'Winter wonderland awaits! ❄️',
    prompts: [
      'What brings you warmth during the cold months?',
      'Reflect on the year that has passed.',
      'What cozy rituals bring you comfort?',
    ],
  },
};

// Special events throughout the year
const SPECIAL_EVENTS = [
  {
    id: 'new-year',
    name: "New Year's Day",
    date: { month: 0, day: 1 },
    duration: 3, // Days
    icon: Star,
    theme: {
      gradient: 'from-gold-400 via-yellow-300 to-amber-400',
      particleType: 'confetti',
    },
    greeting: 'Happy New Year! 🎆',
    prompts: [
      'What intentions are you setting for this new year?',
      'What are you most excited about in the year ahead?',
      'What word will define your year?',
    ],
    rewards: ['🎆', '✨', '🌟'],
  },
  {
    id: 'valentines',
    name: "Valentine's Day",
    date: { month: 1, day: 14 },
    duration: 1,
    icon: Heart,
    theme: {
      gradient: 'from-rose-500 via-pink-400 to-red-400',
      particleType: 'hearts',
    },
    greeting: 'Spread love today! 💕',
    prompts: [
      'Write a love letter to yourself.',
      'Who are the people you cherish most?',
      'How do you show love to others?',
    ],
    rewards: ['💕', '❤️', '💗'],
  },
  {
    id: 'earth-day',
    name: 'Earth Day',
    date: { month: 3, day: 22 },
    duration: 1,
    icon: Leaf,
    theme: {
      gradient: 'from-green-500 via-emerald-400 to-teal-400',
      particleType: 'leaves',
    },
    greeting: 'Celebrate our planet! 🌍',
    prompts: [
      'How do you connect with nature?',
      'What small actions can you take to help the environment?',
      'Describe your favorite place in nature.',
    ],
    rewards: ['🌍', '🌿', '🌱'],
  },
  {
    id: 'mental-health',
    name: 'Mental Health Awareness',
    date: { month: 4, day: 1 },
    duration: 31,
    icon: Heart,
    theme: {
      gradient: 'from-purple-500 via-violet-400 to-indigo-400',
      particleType: 'sparkles',
    },
    greeting: 'Your mental health matters! 💜',
    prompts: [
      'What self-care practices help you most?',
      'Write about a time you overcame a challenge.',
      'What advice would you give to someone struggling?',
    ],
    rewards: ['💜', '🦋', '🌈'],
  },
  {
    id: 'gratitude-month',
    name: 'Gratitude Month',
    date: { month: 10, day: 1 },
    duration: 30,
    icon: Sparkles,
    theme: {
      gradient: 'from-amber-500 via-orange-400 to-yellow-400',
      particleType: 'sparkles',
    },
    greeting: 'Practice gratitude! 🙏',
    prompts: [
      'List 10 things you are grateful for today.',
      'Who has made a positive impact on your life?',
      'What simple pleasures bring you joy?',
    ],
    rewards: ['🙏', '🍂', '🧡'],
  },
  {
    id: 'holiday-season',
    name: 'Holiday Season',
    date: { month: 11, day: 15 },
    duration: 17,
    icon: Gift,
    theme: {
      gradient: 'from-red-500 via-green-500 to-gold-400',
      particleType: 'snow',
    },
    greeting: 'Happy Holidays! 🎄',
    prompts: [
      'What traditions bring you joy during the holidays?',
      'Reflect on your favorite holiday memory.',
      'What gifts are you giving to yourself this season?',
    ],
    rewards: ['🎄', '🎁', '⭐'],
  },
];

// Get current season
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  return Object.values(SEASONS).find(s => s.months.includes(month)) || SEASONS.spring;
};

// Get active special events
const getActiveEvents = () => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  return SPECIAL_EVENTS.filter(event => {
    const startDay = event.date.day;
    const startMonth = event.date.month;
    const endDay = startDay + event.duration - 1;

    // Simple check (doesn't handle month boundaries perfectly)
    if (month === startMonth) {
      return day >= startDay && day <= endDay;
    }
    return false;
  });
};

// Seasonal Context
const SeasonalContext = createContext(null);

export const SeasonalProvider = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState(getCurrentSeason());
  const [activeEvents, setActiveEvents] = useState(getActiveEvents());
  const [dismissedEvents, setDismissedEvents] = useState([]);

  useEffect(() => {
    // Update season and events
    const checkSeasonAndEvents = () => {
      setCurrentSeason(getCurrentSeason());
      setActiveEvents(getActiveEvents());
    };

    checkSeasonAndEvents();

    // Check daily
    const interval = setInterval(checkSeasonAndEvents, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Load dismissed events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mood-garden-dismissed-events');
    if (saved) {
      const { events, date } = JSON.parse(saved);
      // Reset dismissals daily
      if (new Date(date).toDateString() === new Date().toDateString()) {
        setDismissedEvents(events);
      }
    }
  }, []);

  const dismissEvent = (eventId) => {
    const newDismissed = [...dismissedEvents, eventId];
    setDismissedEvents(newDismissed);
    localStorage.setItem('mood-garden-dismissed-events', JSON.stringify({
      events: newDismissed,
      date: new Date().toISOString(),
    }));
  };

  const getSeasonalPrompt = () => {
    const prompts = currentSeason.prompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const getEventPrompt = (eventId) => {
    const event = SPECIAL_EVENTS.find(e => e.id === eventId);
    if (!event) return null;
    return event.prompts[Math.floor(Math.random() * event.prompts.length)];
  };

  const visibleEvents = activeEvents.filter(e => !dismissedEvents.includes(e.id));

  return (
    <SeasonalContext.Provider value={{
      currentSeason,
      activeEvents,
      visibleEvents,
      dismissEvent,
      getSeasonalPrompt,
      getEventPrompt,
      hasActiveEvent: visibleEvents.length > 0,
    }}>
      {children}
    </SeasonalContext.Provider>
  );
};

export const useSeasonal = () => {
  const context = useContext(SeasonalContext);
  if (!context) {
    throw new Error('useSeasonal must be used within a SeasonalProvider');
  }
  return context;
};

// Seasonal Banner Component
const SeasonalBanner = ({ season, onDismiss }) => {
  const Icon = season.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r ${season.theme.gradient}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {season.greeting}
            </h3>
            <p className="text-white/80 text-sm">
              Welcome to {season.name} in your garden
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Event Card Component
const EventCard = ({ event, onDismiss, onUsePrompt }) => {
  const Icon = event.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r ${event.theme.gradient}`}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, white 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, white 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, white 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">{event.name}</h4>
              <p className="text-sm text-white/80">{event.greeting}</p>
            </div>
          </div>

          <button
            onClick={() => onDismiss?.(event.id)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/80" />
          </button>
        </div>

        {/* Rewards */}
        {event.rewards && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-white/70">Earn:</span>
            <div className="flex gap-1">
              {event.rewards.map((reward, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-lg"
                >
                  {reward}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <button
          onClick={() => onUsePrompt?.(event.prompts[0])}
          className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-colors"
        >
          Write with {event.name} prompt
        </button>
      </div>
    </motion.div>
  );
};

// Seasonal Events Panel
const SeasonalEventsPanel = ({ isOpen, onClose, onUsePrompt }) => {
  const { currentSeason, visibleEvents, dismissEvent, getSeasonalPrompt } = useSeasonal();

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
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${currentSeason.theme.gradient}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                Seasonal & Events
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Current Season */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Current Season
            </h3>
            <SeasonalBanner season={currentSeason} />
          </div>

          {/* Active Events */}
          {visibleEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Active Events
              </h3>
              <div className="space-y-3">
                {visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDismiss={dismissEvent}
                    onUsePrompt={onUsePrompt}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Seasonal Prompt */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sage-500" />
              Seasonal Prompt
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-3">
              "{getSeasonalPrompt()}"
            </p>
            <button
              onClick={() => {
                onUsePrompt?.(getSeasonalPrompt());
                onClose();
              }}
              className="text-sm text-sage-600 hover:text-sage-700 dark:text-sage-400 font-medium"
            >
              Use this prompt →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Compact Event Widget
const SeasonalWidget = ({ onOpenFull }) => {
  const { currentSeason, hasActiveEvent, visibleEvents } = useSeasonal();
  const Icon = currentSeason.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpenFull}
      className={`
        relative overflow-hidden w-full p-4 rounded-xl text-left
        bg-gradient-to-r ${currentSeason.theme.gradient}
      `}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-white" />
          <div>
            <p className="font-medium text-white">{currentSeason.name}</p>
            {hasActiveEvent && (
              <p className="text-xs text-white/80">
                {visibleEvents.length} active event{visibleEvents.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        {hasActiveEvent && (
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        )}
      </div>
    </motion.button>
  );
};

export { 
  SEASONS, 
  SPECIAL_EVENTS, 
  getCurrentSeason, 
  getActiveEvents,
  SeasonalBanner,
  EventCard,
  SeasonalEventsPanel,
  SeasonalWidget
};
export default SeasonalEventsPanel;
