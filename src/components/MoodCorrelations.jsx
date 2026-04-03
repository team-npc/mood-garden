/**
 * Mood Correlations Component
 * Track and analyze correlations between mood and activities/factors
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Activity, 
  Sun, 
  Moon, 
  Cloud, 
  Coffee, 
  Dumbbell,
  Users,
  Briefcase,
  Heart,
  Music,
  Book,
  Utensils,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  BarChart2,
  Save,
  Calendar
} from 'lucide-react';

/**
 * Trackable factors
 */
const FACTORS = {
  sleep: {
    icon: Moon,
    label: 'Sleep Quality',
    color: 'indigo',
    scale: ['Poor', 'Fair', 'Good', 'Great'],
    emoji: ['😩', '😐', '😊', '😴']
  },
  exercise: {
    icon: Dumbbell,
    label: 'Exercise',
    color: 'emerald',
    scale: ['None', 'Light', 'Moderate', 'Intense'],
    emoji: ['🛋️', '🚶', '🏃', '💪']
  },
  social: {
    icon: Users,
    label: 'Social Time',
    color: 'pink',
    scale: ['Alone', 'Little', 'Some', 'Lots'],
    emoji: ['🏠', '👤', '👥', '🎉']
  },
  work: {
    icon: Briefcase,
    label: 'Work Stress',
    color: 'amber',
    scale: ['Low', 'Medium', 'High', 'Extreme'],
    emoji: ['😌', '😐', '😤', '🤯']
  },
  caffeine: {
    icon: Coffee,
    label: 'Caffeine',
    color: 'yellow',
    scale: ['None', '1-2 cups', '3-4 cups', '5+ cups'],
    emoji: ['💧', '☕', '☕☕', '☕☕☕']
  },
  weather: {
    icon: Sun,
    label: 'Weather',
    color: 'sky',
    scale: ['Rainy', 'Cloudy', 'Partly Sunny', 'Sunny'],
    emoji: ['🌧️', '☁️', '⛅', '☀️']
  },
  nutrition: {
    icon: Utensils,
    label: 'Nutrition',
    color: 'lime',
    scale: ['Poor', 'Fair', 'Good', 'Excellent'],
    emoji: ['🍕', '🍔', '🥗', '🥑']
  },
  creativity: {
    icon: Music,
    label: 'Creative Time',
    color: 'violet',
    scale: ['None', 'Little', 'Some', 'Lots'],
    emoji: ['📺', '🎨', '🎭', '✨']
  }
};

/**
 * Calculate correlation coefficient
 */
const calculateCorrelation = (x, y) => {
  if (x.length !== y.length || x.length < 3) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
};

/**
 * Factor Slider Component
 */
