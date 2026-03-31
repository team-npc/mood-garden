/**
 * Smart Writing Coach Component
 * Real-time writing suggestions and improvements
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lightbulb, 
  PenTool, 
  Sparkles,
  ChevronRight,
  MessageCircle,
  Heart,
  Target,
  Zap
} from 'lucide-react';

/**
 * Writing tip categories
 */
const TIP_CATEGORIES = {
  depth: {
    icon: Target,
    color: 'blue',
    label: 'Go Deeper',
    tips: [
      'What emotions were you feeling in that moment?',
      'How did this affect your body physically?',
      'What thoughts were running through your mind?',
      'Why do you think you reacted that way?',
      'What does this remind you of from the past?',
      'How would you like to feel about this in the future?'
    ]
  },
  gratitude: {
    icon: Heart,
    color: 'pink',
    label: 'Gratitude',
    tips: [
      'What\'s something small that made you smile today?',
      'Who helped you today, even in a tiny way?',
      'What about your body are you grateful for?',
      'What skill or ability are you thankful for?',
      'What opportunity did today bring?',
      'What challenge helped you grow?'
    ]
  },
  clarity: {
    icon: Sparkles,
    color: 'amber',
    label: 'Get Specific',
    tips: [
      'Can you describe this in more detail?',
      'What did you see, hear, or feel?',
      'Who else was involved?',
      'When exactly did this happen?',
      'What led up to this moment?',
      'What happened immediately after?'
    ]
  },
  insight: {
    icon: Lightbulb,
    color: 'emerald',
    label: 'Find Insight',
    tips: [
      'What lesson can you take from this?',
      'What would you tell a friend in this situation?',
      'What pattern do you notice here?',
      'What would you do differently?',
      'What strength did you show?',
      'What are you learning about yourself?'
    ]
  }
};

/**
 * Writing patterns to detect
 */
const PATTERNS = {
  vague: {
    patterns: [/it was (good|bad|okay|fine)/i, /things (are|were) (okay|fine)/i, /i feel (okay|fine)/i],
    suggestion: 'Try being more specific about what made it good or bad'
  },
  negative: {
    patterns: [/i (can't|cannot|won't|never)/i, /i (always|never) (fail|mess|screw)/i],
    suggestion: 'Try reframing with "I\'m working on..." or "I\'m learning to..."'
  },
  short: {
    minLength: 50,
    suggestion: 'Your entry is quite short. Try expanding on your thoughts.'
  },
  noEmotion: {
    emotionWords: ['happy', 'sad', 'angry', 'anxious', 'excited', 'worried', 'grateful', 'frustrated', 'peaceful', 'stressed', 'loved', 'lonely', 'hopeful', 'fearful'],
    suggestion: 'Consider adding how you felt emotionally'
  }
};

/**
 * Get contextual suggestions based on text
 */
const getContextualSuggestions = (text) => {
  const suggestions = [];
  const lowerText = text.toLowerCase();
  
  // Check for vague language
  for (const pattern of PATTERNS.vague.patterns) {
    if (pattern.test(lowerText)) {
      suggestions.push({
        type: 'vague',
        message: PATTERNS.vague.suggestion,
        category: 'clarity'
      });
      break;
    }
  }
  
  // Check for negative self-talk
  for (const pattern of PATTERNS.negative.patterns) {
    if (pattern.test(lowerText)) {
      suggestions.push({
        type: 'negative',
        message: PATTERNS.negative.suggestion,
        category: 'insight'
      });
      break;
    }
  }
  
  // Check for short entries
  if (text.length > 0 && text.length < PATTERNS.short.minLength) {
    suggestions.push({
      type: 'short',
      message: PATTERNS.short.suggestion,
      category: 'depth'
    });
  }
  
  // Check for emotion words
  const hasEmotion = PATTERNS.noEmotion.emotionWords.some(word => lowerText.includes(word));
  if (text.length > 30 && !hasEmotion) {
    suggestions.push({
      type: 'noEmotion',
      message: PATTERNS.noEmotion.suggestion,
      category: 'depth'
    });
  }
  
  return suggestions;
};

/**
 * Get word count and reading stats
 */
const getWritingStats = (text) => {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordLength = words.length > 0 
    ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1)
    : 0;
  
  return {
    words: words.length,
    sentences: sentences.length,
    avgWordLength,
    readingTime: Math.ceil(words.length / 200) // avg reading speed
  };
};

/**
 * Suggestion Card Component
 */
