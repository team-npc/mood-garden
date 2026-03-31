/**
 * Crisis Support Component
 * Gentle resources and support for very low moods
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, MessageCircle, ExternalLink, X, Shield, Sparkles, ChevronRight } from 'lucide-react';

/**
 * Crisis Resources
 */
const CRISIS_RESOURCES = [
  {
    id: 'hotline',
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support 24/7',
    phone: '988',
    type: 'call',
    icon: Phone,
    color: 'from-red-500 to-rose-500',
    primary: true
  },
  {
    id: 'text',
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741',
    phone: '741741',
    type: 'text',
    icon: MessageCircle,
    color: 'from-blue-500 to-indigo-500',
    primary: true
  },
  {
    id: 'international',
    name: 'International Association for Suicide Prevention',
    description: 'Find resources in your country',
    url: 'https://www.iasp.info/resources/Crisis_Centres/',
    type: 'link',
    icon: ExternalLink,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'trevor',
    name: 'Trevor Project (LGBTQ+)',
    description: '24/7 support for LGBTQ+ youth',
    phone: '1-866-488-7386',
    type: 'call',
    icon: Heart,
    color: 'from-pink-500 to-fuchsia-500'
  },
  {
    id: 'veterans',
    name: 'Veterans Crisis Line',
    description: 'For veterans and their families',
    phone: '988',
    type: 'call',
    note: 'Press 1',
    icon: Shield,
    color: 'from-green-500 to-emerald-500'
  }
];

/**
 * Grounding exercises for immediate relief
 */
const GROUNDING_EXERCISES = [
  {
    id: '5-4-3-2-1',
    name: '5-4-3-2-1 Grounding',
    steps: [
      'Notice 5 things you can SEE',
      'Touch 4 things you can FEEL',
      'Listen for 3 things you can HEAR',
      'Identify 2 things you can SMELL',
      'Notice 1 thing you can TASTE'
    ],
    duration: '2-3 min'
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    steps: [
      'Breathe IN for 4 seconds',
      'HOLD for 4 seconds',
      'Breathe OUT for 4 seconds',
      'HOLD for 4 seconds',
      'Repeat 4 times'
    ],
    duration: '2 min'
  },
  {
    id: 'cold-water',
    name: 'Cold Water Reset',
    steps: [
      'Run cold water over your wrists',
      'Or hold ice cubes in your hands',
      'Focus on the physical sensation',
      'Take slow, deep breaths',
      'This activates your calming reflex'
    ],
    duration: '1-2 min'
  }
];

/**
 * Supportive messages
 */
const SUPPORTIVE_MESSAGES = [
  "You matter. Your feelings are valid.",
  "This moment is hard, but it will pass.",
  "You've gotten through difficult times before.",
  "It's okay to not be okay right now.",
  "You don't have to face this alone.",
  "Small steps count. Just focus on right now.",
  "Your presence in this world matters.",
  "Reaching out takes courage. You're brave.",
  "Tomorrow is a new day with new possibilities.",
  "You deserve support and compassion."
];

/**
 * Resource Card Component
 */
