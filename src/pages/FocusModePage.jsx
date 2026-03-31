/**
 * Focus Mode Page Component
 * Pomodoro-style focus timer with growing plant visualization
 */

import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, AlertTriangle, Trophy, X, Zap } from 'lucide-react';

/**
 * Focus Mode Component
 */
const FocusModePage = () => {
  const [duration, setDuration] = useState(25); // minutes
  const [customDuration, setCustomDuration] = useState(25); // for input field
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [plantStage, setPlantStage] = useState(0); // 0-5 stages
  const [isPlantDead, setIsPlantDead] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  // eslint-disable-next-line no-unused-vars
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
          // User switched tab/minimized window - PAUSE IMMEDIATELY
          setIsPaused(true);
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
            setIsPaused(false); // Resume timer
            lastVisibilityRef.current = true;
          }
        }
      }
    };

    const handleBlur = () => {
      // Window lost focus (switched to another app/window) - PAUSE IMMEDIATELY
      if (isActive && !isPaused && !document.hidden) {
        setIsPaused(true);
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
        setIsPaused(false); // Resume timer
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
   * Render focus plant with beautiful L-System algorithmic growth
   * Uses L-System rules to generate realistic branching patterns
   * Theme-aware colors for both light and dark modes
   */
  const renderFocusPlant = () => {
    const progress = getProgress(); // 0-100%

    // Theme-aware color scheme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const colors = {
      // Background - transparent to match page
      background: 'transparent',
      
      // Plant elements
      stem: isDarkMode ? '#9ea93f' : '#22c55e',
      strokeWidth: isDarkMode ? '2' : '2.5',
      seed: isDarkMode ? '#6B5310' : '#92400e',
      
      // Berries
      berryA: isDarkMode ? '#E5CEDC' : '#db2777',
      berryB: isDarkMode ? '#FCA17D' : '#f97316',
      
      // Magical effects
      sparkle1: isDarkMode ? '#ffeb12' : '#fbbf24',
      sparkle2: isDarkMode ? '#23f0ff' : '#06b6d4',
      
      // Pot colors
      potTop: isDarkMode ? '#8B6914' : '#b8955a',
      potGradientStart: isDarkMode ? '#a89060' : '#d4a574',
      potGradientEnd: isDarkMode ? '#8B6914' : '#b8955a',
      soilGradientStart: isDarkMode ? '#654321' : '#8b6f47',
      soilGradientEnd: isDarkMode ? '#4a3219' : '#6b5537'
    };

    // L-System rules for plant generation
    const rules = {
      X: [
        // Original rule
        { rule: "(F[+X][-X]FX)", prob: 0.5 },
        
        // Fewer limbs
        { rule: "(F[-X]FX)", prob: 0.05 },
        { rule: "(F[+X]FX)", prob: 0.05 },
        
        // Extra rotation
        { rule: "(F[++X][-X]FX)", prob: 0.1 },
        { rule: "(F[+X][--X]FX)", prob: 0.1 },
        
        // Berries/fruits
        { rule: "(F[+X][-X]FXA)", prob: 0.1 },
        { rule: "(F[+X][-X]FXB)", prob: 0.1 }
      ],
      F: [
        // Original rule
        { rule: "F(F)", prob: 0.85 },
        
        // Extra growth
        { rule: "F(FF)", prob: 0.05 },
        
        // Stunted growth
        { rule: "F", prob: 0.1 },
      ],
      "(": "",
      ")": ""
    };

    // Generate L-System string based on progress
    const generateLSystem = (word, generations) => {
      let current = word;
      for (let i = 0; i < generations; i++) {
        let next = "";
        for (let j = 0; j < current.length; j++) {
          let c = current[j];
          if (c in rules) {
            let rule = rules[c];
            if (Array.isArray(rule)) {
              next += chooseOne(rule);
            } else {
              next += rules[c];
            }
          } else {
            next += c;
          }
        }
        current = next;
      }
      return current;
    };

    // Choose one rule based on probability
    const chooseOne = (ruleSet) => {
      let n = Math.random();
      let t = 0;
      for (let i = 0; i < ruleSet.length; i++) {
        t += ruleSet[i].prob;
        if (t > n) {
          return ruleSet[i].rule;
        }
      }
      return "";
    };

    // Calculate generation and growth based on progress
    const maxGeneration = 6;
    const currentGeneration = Math.min(Math.floor(progress / 16.67), maxGeneration); // 16.67% per generation
    const growthPercent = Math.min((progress % 16.67) / 16.67, 1);

    // Generate the plant string
    const plantString = generateLSystem("X", currentGeneration);

    // Helper function to determine element opacity/scale based on growth
    const getGrowthT = (lerpOn) => {
      return lerpOn ? growthPercent : 1;
    };

    // Render beautiful growing plant based on progress
    const renderGrowingPlant = () => {
      const growthStage = Math.floor(progress / 20); // 0-5 stages (0-20%, 20-40%, etc.)
      const stageProgress = (progress % 20) / 20; // Progress within current stage

      // Stage 0: Seed sprouting (0-20%)
      if (growthStage === 0) {
        return (
          <>
            {/* Glowing energy around seed */}
            {progress > 5 && (
              <motion.circle
                cx="120" cy="253" r="8"
                fill="none"
                stroke="#7cb342"
                strokeWidth="0.5"
                opacity="0"
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.6, 0, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            )}
            {/* Tiny sprout emerging */}
            {progress > 10 && (
              <motion.g
                initial={{ scaleY: 0 }}
                animate={{ scaleY: stageProgress * 2 }}
                style={{ transformOrigin: '120px 258px' }}
              >
                <defs>
                  <linearGradient id="sprout-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9dbf7e" />
                    <stop offset="100%" stopColor="#7ca85c" />
                  </linearGradient>
                </defs>
                <path
                  d="M 120 258 Q 120 248 120 240"
                  stroke="url(#sprout-gradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {progress > 15 && (
                  <>
                    <motion.ellipse
                      cx="117" cy="242" rx="3" ry="1.8"
                      fill="#c5e1a5"
                      transform="rotate(-30 117 242)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.ellipse
                      cx="123" cy="242" rx="3" ry="1.8"
                      fill="#c5e1a5"
                      transform="rotate(30 123 242)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Tiny leaf veins */}
                    <path d="M 117 240 L 117 244" stroke="#618a3f" strokeWidth="0.5" opacity="0.6" transform="rotate(-30 117 242)" />
                    <path d="M 123 240 L 123 244" stroke="#618a3f" strokeWidth="0.5" opacity="0.6" transform="rotate(30 123 242)" />
                  </>
                )}
              </motion.g>
            )}
          </>
        );
      }

      // Stage 1: Young sprout (20-40%)
      if (growthStage === 1) {
        return (
          <motion.g
            animate={{ rotate: [0, 1.5, -1.5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transformOrigin: "120px 258px" }}
          >
            <defs>
              <linearGradient id="stem-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9dbf7e" />
                <stop offset="100%" stopColor="#5d8041" />
              </linearGradient>
              <radialGradient id="leaf-grad-1" cx="20%" cy="30%">
                <stop offset="0%" stopColor="#c5e1a5" />
                <stop offset="60%" stopColor="#8fbc6e" />
                <stop offset="100%" stopColor="#618a3f" />
              </radialGradient>
            </defs>
            <path
              d="M 120 258 Q 119 235 120 218"
              stroke="url(#stem-grad-1)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lower leaves with veins and dewdrops */}
            <motion.g
              animate={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ transformOrigin: "110px 240px" }}
            >
              <ellipse cx="110" cy="240" rx="10" ry="6" fill="url(#leaf-grad-1)" transform="rotate(-45 110 240)" />
              <path d="M 110 236 L 110 244" stroke="#618a3f" strokeWidth="0.8" opacity="0.5" transform="rotate(-45 110 240)" />
              <motion.circle
                cx="108" cy="239" r="1.5" fill="#d4ecf7" opacity="0.9"
                animate={{ opacity: [0.9, 0.6, 0.9], scale: [1, 0.95, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              style={{ transformOrigin: "130px 240px" }}
            >
              <ellipse cx="130" cy="240" rx="10" ry="6" fill="url(#leaf-grad-1)" transform="rotate(45 130 240)" />
              <path d="M 130 236 L 130 244" stroke="#618a3f" strokeWidth="0.8" opacity="0.5" transform="rotate(45 130 240)" />
            </motion.g>
            {/* Upper leaves */}
            {progress > 30 && (
              <>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -2, 2, 0] }}
                  transition={{ scale: { duration: 0.5 }, rotate: { duration: 4.5, repeat: Infinity } }}
                  style={{ transformOrigin: "113px 228px" }}
                >
                  <ellipse cx="113" cy="228" rx="8" ry="5" fill="#a8c995" transform="rotate(-50 113 228)" />
                  <path d="M 113 225 L 113 231" stroke="#7ca85c" strokeWidth="0.7" opacity="0.5" transform="rotate(-50 113 228)" />
                </motion.g>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 2, -2, 0] }}
                  transition={{ scale: { duration: 0.5, delay: 0.2 }, rotate: { duration: 4.5, repeat: Infinity, delay: 0.3 } }}
                  style={{ transformOrigin: "127px 228px" }}
                >
                  <ellipse cx="127" cy="228" rx="8" ry="5" fill="#a8c995" transform="rotate(50 127 228)" />
                  <path d="M 127 225 L 127 231" stroke="#7ca85c" strokeWidth="0.7" opacity="0.5" transform="rotate(50 127 228)" />
                </motion.g>
              </>
            )}
            {/* Growth sparkles */}
            {progress > 35 && (
              <motion.circle
                cx="120" cy="220" r="1"
                fill="#ffd700"
                animate={{
                  opacity: [0, 1, 0],
                  y: [-3, -8, -3],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            )}
          </motion.g>
        );
      }

      // Stage 2: Young plant (40-60%)
      if (growthStage === 2) {
        return (
          <motion.g
            animate={{ rotate: [0, 0.8, -0.8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ transformOrigin: "120px 258px" }}
          >
            <path d="M 120 258 Q 118 210 120 180" stroke={colors.stem} strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Multiple branches with leaves */}
            <path d="M 120 230 Q 105 220 95 225" stroke={colors.stem} strokeWidth="2.5" fill="none" />
            <path d="M 120 230 Q 135 220 145 225" stroke={colors.stem} strokeWidth="2.5" fill="none" />
            <path d="M 120 210 Q 108 205 100 208" stroke={colors.stem} strokeWidth="2" fill="none" />
            <path d="M 120 210 Q 132 205 140 208" stroke={colors.stem} strokeWidth="2" fill="none" />
            {/* Leaves on branches */}
            <ellipse cx="90" cy="228" rx="11" ry="7" fill="#7ca85c" transform="rotate(-55 90 228)" />
            <ellipse cx="150" cy="228" rx="11" ry="7" fill="#7ca85c" transform="rotate(55 150 228)" />
            <ellipse cx="95" cy="211" rx="10" ry="6" fill="#8fbc6e" transform="rotate(-60 95 211)" />
            <ellipse cx="145" cy="211" rx="10" ry="6" fill="#8fbc6e" transform="rotate(60 145 211)" />
            <ellipse cx="108" cy="195" rx="9" ry="6" fill="#a8c995" transform="rotate(-45 108 195)" />
            <ellipse cx="132" cy="195" rx="9" ry="6" fill="#a8c995" transform="rotate(45 132 195)" />
          </motion.g>
        );
      }

      // Stage 3: Blooming plant (60-80%)
      if (growthStage === 3) {
        return (
          <motion.g
            animate={{ rotate: [0, 0.5, -0.5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ transformOrigin: "120px 258px" }}
          >
            <path d="M 120 258 Q 118 200 120 160" stroke={colors.stem} strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Branches */}
            <path d="M 120 220 Q 100 210 88 215" stroke={colors.stem} strokeWidth="3" fill="none" />
            <path d="M 120 220 Q 140 210 152 215" stroke={colors.stem} strokeWidth="3" fill="none" />
            <path d="M 120 190 Q 105 185 95 188" stroke={colors.stem} strokeWidth="2.5" fill="none" />
            <path d="M 120 190 Q 135 185 145 188" stroke={colors.stem} strokeWidth="2.5" fill="none" />
            {/* Leaves */}
            <ellipse cx="85" cy="220" rx="12" ry="8" fill="#7ca85c" transform="rotate(-60 85 220)" />
            <ellipse cx="155" cy="220" rx="12" ry="8" fill="#7ca85c" transform="rotate(60 155 220)" />
            <ellipse cx="92" cy="193" rx="11" ry="7" fill="#8fbc6e" transform="rotate(-55 92 193)" />
            <ellipse cx="148" cy="193" rx="11" ry="7" fill="#8fbc6e" transform="rotate(55 148 193)" />
            {/* Beautiful flowers */}
            {[
              { cx: 88, cy: 210, color: '#f48fb1' },
              { cx: 152, cy: 210, color: '#ce93d8' },
              { cx: 120, cy: 165, color: '#ffebf0' }
            ].map((flower, idx) => (
              <motion.g
                key={`flower-${idx}`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: idx * 0.3 }}
                style={{ transformOrigin: `${flower.cx}px ${flower.cy}px` }}
              >
                {[0, 72, 144, 216, 288].map((angle, i) => {
                  const rad = (angle - 90) * Math.PI / 180;
                  const px = flower.cx + Math.cos(rad) * 6;
                  const py = flower.cy + Math.sin(rad) * 6;
                  return (
                    <ellipse
                      key={`petal-${i}`}
                      cx={px} cy={py} rx="4" ry="3"
                      fill={flower.color}
                      transform={`rotate(${angle} ${px} ${py})`}
                    />
                  );
                })}
                <circle cx={flower.cx} cy={flower.cy} r="2.5" fill="#fdd835" />
              </motion.g>
            ))}
          </motion.g>
        );
      }

      // Stage 4: Small tree (80-100%)
      if (growthStage >= 4) {
        return (
          <motion.g
            animate={{ rotate: [0, 0.3, -0.3, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{ transformOrigin: "120px 258px" }}
          >
            {/* Trunk */}
            <rect x="114" y="200" width="12" height="58" fill="#795548" rx="2" />
            <rect x="115" y="202" width="2" height="54" fill="#8d6e63" opacity="0.4" />
            {/* Main branches */}
            <path d="M 120 210 Q 100 200 85 198" stroke="#795548" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 120 210 Q 140 200 155 198" stroke="#795548" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 120 220 Q 95 215 80 213" stroke="#795548" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 120 220 Q 145 215 160 213" stroke="#795548" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Foliage clusters */}
            {[
              { cx: 80, cy: 200, rx: 18, ry: 14, fill: '#66bb6a' },
              { cx: 120, cy: 185, rx: 20, ry: 16, fill: '#81c784' },
              { cx: 160, cy: 200, rx: 18, ry: 14, fill: '#66bb6a' },
              { cx: 75, cy: 215, rx: 16, ry: 13, fill: '#4caf50' },
              { cx: 165, cy: 215, rx: 16, ry: 13, fill: '#4caf50' },
              { cx: 100, cy: 192, rx: 17, ry: 14, fill: '#81c784' },
              { cx: 140, cy: 192, rx: 17, ry: 14, fill: '#81c784' },
              { cx: 120, cy: 177, rx: 16, ry: 13, fill: '#a5d6a7' }
            ].map((cluster, i) => (
              <motion.ellipse
                key={`foliage-${i}`}
                cx={cluster.cx} cy={cluster.cy}
                rx={cluster.rx} ry={cluster.ry}
                fill={cluster.fill}
                animate={{ scale: [1, 1.03, 1], y: [0, -0.5, 0] }}
                transition={{ duration: 3 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
            {/* Fruits on mature tree */}
            {progress >= 90 && [
              { cx: 95, cy: 195, color: '#ff6b6b' },
              { cx: 145, cy: 195, color: '#ffa94d' },
              { cx: 115, cy: 185, color: '#b4ec51' },
              { cx: 125, cy: 188, color: '#ff6b6b' }
            ].map((fruit, idx) => (
              <motion.g
                key={`fruit-${idx}`}
                animate={{ y: [0, -1.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.2 }}
              >
                <circle cx={fruit.cx} cy={fruit.cy} r="4" fill={fruit.color} />
                <ellipse cx={fruit.cx - 1.2} cy={fruit.cy - 1.2} rx="1.5" ry="1.2" fill="#fff" opacity="0.6" />
              </motion.g>
            ))}
          </motion.g>
        );
      }

      return null;
    };

    return (
      <svg width="240" height="320" viewBox="0 0 240 320" className="w-full h-auto">
        <defs>
          <filter id="glow-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="pot-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.potGradientStart} />
            <stop offset="100%" stopColor={colors.potGradientEnd} />
          </linearGradient>
          <linearGradient id="soil-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.soilGradientStart} />
            <stop offset="100%" stopColor={colors.soilGradientEnd} />
          </linearGradient>
          <radialGradient id="seed-gradient" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#d4c4a8" />
            <stop offset="100%" stopColor="#7a6540" />
          </radialGradient>
        </defs>

        {/* Theme-aware background */}
        <rect width="240" height="320" fill="transparent" />

        {/* Theme-aware sparkles in background */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`sparkle-${i}`}
            cx={40 + (i % 4) * 40}
            cy={50 + Math.floor(i / 4) * 60}
            r="0.8"
            fill={i % 3 === 0 ? colors.sparkle1 : colors.sparkle2}
            opacity={isDarkMode ? 0.5 : 0.4}
            animate={{
              opacity: isDarkMode ? [0.2, 0.7, 0.2] : [0.2, 0.6, 0.2],
              scale: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
            filter="url(#glow-effect)"
          />
        ))}

        {/* POT */}
        <ellipse cx="120" cy="282" rx="48" ry="8" fill="#7a5a3a" opacity="0.4" />
        <path d="M 80 270 Q 76 262 80 255 L 160 255 Q 164 262 160 270 Z" fill="url(#pot-gradient)" stroke="#6d4c37" strokeWidth="1.5" />
        <ellipse cx="120" cy="255" rx="40" ry="7" fill="url(#pot-gradient)" />
        <ellipse cx="120" cy="257" rx="38" ry="6" fill="url(#soil-gradient)" />

        {/* Seed at beginning */}
        {progress < 10 && (
          <motion.g>
            <ellipse cx="120" cy="253" rx="5" ry="6" fill="url(#seed-gradient)" />
            <ellipse cx="118" cy="250" rx="2" ry="3" fill="#d4c4a8" opacity="0.5" />
          </motion.g>
        )}

        {/* Beautiful growing plant */}
        {renderGrowingPlant()}

        {/* Magical floating lights around mature plant */}
        {progress > 70 && [...Array(6)].map((_, i) => (
          <motion.circle
            key={`magic-light-${i}`}
            cx={90 + (i % 3) * 20}
            cy={170 + Math.floor(i / 3) * 25}
            r="1.2"
            fill={i % 2 === 0 ? colors.sparkle1 : colors.sparkle2}
            animate={{
              y: [-3, -8, -3],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4
            }}
            filter="url(#glow-effect)"
          />
        ))}
      </svg>
    );
  };

  // Calculate progress for use in JSX
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-earth-50 to-sage-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Compact Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-earth-700 dark:text-cream-100">
            Focus Mode 🎯
          </h1>
          <p className="text-earth-600 dark:text-slate-400">
            Stay focused and watch your plant grow
          </p>
        </motion.div>

        {/* Main Focus Card - Streamlined */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-sage-200 dark:border-slate-700/50 shadow-xl p-6 mb-6"
        >
          {/* Plant + Timer Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
            {/* Plant Visualization - Compact */}
            <motion.div 
              className={`relative rounded-2xl p-4 ${
                isPlantDead 
                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-400/50' 
                  : 'bg-sage-50 dark:bg-slate-700/40 border-2 border-sage-300 dark:border-sage-600/30'
              }`}
              animate={isPlantDead ? { 
                borderColor: ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.5)'] 
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {renderFocusPlant()}
            </motion.div>

            {/* Timer Display */}
            <div className="text-center">
              <div className="text-7xl md:text-8xl font-mono font-bold text-earth-700 dark:text-cream-100 mb-1">
                {formatTime(timeLeft)}
              </div>
              {!isActive && !isPlantDead && (
                <p className="text-earth-500 dark:text-slate-400">Ready to focus?</p>
              )}
              {isActive && !isPlantDead && (
                <p className="text-leaf-600 dark:text-leaf-400 flex items-center justify-center gap-2">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>🌱</motion.span>
                  Growing...
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar - Only when active */}
          {isActive && !isPlantDead && progress > 0 && (
            <div className="mb-6">
              <div className="h-2 bg-sage-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-leaf-500 to-sage-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-center text-sm text-earth-500 dark:text-slate-400 mt-2">
                {progress < 25 ? '🌱 Sprouting' : progress < 50 ? '🌿 Growing' : progress < 75 ? '🌸 Blooming' : '🌳 Thriving!'}
              </p>
            </div>
          )}

          {/* Duration Controls - Unified (only when not active) */}
          {!isActive && !isPlantDead && (
            <div className="mb-6">
              {/* Quick Presets - Primary Selection */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {[5, 15, 25, 30, 45, 60, 90, 120].map((mins) => (
                  <motion.button
                    key={mins}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setDuration(mins);
                      setCustomDuration(mins);
                      setTimeLeft(mins * 60);
                    }}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                      duration === mins
                        ? 'bg-leaf-500 text-white shadow-lg'
                        : 'bg-sage-100 dark:bg-slate-700 text-earth-600 dark:text-slate-300 hover:bg-sage-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                  </motion.button>
                ))}
              </div>
              
              {/* Custom Slider - Secondary */}
              <div className="max-w-sm mx-auto">
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={customDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCustomDuration(val);
                    setDuration(val);
                    setTimeLeft(val * 60);
                  }}
                  className="w-full h-2 bg-sage-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(34, 197, 94) 0%, rgb(34, 197, 94) ${(customDuration / 120) * 100}%, ${document.documentElement.classList.contains('dark') ? 'rgb(71, 85, 105)' : 'rgb(209, 213, 219)'} ${(customDuration / 120) * 100}%, ${document.documentElement.classList.contains('dark') ? 'rgb(71, 85, 105)' : 'rgb(209, 213, 219)'} 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-earth-400 dark:text-slate-500 mt-1">
                  <span>1m</span>
                  <span className="font-semibold text-earth-600 dark:text-slate-300">{customDuration} min</span>
                  <span>2h</span>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {!isActive || isPaused ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startSession}
                disabled={isPlantDead}
                className="bg-leaf-500 hover:bg-leaf-600 disabled:bg-gray-400 text-white font-bold text-lg px-8 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                <Play className="w-6 h-6" />
                {isPaused ? 'Resume' : 'Start Focus'}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={pauseSession}
                className="bg-sage-200 dark:bg-slate-700 hover:bg-sage-300 dark:hover:bg-slate-600 text-earth-700 dark:text-white font-bold text-lg px-8 py-4 rounded-2xl flex items-center gap-2"
              >
                <Pause className="w-6 h-6" />
                Pause
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={resetSession}
              className="bg-sage-100 dark:bg-slate-700 hover:bg-sage-200 dark:hover:bg-slate-600 text-earth-600 dark:text-slate-300 font-semibold px-6 py-4 rounded-2xl flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </motion.button>
          </div>

          {/* Status Messages */}
          {isPlantDead && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-xl text-center"
            >
              <p className="text-red-700 dark:text-red-300 font-bold text-lg mb-2">💀 Your plant died!</p>
              <p className="text-red-600 dark:text-red-400 text-sm mb-3">You switched away during the session.</p>
              <button onClick={resetSession} className="text-red-700 dark:text-red-300 underline font-medium">
                Try Again
              </button>
            </motion.div>
          )}
          
          {isPaused && !isPlantDead && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl text-center"
            >
              <p className="text-amber-700 dark:text-amber-300 font-medium">⏸️ Paused - Click Resume to continue</p>
            </motion.div>
          )}
        </motion.div>

        {/* Compact Tips - Inline */}
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-slate-800/40 rounded-full text-earth-600 dark:text-slate-400">
            <span>⚠️</span> Don't switch tabs
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-slate-800/40 rounded-full text-earth-600 dark:text-slate-400">
            <span>💀</span> Plant dies if you leave
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-slate-800/40 rounded-full text-earth-600 dark:text-slate-400">
            <span>🏆</span> Complete sessions to grow plants
          </span>
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
                  You switched away from the tab/window! Return immediately or your plant will die!
                </p>
                <div className="text-4xl font-bold text-red-600 dark:text-red-400 animate-pulse">
                  ⚠️
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
