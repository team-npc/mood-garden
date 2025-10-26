/**
 * Focus Mode Page Component
 * Pomodoro-style focus timer with growing plant visualization
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, AlertTriangle, Trophy, X } from 'lucide-react';

/**
 * Focus Mode Component
 */
const FocusModePage = () => {
  const [duration, setDuration] = useState(25); // minutes
  const [customDuration, setCustomDuration] = useState(25); // for input field
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [plantStage, setPlantStage] = useState(0); // 0-5 stages
  const [isPlantDead, setIsPlantDead] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const warningTimeoutRef = useRef(null);
  const lastVisibilityRef = useRef(true);

  /**
   * Handle visibility change - detect tab switching
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && !isPaused) {
        if (document.hidden) {
          // User switched tab/minimized window
          setShowWarning(true);
          lastVisibilityRef.current = false;
          
          // Give 3 seconds warning before killing plant
          warningTimeoutRef.current = setTimeout(() => {
            if (document.hidden && isActive) {
              setIsPlantDead(true);
              setIsActive(false);
              setIsPaused(false);
            }
          }, 3000);
        } else {
          // User came back
          if (!lastVisibilityRef.current && warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
            setShowWarning(false);
            lastVisibilityRef.current = true;
          }
        }
      }
    };

    const handleBlur = () => {
      // Window lost focus (switched to another app/window)
      if (isActive && !isPaused && !document.hidden) {
        setShowWarning(true);
        lastVisibilityRef.current = false;
        
        warningTimeoutRef.current = setTimeout(() => {
          if (document.activeElement !== document.body && isActive) {
            setIsPlantDead(true);
            setIsActive(false);
            setIsPaused(false);
          }
        }, 3000);
      }
    };

    const handleFocus = () => {
      // Window regained focus
      if (!lastVisibilityRef.current && warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        setShowWarning(false);
        lastVisibilityRef.current = true;
      }
    };

    const handleBeforeUnload = (e) => {
      // Prevent closing tab/window during active session
      if (isActive && !isPaused) {
        e.preventDefault();
        e.returnValue = 'Your focus session is still active! Your plant will die if you leave.';
        return e.returnValue;
      }
    };

    // Add all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isActive, isPaused]);

  /**
   * Timer countdown effect
   */
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          
          // Update plant stage based on progress
          const progress = ((duration * 60 - newTime) / (duration * 60)) * 100;
          if (progress >= 90) setPlantStage(5);
          else if (progress >= 75) setPlantStage(4);
          else if (progress >= 50) setPlantStage(3);
          else if (progress >= 25) setPlantStage(2);
          else if (progress >= 10) setPlantStage(1);
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Session completed successfully!
      setIsActive(false);
      setShowSuccess(true);
      setSessionsCompleted((prev) => prev + 1);
      
      // Play success sound (optional)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Session Complete! 🎉', {
          body: 'Great job staying focused! Your plant has fully grown.',
          icon: '/favicon.ico'
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, duration]);

  /**
   * Start focus session
   */
  const startSession = () => {
    if (timeLeft === duration * 60) {
      // Fresh start
      setIsActive(true);
      setIsPaused(false);
      setIsPlantDead(false);
      setPlantStage(0);
      setShowWarning(false);
    } else {
      // Resume
      setIsActive(true);
      setIsPaused(false);
    }
  };

  /**
   * Pause session
   */
  const pauseSession = () => {
    setIsPaused(true);
  };

  /**
   * Reset session
   */
  const resetSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setPlantStage(0);
    setIsPlantDead(false);
    setShowWarning(false);
    setShowSuccess(false);
  };

  /**
   * Format time for display
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Get progress percentage
   */
  const getProgress = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  /**
   * Handle custom duration input change
   */
  const handleCustomDurationChange = (value) => {
    const mins = parseInt(value) || 1;
    const clampedMins = Math.min(Math.max(mins, 1), 120); // 1-120 minutes
    setCustomDuration(clampedMins);
  };

  /**
   * Apply custom duration
   */
  const applyCustomDuration = () => {
    setDuration(customDuration);
    setTimeLeft(customDuration * 60);
  };

  /**
   * Render focus plant based on stage
   */
  const renderFocusPlant = () => {
    const colors = isPlantDead 
      ? { primary: '#6b7280', secondary: '#374151', accent: '#9ca3af' }
      : { primary: '#22c55e', secondary: '#15803d', accent: '#86efac' };

    return (
      <svg width="300" height="300" viewBox="0 0 300 300" className="w-full h-auto">
        {/* Pot */}
        <ellipse cx="150" cy="220" rx="60" ry="12" fill="#7c2d12" opacity="0.8" />
        <rect x="100" y="205" width="100" height="25" rx="5" fill="#7c2d12" opacity="0.9" />
        <ellipse cx="150" cy="210" rx="50" ry="10" fill="#a3a3a3" />
        
        {/* Plant stages */}
        {plantStage === 0 && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <circle cx="150" cy="215" r="4" fill="#8b5cf6" />
          </motion.g>
        )}
        
        {plantStage >= 1 && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <line x1="150" y1="210" x2="150" y2="180" stroke={colors.primary} strokeWidth="3" />
            <ellipse cx="140" cy="185" rx="8" ry="4" fill={colors.accent} transform="rotate(-30 140 185)" />
            <ellipse cx="160" cy="185" rx="8" ry="4" fill={colors.accent} transform="rotate(30 160 185)" />
          </motion.g>
        )}
        
        {plantStage >= 2 && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <line x1="150" y1="180" x2="150" y2="140" stroke={colors.secondary} strokeWidth="4" />
            <ellipse cx="135" cy="160" rx="12" ry="6" fill={colors.primary} transform="rotate(-45 135 160)" />
            <ellipse cx="165" cy="160" rx="12" ry="6" fill={colors.primary} transform="rotate(45 165 160)" />
          </motion.g>
        )}
        
        {plantStage >= 3 && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <line x1="150" y1="140" x2="130" y2="120" stroke={colors.secondary} strokeWidth="3" />
            <line x1="150" y1="140" x2="170" y2="120" stroke={colors.secondary} strokeWidth="3" />
            <ellipse cx="120" cy="135" rx="15" ry="8" fill={colors.primary} transform="rotate(-60 120 135)" />
            <ellipse cx="180" cy="135" rx="15" ry="8" fill={colors.primary} transform="rotate(60 180 135)" />
          </motion.g>
        )}
        
        {plantStage >= 4 && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
          >
            <circle cx="150" cy="120" r="35" fill={colors.primary} opacity="0.8" />
            <circle cx="130" cy="130" r="20" fill={colors.accent} opacity="0.6" />
            <circle cx="170" cy="130" r="20" fill={colors.accent} opacity="0.6" />
            
            {/* Flowers */}
            {!isPlantDead && (
              <>
                <circle cx="140" cy="115" r="4" fill="#ffc0cb" stroke="#fff" strokeWidth="1" />
                <circle cx="160" cy="115" r="4" fill="#ff69b4" stroke="#fff" strokeWidth="1" />
              </>
            )}
          </motion.g>
        )}
        
        {plantStage >= 5 && !isPlantDead && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
          >
            {/* Fruits */}
            <circle cx="135" cy="140" r="6" fill="#ff4444" stroke="#fff" strokeWidth="1" />
            <circle cx="165" cy="140" r="6" fill="#ff8c00" stroke="#fff" strokeWidth="1" />
            <circle cx="150" cy="105" r="6" fill="#9acd32" stroke="#fff" strokeWidth="1" />
            
            {/* Sparkles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.circle
                key={i}
                cx={150 + Math.cos(i * Math.PI / 2) * 50}
                cy={120 + Math.sin(i * Math.PI / 2) * 50}
                r="2"
                fill="#fde047"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </motion.g>
        )}
        
        {/* Dead plant effect */}
        {isPlantDead && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <text x="150" y="150" textAnchor="middle" fontSize="40" opacity="0.5">💀</text>
          </motion.g>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
            Focus Mode 🎯
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay focused and watch your plant grow. Don't switch tabs!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-sage-600 dark:text-sage-400">{sessionsCompleted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-2xl font-bold text-sage-600 dark:text-sage-400">{plantStage}/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Growth</div>
          </div>
          <div className="card text-center col-span-2 md:col-span-1">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-sage-600 dark:text-sage-400">{duration}m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
          </div>
        </div>

        {/* Main Focus Area */}
        <div className="card mb-8">
          {/* Plant Visualization */}
          <div className="flex justify-center mb-8">
            <div className={`relative ${isPlantDead ? 'plant-dead' : 'plant-healthy'}`}>
              {renderFocusPlant()}
              
              {/* Progress Ring */}
              {isActive && !isPlantDead && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg width="320" height="320" className="transform -rotate-90">
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      className="dark:stroke-gray-700"
                    />
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 140}`}
                      strokeDashoffset={`${2 * Math.PI * 140 * (1 - getProgress() / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-7xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-4">
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sage-500 to-sage-600"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Duration Selector (only show when not active) */}
          {!isActive && !isPlantDead && (
            <div className="mb-6 space-y-6">
              {/* Custom Duration Input */}
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Set Custom Duration (1-120 minutes)
                </label>
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={customDuration}
                    onChange={(e) => handleCustomDurationChange(e.target.value)}
                    onBlur={applyCustomDuration}
                    className="input-field w-24 text-center font-semibold text-lg"
                    disabled={isActive}
                  />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">minutes</span>
                  <button
                    onClick={applyCustomDuration}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Set
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={customDuration}
                    onChange={(e) => {
                      setCustomDuration(parseInt(e.target.value));
                      setDuration(parseInt(e.target.value));
                      setTimeLeft(parseInt(e.target.value) * 60);
                    }}
                    className="w-full max-w-md accent-sage-600"
                    disabled={isActive}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
                    <span>1m</span>
                    <span>60m</span>
                    <span>120m</span>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Or Choose a Preset
                </label>
                <div className="flex justify-center gap-3 flex-wrap">
                  {[5, 15, 25, 30, 45, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setDuration(mins);
                        setCustomDuration(mins);
                        setTimeLeft(mins * 60);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        duration === mins
                          ? 'bg-sage-600 text-white shadow-lg scale-105'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isActive ? (
              <button
                onClick={startSession}
                disabled={isPlantDead}
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-6 h-6" />
                <span>Start Focus</span>
              </button>
            ) : (
              <>
                <button
                  onClick={pauseSession}
                  className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <Pause className="w-6 h-6" />
                  <span>Pause</span>
                </button>
              </>
            )}
            
            <button
              onClick={resetSession}
              className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <RotateCcw className="w-6 h-6" />
              <span>Reset</span>
            </button>
          </div>

          {/* Status Messages */}
          {isPlantDead && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
              <div className="text-4xl mb-2">💀</div>
              <p className="text-red-800 dark:text-red-300 font-semibold mb-2">
                Your focus plant died!
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                You switched tabs or windows during the session. Stay focused to grow your plant!
              </p>
              <button
                onClick={resetSession}
                className="mt-3 btn-primary text-sm"
              >
                Try Again
              </button>
            </div>
          )}
          
          {isPaused && !isPlantDead && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
              <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                Session Paused
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Click Start to resume your focus session
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            How Focus Mode Works
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
            <li>⏱️ Set your focus duration (1-120 minutes)</li>
            <li>🌱 Watch your plant grow as you stay focused</li>
            <li>🚫 Don't switch tabs, windows, or minimize the browser</li>
            <li>⚠️ Switching away triggers a 3-second warning</li>
            <li>💀 If you don't return within 3 seconds, your plant dies</li>
            <li>🔒 Browser will warn you if you try to close the tab</li>
            <li>🏆 Complete sessions to build your focus streak</li>
            <li>🎯 Use presets or set custom time with slider</li>
          </ul>
        </div>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && !isPlantDead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Focus Broken!
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You switched away from the tab/window! Return immediately or your plant will die in 3 seconds!
                </p>
                <div className="text-4xl font-bold text-red-600 dark:text-red-400 animate-pulse">
                  3...
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Click back to this tab/window NOW!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold text-sage-600 dark:text-sage-400 mb-2">
                  Session Complete!
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Amazing focus! Your plant has fully grown. 🌳
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      resetSession();
                    }}
                    className="btn-primary"
                  >
                    Start New Session
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusModePage;
