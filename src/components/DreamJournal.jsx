/**
 * Dream Journal Mode Component
 * Special night-themed UI for logging dreams
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Star, 
  Cloud, 
  X, 
  Sparkles, 
  Eye,
  Save,
  Clock
} from 'lucide-react';

/**
 * Dream symbols and their meanings
 */
const DREAM_SYMBOLS = {
  '🌙': { name: 'Moon', meaning: 'Intuition, emotions, cycles' },
  '⭐': { name: 'Stars', meaning: 'Hope, guidance, aspirations' },
  '🌊': { name: 'Water', meaning: 'Emotions, subconscious' },
  '🦋': { name: 'Butterfly', meaning: 'Transformation, freedom' },
  '🐍': { name: 'Snake', meaning: 'Change, fear, wisdom' },
  '🏠': { name: 'House', meaning: 'Self, security, family' },
  '✈️': { name: 'Flying', meaning: 'Freedom, ambition, escape' },
  '🚗': { name: 'Driving', meaning: 'Life direction, control' },
  '🌳': { name: 'Trees', meaning: 'Growth, life, grounding' },
  '🔑': { name: 'Keys', meaning: 'Solutions, opportunities' },
  '👶': { name: 'Baby', meaning: 'New beginnings, innocence' },
  '🎭': { name: 'Masks', meaning: 'Identity, hidden aspects' },
  '💀': { name: 'Death', meaning: 'Endings, transformation' },
  '🦷': { name: 'Teeth', meaning: 'Self-image, anxiety' },
  '🌀': { name: 'Spiral', meaning: 'Journey, confusion, growth' },
  '🚪': { name: 'Door', meaning: 'Opportunity, transition' }
};

/**
 * Dream clarity levels
 */
const CLARITY_LEVELS = [
  { value: 1, label: 'Foggy', emoji: '🌫️', description: 'Vague impressions' },
  { value: 2, label: 'Hazy', emoji: '☁️', description: 'Some details clear' },
  { value: 3, label: 'Clear', emoji: '🌤️', description: 'Good recall' },
  { value: 4, label: 'Vivid', emoji: '✨', description: 'Very detailed' },
  { value: 5, label: 'Lucid', emoji: '💫', description: 'Aware you were dreaming' }
];

/**
 * Dream emotion tags
 */
const DREAM_EMOTIONS = [
  { emoji: '😨', label: 'Frightened' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '🤔', label: 'Confused' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🥰', label: 'Loving' },
  { emoji: '😲', label: 'Amazed' }
];

/**
 * Floating Stars Background
 */
const StarryBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }}
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      >
        <Star className="w-2 h-2 text-indigo-300" fill="currentColor" />
      </motion.div>
    ))}
    
    {/* Floating clouds */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`cloud-${i}`}
        className="absolute text-4xl opacity-10"
        style={{ top: `${20 + i * 25}%` }}
        animate={{
          x: ['-10%', '110%']
        }}
        transition={{
          duration: 60 + i * 20,
          repeat: Infinity,
          ease: 'linear',
          delay: i * 15
        }}
      >
        ☁️
      </motion.div>
    ))}
  </div>
);

/**
 * Symbol Picker
 */
const SymbolPicker = ({ selectedSymbols, onToggle }) => (
  <div className="grid grid-cols-8 gap-2">
    {Object.entries(DREAM_SYMBOLS).map(([emoji, data]) => (
      <motion.button
        key={emoji}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(emoji)}
        className={`p-2 rounded-lg transition-all ${
          selectedSymbols.includes(emoji)
            ? 'bg-indigo-500/30 ring-2 ring-indigo-400'
            : 'bg-indigo-900/30 hover:bg-indigo-800/30'
        }`}
        title={`${data.name}: ${data.meaning}`}
      >
        <span className="text-xl">{emoji}</span>
      </motion.button>
    ))}
  </div>
);

/**
 * Clarity Selector
 */
const ClaritySelector = ({ value, onChange }) => (
  <div className="flex justify-between gap-2">
    {CLARITY_LEVELS.map((level) => (
      <motion.button
        key={level.value}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(level.value)}
        className={`flex-1 p-2 rounded-xl text-center transition-all ${
          value === level.value
            ? 'bg-indigo-500/30 ring-2 ring-indigo-400'
            : 'bg-indigo-900/30 hover:bg-indigo-800/30'
        }`}
      >
        <span className="text-xl block">{level.emoji}</span>
        <span className="text-xs text-indigo-300">{level.label}</span>
      </motion.button>
    ))}
  </div>
);

/**
 * Main Dream Journal Mode Component
 */
