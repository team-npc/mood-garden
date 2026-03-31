/**
 * Mental Health Resources Component
 * Curated resources and crisis support
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Phone, 
  MessageCircle, 
  Globe, 
  BookOpen,
  Shield,
  AlertCircle,
  ExternalLink,
  X,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Wind
} from 'lucide-react';

// Crisis Hotlines by Country
const CRISIS_HOTLINES = [
  { country: 'United States', name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
  { country: 'United States', name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
  { country: 'United Kingdom', name: 'Samaritans', number: '116 123', available: '24/7' },
  { country: 'Canada', name: 'Crisis Services Canada', number: '1-833-456-4566', available: '24/7' },
  { country: 'Australia', name: 'Lifeline', number: '13 11 14', available: '24/7' },
  { country: 'International', name: 'International Association for Suicide Prevention', number: 'https://www.iasp.info/resources/Crisis_Centres/', available: 'Directory' }
];

// Self-Care Resources
const SELF_CARE_RESOURCES = [
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Simple breathing techniques to calm your mind',
    icon: Wind,
    color: 'from-blue-400 to-cyan-500',
    content: [
      { name: '4-7-8 Technique', steps: 'Inhale 4s, Hold 7s, Exhale 8s' },
      { name: 'Box Breathing', steps: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s' },
      { name: 'Deep Belly Breathing', steps: 'Slow, deep breaths into your diaphragm' }
    ]
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'A sensory awareness technique for anxiety',
    icon: Shield,
    color: 'from-purple-400 to-indigo-500',
    content: [
      { name: '5 things you can see', steps: 'Look around and name them' },
      { name: '4 things you can touch', steps: 'Feel different textures' },
      { name: '3 things you can hear', steps: 'Listen to sounds around you' },
      { name: '2 things you can smell', steps: 'Notice scents nearby' },
      { name: '1 thing you can taste', steps: 'Focus on taste in your mouth' }
    ]
  },
  {
    id: 'affirmations',
    title: 'Daily Affirmations',
    description: 'Positive statements to start your day',
    icon: Sun,
    color: 'from-yellow-400 to-orange-500',
    content: [
      { name: 'I am worthy of love and respect' },
      { name: 'I am capable of handling challenges' },
      { name: 'My feelings are valid' },
      { name: 'I choose peace over worry' },
      { name: 'I am growing every day' }
    ]
  },
  {
    id: 'journaling',
    title: 'Journaling Prompts',
    description: 'Thoughtful questions for self-reflection',
    icon: BookOpen,
    color: 'from-green-400 to-teal-500',
    content: [
      { name: 'What am I grateful for today?' },
      { name: 'What would I tell my younger self?' },
      { name: 'What brings me peace?' },
      { name: 'What do I need to let go of?' },
      { name: 'What small step can I take today?' }
    ]
  }
];

// Articles and External Resources
const ARTICLES = [
  {
    title: 'Understanding Anxiety',
    source: 'Mental Health America',
    url: 'https://www.mhanational.org/conditions/anxiety',
    category: 'Education'
  },
  {
    title: 'Coping with Stress',
    source: 'American Psychological Association',
    url: 'https://www.apa.org/topics/stress',
    category: 'Self-Help'
  },
  {
    title: 'Mindfulness and Mental Health',
    source: 'National Institute of Mental Health',
    url: 'https://www.nimh.nih.gov',
    category: 'Research'
  },
  {
    title: 'Building Resilience',
    source: 'Psychology Today',
    url: 'https://www.psychologytoday.com/topics/resilience',
    category: 'Growth'
  }
];

// Crisis Alert Banner
const CrisisAlert = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 rounded-2xl shadow-lg"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold">Need immediate help?</h3>
          <p className="text-sm text-white/90 mt-1">
            If you're in crisis, please reach out to a professional.
          </p>
          <a 
            href="tel:988"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call 988 (US)
          </a>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </motion.div>
);

// Resource Card Component
const ResourceCard = ({ resource, onClick }) => {
  const Icon = resource.icon;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-left hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${resource.color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {resource.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {resource.description}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
      </div>
    </motion.button>
  );
};

// Resource Detail Modal
const ResourceDetail = ({ resource, isOpen, onClose }) => {
  if (!isOpen || !resource) return null;

  const Icon = resource.icon;

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
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-br ${resource.color} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8" />
              <h2 className="text-xl font-bold">{resource.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-white/90">{resource.description}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {resource.content.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </p>
              {item.steps && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.steps}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Mental Health Resources Component
const MentalHealthResources = ({ isOpen, onClose }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [showCrisis, setShowCrisis] = useState(true);
  const [activeTab, setActiveTab] = useState('resources');

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
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              Wellness Resources
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
            {['resources', 'crisis', 'articles'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${activeTab === tab 
                    ? 'bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-150px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {showCrisis && (
                  <CrisisAlert onClose={() => setShowCrisis(false)} />
                )}
                
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Self-Care Tools
                </h3>
                
                {SELF_CARE_RESOURCES.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onClick={() => setSelectedResource(resource)}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'crisis' && (
              <motion.div
                key="crisis"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800">
                  <p className="text-sm text-rose-800 dark:text-rose-200">
                    If you or someone you know is in immediate danger, please call emergency services (911 in the US) immediately.
                  </p>
                </div>

                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Crisis Hotlines
                </h3>

                {CRISIS_HOTLINES.map((hotline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {hotline.country}
                        </p>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {hotline.name}
                        </h4>
                        <p className="text-sage-600 dark:text-sage-400 font-medium mt-1">
                          {hotline.number}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                        {hotline.available}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'articles' && (
              <motion.div
                key="articles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Helpful Resources
                </h3>

                {ARTICLES.map((article, index) => (
                  <motion.a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block p-4 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs px-2 py-1 bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 rounded-full">
                          {article.category}
                        </span>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mt-2">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {article.source}
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-sage-500 transition-colors" />
                    </div>
                  </motion.a>
                ))}

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    💚 Remember: Seeking help is a sign of strength
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <ResourceDetail
            resource={selectedResource}
            isOpen={!!selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MentalHealthResources;