const ResourceCard = ({ resource }) => {
  const Icon = resource.icon;
  
  const handleClick = () => {
    if (resource.type === 'call') {
      window.location.href = `tel:${resource.phone}`;
    } else if (resource.type === 'text') {
      window.location.href = `sms:${resource.phone}`;
    } else if (resource.type === 'link') {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`w-full p-4 rounded-xl bg-gradient-to-r ${resource.color} text-white text-left ${
        resource.primary ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{resource.name}</div>
          <div className="text-sm opacity-90">{resource.description}</div>
          {resource.note && (
            <div className="text-xs opacity-75 mt-1">{resource.note}</div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 opacity-75" />
      </div>
    </motion.button>
  );
};

/**
 * Grounding Exercise Component
 */
const GroundingExercise = ({ exercise, isExpanded, onToggle }) => (
  <div className="bg-deep-700 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-4 flex items-center justify-between text-left"
    >
      <div>
        <div className="font-medium text-cream-100">{exercise.name}</div>
        <div className="text-xs text-cream-500">{exercise.duration}</div>
      </div>
      <ChevronRight className={`w-5 h-5 text-cream-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
    </button>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4 space-y-2">
            {exercise.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-deep-600 flex items-center justify-center text-xs text-cream-400 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-cream-300">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/**
 * Main Crisis Support Component
 */
const CrisisSupport = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('support');
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [messageIndex, setMessageIndex] = useState(
    Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)
  );
  
  const nextMessage = () => {
    setMessageIndex((prev) => (prev + 1) % SUPPORTIVE_MESSAGES.length);
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
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" fill="currentColor" />
              <div>
                <h2 className="text-xl font-bold">You're Not Alone</h2>
                <p className="text-sm text-cream-200">Support is available</p>
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
        
        {/* Supportive Message */}
        <div className="p-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-b border-pink-500/30">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0" />
            <p className="text-cream-200 text-sm flex-1">{SUPPORTIVE_MESSAGES[messageIndex]}</p>
            <button
              onClick={nextMessage}
              className="text-pink-400 hover:text-pink-300 text-xs"
            >
              Next
            </button>
          </motion.div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-deep-600">
          {[
            { id: 'support', label: 'Get Support' },
            { id: 'grounding', label: 'Feel Better Now' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-cream-500 hover:text-cream-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'support' ? (
              <motion.div
                key="support"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                {/* Primary Resources */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-cream-400 mb-3">
                    🆘 Immediate Help
                  </h3>
                  <div className="space-y-3">
                    {CRISIS_RESOURCES.filter(r => r.primary).map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
                
                {/* Other Resources */}
                <div>
                  <h3 className="text-sm font-medium text-cream-400 mb-3">
                    📱 More Resources
                  </h3>
                  <div className="space-y-3">
                    {CRISIS_RESOURCES.filter(r => !r.primary).map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-deep-700 rounded-xl">
                  <p className="text-xs text-cream-500 text-center">
                    If you're in immediate danger, please call emergency services (911 in the US)
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grounding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <p className="text-sm text-cream-400 mb-4">
                  These exercises can help you feel more grounded in the present moment.
                </p>
                
                {GROUNDING_EXERCISES.map((exercise) => (
                  <GroundingExercise
                    key={exercise.id}
                    exercise={exercise}
                    isExpanded={expandedExercise === exercise.id}
                    onToggle={() => setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )}
                  />
                ))}
                
                <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl border border-teal-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💚</span>
                    <div>
                      <p className="text-sm text-cream-200">
                        Remember: These feelings are temporary. You've survived 100% of your hardest days.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Mood Check Banner - Shows when detecting low mood entries
 */
export const MoodCheckBanner = ({ onOpenSupport, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl border border-rose-500/30 mb-4"
  >
    <div className="flex items-start gap-3">
      <Heart className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-cream-200">
          It seems like you might be going through a tough time. Support is available if you need it.
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onOpenSupport}
            className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-400 transition-colors"
          >
            Get Support
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 bg-deep-600 text-cream-300 rounded-lg text-sm hover:bg-deep-500 transition-colors"
          >
            I'm okay
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

/**
 * Check if recent entries indicate potential crisis
 */
export const checkMoodPatterns = (entries) => {
  if (!entries || entries.length < 2) return { showSupport: false };
  
  // Get last 3 entries
  const recentEntries = entries.slice(0, 3);
  
  // Check for consecutive sad/anxious moods
  const lowMoods = ['😢', '😰'];
  const lowMoodCount = recentEntries.filter(e => lowMoods.includes(e.mood)).length;
  
  // Check for concerning keywords (very basic, in production would be more sophisticated)
  const concerningWords = ['hopeless', 'worthless', 'alone', 'give up', 'no point', 'end it'];
  const hasKeywords = recentEntries.some(e => 
    concerningWords.some(word => e.content?.toLowerCase().includes(word))
  );
  
  return {
    showSupport: lowMoodCount >= 2 || hasKeywords,
    severity: hasKeywords ? 'high' : 'moderate'
  };
};

export default CrisisSupport;