const DreamJournal = ({ isOpen, onClose, onSave }) => {
  const [dreamContent, setDreamContent] = useState('');
  const [dreamTitle, setDreamTitle] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [clarity, setClarity] = useState(3);
  const [emotion, setEmotion] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [dreamTime, setDreamTime] = useState(new Date().toISOString().slice(0, 16));
  const [showSymbolMeanings, setShowSymbolMeanings] = useState(false);

  const toggleSymbol = (emoji) => {
    setSelectedSymbols(prev => 
      prev.includes(emoji)
        ? prev.filter(s => s !== emoji)
        : [...prev, emoji]
    );
  };

  const handleSave = () => {
    const dreamEntry = {
      type: 'dream',
      title: dreamTitle || 'Untitled Dream',
      content: dreamContent,
      symbols: selectedSymbols,
      clarity,
      emotion,
      isRecurring,
      dreamTime: new Date(dreamTime),
      tags: ['dream', ...selectedSymbols.map(s => DREAM_SYMBOLS[s]?.name.toLowerCase())]
    };
    
    onSave(dreamEntry);
    
    // Reset form
    setDreamContent('');
    setDreamTitle('');
    setSelectedSymbols([]);
    setClarity(3);
    setEmotion(null);
    setIsRecurring(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Full-screen dark background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
        <StarryBackground />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur bg-indigo-950/50 border-b border-indigo-800/50">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-6 h-6 text-indigo-300" />
              <div>
                <h1 className="text-xl font-bold text-indigo-100">Dream Journal</h1>
                <p className="text-sm text-indigo-400">Record your night visions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-indigo-800/50 rounded-xl transition-colors text-indigo-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* Dream Time */}
          <div>
            <label className="text-sm text-indigo-300 mb-2 block flex items-center gap-2">
              <Clock className="w-4 h-4" />
              When did you have this dream?
            </label>
            <input
              type="datetime-local"
              value={dreamTime}
              onChange={(e) => setDreamTime(e.target.value)}
              className="w-full p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-xl text-indigo-100 outline-none focus:border-indigo-500"
            />
          </div>
          
          {/* Title */}
          <div>
            <label className="text-sm text-indigo-300 mb-2 block">
              Give your dream a title (optional)
            </label>
            <input
              type="text"
              value={dreamTitle}
              onChange={(e) => setDreamTitle(e.target.value)}
              placeholder="The Flying Castle..."
              className="w-full p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-xl text-indigo-100 placeholder-indigo-500 outline-none focus:border-indigo-500"
            />
          </div>
          
          {/* Dream Content */}
          <div>
            <label className="text-sm text-indigo-300 mb-2 block flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Describe your dream
            </label>
            <textarea
              value={dreamContent}
              onChange={(e) => setDreamContent(e.target.value)}
              placeholder="I was in a strange place... The sky was purple and there were floating islands..."
              className="w-full p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl text-indigo-100 placeholder-indigo-500 outline-none focus:border-indigo-500 min-h-[200px] resize-none"
            />
          </div>
          
          {/* Clarity */}
          <div>
            <label className="text-sm text-indigo-300 mb-3 block flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              How clear was the dream?
            </label>
            <ClaritySelector value={clarity} onChange={setClarity} />
          </div>
          
          {/* Emotion */}
          <div>
            <label className="text-sm text-indigo-300 mb-3 block">
              Main emotion in the dream
            </label>
            <div className="flex flex-wrap gap-2">
              {DREAM_EMOTIONS.map((e) => (
                <motion.button
                  key={e.emoji}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEmotion(emotion === e.emoji ? null : e.emoji)}
                  className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                    emotion === e.emoji
                      ? 'bg-indigo-500/30 ring-2 ring-indigo-400'
                      : 'bg-indigo-900/30 hover:bg-indigo-800/30'
                  }`}
                >
                  <span className="text-xl">{e.emoji}</span>
                  <span className="text-sm text-indigo-300">{e.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Symbols */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-indigo-300 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Dream symbols
              </label>
              <button
                onClick={() => setShowSymbolMeanings(!showSymbolMeanings)}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                {showSymbolMeanings ? 'Hide meanings' : 'Show meanings'}
              </button>
            </div>
            <SymbolPicker selectedSymbols={selectedSymbols} onToggle={toggleSymbol} />
            
            <AnimatePresence>
              {showSymbolMeanings && selectedSymbols.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 bg-indigo-900/30 rounded-xl space-y-2"
                >
                  {selectedSymbols.map(symbol => (
                    <div key={symbol} className="flex items-center gap-2 text-sm">
                      <span>{symbol}</span>
                      <span className="text-indigo-300 font-medium">
                        {DREAM_SYMBOLS[symbol].name}:
                      </span>
                      <span className="text-indigo-400">
                        {DREAM_SYMBOLS[symbol].meaning}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Recurring */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRecurring(!isRecurring)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isRecurring ? 'bg-indigo-500' : 'bg-indigo-900/50'
              }`}
            >
              <span 
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  isRecurring ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-sm text-indigo-300">This is a recurring dream</span>
          </div>
          
          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!dreamContent.trim()}
            className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${
              dreamContent.trim()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400'
                : 'bg-indigo-900/50 text-indigo-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            Save Dream
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DreamJournal;
