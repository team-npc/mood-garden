/**
 * AI Mood Insights Component
 * Pattern analysis and predictions like "You tend to feel anxious on Mondays"
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

/**
 * Analyze patterns in journal entries
 */
const analyzePatterns = (entries) => {
  if (entries.length < 5) {
    return { hasEnoughData: false, patterns: [], insights: [], predictions: [] };
  }

  const patterns = [];
  const insights = [];
  const predictions = [];

  // Group entries by day of week
  const dayOfWeekMoods = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Group by time of day
  const timeOfDayMoods = { morning: [], afternoon: [], evening: [], night: [] };
  
  // Group by month
  const monthMoods = {};
  
  // Track mood sequences
  const moodSequences = [];
  
  entries.forEach((entry, index) => {
    const date = entry.createdAt?.toDate?.() || new Date(entry.createdAt);
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const month = date.getMonth();
    
    dayOfWeekMoods[dayOfWeek].push(entry.mood);
    
    if (hour >= 5 && hour < 12) timeOfDayMoods.morning.push(entry.mood);
    else if (hour >= 12 && hour < 17) timeOfDayMoods.afternoon.push(entry.mood);
    else if (hour >= 17 && hour < 21) timeOfDayMoods.evening.push(entry.mood);
    else timeOfDayMoods.night.push(entry.mood);
    
    if (!monthMoods[month]) monthMoods[month] = [];
    monthMoods[month].push(entry.mood);
    
    // Track mood sequences (what mood typically follows another)
    if (index > 0) {
      moodSequences.push({
        from: entries[index - 1].mood,
        to: entry.mood
      });
    }
  });

  // Analyze day of week patterns
  Object.entries(dayOfWeekMoods).forEach(([day, moods]) => {
    if (moods.length >= 3) {
      const moodCounts = {};
      moods.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
      
      const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (dominantMood && dominantMood[1] / moods.length >= 0.5) {
        const dayName = dayNames[parseInt(day)];
        const moodEmoji = dominantMood[0];
        
        patterns.push({
          type: 'day_pattern',
          day: dayName,
          mood: moodEmoji,
          confidence: Math.round((dominantMood[1] / moods.length) * 100),
          description: `You often feel ${getMoodName(moodEmoji)} on ${dayName}s`,
          icon: Calendar
        });
      }
    }
  });

  // Analyze time of day patterns
  Object.entries(timeOfDayMoods).forEach(([time, moods]) => {
    if (moods.length >= 5) {
      const moodCounts = {};
      moods.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
      
      const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (dominantMood && dominantMood[1] / moods.length >= 0.4) {
        const timeNames = {
          morning: 'morning',
          afternoon: 'afternoon', 
          evening: 'evening',
          night: 'late night'
        };
        
        patterns.push({
          type: 'time_pattern',
          time: time,
          mood: dominantMood[0],
          confidence: Math.round((dominantMood[1] / moods.length) * 100),
          description: `Your ${timeNames[time]} mood is usually ${getMoodName(dominantMood[0])}`,
          icon: Clock
        });
      }
    }
  });

  // Analyze mood trends
  const recentEntries = entries.slice(0, 10);
  const olderEntries = entries.slice(10, 20);
  
  if (recentEntries.length >= 5 && olderEntries.length >= 5) {
    const positiveRecent = recentEntries.filter(e => ['😊', '😌'].includes(e.mood)).length;
    const positiveOlder = olderEntries.filter(e => ['😊', '😌'].includes(e.mood)).length;
    
    const recentRatio = positiveRecent / recentEntries.length;
    const olderRatio = positiveOlder / olderEntries.length;
    
    if (recentRatio > olderRatio + 0.2) {
      insights.push({
        type: 'trend',
        direction: 'up',
        description: 'Your mood has been improving lately! Keep up the positive momentum.',
        icon: TrendingUp,
        sentiment: 'positive'
      });
    } else if (recentRatio < olderRatio - 0.2) {
      insights.push({
        type: 'trend',
        direction: 'down',
        description: 'Your recent entries show more challenging moods. Remember, it\'s okay to have difficult times.',
        icon: TrendingDown,
        sentiment: 'neutral'
      });
    }
  }

  // Analyze mood recovery patterns
  let recoverySuccess = 0;
  let recoveryTotal = 0;
  
  moodSequences.forEach(seq => {
    if (['😢', '😤', '😰'].includes(seq.from)) {
      recoveryTotal++;
      if (['😊', '😌'].includes(seq.to)) {
        recoverySuccess++;
      }
    }
  });
  
  if (recoveryTotal >= 3) {
    const recoveryRate = recoverySuccess / recoveryTotal;
    if (recoveryRate >= 0.5) {
      insights.push({
        type: 'recovery',
        description: `You have a ${Math.round(recoveryRate * 100)}% recovery rate - you bounce back well from difficult moods!`,
        icon: Sparkles,
        sentiment: 'positive'
      });
    }
  }

  // Generate predictions
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  
  // Predict based on day pattern
  const todaysMoods = dayOfWeekMoods[currentDay];
  if (todaysMoods.length >= 3) {
    const moodCounts = {};
    todaysMoods.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
    const likely = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];
    
    if (likely && likely[1] / todaysMoods.length >= 0.4) {
      predictions.push({
        type: 'daily',
        mood: likely[0],
        confidence: Math.round((likely[1] / todaysMoods.length) * 100),
        description: `Based on patterns, you might feel ${getMoodName(likely[0])} today`,
        suggestion: getSuggestion(likely[0])
      });
    }
  }

  // Check for concerning patterns
  const recentNegative = entries.slice(0, 5).filter(e => 
    ['😢', '😤', '😰'].includes(e.mood)
  ).length;
  
  if (recentNegative >= 4) {
    insights.push({
      type: 'alert',
      description: 'You\'ve been experiencing difficult emotions recently. Consider reaching out to someone you trust.',
      icon: AlertTriangle,
      sentiment: 'concern'
    });
  }

  return { hasEnoughData: true, patterns, insights, predictions };
};

