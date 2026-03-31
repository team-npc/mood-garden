/**
 * Focus Mode Component
 * Full-screen immersive writing experience with breathing exercises
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Clock,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Heart,
  Timer
} from 'lucide-react';

// Breathing exercise patterns
const BREATHING_PATTERNS = {
  'box': {
    name: 'Box Breathing',
    description: 'Equal inhale, hold, exhale, hold',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 }
    ],
    color: 'from-blue-400 to-cyan-400'
  },
  '4-7-8': {
    name: '4-7-8 Relaxing',
    description: 'Calming breath for anxiety',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 }
    ],
    color: 'from-purple-400 to-pink-400'
  },
  'energizing': {
    name: 'Energizing',
    description: 'Quick breath to wake up',
    phases: [
      { name: 'Inhale', duration: 2 },
      { name: 'Exhale', duration: 2 }
    ],
    color: 'from-orange-400 to-yellow-400'
  },
  'coherent': {
    name: 'Coherent Breathing',
    description: 'Heart rate variability optimization',
    phases: [
      { name: 'Inhale', duration: 5 },
      { name: 'Exhale', duration: 5 }
    ],
    color: 'from-green-400 to-teal-400'
  }
};

// Breathing Exercise Component
const BreathingExercise = ({ isActive, pattern = 'box', onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const selectedPattern = BREATHING_PATTERNS[pattern];
  const phases = selectedPattern.phases;
  const totalCycleTime = phases.reduce((sum, p) => sum + p.duration, 0);

  useEffect(() => {
    if (!isRunning || !isActive) {
      clearInterval(intervalRef.current);
      return;
    }

    const currentPhaseDuration = phases[currentPhase].duration;
    const tickInterval = 50; // Update every 50ms for smooth animation
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (tickInterval / 1000 / currentPhaseDuration);
        
        if (newProgress >= 1) {
          // Move to next phase
          setCurrentPhase(prevPhase => {
            const nextPhase = (prevPhase + 1) % phases.length;
            if (nextPhase === 0) {
              setCycleCount(c => c + 1);
            }
            return nextPhase;
          });
          return 0;
        }
        
        return newProgress;
      });
    }, tickInterval);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isActive, currentPhase, phases]);

  const toggleRunning = () => setIsRunning(!isRunning);
  
  const reset = () => {
    setIsRunning(false);
    setCurrentPhase(0);
    setProgress(0);
    setCycleCount(0);
  };

  if (!isActive) return null;

  const currentPhaseName = phases[currentPhase].name;
  const circleScale = currentPhaseName === 'Inhale' ? 1 + (progress * 0.3) :
                      currentPhaseName === 'Exhale' ? 1.3 - (progress * 0.3) : 1.3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center p-8 space-y-6"
    >
      {/* Breathing Circle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glow Effect */}
        <motion.div
          animate={{ scale: circleScale }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`absolute inset-0 bg-gradient-to-r ${selectedPattern.color} rounded-full blur-xl opacity-40`}
        />
        
        {/* Main Circle */}
        <motion.div
          animate={{ scale: circleScale }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative w-40 h-40 bg-gradient-to-r ${selectedPattern.color} rounded-full flex items-center justify-center shadow-2xl`}
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progress)}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>
          
          {/* Phase Text */}
          <div className="text-center text-white z-10">
            <p className="text-2xl font-semibold">{currentPhaseName}</p>
            <p className="text-sm opacity-80">{Math.ceil(phases[currentPhase].duration * (1 - progress))}s</p>
          </div>
        </motion.div>
      </div>

      {/* Pattern Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {selectedPattern.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedPattern.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Cycle {cycleCount + 1}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleRunning}
          className={`p-4 rounded-full ${isRunning ? 'bg-gray-200 dark:bg-gray-700' : 'bg-sage-500'} transition-colors`}
        >
          {isRunning ? (
            <Pause className={`w-6 h-6 ${isRunning ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`} />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
        
        <button
          onClick={reset}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

// Pomodoro Timer Component
const PomodoroTimer = ({ isActive, onComplete }) => {
  const [mode, setMode] = useState('focus'); // focus, break, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const modes = {
    focus: { duration: 25 * 60, label: 'Focus Time', color: 'from-sage-400 to-green-400' },
    break: { duration: 5 * 60, label: 'Short Break', color: 'from-blue-400 to-cyan-400' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'from-purple-400 to-pink-400' }
  };

  useEffect(() => {
    if (!isRunning || !isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          // Auto-switch modes
          if (mode === 'focus') {
            setSessions(s => s + 1);
            setMode(sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'break');
          } else {
            setMode('focus');
          }
          onComplete?.();
          return modes[mode === 'focus' ? 'break' : 'focus'].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isActive, mode, sessions, onComplete]);

  const toggleRunning = () => setIsRunning(!isRunning);
  
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsRunning(false);
  };

  if (!isActive) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - (timeLeft / modes[mode].duration);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center p-8 space-y-6"
    >
      {/* Mode Tabs */}
      <div className="flex gap-2">
        {Object.entries(modes).map(([key, value]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === key
                ? 'bg-sage-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="112"
            cy="112"
            r="100"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 100}
            strokeDashoffset={2 * Math.PI * 100 * (1 - progress)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#68a67d" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time Display */}
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-800 dark:text-gray-100 font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {modes[mode].label}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleRunning}
          className={`p-4 rounded-full ${isRunning ? 'bg-gray-200 dark:bg-gray-700' : 'bg-sage-500'} transition-colors`}
        >
          {isRunning ? (
            <Pause className={`w-6 h-6 ${isRunning ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`} />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
        
        <button
          onClick={reset}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < (sessions % 4)
                ? 'bg-sage-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          Session {sessions + 1}
        </span>
      </div>
    </motion.div>
  );
};

// Main Focus Mode Component
const FocusMode = ({ 
  isOpen, 
  onClose, 
  children,
  showBreathing = true,
  showPomodoro = true
}) => {
  const [activePanel, setActivePanel] = useState(null); // 'breathing', 'pomodoro', null
  const [breathingPattern, setBreathingPattern] = useState('box');
  const [wordCount, setWordCount] = useState(0);
  const [typingSounds, setTypingSounds] = useState(false);
  const textRef = useRef(null);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose?.();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Play typing sound (optional)
  const playTypeSound = useCallback(() => {
    if (!typingSounds) return;
    // Would integrate with actual typing sound here
  }, [typingSounds]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-sage-50 via-white to-earth-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-200/30 dark:bg-sage-800/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-earth-200/30 dark:bg-earth-800/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold-200/20 dark:bg-gold-900/10 rounded-full blur-3xl animate-breathe" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
            <Sparkles className="w-4 h-4 text-sage-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Focus Mode
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showBreathing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePanel(activePanel === 'breathing' ? null : 'breathing')}
              className={`p-2 rounded-xl backdrop-blur-sm transition-colors ${
                activePanel === 'breathing'
                  ? 'bg-sage-500 text-white'
                  : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Wind className="w-5 h-5" />
            </motion.button>
          )}

          {showPomodoro && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePanel(activePanel === 'pomodoro' ? null : 'pomodoro')}
              className={`p-2 rounded-xl backdrop-blur-sm transition-colors ${
                activePanel === 'pomodoro'
                  ? 'bg-sage-500 text-white'
                  : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Timer className="w-5 h-5" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTypingSounds(!typingSounds)}
            className={`p-2 rounded-xl backdrop-blur-sm transition-colors ${
              typingSounds
                ? 'bg-sage-500 text-white'
                : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300'
            }`}
          >
            {typingSounds ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full flex">
        {/* Side Panel */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 overflow-hidden"
            >
              {activePanel === 'breathing' && (
                <div className="h-full flex flex-col pt-20">
                  {/* Pattern Selector */}
                  <div className="px-4 pb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Breathing Pattern
                    </label>
                    <select
                      value={breathingPattern}
                      onChange={(e) => setBreathingPattern(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sage-500"
                    >
                      {Object.entries(BREATHING_PATTERNS).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <BreathingExercise
                    isActive={true}
                    pattern={breathingPattern}
                  />
                </div>
              )}

              {activePanel === 'pomodoro' && (
                <div className="h-full flex flex-col pt-20">
                  <PomodoroTimer isActive={true} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Writing Area */}
        <div className="flex-1 flex items-center justify-center p-8 pt-24">
          <div className="w-full max-w-3xl">
            {children}
          </div>
        </div>
      </div>

      {/* Word Count Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> to exit focus mode
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Hook for focus mode
export const useFocusMode = () => {
  const [isOpen, setIsOpen] = useState(false);

  const enterFocusMode = () => setIsOpen(true);
  const exitFocusMode = () => setIsOpen(false);
  const toggleFocusMode = () => setIsOpen(!isOpen);

  return {
    isOpen,
    enterFocusMode,
    exitFocusMode,
    toggleFocusMode
  };
};

export { BreathingExercise, PomodoroTimer };
export default FocusMode;
