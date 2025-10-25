/**
 * Plant Stage Visualization Component
 * Renders different plant stages with SVG graphics and animations
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Plant Stage Component
 * @param {Object} props - Component props
 * @param {string} props.stage - Current plant stage
 * @param {string} props.visualState - Visual state (healthy, wilting, dead)
 * @param {Array} props.flowers - Array of flower objects
 * @param {Array} props.fruits - Array of fruit objects
 * @param {Array} props.specialEffects - Array of special effect objects
 * @param {number} props.health - Plant health (0-100)
 */
const PlantStage = ({ 
  stage = 'seed', 
  visualState = 'healthy', 
  flowers = [], 
  fruits = [], 
  specialEffects = [],
  health = 100 
}) => {
  const [showGlow, setShowGlow] = useState(false);
  
  // Trigger glow effect for special effects
  useEffect(() => {
    const glowEffect = specialEffects.find(effect => effect.type === 'glow');
    if (glowEffect) {
      setShowGlow(true);
      const timer = setTimeout(() => setShowGlow(false), glowEffect.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [specialEffects]);

  /**
   * Get color scheme based on visual state and health
   */
  const getColorScheme = () => {
    const baseColors = {
      healthy: {
        primary: '#22c55e', // green-500
        secondary: '#15803d', // green-700
        accent: '#86efac', // green-300
        soil: '#a3a3a3', // neutral-400
        pot: '#7c2d12' // red-900
      },
      wilting: {
        primary: '#eab308', // yellow-500
        secondary: '#a16207', // yellow-700
        accent: '#fde047', // yellow-300
        soil: '#a3a3a3',
        pot: '#7c2d12'
      },
      dead: {
        primary: '#6b7280', // gray-500
        secondary: '#374151', // gray-700
        accent: '#9ca3af', // gray-400
        soil: '#a3a3a3',
        pot: '#7c2d12'
      }
    };

    return baseColors[visualState] || baseColors.healthy;
  };

  const colors = getColorScheme();

  /**
   * Render pot/soil base
   */
  const renderPotBase = () => (
    <g>
      {/* Pot */}
      <ellipse 
        cx="200" 
        cy="280" 
        rx="80" 
        ry="15" 
        fill={colors.pot}
        opacity="0.8"
      />
      <rect 
        x="130" 
        y="265" 
        width="140" 
        height="30" 
        rx="5"
        fill={colors.pot}
        opacity="0.9"
      />
      
      {/* Soil */}
      <ellipse 
        cx="200" 
        cy="270" 
        rx="70" 
        ry="12" 
        fill={colors.soil}
      />
    </g>
  );

  /**
   * Render seed stage
   */
  const renderSeed = () => (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderPotBase()}
      
      {/* Seed underground */}
      <circle 
        cx="200" 
        cy="275" 
        r="3" 
        fill="#8b5cf6"
        opacity="0.8"
      />
      
      {/* Small mound */}
      <ellipse 
        cx="200" 
        cy="268" 
        rx="10" 
        ry="3" 
        fill={colors.soil}
      />
    </motion.g>
  );

  /**
   * Render sprout stage
   */
  const renderSprout = () => (
    <motion.g
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderPotBase()}
      
      {/* Stem */}
      <motion.line 
        x1="200" 
        y1="270" 
        x2="200" 
        y2="240" 
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      
      {/* First leaves */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <ellipse 
          cx="190" 
          cy="245" 
          rx="8" 
          ry="4" 
          fill={colors.accent}
          transform="rotate(-30 190 245)"
        />
        <ellipse 
          cx="210" 
          cy="245" 
          rx="8" 
          ry="4" 
          fill={colors.accent}
          transform="rotate(30 210 245)"
        />
      </motion.g>
    </motion.g>
  );

  /**
   * Render plant stage
   */
  const renderPlant = () => (
    <motion.g
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderPotBase()}
      
      {/* Main stem */}
      <line 
        x1="200" 
        y1="270" 
        x2="200" 
        y2="180" 
        stroke={colors.secondary}
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Multiple leaves */}
      {[
        { x: 185, y: 220, rotation: -45 },
        { x: 215, y: 220, rotation: 45 },
        { x: 180, y: 200, rotation: -60 },
        { x: 220, y: 200, rotation: 60 },
        { x: 190, y: 190, rotation: -30 },
        { x: 210, y: 190, rotation: 30 }
      ].map((leaf, index) => (
        <motion.ellipse
          key={index}
          cx={leaf.x}
          cy={leaf.y}
          rx="12"
          ry="6"
          fill={colors.primary}
          transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        />
      ))}
    </motion.g>
  );

  /**
   * Render blooming stage
   */
  const renderBlooming = () => (
    <motion.g
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderPotBase()}
      
      {/* Main stem */}
      <line 
        x1="200" 
        y1="270" 
        x2="200" 
        y2="150" 
        stroke={colors.secondary}
        strokeWidth="5"
        strokeLinecap="round"
      />
      
      {/* Branches */}
      <line x1="200" y1="180" x2="170" y2="160" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
      <line x1="200" y1="180" x2="230" y2="160" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
      
      {/* Leaves */}
      {[
        { x: 175, y: 200, rotation: -45 },
        { x: 225, y: 200, rotation: 45 },
        { x: 160, y: 180, rotation: -60 },
        { x: 240, y: 180, rotation: 60 },
        { x: 155, y: 165, rotation: -30 },
        { x: 245, y: 165, rotation: 30 }
      ].map((leaf, index) => (
        <ellipse
          key={index}
          cx={leaf.x}
          cy={leaf.y}
          rx="15"
          ry="8"
          fill={colors.primary}
          transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
        />
      ))}
      
      {/* Flowers */}
      {renderFlowers()}
    </motion.g>
  );

  /**
   * Render tree stage
   */
  const renderTree = () => (
    <motion.g
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderPotBase()}
      
      {/* Trunk */}
      <rect 
        x="195" 
        y="150" 
        width="10" 
        height="120" 
        fill={colors.secondary}
        rx="5"
      />
      
      {/* Main branches */}
      <line x1="200" y1="170" x2="160" y2="140" stroke={colors.secondary} strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="170" x2="240" y2="140" stroke={colors.secondary} strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="180" x2="150" y2="160" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
      <line x1="200" y1="180" x2="250" y2="160" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
      
      {/* Canopy */}
      <circle 
        cx="200" 
        cy="140" 
        r="50" 
        fill={colors.primary}
        opacity="0.8"
      />
      <circle 
        cx="180" 
        cy="150" 
        r="30" 
        fill={colors.accent}
        opacity="0.6"
      />
      <circle 
        cx="220" 
        cy="150" 
        r="30" 
        fill={colors.accent}
        opacity="0.6"
      />
      
      {/* Flowers and fruits */}
      {renderFlowers()}
      {renderFruits()}
    </motion.g>
  );

  /**
   * Render fruiting tree stage
   */
  const renderFruitingTree = () => (
    <motion.g
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderPotBase()}
      
      {/* Larger trunk */}
      <rect 
        x="192" 
        y="130" 
        width="16" 
        height="140" 
        fill={colors.secondary}
        rx="8"
      />
      
      {/* More branches */}
      <line x1="200" y1="150" x2="140" y2="120" stroke={colors.secondary} strokeWidth="5" strokeLinecap="round" />
      <line x1="200" y1="150" x2="260" y2="120" stroke={colors.secondary} strokeWidth="5" strokeLinecap="round" />
      <line x1="200" y1="170" x2="130" y2="150" stroke={colors.secondary} strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="170" x2="270" y2="150" stroke={colors.secondary} strokeWidth="4" strokeLinecap="round" />
      
      {/* Fuller canopy */}
      <circle 
        cx="200" 
        cy="120" 
        r="60" 
        fill={colors.primary}
        opacity="0.9"
      />
      <circle 
        cx="160" 
        cy="135" 
        r="35" 
        fill={colors.accent}
        opacity="0.7"
      />
      <circle 
        cx="240" 
        cy="135" 
        r="35" 
        fill={colors.accent}
        opacity="0.7"
      />
      <circle 
        cx="200" 
        cy="100" 
        r="25" 
        fill={colors.primary}
        opacity="0.8"
      />
      
      {/* Abundant flowers and fruits */}
      {renderFlowers()}
      {renderFruits()}
    </motion.g>
  );

  /**
   * Render flowers based on earned flowers
   */
  const renderFlowers = () => {
    const flowerPositions = [
      { x: 180, y: 140 },
      { x: 220, y: 140 },
      { x: 160, y: 160 },
      { x: 240, y: 160 },
      { x: 200, y: 120 }
    ];

    return flowers.slice(0, 5).map((flower, index) => {
      const pos = flowerPositions[index] || flowerPositions[0];
      const flowerColors = {
        cherry: '#ffc0cb',
        daisy: '#ffffff',
        rose: '#ff69b4',
        sunflower: '#ffd700',
        tulip: '#ff6347'
      };

      return (
        <motion.g
          key={`flower-${index}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <circle
            cx={pos.x}
            cy={pos.y}
            r="4"
            fill={flowerColors[flower.type] || '#ffc0cb'}
            stroke="#fff"
            strokeWidth="1"
          />
        </motion.g>
      );
    });
  };

  /**
   * Render fruits based on earned fruits
   */
  const renderFruits = () => {
    const fruitPositions = [
      { x: 170, y: 150 },
      { x: 230, y: 150 },
      { x: 150, y: 170 },
      { x: 250, y: 170 }
    ];

    return fruits.slice(0, 4).map((fruit, index) => {
      const pos = fruitPositions[index] || fruitPositions[0];
      const fruitColors = {
        apple: '#ff4444',
        orange: '#ff8c00',
        pear: '#9acd32',
        plum: '#8b008b',
        cherry: '#dc143c'
      };

      return (
        <motion.g
          key={`fruit-${index}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.3 }}
        >
          <circle
            cx={pos.x}
            cy={pos.y}
            r="6"
            fill={fruitColors[fruit.type] || '#ff4444'}
            stroke="#fff"
            strokeWidth="1"
          />
        </motion.g>
      );
    });
  };

  /**
   * Render the appropriate stage
   */
  const renderStage = () => {
    switch (stage) {
      case 'seed': return renderSeed();
      case 'sprout': return renderSprout();
      case 'plant': return renderPlant();
      case 'blooming': return renderBlooming();
      case 'tree': return renderTree();
      case 'fruitingTree': return renderFruitingTree();
      default: return renderSeed();
    }
  };

  return (
    <div className={`plant-container ${visualState === 'healthy' ? 'plant-healthy' : visualState === 'wilting' ? 'plant-wilting' : 'plant-dead'}`}>
      <motion.div
        className="relative"
        animate={{ 
          scale: showGlow ? [1, 1.05, 1] : 1,
          filter: showGlow ? ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] : 'brightness(1)'
        }}
        transition={{ duration: 2, repeat: showGlow ? Infinity : 0 }}
      >
        <svg 
          width="400" 
          height="300" 
          viewBox="0 0 400 300"
          className="w-full h-auto max-w-md mx-auto"
        >
          {/* Glow effect */}
          {showGlow && (
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          )}
          
          <g filter={showGlow ? "url(#glow)" : undefined}>
            {renderStage()}
          </g>
        </svg>

        {/* Floating particles for special effects */}
        <AnimatePresence>
          {showGlow && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
                  initial={{ 
                    x: Math.random() * 300 + 50,
                    y: Math.random() * 200 + 50,
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    y: [null, -50],
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PlantStage;