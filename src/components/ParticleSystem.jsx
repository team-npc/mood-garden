/**
 * Particle Effects System
 * Provides beautiful ambient particles, sparkles, and nature effects
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Particle types configuration
const PARTICLE_CONFIGS = {
  sparkles: {
    count: 20,
    colors: ['#D4AF37', '#F4E7D1', '#FFD700', '#FFF8DC'],
    size: { min: 4, max: 8 },
    duration: { min: 2, max: 4 },
    emoji: '✨'
  },
  petals: {
    count: 15,
    colors: ['#fda4af', '#fb7185', '#fecdd3', '#ffe4e6'],
    size: { min: 12, max: 20 },
    duration: { min: 8, max: 15 },
    emojis: ['🌸', '💮', '🏵️', '🌺']
  },
  leaves: {
    count: 12,
    colors: ['#4ade80', '#22c55e', '#86efac', '#a3e635'],
    size: { min: 14, max: 22 },
    duration: { min: 10, max: 18 },
    emojis: ['🍃', '🌿', '☘️', '🍀']
  },
  fireflies: {
    count: 25,
    colors: ['#fef08a', '#fde047', '#facc15', '#fbbf24'],
    size: { min: 4, max: 8 },
    duration: { min: 3, max: 6 },
    glow: true
  },
  snow: {
    count: 40,
    colors: ['#ffffff', '#f0f9ff', '#e0f2fe', '#dbeafe'],
    size: { min: 4, max: 10 },
    duration: { min: 8, max: 15 },
    emoji: '❄️'
  },
  stars: {
    count: 30,
    colors: ['#fef3c7', '#fde68a', '#fcd34d', '#f59e0b'],
    size: { min: 6, max: 12 },
    duration: { min: 2, max: 5 },
    emoji: '⭐'
  },
  hearts: {
    count: 10,
    colors: ['#fda4af', '#fb7185', '#f43f5e', '#e11d48'],
    size: { min: 14, max: 24 },
    duration: { min: 4, max: 8 },
    emojis: ['💖', '💗', '💕', '💓']
  },
  butterflies: {
    count: 8,
    colors: ['#c084fc', '#a855f7', '#d946ef', '#f0abfc'],
    size: { min: 16, max: 24 },
    duration: { min: 6, max: 12 },
    emojis: ['🦋']
  },
  rain: {
    count: 50,
    colors: ['#93c5fd', '#60a5fa', '#3b82f6'],
    size: { min: 2, max: 4 },
    duration: { min: 1, max: 2 }
  },
  confetti: {
    count: 40,
    colors: ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#fb7185'],
    size: { min: 6, max: 12 },
    duration: { min: 3, max: 6 }
  }
};

// Generate random number in range
const random = (min, max) => Math.random() * (max - min) + min;

// Generate random integer in range
const randomInt = (min, max) => Math.floor(random(min, max));

// Pick random item from array
const randomItem = (arr) => arr[randomInt(0, arr.length)];

// Single Particle Component
const Particle = ({ config, type, index, containerSize }) => {
  const particleConfig = PARTICLE_CONFIGS[type] || PARTICLE_CONFIGS.sparkles;
  
  const style = useMemo(() => {
    const size = random(particleConfig.size.min, particleConfig.size.max);
    const duration = random(particleConfig.duration.min, particleConfig.duration.max);
    const delay = random(0, duration);
    const startX = random(0, containerSize.width || window.innerWidth);
    const drift = random(-100, 100);
    const rotation = random(0, 720);
    
    return {
      size,
      duration,
      delay,
      startX,
      drift,
      rotation,
      color: randomItem(particleConfig.colors),
      emoji: particleConfig.emojis ? randomItem(particleConfig.emojis) : particleConfig.emoji
    };
  }, [type, particleConfig, containerSize]);

  const getAnimation = () => {
    switch (type) {
      case 'sparkles':
      case 'stars':
        return {
          initial: { 
            opacity: 0, 
            scale: 0,
            x: style.startX,
            y: random(containerSize.height * 0.2, containerSize.height * 0.8)
          },
          animate: { 
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.2, 0],
            rotate: [0, 180, 360],
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        };
      
      case 'petals':
      case 'leaves':
        return {
          initial: { 
            opacity: 0,
            x: style.startX,
            y: -50,
            rotate: 0
          },
          animate: {
            opacity: [0, 1, 1, 0.5, 0],
            x: [style.startX, style.startX + style.drift],
            y: [-50, containerSize.height + 50],
            rotate: [0, style.rotation]
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: 'linear'
          }
        };
      
      case 'fireflies':
        return {
          initial: {
            opacity: 0,
            x: style.startX,
            y: random(containerSize.height * 0.3, containerSize.height * 0.8),
            scale: 0
          },
          animate: {
            opacity: [0, 1, 0.5, 1, 0],
            x: [style.startX, style.startX + style.drift / 2, style.startX - style.drift / 2, style.startX + style.drift],
            y: (y) => [y, y - 30, y + 20, y - 40, y],
            scale: [0, 1, 0.8, 1, 0]
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        };
      
      case 'snow':
        return {
          initial: {
            opacity: 0,
            x: style.startX,
            y: -20,
            rotate: 0
          },
          animate: {
            opacity: [0, 1, 1, 0],
            x: [style.startX, style.startX + Math.sin(style.delay) * 50, style.startX + style.drift / 3],
            y: [-20, containerSize.height + 20],
            rotate: [0, style.rotation / 2]
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: 'linear'
          }
        };
      
      case 'butterflies':
        return {
          initial: {
            opacity: 0,
            x: random(-50, containerSize.width + 50),
            y: random(containerSize.height * 0.2, containerSize.height * 0.8),
            scale: 0
          },
          animate: {
            opacity: [0, 1, 1, 0],
            x: [style.startX, style.startX + 100, style.startX + 50, style.startX + 150],
            y: (y) => [y, y - 50, y + 30, y - 20],
            scale: [0, 1, 1, 0],
            rotateY: [0, 180, 0, 180, 0]
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        };
      
      case 'rain':
        return {
          initial: {
            opacity: 0,
            x: style.startX,
            y: -10
          },
          animate: {
            opacity: [0, 0.6, 0.6, 0],
            x: style.startX,
            y: [-10, containerSize.height + 10]
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: 'linear'
          }
        };
      
      case 'confetti':
        return {
          initial: {
            opacity: 0,
            x: containerSize.width / 2,
            y: 0,
            rotate: 0,
            scale: 0
          },
          animate: {
            opacity: [0, 1, 1, 0],
            x: [containerSize.width / 2, style.startX],
            y: [0, containerSize.height],
            rotate: [0, style.rotation],
            scale: [0, 1, 1, 0.5]
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: [0.2, 0.8, 0.8, 1]
          }
        };
      
      case 'hearts':
        return {
          initial: {
            opacity: 0,
            x: style.startX,
            y: containerSize.height + 20,
            scale: 0
          },
          animate: {
            opacity: [0, 1, 1, 0],
            x: [style.startX, style.startX + style.drift / 2],
            y: [containerSize.height + 20, -50],
            scale: [0, 1, 0.8, 0]
          },
          transition: {
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: 'easeOut'
          }
        };
      
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: [0, 1, 0] },
          transition: { duration: 2, repeat: Infinity }
        };
    }
  };

  const animation = getAnimation();

  // Render based on type
  if (particleConfig.emoji || particleConfig.emojis) {
    return (
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ fontSize: `${style.size}px` }}
        {...animation}
      >
        {style.emoji}
      </motion.div>
    );
  }

  if (type === 'rain') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 2,
          height: style.size * 5,
          background: `linear-gradient(to bottom, transparent, ${style.color})`,
          borderRadius: '2px'
        }}
        {...animation}
      />
    );
  }

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        width: style.size,
        height: style.size,
        backgroundColor: style.color,
        boxShadow: particleConfig.glow 
          ? `0 0 ${style.size * 2}px ${style.color}, 0 0 ${style.size * 4}px ${style.color}`
          : undefined
      }}
      {...animation}
    />
  );
};

// Main Particle System Component
const ParticleSystem = ({ 
  type = 'sparkles', 
  enabled = true, 
  intensity = 1,
  container = false // If true, particles are contained within parent element
}) => {
  const [containerSize, setContainerSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  useEffect(() => {
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particleConfig = PARTICLE_CONFIGS[type];
  const particleCount = Math.floor((particleConfig?.count || 20) * intensity);

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => i);
  }, [particleCount]);

  if (!enabled || !particleConfig) return null;

  return (
    <div 
      className={`
        ${container ? 'absolute' : 'fixed'} 
        inset-0 pointer-events-none overflow-hidden z-0
      `}
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((index) => (
          <Particle
            key={`${type}-${index}`}
            type={type}
            index={index}
            containerSize={containerSize}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Burst Effect Component (for celebrations)
const ParticleBurst = ({ 
  trigger, 
  type = 'confetti',
  x, 
  y,
  count = 30,
  onComplete
}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (i / count) * 360,
        distance: random(50, 200),
        rotation: random(0, 720),
        size: random(8, 16),
        color: randomItem(PARTICLE_CONFIGS[type]?.colors || PARTICLE_CONFIGS.confetti.colors)
      }));
      setParticles(newParticles);
      
      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [trigger, count, type, onComplete]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: x,
            top: y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: type === 'confetti' ? '2px' : '50%'
          }}
          initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0.5],
            x: Math.cos(particle.angle * Math.PI / 180) * particle.distance,
            y: [
              Math.sin(particle.angle * Math.PI / 180) * particle.distance,
              Math.sin(particle.angle * Math.PI / 180) * particle.distance + 100
            ],
            rotate: particle.rotation,
            opacity: [1, 1, 0]
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
  );
};

// Hook for triggering particle bursts
const useParticleBurst = () => {
  const [burst, setBurst] = useState(null);

  const triggerBurst = useCallback((x, y, type = 'confetti', count = 30) => {
    setBurst({ x, y, type, count, key: Date.now() });
  }, []);

  const clearBurst = useCallback(() => {
    setBurst(null);
  }, []);

  return { burst, triggerBurst, clearBurst };
};

// Ambient Glow Component
const AmbientGlow = ({ color = 'sage', position = 'center', size = 'md', animate = true }) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-128 h-128'
  };

  const colorClasses = {
    sage: 'bg-sage-400/30',
    gold: 'bg-gold-400/30',
    rose: 'bg-rose-400/30',
    blue: 'bg-blue-400/30',
    purple: 'bg-purple-400/30'
  };

  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div
      className={`
        absolute ${sizeClasses[size]} ${colorClasses[color]} ${positionClasses[position]}
        rounded-full blur-3xl pointer-events-none
        ${animate ? 'animate-breathe' : ''}
      `}
      aria-hidden="true"
    />
  );
};

export { 
  ParticleSystem, 
  ParticleBurst, 
  useParticleBurst, 
  AmbientGlow,
  PARTICLE_CONFIGS 
};

export default ParticleSystem;