const SuggestionCard = ({ suggestion, onDismiss }) => {
  const category = TIP_CATEGORIES[suggestion.category];
  const Icon = category?.icon || Lightbulb;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-${category?.color || 'blue'}-500/10 border border-${category?.color || 'blue'}-500/30 rounded-xl p-3`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 bg-${category?.color || 'blue'}-500/20 rounded-lg shrink-0`}>
          <Icon className={`w-4 h-4 text-${category?.color || 'blue'}-400`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-${category?.color || 'blue'}-300 text-sm font-medium mb-1`}>
            {category?.label || 'Tip'}
          </p>
          <p className="text-cream-300 text-sm">{suggestion.message}</p>
        </div>
        <button
          onClick={() => onDismiss(suggestion.type)}
          className="p-1 hover:bg-deep-600 rounded-lg shrink-0"
        >
          <X className="w-4 h-4 text-cream-500" />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Writing Prompt Card
 */
const PromptCard = ({ tip, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full text-left p-3 bg-deep-600/50 hover:bg-deep-600 rounded-xl transition-colors flex items-center gap-3"
  >
    <ChevronRight className="w-4 h-4 text-sage-400 shrink-0" />
    <span className="text-cream-300 text-sm">{tip}</span>
  </motion.button>
);

/**
 * Main Smart Writing Coach Component
 */
const SmartWritingCoach = ({ 
  isOpen, 
  onClose, 
  currentText = '', 
  onInsertPrompt,
  position = 'sidebar' // 'sidebar' or 'modal'
}) => {
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Get suggestions based on current text
  const suggestions = useMemo(() => {
    const allSuggestions = getContextualSuggestions(currentText);
    return allSuggestions.filter(s => !dismissedSuggestions.includes(s.type));
  }, [currentText, dismissedSuggestions]);
  
  // Get writing stats
  const stats = useMemo(() => getWritingStats(currentText), [currentText]);
  
  const handleDismiss = (type) => {
    setDismissedSuggestions(prev => [...prev, type]);
  };
  
  const handlePromptClick = (prompt) => {
    if (onInsertPrompt) {
      onInsertPrompt(`\n\n${prompt}\n`);
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className="space-y-4">
      {/* Writing Stats */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
          <PenTool className="w-4 h-4 text-sage-400" />
          Writing Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-deep-600/50 rounded-lg p-3 text-center">
            <span className="text-2xl font-bold text-sage-400">{stats.words}</span>
            <span className="text-xs text-cream-500 block">words</span>
          </div>
          <div className="bg-deep-600/50 rounded-lg p-3 text-center">
            <span className="text-2xl font-bold text-leaf-400">{stats.sentences}</span>
            <span className="text-xs text-cream-500 block">sentences</span>
          </div>
        </div>
      </div>
      
      {/* Active Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-cream-200 font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Suggestions
          </h3>
          <AnimatePresence>
            {suggestions.map((suggestion, i) => (
              <SuggestionCard
                key={suggestion.type}
                suggestion={suggestion}
                onDismiss={handleDismiss}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Writing Prompts */}
      <div>
        <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-violet-400" />
          Writing Prompts
        </h3>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(TIP_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
                  activeCategory === key
                    ? `bg-${category.color}-500/20 text-${category.color}-400 ring-1 ring-${category.color}-400/50`
                    : 'bg-deep-600/50 text-cream-400 hover:bg-deep-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {category.label}
              </button>
            );
          })}
        </div>
        
        {/* Prompts List */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {TIP_CATEGORIES[activeCategory].tips.map((tip, i) => (
                <PromptCard 
                  key={i} 
                  tip={tip} 
                  onClick={() => handlePromptClick(tip)} 
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!activeCategory && (
          <p className="text-cream-500 text-sm text-center py-4">
            Select a category above to see prompts
          </p>
        )}
      </div>
    </div>
  );

  // Render as sidebar or modal based on position prop
  if (position === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="w-80 bg-deep-800 border-l border-deep-600 h-full overflow-y-auto"
      >
        <div className="p-4 border-b border-deep-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-cream-100">Writing Coach</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-deep-600 rounded-lg"
          >
            <X className="w-4 h-4 text-cream-400" />
          </button>
        </div>
        <div className="p-4">
          {content}
        </div>
      </motion.div>
    );
  }

  // Modal view
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
          className="bg-deep-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Writing Coach</h2>
                  <p className="text-sm text-amber-200">Get suggestions & prompts</p>
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
          
          <div className="p-4 overflow-y-auto max-h-[70vh]">
            {content}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartWritingCoach;
