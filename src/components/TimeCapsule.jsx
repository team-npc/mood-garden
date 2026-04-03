/**
 * Time Capsule Component
 * Lock entries to be revealed after a specified time period
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Clock, 
  Calendar, 
  Gift, 
  X, 
  Plus,
  Eye,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const TIME_CAPSULE_KEY = 'mood-garden-time-capsules';

/**
 * Calculate time remaining
 */
const getTimeRemaining = (unlockDate) => {
  const now = new Date().getTime();
  const unlock = new Date(unlockDate).getTime();
  const diff = unlock - now;
  
  if (diff <= 0) return { expired: true, text: 'Ready to open!' };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  // Qualitative time descriptions instead of exact numbers
  if (days > 365) {
    return { expired: false, text: 'A long journey ahead' };
  }
  if (days > 180) {
    return { expired: false, text: 'Seasons away' };
  }
  if (days > 30) {
    return { expired: false, text: 'Still brewing' };
  }
  if (days > 7) {
    return { expired: false, text: 'Coming soon' };
  }
  if (days > 0) {
    return { expired: false, text: 'Almost ready' };
  }
  if (hours > 0) {
    return { expired: false, text: 'Opening soon' };
  }
  return { expired: false, text: 'Ready to open!' };
};

/**
 * Preset durations
 */
const DURATION_PRESETS = [
  { id: '1week', label: '1 Week', days: 7 },
  { id: '1month', label: '1 Month', days: 30 },
  { id: '3months', label: '3 Months', days: 90 },
  { id: '6months', label: '6 Months', days: 180 },
  { id: '1year', label: '1 Year', days: 365 },
  { id: 'custom', label: 'Custom Date', days: null }
];

/**
 * Time Capsule Card
 */
