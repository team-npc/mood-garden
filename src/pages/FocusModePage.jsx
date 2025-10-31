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
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-500 dark:to-teal-400 bg-clip-text text-transparent">
            Focus Mode 🎯
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300">
            Stay focused and watch your plant grow. Don't switch tabs or your plant will die! 🌱
          </p>
        </motion.div>

        {/* Main Focus Area with Glass Effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-slate-700/50 shadow-2xl p-8 mb-8"
        >
          {/* Plant Visualization with Enhanced Container */}
          <div className="flex justify-center mb-8">
            <motion.div 
              className={`relative rounded-2xl p-6 ${
                isPlantDead 
                  ? 'bg-red-100 dark:bg-red-900/20 border-2 border-red-500/50' 
                  : 'bg-gradient-to-b from-green-50 to-emerald-50 dark:from-slate-700/30 dark:to-slate-800/30 border-2 border-green-500/50 dark:border-green-500/30'
              }`}
              animate={isPlantDead ? { 
                borderColor: ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.5)'] 
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {renderFocusPlant()}
            </motion.div>
          </div>

          {/* Progress Bar - Qualitative only (hide at start until progress > 0) */}
          {isActive && !isPlantDead && progress > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="flex justify-center items-center mb-3">
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {progress < 20 ? '🌱 Sprouting...' :
                   progress < 40 ? '🌿 Growing...' :
                   progress < 60 ? '🪴 Flourishing...' :
                   progress < 80 ? '🌸 Blooming...' :
                   '🌳 Majestic!'}
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden border border-gray-300 dark:border-slate-600/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-400 relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Timer Display - Enhanced */}
          {!isActive && !isPlantDead && (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center mb-8"
            >
              <div className="text-8xl font-mono font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-600 dark:text-slate-400">Ready to focus?</p>
            </motion.div>
          )}

          {/* Active Status - Enhanced */}
          {isActive && !isPlantDead && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <div className="text-3xl font-serif text-green-600 dark:text-green-400 mb-2 flex items-center justify-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌱
                </motion.span>
                <span>Your plant is growing...</span>
              </div>
              <p className="text-gray-600 dark:text-slate-400 text-lg">
                Stay focused and watch it bloom
              </p>
            </motion.div>
          )}

          {/* Duration Selector - Enhanced (only show when not active) */}
          {!isActive && !isPlantDead && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 space-y-8"
            >
              {/* Custom Duration Input */}
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-semibold text-green-600 dark:text-green-400 mb-4 text-center flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Set Custom Duration
                </label>
                <div className="bg-gray-100 dark:bg-slate-700/30 rounded-2xl p-6 border border-gray-200 dark:border-slate-600/30">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={customDuration}
                      onChange={(e) => handleCustomDurationChange(e.target.value)}
                      onBlur={applyCustomDuration}
                      className="bg-white dark:bg-slate-800/50 border-2 border-green-500/50 dark:border-green-500/30 rounded-xl w-24 text-center font-bold text-2xl text-green-600 dark:text-green-400 py-3 focus:outline-none focus:border-green-500 transition-colors"
                      disabled={isActive}
                    />
                    <span className="text-gray-700 dark:text-slate-300 font-semibold text-lg">minutes</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyCustomDuration}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-500/20"
                    >
                      Set
                    </motion.button>
                  </div>
                  <div className="relative">
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
                      className="w-full h-2 bg-gray-300 dark:bg-slate-600 rounded-full appearance-none cursor-pointer slider-green"
                      disabled={isActive}
                      style={{
                        background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${(customDuration / 120) * 100}%, ${document.documentElement.classList.contains('dark') ? 'rgb(71, 85, 105)' : 'rgb(209, 213, 219)'} ${(customDuration / 120) * 100}%, ${document.documentElement.classList.contains('dark') ? 'rgb(71, 85, 105)' : 'rgb(209, 213, 219)'} 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-600 dark:text-slate-400 font-semibold mt-2">
                      <span>1m</span>
                      <span>60m</span>
                      <span>120m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Presets - Enhanced */}
              <div>
                <label className="block text-sm font-semibold text-green-600 dark:text-green-400 mb-4 text-center flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Presets
                </label>
                <div className="flex justify-center gap-3 flex-wrap">
                  {[5, 15, 25, 30, 45, 60, 90, 120].map((mins) => (
                    <motion.button
                      key={mins}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setDuration(mins);
                        setCustomDuration(mins);
                        setTimeLeft(mins * 60);
                      }}
                      className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                        duration === mins
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30 border-2 border-green-400'
                          : 'bg-gray-200 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600/50 border-2 border-gray-300 dark:border-slate-600/30 hover:border-gray-400 dark:hover:border-slate-500/50'
                      }`}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Control Buttons - Enhanced */}
          <div className="flex justify-center gap-4">
            {!isActive || isPaused ? (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={startSession}
                disabled={isPlantDead}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-xl px-10 py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-2xl shadow-green-500/30 border-2 border-green-400/50 transition-all"
              >
                <Play className="w-7 h-7" />
                <span>{isPaused ? 'Resume Focus' : 'Start Focus'}</span>
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseSession}
                  className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold text-xl px-10 py-5 rounded-2xl flex items-center space-x-3 shadow-xl border-2 border-gray-300 dark:border-slate-600"
                >
                  <Pause className="w-7 h-7" />
                  <span>Pause</span>
                </motion.button>
              </>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetSession}
              className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold text-xl px-10 py-5 rounded-2xl flex items-center space-x-3 shadow-xl border-2 border-gray-300 dark:border-slate-600"
            >
              <RotateCcw className="w-7 h-7" />
              <span>Reset</span>
            </motion.button>
          </div>

          {/* Status Messages - Enhanced */}
          {isPlantDead && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 border-2 border-red-500/50 rounded-2xl text-center backdrop-blur-sm"
            >
              <motion.div 
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-3"
              >
                💀
              </motion.div>
              <p className="text-red-700 dark:text-red-300 font-bold text-2xl mb-3">
                Your focus plant died!
              </p>
              <p className="text-red-600 dark:text-red-200 mb-4">
                You switched tabs or windows during the session. Stay focused to grow your plant!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetSession}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
              >
                Try Again 🌱
              </motion.button>
            </motion.div>
          )}
          
          {isPaused && !isPlantDead && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 border-2 border-yellow-500/50 rounded-2xl text-center backdrop-blur-sm"
            >
              <p className="text-yellow-700 dark:text-yellow-300 font-bold text-xl mb-2">
                ⏸️ Session Paused
              </p>
              <p className="text-yellow-600 dark:text-yellow-200">
                Click Resume to continue your focus session
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Instructions - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-sm rounded-3xl border border-blue-300 dark:border-blue-500/30 p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6 flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            How Focus Mode Works
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">⏱️</span>
              <div>
                <p className="text-blue-700 dark:text-blue-200 font-semibold">Set Your Duration</p>
                <p className="text-blue-600 dark:text-blue-300/70 text-sm">Choose 1-120 minutes of focus time</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">🌱</span>
              <div>
                <p className="text-blue-700 dark:text-blue-200 font-semibold">Watch It Grow</p>
                <p className="text-blue-600 dark:text-blue-300/70 text-sm">Your plant grows as you stay focused</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">🚫</span>
              <div>
                <p className="text-blue-700 dark:text-blue-200 font-semibold">Stay Focused</p>
                <p className="text-blue-600 dark:text-blue-300/70 text-sm">Don't switch tabs or minimize browser</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="text-blue-700 dark:text-blue-200 font-semibold">Warning System</p>
                <p className="text-blue-600 dark:text-blue-300/70 text-sm">Get warned if you lose focus</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">💀</span>
              <div>
                <p className="text-blue-200 font-semibold">Plant Dies</p>
                <p className="text-blue-300/70 text-sm">If you don't return quickly enough</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">🔒</span>
              <div>
                <p className="text-blue-700 dark:text-blue-200 font-semibold">Protected Session</p>
                <p className="text-blue-600 dark:text-blue-300/70 text-sm">Browser warns if you try to close tab</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-blue-700 dark:text-blue-200 font-semibold">Earn Rewards</p>
                <p className="text-blue-600 dark:text-blue-300/70 text-sm">Complete sessions to grow beautiful plants</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all"
            >
              <span className="text-3xl">🎯</span>
              <div>
                <p className="text-blue-700 dark:text-blue-200 font-semibold">Flexible Options</p>
                <p className="text-blue-600 dark:text-blue-300/70 text-sm">Use presets or custom duration slider</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
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
