/**
 * Breathing Exercises Component
 * Guided breathing exercises for stress relief
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

/**
 * Breathing exercise patterns
 */
const BREATHING_PATTERNS = {
  calm: {
    id: 'calm',
    name: 'Calming Breath',
    description: 'Perfect for anxiety relief',
    emoji: '😌',
    phases: [
      { name: 'Breathe In', duration: 4, color: 'from-blue-400 to-cyan-400' },
      { name: 'Hold', duration: 4, color: 'from-cyan-400 to-teal-400' },
      { name: 'Breathe Out', duration: 6, color: 'from-teal-400 to-green-400' }
    ],
    cycles: 4
  },
  energize: {
    id: 'energize',
    name: 'Energizing Breath',
    description: 'Wake up your mind and body',
    emoji: '⚡',
    phases: [
      { name: 'Breathe In', duration: 3, color: 'from-orange-400 to-amber-400' },
      { name: 'Breathe Out', duration: 3, color: 'from-amber-400 to-yellow-400' }
    ],
    cycles: 6
  },
  sleep: {
    id: 'sleep',
    name: '4-7-8 Sleep Breath',
    description: 'Prepare for restful sleep',
    emoji: '😴',
    phases: [
      { name: 'Breathe In', duration: 4, color: 'from-indigo-400 to-purple-400' },
      { name: 'Hold', duration: 7, color: 'from-purple-400 to-violet-400' },
      { name: 'Breathe Out', duration: 8, color: 'from-violet-400 to-indigo-400' }
    ],
    cycles: 4
  },
  focus: {
    id: 'focus',
    name: 'Box Breathing',
    description: 'Improve concentration',
    emoji: '🎯',
    phases: [
      { name: 'Breathe In', duration: 4, color: 'from-emerald-400 to-green-400' },
      { name: 'Hold', duration: 4, color: 'from-green-400 to-teal-400' },
      { name: 'Breathe Out', duration: 4, color: 'from-teal-400 to-cyan-400' },
      { name: 'Hold', duration: 4, color: 'from-cyan-400 to-emerald-400' }
    ],
    cycles: 4
  },
  quick: {
    id: 'quick',
    name: 'Quick Reset',
    description: '1-minute stress relief',
    emoji: '🚀',
    phases: [
      { name: 'Breathe In', duration: 3, color: 'from-pink-400 to-rose-400' },
      { name: 'Hold', duration: 2, color: 'from-rose-400 to-red-400' },
      { name: 'Breathe Out', duration: 4, color: 'from-red-400 to-pink-400' }
    ],
    cycles: 3
  }
};

/**
 * Breathing Circle Animation
 */
