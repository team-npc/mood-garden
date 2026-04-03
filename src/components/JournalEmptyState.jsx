/**
 * Enhanced Empty State Component
 * Engaging empty state with writing prompts and suggested actions
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Feather, 
  Sparkles, 
  Heart, 
  Sun, 
  Moon, 
  Cloud,
  Leaf,
  RefreshCw
} from 'lucide-react';

// Writing prompts organized by category
const WRITING_PROMPTS = {
  gratitude: [
    "What made you smile today?",
    "Name three things you're grateful for right now.",
    "Who has positively influenced your week?",
    "What small pleasure did you enjoy recently?"
  ],
  reflection: [
    "What's on your mind right now?",
    "How are you really feeling today?",
    "What would you tell your past self?",
    "What are you looking forward to?"
  ],
  growth: [
    "What did you learn today?",
    "What challenge are you currently facing?",
    "How have you grown in the past month?",
    "What goal would you like to work toward?"
  ],
  creativity: [
    "Describe your perfect day in detail.",
    "If you could have any superpower, what would it be?",
    "Write about a place that makes you feel peaceful.",
    "What song captures your current mood?"
  ]
};

const PROMPT_CATEGORIES = [
  { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'text-rose-500' },
  { id: 'reflection', label: 'Reflection', icon: Moon, color: 'text-indigo-500' },
  { id: 'growth', label: 'Growth', icon: Leaf, color: 'text-emerald-500' },
  { id: 'creativity', label: 'Creativity', icon: Sparkles, color: 'text-amber-500' }
];

/**
 * EmptyStatePrompt Component
 */
const EmptyStatePrompt = ({ prompt, onSelect, category }) => {
  const CategoryIcon = PROMPT_CATEGORIES.find(c => c.id === category)?.icon || Feather;
  const categoryColor = PROMPT_CATEGORIES.find(c => c.id === category)?.color || 'text-sage-500';
  
  return (
    <motion.button
      onClick={() => onSelect(prompt)}
      className="w-full text-left p-4 rounded-xl bg-white/50 dark:bg-deep-600/50 
                 border border-sage-200 dark:border-deep-500
                 hover:bg-leaf-50 dark:hover:bg-leaf-900/20
                 hover:border-leaf-300 dark:hover:border-leaf-600/50
                 transition-all duration-200 group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <CategoryIcon className={`w-5 h-5 ${categoryColor} mt-0.5 flex-shrink-0`} />
        <span className="text-earth-700 dark:text-cream-200 group-hover:text-leaf-700 dark:group-hover:text-leaf-300 transition-colors">
          {prompt}
        </span>
      </div>
    </motion.button>
  );
};

/**
 * JournalEmptyState Component
 * @param {Function} onStartWriting - Called when user clicks to start writing
 * @param {Function} onSelectPrompt - Called when user selects a writing prompt
 */
const JournalEmptyState = ({ onStartWriting, onSelectPrompt }) => {
  const [activeCategory, setActiveCategory] = useState('reflection');
  const [refreshKey, setRefreshKey] = useState(0);

  // Get random prompts for the active category
  const displayedPrompts = useMemo(() => {
    const categoryPrompts = WRITING_PROMPTS[activeCategory] || [];
    const shuffled = [...categoryPrompts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [activeCategory, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun, color: 'text-amber-500' };
    if (hour < 18) return { text: 'Good afternoon', icon: Cloud, color: 'text-sky-500' };
    return { text: 'Good evening', icon: Moon, color: 'text-indigo-500' };
  };

  const greeting = getTimeBasedGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bento-item text-center py-12 px-6"
    >
      {/* Greeting & Illustration */}
      <div className="mb-8">
        <motion.div 
          className="w-24 h-24 mx-auto mb-6 relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Decorative circles */}
          <div className="absolute inset-0 bg-gradient-to-br from-leaf-200 to-sage-200 dark:from-leaf-800/30 dark:to-sage-800/30 rounded-full blur-xl" />
          <div className="absolute inset-2 bg-gradient-to-br from-leaf-100 to-white dark:from-deep-600 dark:to-deep-700 rounded-full flex items-center justify-center">
            <Feather className="w-10 h-10 text-leaf-600 dark:text-leaf-400" />
          </div>
          {/* Floating particles */}
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-leaf-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <GreetingIcon className={`w-5 h-5 ${greeting.color}`} />
          <h3 className="text-xl font-semibold text-earth-800 dark:text-cream-100">
            {greeting.text}! Your journal awaits.
          </h3>
        </div>
        
        <p className="text-earth-600 dark:text-cream-400 max-w-md mx-auto">
          Every thought is a seed. Plant your first one and watch your garden grow.
        </p>
      </div>

      {/* Primary CTA */}
      <motion.button
        onClick={onStartWriting}
        className="btn-primary text-lg px-8 py-3 mb-10 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Feather className="w-5 h-5 mr-2 inline" />
        Start Writing
      </motion.button>

      {/* Writing Prompts Section */}
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-earth-600 dark:text-cream-400">
            Or try a writing prompt:
          </h4>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-sage-100 dark:hover:bg-deep-600 
                       text-earth-500 dark:text-cream-500 transition-colors"
            title="Get new prompts"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {PROMPT_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${activeCategory === category.id
                    ? 'bg-leaf-600 text-white dark:bg-leaf-600'
                    : 'bg-sage-100 dark:bg-deep-600 text-earth-600 dark:text-cream-400 hover:bg-sage-200 dark:hover:bg-deep-500'
                  }
                `}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Prompts List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${refreshKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {displayedPrompts.map((prompt, index) => (
              <EmptyStatePrompt
                key={`${prompt}-${index}`}
                prompt={prompt}
                category={activeCategory}
                onSelect={onSelectPrompt}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JournalEmptyState;