/**
 * Get mood name from emoji
 */
const getMoodName = (emoji) => {
  const names = {
    '😊': 'happy',
    '😢': 'sad',
    '😤': 'frustrated',
    '😴': 'tired',
    '😰': 'anxious',
    '😌': 'calm'
  };
  return names[emoji] || 'neutral';
};

/**
 * Get suggestion based on predicted mood
 */
const getSuggestion = (mood) => {
  const suggestions = {
    '😊': 'A great day to share your positivity with others!',
    '😢': 'Consider some self-care activities that usually help.',
    '😤': 'Try a calming activity or breathing exercise.',
    '😴': 'Maybe get some extra rest if you can.',
    '😰': 'Deep breathing or a walk might help center you.',
    '😌': 'A perfect day for reflection or creative activities.'
  };
  return suggestions[mood] || '';
};

/**
 * Pattern Card Component
 */
const PatternCard = ({ pattern }) => {
  const Icon = pattern.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-deep-700 rounded-xl border border-deep-600"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-xl">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{pattern.mood}</span>
            <span className="text-sm text-indigo-400 font-medium">
              {pattern.confidence}% confidence
            </span>
          </div>
          <p className="text-sm text-cream-300">{pattern.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Insight Card Component
 */
const InsightCard = ({ insight }) => {
  const Icon = insight.icon;
  const bgColors = {
    positive: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    neutral: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
    concern: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl bg-gradient-to-r ${bgColors[insight.sentiment]} border`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${
          insight.sentiment === 'positive' ? 'text-green-400' :
          insight.sentiment === 'concern' ? 'text-amber-400' : 'text-blue-400'
        }`} />
        <p className="text-sm text-cream-200">{insight.description}</p>
      </div>
    </motion.div>
  );
};

/**
 * Prediction Card Component
 */
const PredictionCard = ({ prediction }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
  >
    <div className="flex items-center gap-3 mb-2">
      <span className="text-3xl">{prediction.mood}</span>
      <div>
        <div className="text-sm font-medium text-cream-200">
          Today's Mood Prediction
        </div>
        <div className="text-xs text-purple-400">
          {prediction.confidence}% likely
        </div>
      </div>
    </div>
    <p className="text-sm text-cream-400 mb-2">{prediction.description}</p>
    {prediction.suggestion && (
      <p className="text-xs text-cream-500 italic">💡 {prediction.suggestion}</p>
    )}
  </motion.div>
);

/**
 * Main AI Mood Insights Component
 */
const AIMoodInsights = ({ isOpen, onClose, entries = [] }) => {
  const analysis = useMemo(() => analyzePatterns(entries), [entries]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Mood Insights</h2>
                <p className="text-sm text-cream-200">AI-powered pattern analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {!analysis.hasEnoughData ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-cream-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-cream-300 mb-2">
                Not Enough Data Yet
              </h3>
              <p className="text-sm text-cream-500">
                Write at least 5 journal entries to unlock mood insights and pattern analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Predictions */}
              {analysis.predictions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-cream-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Today's Prediction
                  </h3>
                  {analysis.predictions.map((pred, i) => (
                    <PredictionCard key={i} prediction={pred} />
                  ))}
                </div>
              )}
              
              {/* Insights */}
              {analysis.insights.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-cream-400 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Insights
                  </h3>
                  <div className="space-y-3">
                    {analysis.insights.map((insight, i) => (
                      <InsightCard key={i} insight={insight} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Patterns */}
              {analysis.patterns.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-cream-400 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Patterns Detected
                  </h3>
                  <div className="space-y-3">
                    {analysis.patterns.map((pattern, i) => (
                      <PatternCard key={i} pattern={pattern} />
                    ))}
                  </div>
                </div>
              )}
              
              {analysis.patterns.length === 0 && analysis.insights.length === 0 && (
                <div className="text-center py-4 text-cream-500">
                  <p>Keep journaling to discover more patterns!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AIMoodInsights;