const TimeCapsuleCard = ({ capsule, onOpen, onDelete }) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(capsule.unlockDate));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(capsule.unlockDate));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [capsule.unlockDate]);
  
  const isReady = timeRemaining.expired;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-2xl border transition-all ${
        isReady
          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50'
          : 'bg-deep-700 border-deep-600'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isReady ? (
            <Gift className="w-5 h-5 text-amber-400" />
          ) : (
            <Lock className="w-5 h-5 text-cream-500" />
          )}
          <span className={`text-sm font-medium ${isReady ? 'text-amber-300' : 'text-cream-400'}`}>
            {isReady ? 'Ready to Open!' : timeRemaining.text}
          </span>
        </div>
        {!isReady && (
          <button
            onClick={() => onDelete(capsule.id)}
            className="p-1 text-cream-600 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="mb-3">
        <div className="text-xs text-cream-500 mb-1">
          Created: {new Date(capsule.createdAt).toLocaleDateString()}
        </div>
        <div className="text-xs text-cream-500">
          Opens: {new Date(capsule.unlockDate).toLocaleDateString()}
        </div>
      </div>
      
      {isReady ? (
        <div className="space-y-2">
          {capsule.isOpened ? (
            <div className="p-3 bg-deep-700 rounded-xl">
              <div className="text-sm text-cream-200 whitespace-pre-wrap">
                {capsule.content.length > 200 
                  ? capsule.content.substring(0, 200) + '...' 
                  : capsule.content}
              </div>
              {capsule.mood && (
                <span className="text-2xl mt-2 block">{capsule.mood}</span>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpen(capsule.id)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Open Time Capsule
            </motion.button>
          )}
        </div>
      ) : (
        <div className="p-3 bg-deep-600/50 rounded-xl">
          <div className="flex items-center gap-2 text-cream-500">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Content hidden until unlock date</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Create Time Capsule Form
 */
const CreateCapsuleForm = ({ onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('1year');
  const [customDate, setCustomDate] = useState('');
  
  const moods = ['😊', '😢', '😤', '😴', '😰', '😌'];
  
  const handleSubmit = () => {
    if (!content.trim()) return;
    
    let unlockDate;
    if (duration === 'custom' && customDate) {
      unlockDate = new Date(customDate);
    } else {
      const preset = DURATION_PRESETS.find(p => p.id === duration);
      unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + (preset?.days || 365));
    }
    
    onSubmit({
      id: `capsule-${Date.now()}`,
      content,
      mood,
      createdAt: new Date().toISOString(),
      unlockDate: unlockDate.toISOString(),
      isOpened: false
    });
  };
  
  // Calculate minimum date (tomorrow)
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="text-sm text-cream-400 mb-2 block">Your message to the future</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dear future me..."
          className="w-full p-4 bg-deep-700 border border-deep-600 rounded-xl text-cream-100 placeholder-cream-600 resize-none outline-none focus:border-amber-500 transition-colors min-h-[120px]"
          rows={4}
        />
      </div>
      
      <div>
        <label className="text-sm text-cream-400 mb-2 block">Current mood (optional)</label>
        <div className="flex gap-2">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(mood === m ? '' : m)}
              className={`text-2xl p-2 rounded-xl transition-all ${
                mood === m 
                  ? 'bg-amber-500/30 scale-110' 
                  : 'bg-deep-700 hover:bg-deep-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-sm text-cream-400 mb-2 block">When to unlock</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setDuration(preset.id)}
              className={`p-2 rounded-xl text-sm transition-all ${
                duration === preset.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        
        {duration === 'custom' && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            min={minDate}
            className="w-full p-3 bg-deep-700 border border-deep-600 rounded-xl text-cream-100 outline-none focus:border-amber-500"
          />
        )}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-deep-600 text-cream-300 hover:bg-deep-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            content.trim()
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
              : 'bg-deep-700 text-cream-500 cursor-not-allowed'
          }`}
        >
          <Lock className="w-4 h-4" />
          Seal Capsule
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Time Capsule Opening Animation
 */
const OpeningAnimation = ({ capsule, onComplete }) => {
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2500),
      setTimeout(() => onComplete(), 3500)
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="locked"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
          >
            <Lock className="w-24 h-24 text-amber-400" />
          </motion.div>
        )}
        
        {stage === 1 && (
          <motion.div
            key="unlocking"
            initial={{ rotate: -20 }}
            animate={{ rotate: 20 }}
            transition={{ duration: 0.3, repeat: 3 }}
          >
            <Lock className="w-24 h-24 text-amber-400" />
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div
            key="open"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Unlock className="w-24 h-24 text-green-400" />
          </motion.div>
        )}
        
        {stage === 3 && (
          <motion.div
            key="sparkles"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            className="text-center"
          >
            <Sparkles className="w-24 h-24 text-amber-400 mx-auto mb-4" />
            <div className="text-2xl text-cream-100 font-bold">
              Time Capsule Opened!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Main Time Capsule Component
 */
const TimeCapsule = ({ isOpen, onClose }) => {
  const [capsules, setCapsules] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [openingCapsule, setOpeningCapsule] = useState(null);
  
  // Load capsules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(TIME_CAPSULE_KEY);
    if (saved) {
      try {
        setCapsules(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading time capsules:', e);
      }
    }
  }, []);
  
  // Save capsules to localStorage
  const saveCapsules = (newCapsules) => {
    setCapsules(newCapsules);
    localStorage.setItem(TIME_CAPSULE_KEY, JSON.stringify(newCapsules));
  };
  
  const handleCreateCapsule = (capsule) => {
    saveCapsules([capsule, ...capsules]);
    setIsCreating(false);
  };
  
  const handleOpenCapsule = (id) => {
    setOpeningCapsule(capsules.find(c => c.id === id));
  };
  
  const handleOpeningComplete = () => {
    if (openingCapsule) {
      const updated = capsules.map(c => 
        c.id === openingCapsule.id ? { ...c, isOpened: true } : c
      );
      saveCapsules(updated);
    }
    setOpeningCapsule(null);
  };
  
  const handleDeleteCapsule = (id) => {
    saveCapsules(capsules.filter(c => c.id !== id));
  };
  
  // Sort capsules: ready first, then by unlock date
  const sortedCapsules = useMemo(() => {
    return [...capsules].sort((a, b) => {
      const aReady = new Date(a.unlockDate) <= new Date();
      const bReady = new Date(b.unlockDate) <= new Date();
      
      if (aReady && !bReady) return -1;
      if (!aReady && bReady) return 1;
      
      return new Date(a.unlockDate) - new Date(b.unlockDate);
    });
  }, [capsules]);
  
  const readyCount = capsules.filter(c => 
    new Date(c.unlockDate) <= new Date() && !c.isOpened
  ).length;
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="modal-overlay flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-cream-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Time Capsules</h2>
                  <p className="text-sm text-cream-200">
                    {readyCount > 0 
                      ? 'Some capsules are ready to open!' 
                      : 'Messages to your future self'}
                  </p>
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
            <AnimatePresence mode="wait">
              {isCreating ? (
                <CreateCapsuleForm
                  key="create"
                  onSubmit={handleCreateCapsule}
                  onCancel={() => setIsCreating(false)}
                />
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Create Button */}
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full p-4 rounded-xl border-2 border-dashed border-deep-500 text-cream-400 hover:border-amber-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Time Capsule
                  </button>
                  
                  {/* Capsules List */}
                  {sortedCapsules.length === 0 ? (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 text-cream-600 mx-auto mb-3" />
                      <p className="text-cream-500">No time capsules yet</p>
                      <p className="text-sm text-cream-600">
                        Write a message to your future self!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedCapsules.map((capsule) => (
                        <TimeCapsuleCard
                          key={capsule.id}
                          capsule={capsule}
                          onOpen={handleOpenCapsule}
                          onDelete={handleDeleteCapsule}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      
      {/* Opening Animation */}
      {openingCapsule && (
        <OpeningAnimation
          capsule={openingCapsule}
          onComplete={handleOpeningComplete}
        />
      )}
    </>
  );
};

export default TimeCapsule;