const BreathingCircle = ({ phase, progress, isPaused }) => {
  const scale = phase?.name === 'Breathe In' 
    ? 0.5 + (progress * 0.5) 
    : phase?.name === 'Breathe Out'
      ? 1 - (progress * 0.5)
      : 1;
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Background circles */}
      {[0.3, 0.5, 0.7, 0.9].map((opacity, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-cream-500"
          style={{ opacity: opacity * 0.2, transform: `scale(${0.3 + i * 0.2})` }}
        />
      ))}
      
      {/* Main breathing circle */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase?.color || 'from-blue-400 to-cyan-400'}`}
        animate={{
          scale: isPaused ? scale : scale,
          opacity: isPaused ? 0.6 : 0.8
        }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: 'center' }}
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-white/20 blur-xl" />
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.div
              className="text-3xl font-bold"
              animate={{ opacity: isPaused ? 0.5 : 1 }}
            >
              {phase?.name || 'Ready'}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Particles */}
      {!isPaused && phase?.name === 'Breathe In' && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/60 rounded-full"
              style={{
                left: '50%',
                top: '50%'
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 4) * 100],
                y: [0, Math.sin(i * Math.PI / 4) * 100],
                opacity: [1, 0],
                scale: [1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Pattern Selection Card
 */
const PatternCard = ({ pattern, isSelected, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 rounded-xl border text-left transition-all ${
      isSelected
        ? 'bg-deep-500 border-leaf-500'
        : 'bg-deep-700 border-deep-600 hover:border-deep-500'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{pattern.emoji}</span>
      <div>
        <div className="font-medium text-cream-100">{pattern.name}</div>
        <div className="text-xs text-cream-500">{pattern.description}</div>
      </div>
    </div>
  </motion.button>
);

/**
 * Main Breathing Exercises Component
 */
const BreathingExercises = ({ isOpen, onClose, suggestedMood = null }) => {
  const [selectedPattern, setSelectedPattern] = useState('calm');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const pattern = BREATHING_PATTERNS[selectedPattern];
  const currentPhase = pattern.phases[currentPhaseIndex];
  
  // Auto-select pattern based on mood
  useEffect(() => {
    if (suggestedMood) {
      const moodPatterns = {
        '😰': 'calm',
        '😴': 'sleep',
        '😤': 'calm',
        '😢': 'calm',
        '😊': 'energize',
        '😌': 'focus'
      };
      if (moodPatterns[suggestedMood]) {
        setSelectedPattern(moodPatterns[suggestedMood]);
      }
    }
  }, [suggestedMood]);
  
  // Play sound cue
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    // Use Web Audio API for simple tones
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = type === 'in' ? 440 : type === 'out' ? 330 : 380;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled]);
  
  // Timer logic
  useEffect(() => {
    if (!isActive || isPaused) {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
      return;
    }
    
    startTimeRef.current = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const phaseDuration = currentPhase.duration;
      const phaseProgress = Math.min(elapsed / phaseDuration, 1);
      
      setProgress(phaseProgress);
      
      if (phaseProgress >= 1) {
        // Move to next phase
        const nextPhaseIndex = (currentPhaseIndex + 1) % pattern.phases.length;
        
        if (nextPhaseIndex === 0) {
          // Completed a cycle
          const nextCycle = currentCycle + 1;
          if (nextCycle >= pattern.cycles) {
            // Exercise complete
            setIsActive(false);
            setIsComplete(true);
            playSound('complete');
            return;
          }
          setCurrentCycle(nextCycle);
        }
        
        setCurrentPhaseIndex(nextPhaseIndex);
        setProgress(0);
        startTimeRef.current = Date.now();
        
        // Play sound for new phase
        const nextPhase = pattern.phases[nextPhaseIndex];
        if (nextPhase.name.includes('In')) playSound('in');
        else if (nextPhase.name.includes('Out')) playSound('out');
        else playSound('hold');
      }
      
      timerRef.current = requestAnimationFrame(animate);
    };
    
    // Play initial sound
    if (currentPhase.name.includes('In')) playSound('in');
    
    timerRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isActive, isPaused, currentPhaseIndex, currentCycle, pattern, currentPhase, playSound]);
  
  const startExercise = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentPhaseIndex(0);
    setCurrentCycle(0);
    setProgress(0);
    setIsComplete(false);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startTimeRef.current = Date.now() - (progress * currentPhase.duration * 1000);
    }
  };
  
  const resetExercise = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentPhaseIndex(0);
    setCurrentCycle(0);
    setProgress(0);
    setIsComplete(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wind className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Breathing Exercises</h2>
                <p className="text-sm text-cream-200">Find your calm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!isActive && !isComplete ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Pattern Selection */}
                <div className="space-y-3 mb-6">
                  {Object.values(BREATHING_PATTERNS).map((p) => (
                    <PatternCard
                      key={p.id}
                      pattern={p}
                      isSelected={selectedPattern === p.id}
                      onClick={() => setSelectedPattern(p.id)}
                    />
                  ))}
                </div>
                
                {/* Pattern Info */}
                <div className="p-4 bg-deep-700 rounded-xl mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{pattern.emoji}</span>
                    <span className="font-medium text-cream-100">{pattern.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pattern.phases.map((phase, i) => (
                      <span key={i} className="px-2 py-1 bg-deep-600 rounded-lg text-xs text-cream-400">
                        {phase.name}: {phase.duration}s
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-cream-500 mt-2">
                    {pattern.cycles} cycles • ~{Math.round(pattern.phases.reduce((sum, p) => sum + p.duration, 0) * pattern.cycles / 60)} min
                  </div>
                </div>
                
                {/* Start Button */}
                <button
                  onClick={startExercise}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Begin Exercise
                </button>
              </motion.div>
            ) : isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🧘
                </motion.div>
                <h3 className="text-xl font-bold text-cream-100 mb-2">
                  Exercise Complete!
                </h3>
                <p className="text-cream-400 mb-6">
                  Take a moment to notice how you feel.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={resetExercise}
                    className="flex-1 py-3 rounded-xl bg-deep-600 text-cream-200 hover:bg-deep-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Do Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                {/* Progress */}
                <div className="mb-4 text-cream-400 text-sm">
                  Cycle {currentCycle + 1} of {pattern.cycles}
                </div>
                
                {/* Breathing Circle */}
                <BreathingCircle
                  phase={currentPhase}
                  progress={progress}
                  isPaused={isPaused}
                />
                
                {/* Timer */}
                <div className="text-4xl font-bold text-cream-100 mt-4 mb-6">
                  {Math.ceil(currentPhase.duration * (1 - progress))}
                </div>
                
                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={togglePause}
                    className="p-4 rounded-full bg-deep-600 text-cream-200 hover:bg-deep-500 transition-colors"
                  >
                    {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={resetExercise}
                    className="p-4 rounded-full bg-deep-600 text-cream-200 hover:bg-deep-500 transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default BreathingExercises;
