/**
 * Seasonal Events Component
 * Special plants and decorations for holidays and seasons
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Get current season based on date
 */
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

/**
 * Get current holiday if applicable
 */
const getCurrentHoliday = () => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  
  // Check for specific holidays
  if (month === 11 && day >= 20 && day <= 31) return 'winter-holiday';
  if (month === 0 && day === 1) return 'new-year';
  if (month === 1 && day >= 10 && day <= 14) return 'valentines';
  if (month === 2 && day >= 14 && day <= 17) return 'stpatricks';
  if (month === 3 && day >= 1 && day <= 22) return 'spring-equinox';
  if (month === 9 && day >= 25 && day <= 31) return 'halloween';
  if (month === 10 && day >= 20 && day <= 28) return 'thanksgiving';
  
  return null;
};

/**
 * Seasonal themes with colors and decorations
 */
export const SEASONAL_THEMES = {
  spring: {
    id: 'spring',
    name: 'Spring Bloom',
    emoji: '🌸',
    colors: {
      primary: '#f9a8d4',
      secondary: '#fbcfe8',
      accent: '#fce7f3',
      background: 'from-pink-900/20 to-rose-900/20'
    },
    decorations: ['🌸', '🌷', '🐝', '🦋', '🌱'],
    plantOverlay: 'cherry-blossoms',
    ambientParticles: 'petals'
  },
  summer: {
    id: 'summer',
    name: 'Summer Sunshine',
    emoji: '☀️',
    colors: {
      primary: '#fbbf24',
      secondary: '#fcd34d',
      accent: '#fef3c7',
      background: 'from-amber-900/20 to-orange-900/20'
    },
    decorations: ['☀️', '🌻', '🦎', '🍉', '🌴'],
    plantOverlay: 'sunflowers',
    ambientParticles: 'fireflies'
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn Harvest',
    emoji: '🍂',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#fed7aa',
      background: 'from-orange-900/20 to-red-900/20'
    },
    decorations: ['🍂', '🍁', '🎃', '🌾', '🍎'],
    plantOverlay: 'fall-leaves',
    ambientParticles: 'leaves'
  },
  winter: {
    id: 'winter',
    name: 'Winter Wonder',
    emoji: '❄️',
    colors: {
      primary: '#93c5fd',
      secondary: '#bfdbfe',
      accent: '#dbeafe',
      background: 'from-blue-900/20 to-indigo-900/20'
    },
    decorations: ['❄️', '⛄', '🌨️', '🎄', '✨'],
    plantOverlay: 'snow',
    ambientParticles: 'snowflakes'
  }
};

/**
 * Holiday themes
 */
export const HOLIDAY_THEMES = {
  'winter-holiday': {
    id: 'winter-holiday',
    name: 'Holiday Spirit',
    emoji: '🎄',
    colors: {
      primary: '#22c55e',
      secondary: '#ef4444',
      accent: '#fcd34d',
      background: 'from-green-900/20 to-red-900/20'
    },
    decorations: ['🎄', '🎅', '🎁', '⭐', '🔔'],
    specialPlant: 'christmas-tree'
  },
  'new-year': {
    id: 'new-year',
    name: 'New Beginnings',
    emoji: '🎆',
    colors: {
      primary: '#fcd34d',
      secondary: '#c084fc',
      accent: '#22d3ee',
      background: 'from-purple-900/20 to-cyan-900/20'
    },
    decorations: ['🎆', '🎇', '🥳', '🍾', '✨'],
    specialPlant: 'firework-flower'
  },
  'valentines': {
    id: 'valentines',
    name: "Valentine's Day",
    emoji: '💕',
    colors: {
      primary: '#f43f5e',
      secondary: '#fb7185',
      accent: '#fda4af',
      background: 'from-rose-900/20 to-pink-900/20'
    },
    decorations: ['💕', '💖', '🌹', '💌', '🍫'],
    specialPlant: 'heart-rose'
  },
  'stpatricks': {
    id: 'stpatricks',
    name: "St. Patrick's Day",
    emoji: '☘️',
    colors: {
      primary: '#22c55e',
      secondary: '#4ade80',
      accent: '#86efac',
      background: 'from-green-900/30 to-emerald-900/20'
    },
    decorations: ['☘️', '🍀', '🌈', '🪙', '💚'],
    specialPlant: 'four-leaf-clover'
  },
  'spring-equinox': {
    id: 'spring-equinox',
    name: 'Spring Awakening',
    emoji: '🐣',
    colors: {
      primary: '#a3e635',
      secondary: '#84cc16',
      accent: '#ecfccb',
      background: 'from-lime-900/20 to-green-900/20'
    },
    decorations: ['🐣', '🌷', '🥚', '🐰', '🌼'],
    specialPlant: 'easter-lily'
  },
  'halloween': {
    id: 'halloween',
    name: 'Spooky Season',
    emoji: '🎃',
    colors: {
      primary: '#f97316',
      secondary: '#7c3aed',
      accent: '#22c55e',
      background: 'from-orange-900/30 to-purple-900/30'
    },
    decorations: ['🎃', '👻', '🦇', '🕷️', '🌙'],
    specialPlant: 'pumpkin-vine'
  },
  'thanksgiving': {
    id: 'thanksgiving',
    name: 'Gratitude Season',
    emoji: '🦃',
    colors: {
      primary: '#d97706',
      secondary: '#92400e',
      accent: '#fcd34d',
      background: 'from-amber-900/30 to-orange-900/20'
    },
    decorations: ['🦃', '🌽', '🥧', '🍂', '🙏'],
    specialPlant: 'cornucopia'
  }
};