const FactorSlider = ({ factorKey, value, onChange }) => {
  const factor = FACTORS[factorKey];
  const Icon = factor.icon;
  
  return (
    <div className="bg-deep-700/50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-${factor.color}-500/20 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${factor.color}-400`} />
        </div>
        <span className="text-cream-200 font-medium">{factor.label}</span>
      </div>
      
      <div className="flex justify-between gap-2">
        {factor.scale.map((label, index) => (
          <button
            key={index}
            onClick={() => onChange(factorKey, index)}
            className={`flex-1 py-2 px-1 rounded-lg text-center transition-all ${
              value === index
                ? `bg-${factor.color}-500/30 ring-2 ring-${factor.color}-400`
                : 'bg-deep-600/50 hover:bg-deep-600'
            }`}
          >
            <span className="text-xl block mb-1">{factor.emoji[index]}</span>
            <span className="text-xs text-cream-400">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Correlation Card
 */
const CorrelationCard = ({ factorKey, correlation, dataPoints }) => {
  const factor = FACTORS[factorKey];
  const Icon = factor.icon;
  
  const getCorrelationLabel = (corr) => {
    if (corr > 0.5) return { label: 'Strong +', color: 'emerald' };
    if (corr > 0.2) return { label: 'Moderate +', color: 'lime' };
    if (corr > -0.2) return { label: 'Weak', color: 'gray' };
    if (corr > -0.5) return { label: 'Moderate -', color: 'orange' };
    return { label: 'Strong -', color: 'red' };
  };
  
  const info = getCorrelationLabel(correlation);
  const percentage = Math.abs(Math.round(correlation * 100));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-deep-700/50 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${factor.color}-400`} />
          <span className="text-cream-200 font-medium">{factor.label}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full bg-${info.color}-500/20 text-${info.color}-400`}>
          {info.label}
        </span>
      </div>
      
      {/* Correlation bar - visual only */}
      <div className="relative h-2 bg-deep-600 rounded-full overflow-hidden mb-2">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 flex justify-end">
            {correlation < 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-red-500 rounded-r"
              />
            )}
          </div>
          <div className="w-px bg-cream-500/50" />
          <div className="w-1/2">
            {correlation > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-emerald-500 rounded-l"
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-cream-500">
        <span>Negative</span>
        <span>{dataPoints >= 10 ? 'Good data' : 'Gathering insights'}</span>
        <span>Positive</span>
      </div>
      
      <p className="text-xs text-cream-400 mt-2">
        {correlation > 0.3 && `Higher ${factor.label.toLowerCase()} tends to improve your mood`}
        {correlation < -0.3 && `Higher ${factor.label.toLowerCase()} tends to lower your mood`}
        {correlation >= -0.3 && correlation <= 0.3 && `No strong relationship detected yet`}
      </p>
    </motion.div>
  );
};

/**
 * Daily Log Component
 */
const DailyLog = ({ factors, mood, onFactorChange, onMoodChange, onSave }) => {
  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  
  return (
    <div className="space-y-4">
      {/* Mood selection */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-3">How are you feeling today?</h3>
        <div className="flex justify-between gap-2">
          {moodEmojis.map((emoji, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMoodChange(index)}
              className={`flex-1 py-3 rounded-xl text-2xl transition-all ${
                mood === index
                  ? 'bg-sage-500/30 ring-2 ring-sage-400'
                  : 'bg-deep-600/50 hover:bg-deep-600'
              }`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Factor sliders */}
      <div className="grid gap-3">
        {Object.keys(factors).map(key => (
          <FactorSlider
            key={key}
            factorKey={key}
            value={factors[key]}
            onChange={onFactorChange}
          />
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSave}
        disabled={mood === null}
        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
          mood !== null
            ? 'bg-gradient-to-r from-sage-500 to-leaf-500 text-white'
            : 'bg-deep-600 text-cream-500 cursor-not-allowed'
        }`}
      >
        <Save className="w-5 h-5" />
        Save Today's Log
      </motion.button>
    </div>
  );
};

/**
 * Main Mood Correlations Component
 */
const MoodCorrelations = ({ isOpen, onClose, entries = [] }) => {
  const [activeTab, setActiveTab] = useState('log');
  const [todayFactors, setTodayFactors] = useState({
    sleep: null,
    exercise: null,
    social: null,
    work: null,
    caffeine: null,
    weather: null,
    nutrition: null,
    creativity: null
  });
  const [todayMood, setTodayMood] = useState(null);
  const [logs, setLogs] = useState([]);

  // Load saved logs
  useEffect(() => {
    const saved = localStorage.getItem('moodCorrelationLogs');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const handleFactorChange = (factor, value) => {
    setTodayFactors(prev => ({ ...prev, [factor]: value }));
  };

  const handleSaveLog = () => {
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      mood: todayMood,
      factors: todayFactors
    };
    
    const updatedLogs = [newLog, ...logs.filter(l => l.date !== newLog.date)];
    setLogs(updatedLogs);
    localStorage.setItem('moodCorrelationLogs', JSON.stringify(updatedLogs));
    
    // Reset form
    setTodayFactors({
      sleep: null,
      exercise: null,
      social: null,
      work: null,
      caffeine: null,
      weather: null,
      nutrition: null,
      creativity: null
    });
    setTodayMood(null);
  };

  // Calculate correlations
  const correlations = useMemo(() => {
    const logsWithData = logs.filter(l => l.mood !== null);
    if (logsWithData.length < 3) return null;
    
    const moods = logsWithData.map(l => l.mood);
    const result = {};
    
    Object.keys(FACTORS).forEach(factor => {
      const factorValues = logsWithData
        .filter(l => l.factors[factor] !== null)
        .map(l => l.factors[factor]);
      const correspondingMoods = logsWithData
        .filter(l => l.factors[factor] !== null)
        .map(l => l.mood);
      
      if (factorValues.length >= 3) {
        result[factor] = {
          correlation: calculateCorrelation(factorValues, correspondingMoods),
          dataPoints: factorValues.length
        };
      }
    });
    
    return result;
  }, [logs]);

  // Recent log history
  const recentLogs = logs.slice(0, 7);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-deep-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Mood Correlations</h2>
                  <p className="text-sm text-violet-200">Discover what affects your mood</p>
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
          <div className="flex border-b border-deep-600">
            <button
              onClick={() => setActiveTab('log')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'log'
                  ? 'text-violet-400 border-b-2 border-violet-400'
                  : 'text-cream-400 hover:text-cream-200'
              }`}
            >
              Daily Log
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'text-violet-400 border-b-2 border-violet-400'
                  : 'text-cream-400 hover:text-cream-200'
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-violet-400 border-b-2 border-violet-400'
                  : 'text-cream-400 hover:text-cream-200'
              }`}
            >
              History
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {activeTab === 'log' && (
              <DailyLog
                factors={todayFactors}
                mood={todayMood}
                onFactorChange={handleFactorChange}
                onMoodChange={setTodayMood}
                onSave={handleSaveLog}
              />
            )}
            
            {activeTab === 'insights' && (
              <div className="space-y-4">
                {logs.length < 3 ? (
                  <div className="text-center py-12">
                    <BarChart2 className="w-12 h-12 text-cream-600 mx-auto mb-3" />
                    <h3 className="text-cream-300 font-medium mb-2">Not enough data yet</h3>
                    <p className="text-cream-500 text-sm">
                      Keep journaling to see correlation insights
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-cream-400 text-sm">
                      Based on your reflections, here's how factors correlate with your mood:
                    </p>
                    <div className="grid gap-3">
                      {correlations && Object.entries(correlations)
                        .sort(([,a], [,b]) => Math.abs(b.correlation) - Math.abs(a.correlation))
                        .map(([factor, data]) => (
                          <CorrelationCard
                            key={factor}
                            factorKey={factor}
                            correlation={data.correlation}
                            dataPoints={data.dataPoints}
                          />
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="space-y-3">
                {recentLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-cream-600 mx-auto mb-3" />
                    <h3 className="text-cream-300 font-medium mb-2">No logs yet</h3>
                    <p className="text-cream-500 text-sm">
                      Start tracking your daily factors and mood
                    </p>
                  </div>
                ) : (
                  recentLogs.map(log => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-deep-700/50 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-cream-300 font-medium">
                          {new Date(log.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-2xl">
                          {['😢', '😔', '😐', '🙂', '😊'][log.mood]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(log.factors)
                          .filter(([, val]) => val !== null)
                          .map(([key, val]) => (
                            <span 
                              key={key}
                              className="text-sm bg-deep-600/50 px-2 py-1 rounded-lg text-cream-400"
                            >
                              {FACTORS[key].emoji[val]} {FACTORS[key].label}
                            </span>
                          ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodCorrelations;
