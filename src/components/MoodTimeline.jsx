/**
 * Mood Timeline Visualization Component
 * Beautiful interactive mood charts and visualizations
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  TrendingUp,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Sparkles
} from 'lucide-react';

// Mood to color mapping
const MOOD_COLORS = {
  '😊': { bg: 'bg-yellow-400', color: '#fbbf24', label: 'Happy' },
  '😄': { bg: 'bg-yellow-500', color: '#f59e0b', label: 'Joyful' },
  '🥰': { bg: 'bg-pink-400', color: '#f472b6', label: 'Loving' },
  '😌': { bg: 'bg-green-400', color: '#4ade80', label: 'Content' },
  '🤔': { bg: 'bg-blue-400', color: '#60a5fa', label: 'Thoughtful' },
  '😢': { bg: 'bg-indigo-400', color: '#818cf8', label: 'Sad' },
  '😤': { bg: 'bg-red-400', color: '#f87171', label: 'Frustrated' },
  '😴': { bg: 'bg-purple-400', color: '#c084fc', label: 'Tired' },
  '😰': { bg: 'bg-orange-400', color: '#fb923c', label: 'Anxious' },
  '🤗': { bg: 'bg-rose-400', color: '#fb7185', label: 'Grateful' },
  '😎': { bg: 'bg-cyan-400', color: '#22d3ee', label: 'Confident' },
  '🙏': { bg: 'bg-amber-400', color: '#fbbf24', label: 'Hopeful' },
  'default': { bg: 'bg-gray-400', color: '#9ca3af', label: 'Neutral' }
};

const getMoodConfig = (mood) => MOOD_COLORS[mood] || MOOD_COLORS.default;

// Mood score mapping (for visualization purposes)
const getMoodScore = (mood) => {
  const positiveEmojis = ['😊', '😄', '🥰', '😌', '🤗', '😎', '🙏'];
  const neutralEmojis = ['🤔'];
  const negativeEmojis = ['😢', '😤', '😴', '😰'];
  
  if (positiveEmojis.includes(mood)) return 0.8 + Math.random() * 0.2;
  if (neutralEmojis.includes(mood)) return 0.4 + Math.random() * 0.2;
  if (negativeEmojis.includes(mood)) return 0.1 + Math.random() * 0.3;
  return 0.5;
};

// Generate days for calendar
const generateCalendarDays = (year, month, entries = []) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push({ day: null, entries: [] });
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateStr = date.toISOString().split('T')[0];
    const dayEntries = entries.filter(e => {
      const entryDate = new Date(e.createdAt?.seconds * 1000 || e.createdAt);
      return entryDate.toISOString().split('T')[0] === dateStr;
    });
    
    days.push({
      day: i,
      date,
      entries: dayEntries,
      moods: dayEntries.map(e => e.mood).filter(Boolean)
    });
  }
  
  return days;
};

// Calendar Heatmap Component
const MoodCalendar = ({ entries = [], onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const days = useMemo(() => 
    generateCalendarDays(year, month, entries),
    [year, month, entries]
  );

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {monthName}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayData, index) => (
          <motion.button
            key={index}
            whileHover={dayData.day ? { scale: 1.1 } : {}}
            whileTap={dayData.day ? { scale: 0.95 } : {}}
            onClick={() => dayData.day && onDayClick?.(dayData)}
            disabled={!dayData.day}
            className={`
              aspect-square rounded-lg relative overflow-hidden
              ${dayData.day ? 'cursor-pointer' : 'cursor-default'}
              ${isToday(dayData.day) ? 'ring-2 ring-sage-400 ring-offset-2' : ''}
              ${dayData.entries.length > 0 
                ? 'bg-sage-100 dark:bg-sage-900/50' 
                : dayData.day 
                  ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700' 
                  : 'bg-transparent'
              }
              transition-all duration-200
            `}
          >
            {dayData.day && (
              <>
                <span className={`
                  text-sm font-medium
                  ${isToday(dayData.day) 
                    ? 'text-sage-600 dark:text-sage-300' 
                    : 'text-gray-700 dark:text-gray-300'
                  }
                `}>
                  {dayData.day}
                </span>
                
                {/* Mood Indicators */}
                {dayData.moods.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {dayData.moods.slice(0, 3).map((mood, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${getMoodConfig(mood).bg}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Mood Distribution Chart
const MoodDistribution = ({ entries = [] }) => {
  const moodCounts = useMemo(() => {
    const counts = {};
    entries.forEach(entry => {
      if (entry.mood) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: (count / entries.length) * 100,
        config: getMoodConfig(mood)
      }))
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  const maxCount = Math.max(...moodCounts.map(m => m.count), 1);

  if (moodCounts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No mood data yet. Start journaling with moods!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {moodCounts.map((item, index) => (
        <motion.div
          key={item.mood}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-3"
        >
          <span className="text-2xl w-10 flex-shrink-0">{item.mood}</span>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.config.label}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.count} ({Math.round(item.percentage)}%)
              </span>
            </div>
            
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / maxCount) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.config.color }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Weekly Mood Trend
const WeeklyMoodTrend = ({ entries = [] }) => {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEntries = entries.filter(e => {
        const entryDate = new Date(e.createdAt?.seconds * 1000 || e.createdAt);
        return entryDate.toISOString().split('T')[0] === dateStr;
      });
      
      const avgScore = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + getMoodScore(e.mood), 0) / dayEntries.length
        : null;
      
      days.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        entries: dayEntries,
        avgScore,
        mood: dayEntries[0]?.mood
      });
    }
    
    return days;
  }, [entries]);

  const maxHeight = 120;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-40">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            {/* Bar */}
            <div className="w-full flex flex-col items-center justify-end" style={{ height: maxHeight }}>
              {day.avgScore !== null ? (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: day.avgScore * maxHeight }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-sage-400 to-sage-300 dark:from-sage-600 dark:to-sage-500 relative group cursor-pointer"
                >
                  {/* Mood emoji on hover */}
                  {day.mood && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xl">{day.mood}</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="w-full max-w-8 h-2 rounded bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
            
            {/* Label */}
            <div className="text-center">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {day.dayName}
              </p>
              <p className="text-xs text-gray-500">
                {day.dayNum}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-sage-400" />
          <span>Positive</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-300" />
          <span>No entry</span>
        </div>
      </div>
    </div>
  );
};

// Main Mood Timeline Component
const MoodTimeline = ({ entries = [], isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDay, setSelectedDay] = useState(null);

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'trend', label: 'Weekly', icon: Activity },
    { id: 'distribution', label: 'Moods', icon: BarChart3 }
  ];

  const handleDayClick = (dayData) => {
    if (dayData.entries.length > 0) {
      setSelectedDay(dayData);
    }
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
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-sage-500" />
              Mood Timeline
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl
                    transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <MoodCalendar entries={entries} onDayClick={handleDayClick} />
              </motion.div>
            )}
            
            {activeTab === 'trend' && (
              <motion.div
                key="trend"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <WeeklyMoodTrend entries={entries} />
              </motion.div>
            )}
            
            {activeTab === 'distribution' && (
              <motion.div
                key="distribution"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <MoodDistribution entries={entries} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Day Detail */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedDay.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {selectedDay.entries.map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    {entry.mood && (
                      <span className="text-2xl">{entry.mood}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {entry.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(entry.createdAt?.seconds * 1000 || entry.createdAt)
                          .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export { MoodCalendar, MoodDistribution, WeeklyMoodTrend };
export default MoodTimeline;