/**
 * Seasonal Decoration Overlay
 */
export const SeasonalDecorations = ({ theme, intensity = 'normal' }) => {
  if (!theme) return null;
  
  const decorationCount = intensity === 'high' ? 12 : intensity === 'low' ? 4 : 8;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(decorationCount)].map((_, i) => {
        const decoration = theme.decorations[i % theme.decorations.length];
        const startX = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${startX}%`, top: '-10%' }}
            animate={{
              y: ['0%', '110vh'],
              x: [0, Math.sin(i) * 50],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {decoration}
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * Ambient Particles based on season
 */
export const SeasonalParticles = ({ type, count = 20 }) => {
  const particles = useMemo(() => {
    const particleTypes = {
      petals: { emoji: '🌸', size: 'text-lg', speed: 8 },
      fireflies: { emoji: '✨', size: 'text-sm', speed: 3 },
      leaves: { emoji: '🍂', size: 'text-xl', speed: 6 },
      snowflakes: { emoji: '❄️', size: 'text-lg', speed: 10 }
    };
    
    const config = particleTypes[type] || particleTypes.petals;
    
    return [...Array(count)].map((_, i) => ({
      id: i,
      ...config,
      x: Math.random() * 100,
      delay: Math.random() * 10
    }));
  }, [type, count]);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.size}`}
          style={{ left: `${particle.x}%`, top: '-5%' }}
          animate={{
            y: ['0%', '105vh'],
            x: [0, Math.sin(particle.id) * 30],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: particle.speed,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Special Seasonal Plants
 */
export const SEASONAL_PLANTS = {
  'cherry-blossoms': {
    name: 'Cherry Blossom Tree',
    emoji: '🌸',
    description: 'A beautiful spring bloom',
    svg: (
      <g>
        <circle cx="200" cy="80" r="60" fill="#fce7f3" />
        <circle cx="160" cy="100" r="40" fill="#fbcfe8" />
        <circle cx="240" cy="100" r="40" fill="#fbcfe8" />
        <circle cx="200" cy="60" r="35" fill="#f9a8d4" />
        {[...Array(8)].map((_, i) => (
          <text 
            key={i}
            x={180 + (i % 4) * 20} 
            y={60 + Math.floor(i / 4) * 40} 
            fontSize="20"
          >
            🌸
          </text>
        ))}
      </g>
    )
  },
  'christmas-tree': {
    name: 'Holiday Tree',
    emoji: '🎄',
    description: 'Festive winter decoration',
    svg: (
      <g>
        <polygon points="200,30 260,120 140,120" fill="#166534" />
        <polygon points="200,60 280,160 120,160" fill="#15803d" />
        <polygon points="200,90 300,200 100,200" fill="#22c55e" />
        <rect x="185" y="200" width="30" height="40" fill="#92400e" />
        <text x="190" y="100" fontSize="16">⭐</text>
        <text x="170" y="140" fontSize="14">🔴</text>
        <text x="210" y="150" fontSize="14">🔵</text>
        <text x="150" y="180" fontSize="14">🟡</text>
        <text x="230" y="175" fontSize="14">🟢</text>
      </g>
    )
  }
};

/**
 * Get current theme (season or holiday)
 */
export const getCurrentTheme = () => {
  const holiday = getCurrentHoliday();
  if (holiday && HOLIDAY_THEMES[holiday]) {
    return { ...HOLIDAY_THEMES[holiday], isHoliday: true };
  }
  
  const season = getCurrentSeason();
  return { ...SEASONAL_THEMES[season], isHoliday: false };
};

/**
 * Seasonal Badge Component
 */
export const SeasonalBadge = ({ theme }) => {
  if (!theme) return null;
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${theme.colors.background} border border-white/20`}
    >
      <span>{theme.emoji}</span>
      <span className="text-sm text-cream-200">{theme.name}</span>
    </motion.div>
  );
};

/**
 * Seasonal Garden Background
 */
const SeasonalGardenBackground = ({ children }) => {
  const theme = useMemo(() => getCurrentTheme(), []);
  
  return (
    <div className={`relative bg-gradient-to-b ${theme.colors.background}`}>
      <SeasonalDecorations theme={theme} intensity="low" />
      <SeasonalParticles type={theme.ambientParticles} count={15} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SeasonalGardenBackground;
