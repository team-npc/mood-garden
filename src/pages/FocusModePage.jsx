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
   * Render focus plant with smooth continuous growth
   */
  const renderFocusPlant = () => {
    const progress = getProgress();
    const colors = isPlantDead 
      ? { primary: '#6b7280', secondary: '#374151', accent: '#9ca3af', trunk: '#4b5563' }
      : { primary: '#10b981', secondary: '#059669', accent: '#6ee7b7', trunk: '#78350f' };

    // Smooth growth calculations
    const stemHeight = Math.min(progress * 1.2, 120);
    const stemWidth = 3 + (progress / 100) * 5;
    const leafSize = Math.min(progress * 0.2, 20);
    const canopySize = Math.max(0, (progress - 20) * 1);
    const flowerOpacity = Math.max(0, Math.min(1, (progress - 70) / 20));
    const fruitOpacity = Math.max(0, Math.min(1, (progress - 90) / 10));

    return (
      <svg width="320" height="320" viewBox="0 0 320 320" className="w-full h-auto">
        <defs>
          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          
          <radialGradient id="canopyGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colors.primary} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.7" />
          </radialGradient>

          <filter id="leafShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2"/>
          </filter>
          
          <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="50%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>

        {/* Enhanced Pot */}
        <g>
          <ellipse cx="160" cy="240" rx="65" ry="14" fill="url(#potGradient)" opacity="0.9" />
          <path 
            d="M 105 225 Q 105 245 160 245 Q 215 245 215 225 L 210 210 Q 210 205 160 205 Q 110 205 110 210 Z"
            fill="url(#potGradient)"
          />
          <ellipse cx="160" cy="215" rx="50" ry="12" fill="#92400e" />
          <ellipse cx="160" cy="215" rx="48" ry="10" fill="#a8a29e" />
        </g>
        
        {/* Growing plant with smooth transitions */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Seed */}
          {progress < 8 && (
            <motion.g>
              <circle 
                cx="160" 
                cy="220" 
                r={4 + progress * 0.2}
                fill="#7c3aed"
                filter="url(#leafShadow)"
              />
              <motion.circle 
                cx="160" 
                cy="220" 
                r={3 + progress * 0.15}
                fill="#a78bfa"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.g>
          )}

          {/* Main Trunk - realistic with texture */}
          {stemHeight > 0 && (
            <motion.g>
              <motion.path
                d={`M 160 215 Q ${160 - stemWidth/2} ${215 - stemHeight/2} ${160 - stemWidth/3} ${215 - stemHeight} Q 160 ${210 - stemHeight} ${160 + stemWidth/3} ${215 - stemHeight} Q ${160 + stemWidth/2} ${215 - stemHeight/2} 160 215`}
                fill="url(#trunkGradient)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              
              <motion.line 
                x1={160 - stemWidth/3} 
                y1="215" 
                x2={160 - stemWidth/3} 
                y2={215 - stemHeight} 
                stroke="#78350f"
                strokeWidth="0.5"
                opacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <motion.line 
                x1={160 + stemWidth/3} 
                y1="215" 
                x2={160 + stemWidth/3} 
                y2={215 - stemHeight} 
                stroke="#92400e"
                strokeWidth="0.5"
                opacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </motion.g>
          )}

          {/* Leaves with veins */}
          {progress > 12 && (
            <>
              {[0, 1, 2, 3].map((i) => {
                const leafProgress = Math.max(0, Math.min(1, (progress - 12 - i * 12) / 15));
                const yPos = 205 - i * 18 - (progress - 12) * 0.25;
                const xOffset = 15 + i * 3;
                
                return leafProgress > 0 && yPos > 95 && (
                  <motion.g key={`leaf-left-${i}`}>
                    <motion.ellipse
                      cx={160 - xOffset - leafSize * 0.3}
                      cy={yPos}
                      rx={leafSize * 0.7 * leafProgress}
                      ry={leafSize * 0.4 * leafProgress}
                      fill={colors.primary}
                      filter="url(#leafShadow)"
                      transform={`rotate(-50 ${160 - xOffset - leafSize * 0.3} ${yPos})`}
                      animate={{ 
                        rotate: [-50, -48, -50],
                        y: [0, -1.5, 0]
                      }}
                      transition={{ 
                        duration: 3 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2
                      }}
                    />
                    <motion.line
                      x1={160 - xOffset}
                      y1={yPos}
                      x2={160 - xOffset - leafSize * 0.6 * leafProgress}
                      y2={yPos}
                      stroke={colors.secondary}
                      strokeWidth="0.5"
                      opacity="0.5"
                      transform={`rotate(-50 ${160 - xOffset} ${yPos})`}
                    />
                  </motion.g>
                );
              })}

              {[0, 1, 2, 3].map((i) => {
                const leafProgress = Math.max(0, Math.min(1, (progress - 12 - i * 12) / 15));
                const yPos = 200 - i * 18 - (progress - 12) * 0.25;
                const xOffset = 15 + i * 3;
                
                return leafProgress > 0 && yPos > 95 && (
                  <motion.g key={`leaf-right-${i}`}>
                    <motion.ellipse
                      cx={160 + xOffset + leafSize * 0.3}
                      cy={yPos}
                      rx={leafSize * 0.7 * leafProgress}
                      ry={leafSize * 0.4 * leafProgress}
                      fill={colors.primary}
                      filter="url(#leafShadow)"
                      transform={`rotate(50 ${160 + xOffset + leafSize * 0.3} ${yPos})`}
                      animate={{ 
                        rotate: [50, 52, 50],
                        y: [0, -1.5, 0]
                      }}
                      transition={{ 
                        duration: 3 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2 + 0.15
                      }}
                    />
                    <motion.line
                      x1={160 + xOffset}
                      y1={yPos}
                      x2={160 + xOffset + leafSize * 0.6 * leafProgress}
                      y2={yPos}
                      stroke={colors.secondary}
                      strokeWidth="0.5"
                      opacity="0.5"
                      transform={`rotate(50 ${160 + xOffset} ${yPos})`}
                    />
                  </motion.g>
                );
              })}
            </>
          )}

          {/* Curved Branches */}
          {progress > 35 && stemHeight > 50 && (
            <>
              <motion.path
                d={`M 160 ${215 - stemHeight * 0.6} Q ${145 - (progress - 35) * 0.25} ${215 - stemHeight * 0.65} ${140 - (progress - 35) * 0.3} ${215 - stemHeight * 0.7}`}
                stroke={colors.trunk}
                strokeWidth={stemWidth * 0.5}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.path
                d={`M 160 ${215 - stemHeight * 0.6} Q ${175 + (progress - 35) * 0.25} ${215 - stemHeight * 0.65} ${180 + (progress - 35) * 0.3} ${215 - stemHeight * 0.7}`}
                stroke={colors.trunk}
                strokeWidth={stemWidth * 0.5}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              />
              
              {progress > 50 && (
                <>
                  <motion.path
                    d={`M 160 ${215 - stemHeight * 0.75} Q ${150 - (progress - 50) * 0.2} ${215 - stemHeight * 0.78} ${145 - (progress - 50) * 0.25} ${215 - stemHeight * 0.82}`}
                    stroke={colors.trunk}
                    strokeWidth={stemWidth * 0.35}
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.path
                    d={`M 160 ${215 - stemHeight * 0.75} Q ${170 + (progress - 50) * 0.2} ${215 - stemHeight * 0.78} ${175 + (progress - 50) * 0.25} ${215 - stemHeight * 0.82}`}
                    stroke={colors.trunk}
                    strokeWidth={stemWidth * 0.35}
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  />
                </>
              )}
            </>
          )}

          {/* Multi-layered Canopy */}
          {canopySize > 5 && (
            <>
              <motion.circle
                cx="160"
                cy={215 - stemHeight - 5}
                r={canopySize * 0.8}
                fill="url(#canopyGradient)"
                opacity={isPlantDead ? 0.3 : 0.85}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
              />
              <motion.circle
                cx={160 - canopySize * 0.4}
                cy={215 - stemHeight}
                r={canopySize * 0.55}
                fill={colors.primary}
                opacity={isPlantDead ? 0.25 : 0.75}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.1 }}
              />
              <motion.circle
                cx={160 + canopySize * 0.4}
                cy={215 - stemHeight}
                r={canopySize * 0.55}
                fill={colors.primary}
                opacity={isPlantDead ? 0.25 : 0.75}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.15 }}
              />
              
              {canopySize > 20 && (
                <>
                  <motion.circle
                    cx={160 - canopySize * 0.55}
                    cy={215 - stemHeight + canopySize * 0.3}
                    r={canopySize * 0.4}
                    fill={colors.accent}
                    opacity={isPlantDead ? 0.2 : 0.6}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.2 }}
                  />
                  <motion.circle
                    cx={160 + canopySize * 0.55}
                    cy={215 - stemHeight + canopySize * 0.3}
                    r={canopySize * 0.4}
                    fill={colors.accent}
                    opacity={isPlantDead ? 0.2 : 0.6}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.25 }}
                  />
                  <motion.circle
                    cx="160"
                    cy={215 - stemHeight - canopySize * 0.6}
                    r={canopySize * 0.45}
                    fill={colors.secondary}
                    opacity={isPlantDead ? 0.25 : 0.7}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.3 }}
                  />
                </>
              )}
            </>
          )}

          {/* Beautiful Flowers with petals */}
          {flowerOpacity > 0 && !isPlantDead && canopySize > 20 && (
            <>
              {[
                { x: 160 - canopySize * 0.55, y: 215 - stemHeight - 10, color: '#ffc0cb', size: 1 },
                { x: 160 + canopySize * 0.55, y: 215 - stemHeight - 10, color: '#ff69b4', size: 1.1 },
                { x: 160, y: 215 - stemHeight - canopySize * 0.5, color: '#ffd700', size: 1.2 },
                { x: 160 - canopySize * 0.3, y: 215 - stemHeight - 2, color: '#ff6b9d', size: 0.9 },
                { x: 160 + canopySize * 0.3, y: 215 - stemHeight - 2, color: '#da70d6', size: 1 },
              ].map((flower, i) => (
                <motion.g key={`flower-${i}`}>
                  {[0, 1, 2, 3, 4].map((petal) => {
                    const angle = (petal / 5) * Math.PI * 2;
                    return (
                      <motion.ellipse
                        key={petal}
                        cx={flower.x + Math.cos(angle) * (2.5 * flower.size)}
                        cy={flower.y + Math.sin(angle) * (2.5 * flower.size)}
                        rx={2 * flower.size}
                        ry={3.5 * flower.size}
                        fill={flower.color}
                        stroke="#fff"
                        strokeWidth="0.5"
                        opacity={flowerOpacity * 0.9}
                        transform={`rotate(${(petal * 72)} ${flower.x} ${flower.y})`}
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          delay: i * 0.15 + petal * 0.05,
                          ease: "easeInOut"
                        }}
                      />
                    );
                  })}
                  <motion.circle
                    cx={flower.x}
                    cy={flower.y}
                    r={2 * flower.size}
                    fill="#ffd700"
                    stroke="#fff"
                    strokeWidth="0.3"
                    opacity={flowerOpacity}
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                </motion.g>
              ))}
            </>
          )}

          {/* Realistic Fruits with shine */}
          {fruitOpacity > 0 && !isPlantDead && canopySize > 30 && (
            <>
              {[
                { x: 160 - canopySize * 0.65, y: 215 - stemHeight + 8, color: '#dc2626', highlight: '#fca5a5' },
                { x: 160 + canopySize * 0.65, y: 215 - stemHeight + 8, color: '#ea580c', highlight: '#fdba74' },
                { x: 160 - canopySize * 0.35, y: 215 - stemHeight + 15, color: '#65a30d', highlight: '#bef264' },
                { x: 160 + canopySize * 0.35, y: 215 - stemHeight + 15, color: '#7c3aed', highlight: '#c4b5fd' },
                { x: 160, y: 215 - stemHeight - 15, color: '#dc2626', highlight: '#fca5a5' },
              ].map((fruit, i) => (
                <motion.g key={`fruit-${i}`}>
                  <motion.circle
                    cx={fruit.x}
                    cy={fruit.y}
                    r={4 + fruitOpacity * 2.5}
                    fill={fruit.color}
                    stroke="#78350f"
                    strokeWidth="0.5"
                    opacity={fruitOpacity}
                    filter="url(#leafShadow)"
                    initial={{ scale: 0, y: -15 }}
                    animate={{ 
                      scale: 1,
                      y: 0,
                      opacity: fruitOpacity
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 150,
                      damping: 8,
                      delay: i * 0.15
                    }}
                  />
                  <motion.ellipse
                    cx={fruit.x - 1.5}
                    cy={fruit.y - 1.5}
                    rx={1.5}
                    ry={2}
                    fill={fruit.highlight}
                    opacity={fruitOpacity * 0.7}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                  />
                  <motion.line
                    x1={fruit.x}
                    y1={fruit.y - (4 + fruitOpacity * 2.5)}
                    x2={fruit.x}
                    y2={fruit.y - (4 + fruitOpacity * 2.5) - 3}
                    stroke="#78350f"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity={fruitOpacity}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                  />
                </motion.g>
              ))}
            </>
          )}

          {/* Magical Star Sparkles */}
          {progress > 95 && !isPlantDead && (
            <>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 45 + canopySize * 0.8;
                return (
                  <motion.g key={`sparkle-${i}`}>
                    <motion.path
                      d={`M ${160 + Math.cos(angle) * radius} ${215 - stemHeight - 5 + Math.sin(angle) * radius} 
                          l 1.5 1.5 l 2 0 l -1.5 1.5 l 0.5 2 l -2 -1 l -2 1 l 0.5 -2 l -1.5 -1.5 l 2 0 Z`}
                      fill="#fbbf24"
                      stroke="#fef3c7"
                      strokeWidth="0.5"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.25,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.g>
                );
              })}
            </>
          )}
        </motion.g>
        
        {/* Dead plant effect */}
        {isPlantDead && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <text x="160" y="140" textAnchor="middle" fontSize="50" opacity="0.6">💀</text>
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
            <div className="text-2xl font-bold text-sage-600 dark:text-sage-400">{Math.round(getProgress())}%</div>
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
