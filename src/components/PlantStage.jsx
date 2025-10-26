/**
 * Plant Stage Visualization Component
 * Renders different plant stages with beautiful SVG graphics and smooth animations
 * Features cute plants from germination to full fruiting trees with magical growing animations
 * Inspired by magical nighttime garden aesthetic
 */

import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  health = 100 
}) => {
  const [showGlow, setShowGlow] = useState(false);
  const [fallingFlowers, setFallingFlowers] = useState([]);
  
  // Trigger glow effect for special effects
  useEffect(() => {
    const glowEffect = specialEffects.find(effect => effect.type === 'glow');
    if (glowEffect) {
      setShowGlow(true);
      const timer = setTimeout(() => setShowGlow(false), glowEffect.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [specialEffects]);

  // Trigger flower falling animation
  useEffect(() => {
    if (flowers.length > 0 && stage === 'blooming' || stage === 'tree' || stage === 'fruitingTree') {
      // Generate falling flowers every 2 seconds
      const interval = setInterval(() => {
        const randomFlower = flowers[Math.floor(Math.random() * flowers.length)];
        const id = Math.random();
        setFallingFlowers(prev => [...prev, { id, type: randomFlower.type, xStart: Math.random() * 80 + 10 }]);
        
        // Remove falling flower after animation completes
        setTimeout(() => {
          setFallingFlowers(prev => prev.filter(f => f.id !== id));
        }, 3000);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [flowers, stage]);

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
   * Render seed stage - cute sprouting seed with magical grow
   */
  const renderSeed = () => (
    <motion.g
      initial={{ scale: 0, opacity: 0, translateY: 10 }}
      animate={{ scale: 1, opacity: 1, translateY: 0 }}
      transition={{ duration: 1.5, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      {renderPotBase()}
      
      {/* Soil layer with texture */}
      <ellipse 
        cx="200" 
        cy="268" 
        rx="75" 
        ry="10" 
        fill="#8b7355"
        opacity="0.6"
      />
      
      {/* Cute seed case (cracking) - grows gently */}
      <g style={{ transformOrigin: '200px 268px' }}>
        <motion.circle 
          cx="200" 
          cy="268" 
          r="6" 
          fill="#9d7e4f"
          animate={{ scale: [0.8, 1, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="200" 
          cy="268" 
          r="5" 
          fill="#c4a57b"
          opacity="0.8"
          animate={{ scale: [0.8, 1, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Seed crack line */}
        <path
          d="M 195 265 Q 200 268 205 265"
          stroke="#8b7355"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
      
      {/* Tiny sprout emerging - smooth grow */}
      <motion.line 
        x1="200" 
        y1="262" 
        x2="200" 
        y2="250" 
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: '200px 262px' }}
      />
      
      {/* First tiny leaves - unfurl smoothly */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        style={{ transformOrigin: '200px 255px' }}
      >
        <ellipse 
          cx="195" 
          cy="255" 
          rx="5" 
          ry="3" 
          fill="#86efac"
          transform="rotate(-25 195 255)"
        />
        <ellipse 
          cx="205" 
          cy="255" 
          rx="5" 
          ry="3" 
          fill="#86efac"
          transform="rotate(25 205 255)"
        />
      </motion.g>
    </motion.g>
  );

  /**
   * Render sprout stage - cute little sprout with smooth growth
   */
  const renderSprout = () => (
    <motion.g
      initial={{ scale: 0.8, opacity: 0, translateY: 15 }}
      animate={{ scale: 1, opacity: 1, translateY: 0 }}
      transition={{ duration: 2, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      {renderPotBase()}
      
      {/* Main stem with sway animation - grows from bottom */}
      <motion.g
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 270px" }}
      >
        {/* Stem grows upward smoothly */}
        <motion.line 
          x1="200" 
          y1="270" 
          x2="200" 
          y2="220" 
          stroke="#15803d"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        />
        
        {/* Cute oval leaves unfurl */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.2, 
            ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
          style={{ transformOrigin: '200px 240px' }}
        >
          <ellipse 
            cx="185" 
            cy="240" 
            rx="10" 
            ry="6" 
            fill="#22c55e"
            transform="rotate(-35 185 240)"
            filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.1))"
          />
          <ellipse 
            cx="215" 
            cy="240" 
            rx="10" 
            ry="6" 
            fill="#22c55e"
            transform="rotate(35 215 240)"
            filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.1))"
          />
        </motion.g>
      </motion.g>
      
      {/* Soil depression where plant sits */}
      <ellipse 
        cx="200" 
        cy="272" 
        rx="12" 
        ry="4" 
        fill="#6b5344"
        opacity="0.3"
      />
    </motion.g>
  );

  /**
   * Render plant stage - fuller plant with smooth growing leaves
   */
  const renderPlant = () => (
    <motion.g
      initial={{ scale: 0.9, opacity: 0, translateY: 20 }}
      animate={{ scale: 1, opacity: 1, translateY: 0 }}
      transition={{ duration: 2.5, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      {renderPotBase()}
      
      {/* Main stem with gentle sway - grows smoothly */}
      <motion.g
        animate={{ rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 270px" }}
      >
        <motion.line 
          x1="200" 
          y1="270" 
          x2="200" 
          y2="160" 
          stroke="#15803d"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
        />
        
        {/* Cute leaves with depth - grow sequentially */}
        {[
          { x: 180, y: 225, rotation: -50, size: 1, delay: 0.8 },
          { x: 220, y: 225, rotation: 50, size: 1, delay: 0.95 },
          { x: 170, y: 200, rotation: -65, size: 0.9, delay: 1.1 },
          { x: 230, y: 200, rotation: 65, size: 0.9, delay: 1.25 },
          { x: 185, y: 180, rotation: -40, size: 0.8, delay: 1.4 },
          { x: 215, y: 180, rotation: 40, size: 0.8, delay: 1.55 }
        ].map((leaf, index) => (
          <motion.g
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              rotateZ: [0, 3, -3, 0],
            }}
            transition={{ 
              scale: {
                duration: 0.7,
                delay: leaf.delay,
                ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
              },
              opacity: {
                duration: 0.7,
                delay: leaf.delay,
                ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
              },
              rotateZ: {
                duration: 3 + index * 0.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: leaf.delay
              }
            }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
          >
            <ellipse
              cx={leaf.x}
              cy={leaf.y}
              rx={12 * leaf.size}
              ry={7 * leaf.size}
              fill="#22c55e"
              transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
              filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.15))"
            />
            {/* Leaf vein detail */}
            <path
              d={`M ${leaf.x} ${leaf.y - 3 * leaf.size} Q ${leaf.x} ${leaf.y} ${leaf.x} ${leaf.y + 3 * leaf.size}`}
              stroke="#15803d"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
              transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
            />
          </motion.g>
        ))}
      </motion.g>
    </motion.g>
  );

  /**
   * Render blooming stage with beautiful flowers blooming smoothly
   */
  const renderBlooming = () => (
    <g>
      {renderPotBase()}
      
      {/* Main stem with sway - grows smoothly */}
      <motion.g
        animate={{ rotate: [0, 1, -1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 270px" }}
      >
        <motion.line 
          x1="200" 
          y1="270" 
          x2="200" 
          y2="130" 
          stroke="#15803d"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
        />
        
        {/* Branches */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <line x1="200" y1="170" x2="160" y2="145" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <line x1="200" y1="170" x2="240" y2="145" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <line x1="200" y1="150" x2="150" y2="140" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          <line x1="200" y1="150" x2="250" y2="140" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        
        {/* Cute leaves - grow and sway */}
        {[
          { x: 170, y: 205, rotation: -50, size: 1, delay: 1.2 },
          { x: 230, y: 205, rotation: 50, size: 1, delay: 1.35 },
          { x: 155, y: 175, rotation: -60, size: 0.9, delay: 1.5 },
          { x: 245, y: 175, rotation: 60, size: 0.9, delay: 1.65 },
          { x: 165, y: 155, rotation: -45, size: 0.7, delay: 1.8 },
          { x: 235, y: 155, rotation: 45, size: 0.7, delay: 1.95 }
        ].map((leaf, index) => (
          <motion.g
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              rotateZ: [0, 2, -2, 0],
            }}
            transition={{ 
              scale: {
                duration: 0.7,
                delay: leaf.delay,
                ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
              },
              opacity: {
                duration: 0.7,
                delay: leaf.delay,
              },
              rotateZ: {
                duration: 4 + index * 0.1, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: leaf.delay
              }
            }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
          >
            <ellipse
              cx={leaf.x}
              cy={leaf.y}
              rx={14 * leaf.size}
              ry={8 * leaf.size}
              fill="#22c55e"
              transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
              filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.15))"
            />
          </motion.g>
        ))}
        
        {/* Flowers - bloom beautifully */}
        {renderFlowers()}
      </motion.g>
    </g>
  );

  /**
   * Render tree stage - cute Minecraft-style tree with blocks growing in
   */
  const renderTree = () => (
    <g>
      {renderPotBase()}
      
      {/* Minecraft-style trunk made of blocks - grow sequentially */}
      <g>
        <motion.rect 
          x="192" y="220" width="16" height="16" 
          fill="#8b5a3c" stroke="#6b4423" strokeWidth="1"
          className="block-grow"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <motion.rect 
          x="192" y="204" width="16" height="16" 
          fill="#9d6b47" stroke="#6b4423" strokeWidth="1"
          className="block-grow"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <motion.rect 
          x="192" y="188" width="16" height="16" 
          fill="#8b5a3c" stroke="#6b4423" strokeWidth="1"
          className="block-grow"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <motion.rect 
          x="192" y="172" width="16" height="16" 
          fill="#9d6b47" stroke="#6b4423" strokeWidth="1"
          className="block-grow"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
      </g>
      
      {/* Minecraft-style foliage - cute pixel leaves grow and bob */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Top layer */}
        <g>
          {[
            { x: 168, y: 140, delay: 0.8 },
            { x: 180, y: 140, delay: 0.95 },
            { x: 192, y: 132, delay: 1.1 },
            { x: 204, y: 132, delay: 1.25 },
            { x: 216, y: 140, delay: 1.4 },
            { x: 228, y: 140, delay: 1.55 }
          ].map((block, idx) => (
            <motion.rect 
              key={`top-${idx}`}
              x={block.x} y={block.y} width="12" height="12" 
              fill={idx % 2 === 0 ? "#4CAF50" : "#66BB6A"}
              stroke={idx % 2 === 0 ? "#388E3C" : "#43A047"}
              strokeWidth="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: block.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              style={{ transformOrigin: `${block.x + 6}px ${block.y + 6}px` }}
            />
          ))}
        </g>
        
        {/* Middle layer */}
        <g>
          {[
            { x: 160, y: 152, delay: 1.7 },
            { x: 172, y: 152, delay: 1.85 },
            { x: 184, y: 152, delay: 2.0 },
            { x: 196, y: 152, delay: 2.15 },
            { x: 208, y: 152, delay: 2.3 },
            { x: 220, y: 152, delay: 2.45 },
            { x: 232, y: 152, delay: 2.6 }
          ].map((block, idx) => (
            <motion.rect 
              key={`mid-${idx}`}
              x={block.x} y={block.y} width="12" height="12" 
              fill={idx % 2 === 0 ? "#66BB6A" : "#4CAF50"}
              stroke={idx % 2 === 0 ? "#43A047" : "#388E3C"}
              strokeWidth="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: block.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              style={{ transformOrigin: `${block.x + 6}px ${block.y + 6}px` }}
            />
          ))}
        </g>
        
        {/* Lower layer */}
        <g>
          {[
            { x: 168, y: 164, delay: 2.75 },
            { x: 180, y: 164, delay: 2.9 },
            { x: 192, y: 164, delay: 3.05 },
            { x: 204, y: 164, delay: 3.2 },
            { x: 216, y: 164, delay: 3.35 },
            { x: 228, y: 164, delay: 3.5 }
          ].map((block, idx) => (
            <motion.rect 
              key={`low-${idx}`}
              x={block.x} y={block.y} width="12" height="12" 
              fill={idx % 2 === 0 ? "#4CAF50" : "#66BB6A"}
              stroke={idx % 2 === 0 ? "#388E3C" : "#43A047"}
              strokeWidth="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: block.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              style={{ transformOrigin: `${block.x + 6}px ${block.y + 6}px` }}
            />
          ))}
        </g>
      </motion.g>
      
      {/* Flowers and fruits */}
      {renderFlowers()}
      {renderFruits()}
    </g>
  );

  /**
   * Render fruiting tree stage - bigger Minecraft tree with fruits growing in
   */
  const renderFruitingTree = () => (
    <g>
      {renderPotBase()}
      
      {/* Minecraft-style trunk - taller with blocks growing up */}
      <g>
        <motion.rect 
          x="190" y="200" width="20" height="16" 
          fill="#8b5a3c" stroke="#6b4423" strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          style={{ transformOrigin: '200px 208px' }}
        />
        <motion.rect 
          x="190" y="184" width="20" height="16" 
          fill="#9d6b47" stroke="#6b4423" strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          style={{ transformOrigin: '200px 192px' }}
        />
        <motion.rect 
          x="190" y="168" width="20" height="16" 
          fill="#8b5a3c" stroke="#6b4423" strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          style={{ transformOrigin: '200px 176px' }}
        />
        <motion.rect 
          x="190" y="152" width="20" height="16" 
          fill="#9d6b47" stroke="#6b4423" strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          style={{ transformOrigin: '200px 160px' }}
        />
      </g>
      
      {/* Minecraft-style foliage - bigger with smooth grow */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Top layer */}
        <g>
          {[
            { x: 156, y: 120, delay: 0.8 },
            { x: 168, y: 120, delay: 0.95 },
            { x: 180, y: 112, delay: 1.1 },
            { x: 192, y: 108, delay: 1.25 },
            { x: 204, y: 112, delay: 1.4 },
            { x: 216, y: 120, delay: 1.55 },
            { x: 228, y: 120, delay: 1.7 }
          ].map((block, idx) => (
            <motion.rect 
              key={`top-${idx}`}
              x={block.x} y={block.y} width="12" height="12" 
              fill={idx % 2 === 0 ? "#4CAF50" : "#66BB6A"}
              stroke={idx % 2 === 0 ? "#388E3C" : "#43A047"}
              strokeWidth="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: block.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              style={{ transformOrigin: `${block.x + 6}px ${block.y + 6}px` }}
            />
          ))}
        </g>
        
        {/* Upper-middle layer */}
        <g>
          {[
            { x: 148, y: 132, delay: 1.85 },
            { x: 160, y: 132, delay: 2.0 },
            { x: 172, y: 132, delay: 2.15 },
            { x: 184, y: 132, delay: 2.3 },
            { x: 196, y: 132, delay: 2.45 },
            { x: 208, y: 132, delay: 2.6 },
            { x: 220, y: 132, delay: 2.75 },
            { x: 232, y: 132, delay: 2.9 }
          ].map((block, idx) => (
            <motion.rect 
              key={`umid-${idx}`}
              x={block.x} y={block.y} width="12" height="12" 
              fill={idx % 2 === 0 ? "#66BB6A" : "#4CAF50"}
              stroke={idx % 2 === 0 ? "#43A047" : "#388E3C"}
              strokeWidth="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: block.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              style={{ transformOrigin: `${block.x + 6}px ${block.y + 6}px` }}
            />
          ))}
        </g>
        
        {/* Middle layer */}
        <g>
          {[
            { x: 156, y: 144, delay: 3.05 },
            { x: 168, y: 144, delay: 3.2 },
            { x: 180, y: 144, delay: 3.35 },
            { x: 192, y: 144, delay: 3.5 },
            { x: 204, y: 144, delay: 3.65 },
            { x: 216, y: 144, delay: 3.8 },
            { x: 228, y: 144, delay: 3.95 }
          ].map((block, idx) => (
            <motion.rect 
              key={`mid-${idx}`}
              x={block.x} y={block.y} width="12" height="12" 
              fill={idx % 2 === 0 ? "#4CAF50" : "#66BB6A"}
              stroke={idx % 2 === 0 ? "#388E3C" : "#43A047"}
              strokeWidth="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: block.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              style={{ transformOrigin: `${block.x + 6}px ${block.y + 6}px` }}
            />
          ))}
        </g>
      </motion.g>
      
      {/* Abundant flowers and fruits */}
      {renderFlowers()}
      {renderFruits()}
    </g>
  );

  /**
   * Render flowers with smooth blooming animation
   */
  const renderFlowers = () => {
    const flowerPositions = [
      { x: 175, y: 135, type: 'cherry', delay: 2.5 },
      { x: 225, y: 135, type: 'rose', delay: 2.7 },
      { x: 160, y: 160, type: 'daisy', delay: 2.9 },
      { x: 240, y: 160, type: 'sunflower', delay: 3.1 },
      { x: 200, y: 125, type: 'tulip', delay: 3.3 }
    ];

    const flowerColors = {
      cherry: { petals: '#ffc0cb', center: '#ff69b4' },
      daisy: { petals: '#ffffff', center: '#ffd700' },
      rose: { petals: '#ff69b4', center: '#c41e3a' },
      sunflower: { petals: '#ffd700', center: '#ff8c00' },
      tulip: { petals: '#ff6347', center: '#ff4500' }
    };

    return flowers.slice(0, 5).map((flower, index) => {
      const pos = flowerPositions[index] || flowerPositions[0];
      const colors = flowerColors[flower.type] || flowerColors.cherry;

      return (
        <motion.g
          key={`flower-${index}`}
          initial={{ scale: 0, opacity: 0, rotateZ: -45 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotateZ: [-5, 5, -5]
          }}
          transition={{ 
            scale: { duration: 0.8, delay: pos.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
            opacity: { duration: 0.8, delay: pos.delay },
            rotateZ: { duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut", delay: pos.delay }
          }}
          style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
          filter="drop-shadow(0.5px 0.5px 1px rgba(0,0,0,0.2))"
        >
          {/* Flower petals - cute petal shape */}
          <circle cx={pos.x - 3} cy={pos.y - 4} r="2.5" fill={colors.petals} />
          <circle cx={pos.x + 3} cy={pos.y - 4} r="2.5" fill={colors.petals} />
          <circle cx={pos.x - 4} cy={pos.y} r="2.5" fill={colors.petals} />
          <circle cx={pos.x + 4} cy={pos.y} r="2.5" fill={colors.petals} />
          <circle cx={pos.x} cy={pos.y - 5} r="2.5" fill={colors.petals} />
          
          {/* Center */}
          <circle cx={pos.x} cy={pos.y} r="2" fill={colors.center} />
          <circle cx={pos.x} cy={pos.y} r="1.5" fill="#fff" opacity="0.6" />
        </motion.g>
      );
    });
  };

  /**
   * Render falling flower petals with smooth animation
   */
  const renderFallingFlowers = () => {
    const flowerColors = {
      cherry: { petals: '#ffc0cb', center: '#ff69b4' },
      daisy: { petals: '#ffffff', center: '#ffd700' },
      rose: { petals: '#ff69b4', center: '#c41e3a' },
      sunflower: { petals: '#ffd700', center: '#ff8c00' },
      tulip: { petals: '#ff6347', center: '#ff4500' }
    };

    return (
      <AnimatePresence>
        {fallingFlowers.map((flower) => {
          const colors = flowerColors[flower.type] || flowerColors.cherry;
          return (
            <motion.div
              key={flower.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ 
                backgroundColor: colors.petals,
                left: `${flower.xStart}%`,
                top: 0
              }}
              initial={{ 
                y: 0,
                opacity: 1,
                rotate: 0,
                x: 0
              }}
              animate={{ 
                y: 320,
                opacity: 0,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                x: (Math.random() - 0.5) * 60
              }}
              transition={{ 
                duration: 3 + Math.random() * 1.5,
                ease: "easeIn"
              }}
              exit={{ opacity: 0 }}
            />
          );
        })}
      </AnimatePresence>
    );
  };

  /**
   * Render fruits with smooth growing and bobbing animation
   */
  const renderFruits = () => {
    const fruitPositions = [
      { x: 165, y: 155, type: 'apple', delay: 3.5 },
      { x: 235, y: 155, type: 'orange', delay: 3.7 },
      { x: 145, y: 170, type: 'pear', delay: 3.9 },
      { x: 255, y: 170, type: 'cherry', delay: 4.1 }
    ];

    const fruitColors = {
      apple: { color: '#ff4444', shine: '#ff7777' },
      orange: { color: '#ff8c00', shine: '#ffb84d' },
      pear: { color: '#9acd32', shine: '#c8e6a0' },
      plum: { color: '#8b008b', shine: '#c060c0' },
      cherry: { color: '#dc143c', shine: '#ff6b6b' }
    };

    return fruits.slice(0, 4).map((fruit, index) => {
      const pos = fruitPositions[index] || fruitPositions[0];
      const colors = fruitColors[fruit.type] || fruitColors.apple;

      return (
        <motion.g
          key={`fruit-${index}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -3, 0]
          }}
          transition={{ 
            scale: { duration: 0.8, delay: pos.delay, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
            opacity: { duration: 0.8, delay: pos.delay },
            y: { duration: 2.5 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: pos.delay }
          }}
          style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
          filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.25))"
        >
          {/* Fruit body */}
          <circle cx={pos.x} cy={pos.y} r="6" fill={colors.color} />
          
          {/* Shine */}
          <circle cx={pos.x - 2} cy={pos.y - 2} r="2" fill={colors.shine} opacity="0.6" />
          
          {/* Stem */}
          <rect x={pos.x - 0.5} y={pos.y - 8} width="1" height="2" fill="#8b7355" />
        </motion.g>
      );
    });
  };

  /**
   * Render the appropriate stage
   */
  const renderStage = () => {
    console.log('🌱 Rendering stage:', stage);
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
        <div className="relative">
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

          {/* Falling flower petals overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-md mx-auto">
            {renderFallingFlowers()}
          </div>
        </div>

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