/**
 * Gratitude Prompts Component
 * Daily "3 things I'm grateful for" mini-entries
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, Check, ChevronRight, Calendar } from 'lucide-react';

const GRATITUDE_KEY = 'mood-garden-gratitude';

/**
 * Get today's date string
 */
const getTodayKey = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Gratitude prompt suggestions
 */
const GRATITUDE_SUGGESTIONS = [
  "Something that made you smile today",
  "A person you're thankful for",
  "A small comfort you enjoyed",
  "Something beautiful you noticed",
  "A skill or ability you have",
  "A memory that brings you joy",
  "Something you're looking forward to",
  "A challenge that helped you grow",
  "Food or drink you enjoyed",
  "A moment of peace you experienced",
  "Something that went well today",
  "A kindness someone showed you",
  "Your health or body",
  "Nature around you",
  "A cozy place you have",
  "Music, art, or entertainment you love",
  "A lesson you learned recently",
  "Technology that makes life easier",
  "Freedom you have",
  "A pet or animal you love"
];

/**
 * Get random suggestions
 */
const getRandomSuggestions = (count = 3) => {
  const shuffled = [...GRATITUDE_SUGGESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Gratitude Entry Component
 */
const GratitudeEntry = ({ index, value, onChange, suggestion, isComplete }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative rounded-2xl border transition-all ${
        isComplete
          ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/30'
          : isFocused
            ? 'bg-deep-600 border-rose-500/50'
            : 'bg-deep-700 border-deep-500'
      }`}
    >
      <div className="flex items-start p-4 gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isComplete
            ? 'bg-pink-500 text-white'
            : 'bg-deep-600 text-cream-400'
        }`}>
          {isComplete ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
        </div>
        
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={suggestion || "What are you grateful for?"}
            className="w-full bg-transparent text-cream-100 placeholder-cream-500 resize-none outline-none text-sm min-h-[60px]"
            rows={2}
          />
        </div>
      </div>
      
      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-2 -top-2"
        >
          <span className="text-2xl">💖</span>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Gratitude Practice Display - Qualitative, no numbers
 */
const GratitudeStreak = ({ streak, bestStreak }) => {
  // Get qualitative descriptions
  const getPracticeStatus = (s) => {
    if (s >= 30) return { emoji: '🌟', label: 'Flourishing' };
    if (s >= 14) return { emoji: '🌸', label: 'Blooming' };
    if (s >= 7) return { emoji: '🌿', label: 'Growing' };
    if (s >= 3) return { emoji: '🌱', label: 'Sprouting' };
    return { emoji: '✨', label: 'Beginning' };
  };
  
  const current = getPracticeStatus(streak);
  const best = getPracticeStatus(bestStreak);
  
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      <div className="text-center">
        <div className="text-2xl">{current.emoji}</div>
        <div className="text-sm font-medium text-pink-400">{current.label}</div>
        <div className="text-xs text-cream-500">Your practice</div>
      </div>
      <div className="w-px h-8 bg-deep-600" />
      <div className="text-center">
        <div className="text-2xl">{best.emoji}</div>
        <div className="text-sm font-medium text-rose-400">{best.label}</div>
        <div className="text-xs text-cream-500">Best so far</div>
      </div>
    </div>
  );
};

/**
 * Main Gratitude Prompts Modal
 */
const GratitudePrompts = ({ isOpen, onClose, onSaveToJournal }) => {
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [suggestions] = useState(getRandomSuggestions(3));
  const [savedToday, setSavedToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(GRATITUDE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const todayKey = getTodayKey();
        
        // Check if already completed today
        if (data.lastDate === todayKey && data.todayGratitudes) {
          setGratitudes(data.todayGratitudes);
          setSavedToday(true);
        }
        
        setStreak(data.streak || 0);
        setBestStreak(data.bestStreak || 0);
        setHistory(data.history || []);
      } catch (e) {
        console.error('Error loading gratitude data:', e);
      }
    }
  }, []);
  
  // Calculate if entry is complete
  const isEntryComplete = (value) => value.trim().length >= 3;
  const allComplete = gratitudes.every(isEntryComplete);
  
  // Save gratitudes
  const handleSave = useCallback(() => {
    const todayKey = getTodayKey();
    const saved = JSON.parse(localStorage.getItem(GRATITUDE_KEY) || '{}');
    
    // Calculate new streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    let newStreak = saved.lastDate === yesterdayKey ? (saved.streak || 0) + 1 : 1;
    if (saved.lastDate === todayKey) {
      newStreak = saved.streak || 1; // Already saved today
    }
    
    const newBestStreak = Math.max(newStreak, saved.bestStreak || 0);
    
    // Add to history
    const newHistory = [
      { date: todayKey, gratitudes: gratitudes.filter(g => g.trim()) },
      ...(saved.history || []).slice(0, 29) // Keep last 30 days
    ];
    
    // Save
    const newData = {
      lastDate: todayKey,
      todayGratitudes: gratitudes,
      streak: newStreak,
      bestStreak: newBestStreak,
      history: newHistory
    };
    
    localStorage.setItem(GRATITUDE_KEY, JSON.stringify(newData));
    setStreak(newStreak);
    setBestStreak(newBestStreak);
    setHistory(newHistory);
    setSavedToday(true);
    
    // Optionally save to journal
    if (onSaveToJournal) {
      const journalContent = `🙏 Today I'm grateful for:\n\n` +
        gratitudes.filter(g => g.trim()).map((g, i) => `${i + 1}. ${g}`).join('\n');
      onSaveToJournal(journalContent, '😊', ['gratitude']);
    }
  }, [gratitudes, onSaveToJournal]);
  
  const updateGratitude = (index, value) => {
    const newGratitudes = [...gratitudes];
    newGratitudes[index] = value;
    setGratitudes(newGratitudes);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" fill="currentColor" />
              <div>
                <h2 className="text-xl font-bold">Daily Gratitude</h2>
                <p className="text-sm text-cream-200">3 things you're thankful for</p>
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
          {/* Streak Display */}
          <GratitudeStreak streak={streak} bestStreak={bestStreak} />
          
          {/* Toggle History */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-3 bg-deep-700 rounded-xl mb-4 text-sm text-cream-400 hover:bg-deep-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View History
            </span>
            <ChevronRight className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-center text-cream-500 text-sm py-4">
                      No history yet. Start your gratitude practice today!
                    </p>
                  ) : (
                    history.slice(0, 7).map((entry, i) => (
                      <div key={i} className="p-3 bg-deep-700/50 rounded-xl">
                        <div className="text-xs text-cream-500 mb-1">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-cream-300">
                          {entry.gratitudes.join(' • ')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Gratitude Entries */}
          <div className="space-y-4">
            {gratitudes.map((value, index) => (
              <GratitudeEntry
                key={index}
                index={index}
                value={value}
                onChange={(val) => updateGratitude(index, val)}
                suggestion={suggestions[index]}
                isComplete={isEntryComplete(value)}
              />
            ))}
          </div>
          
          {/* Completion Message */}
          <AnimatePresence>
            {allComplete && !savedToday && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl border border-pink-500/30 text-center"
              >
                <Sparkles className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <p className="text-cream-200 text-sm">
                  Wonderful! You've reflected on 3 blessings today. 💖
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {savedToday && (
            <div className="mt-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30 text-center">
              <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-cream-200 text-sm">
                Today's gratitude saved! See you tomorrow. 🌟
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-deep-600">
          <button
            onClick={handleSave}
            disabled={!allComplete || savedToday}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              allComplete && !savedToday
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400'
                : 'bg-deep-700 text-cream-500 cursor-not-allowed'
            }`}
          >
            {savedToday ? 'Completed for Today ✓' : 'Save & Add to Journal'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GratitudePrompts;
