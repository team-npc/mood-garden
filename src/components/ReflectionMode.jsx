/**
 * Reflection Mode Component
 * Read-only view of past entries with inspirational quotes
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Shuffle,
  Calendar,
  Quote,
  Heart
} from 'lucide-react';

/**
 * Inspirational quotes for reflection
 */
const REFLECTION_QUOTES = [
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "Your mind is a garden, your thoughts are the seeds.", author: "Unknown" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The only journey is the one within.", author: "Rainer Maria Rilke" },
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
  { text: "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.", author: "Unknown" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "We do not learn from experience. We learn from reflecting on experience.", author: "John Dewey" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" }
];

/**
 * Get entries from a specific time period
 */
const getEntriesFromPeriod = (entries, period) => {
  const now = new Date();
  
  switch (period) {
    case 'week':
      return entries.filter(e => {
        const entryDate = new Date(e.createdAt);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= weekAgo;
      });
    case 'month':
      return entries.filter(e => {
        const entryDate = new Date(e.createdAt);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return entryDate >= monthAgo;
      });
    case 'year':
      return entries.filter(e => {
        const entryDate = new Date(e.createdAt);
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return entryDate >= yearAgo;
      });
    case 'random':
      return [...entries].sort(() => Math.random() - 0.5).slice(0, 10);
    default:
      return entries;
  }
};

/**
 * Reflection Mode Modal
 */
const ReflectionMode = ({ entries = [], isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [period, setPeriod] = useState('random');
  const [quote, setQuote] = useState(REFLECTION_QUOTES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredEntries = useMemo(() => 
    getEntriesFromPeriod(entries, period),
    [entries, period]
  );

  const currentEntry = filteredEntries[currentIndex] || null;

  // Change quote when entry changes
  useEffect(() => {
    const randomQuote = REFLECTION_QUOTES[Math.floor(Math.random() * REFLECTION_QUOTES.length)];
    setQuote(randomQuote);
  }, [currentIndex]);

  // Auto-play slideshow
  useEffect(() => {
    let interval;
    if (isPlaying && filteredEntries.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredEntries.length);
      }, 8000); // 8 seconds per entry
    }
    return () => clearInterval(interval);
  }, [isPlaying, filteredEntries.length]);

  const goNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredEntries.length);
  };

  const goPrev = () => {
    setCurrentIndex(prev => (prev - 1 + filteredEntries.length) % filteredEntries.length);
  };

  const shuffleEntries = () => {
    setPeriod('random');
    setCurrentIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-deep-900/95 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-deep-700">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-6 h-6 text-leaf-400" />
            <div>
              <h2 className="text-xl font-bold text-cream-100">Reflection Mode</h2>
              <p className="text-sm text-cream-400">
                {filteredEntries.length} entries to reflect on
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setCurrentIndex(0);
              }}
              className="bg-deep-700 border border-deep-500 rounded-xl px-4 py-2 text-cream-100"
            >
              <option value="random">Random Selection</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

            {/* Shuffle Button */}
            <button
              onClick={shuffleEntries}
              className="p-2 hover:bg-deep-700 rounded-xl transition-colors text-cream-400 hover:text-cream-100"
              title="Shuffle entries"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl transition-colors ${
                isPlaying 
                  ? 'bg-leaf-600 text-white' 
                  : 'bg-deep-700 text-cream-300 hover:bg-deep-600'
              }`}
            >
              {isPlaying ? 'Pause' : 'Auto-Play'}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-deep-700 rounded-xl transition-colors text-cream-400 hover:text-cream-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          {filteredEntries.length > 0 && currentEntry ? (
            <div className="max-w-3xl w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEntry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Entry Card */}
                  <div className="bg-deep-800/50 backdrop-blur-sm rounded-2xl p-8 border border-deep-600">
                    {/* Entry Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        {currentEntry.mood && (
                          <span className="text-4xl">{currentEntry.mood}</span>
                        )}
                        <div>
                          <div className="flex items-center space-x-2 text-cream-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(currentEntry.createdAt).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {currentEntry.isPinned && (
                        <Heart className="w-5 h-5 text-pink-400 fill-current" />
                      )}
                    </div>

                    {/* Entry Content */}
                    <div className="text-cream-100 text-lg leading-relaxed whitespace-pre-wrap max-h-[40vh] overflow-y-auto">
                      {currentEntry.content}
                    </div>

                    {/* Tags */}
                    {currentEntry.tags && currentEntry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-deep-600">
                        {currentEntry.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-sage-600/30 text-sage-300 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inspirational Quote */}
                  <div className="text-center">
                    <div className="inline-flex items-start space-x-2 text-cream-400 italic max-w-2xl">
                      <Quote className="w-5 h-5 flex-shrink-0 mt-1 opacity-50" />
                      <div>
                        <p className="text-lg">"{quote.text}"</p>
                        <p className="text-sm mt-2 text-cream-500">— {quote.author}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto text-cream-600 mb-4" />
              <h3 className="text-xl font-medium text-cream-300 mb-2">No Entries Found</h3>
              <p className="text-cream-500">
                Try selecting a different time period or start journaling to see your reflections here.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        {filteredEntries.length > 1 && (
          <div className="flex items-center justify-center p-6 border-t border-deep-700 space-x-8">
            <button
              onClick={goPrev}
              className="p-3 bg-deep-700 hover:bg-deep-600 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-cream-300" />
            </button>

            <div className="flex items-center space-x-2">
              {filteredEntries.slice(0, 10).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'bg-leaf-400 w-4' 
                      : 'bg-deep-600 hover:bg-deep-500'
                  }`}
                />
              ))}
              {filteredEntries.length > 10 && (
                <span className="text-sm text-cream-500 ml-2">
                  +{filteredEntries.length - 10} more
                </span>
              )}
            </div>

            <button
              onClick={goNext}
              className="p-3 bg-deep-700 hover:bg-deep-600 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-cream-300" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReflectionMode;
