/**
 * Plant Stage Visualization Component - Magical Growing Garden
 * Every element grows smoothly from germination to fruiting tree
 * Inspired by beautiful nighttime garden aesthetic
 */

import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import './PlantStageNew.css';

const PlantStageNew = ({ 
  stage = 'seed', 
  visualState = 'healthy', 
  // eslint-disable-next-line no-unused-vars
  flowers = [], 
  // eslint-disable-next-line no-unused-vars
  fruits = [], 
  // eslint-disable-next-line no-unused-vars
  specialEffects = [],
  // eslint-disable-next-line no-unused-vars
  health = 100 
}) => {
  // eslint-disable-next-line no-unused-vars
  const [showGlow, setShowGlow] = useState(false);

  /**
   * Create a growing animation for any element
   * @param {number} delayMs - Delay before animation starts
   * @param {number} durationMs - Duration of the animation
   */
  const growingAnimation = (delayMs = 0, durationMs = 600) => ({
    initial: { scaleY: 0, opacity: 0 },
    animate: { scaleY: 1, opacity: 1 },
    transition: { 
      delay: delayMs / 1000, 
      duration: durationMs / 1000, 
      ease: "easeOut"
    },
    style: { transformOrigin: 'bottom center' }
  });

  const bloomAnimation = (delayMs = 0) => ({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      delay: delayMs / 1000, 
      duration: 0.6,
      ease: "cubic-bezier(0.34, 1.56, 0.64, 1)"
    }
  });

  /**
   * Seed Stage - Natural germinating seed
   */
  const renderSeedStage = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
      <defs>
        <linearGradient id="potGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bc8b5a" />
          <stop offset="50%" stopColor="#a67550" />
          <stop offset="100%" stopColor="#8d5a3a" />
        </linearGradient>
        <radialGradient id="soilGrad" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#5d4332" />
          <stop offset="100%" stopColor="#3e2a1f" />
        </radialGradient>
        <radialGradient id="seedGrad" cx="35%" cy="25%">
          <stop offset="0%" stopColor="#d4c4a8" />
          <stop offset="50%" stopColor="#a89060" />
          <stop offset="100%" stopColor="#7a6540" />
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Clay pot */}
      <ellipse cx="200" cy="282" rx="75" ry="12" fill="#7a5a3a" opacity="0.4"/>
      <path d="M 135 270 Q 130 260 135 250 L 265 250 Q 270 260 265 270 Z" fill="url(#potGrad)" stroke="#6d4c37" strokeWidth="2"/>
      <ellipse cx="200" cy="250" rx="65" ry="10" fill="url(#potGrad)"/>
      <path d="M 145 250 Q 145 253 148 254" stroke="#e8d4b8" strokeWidth="1.5" fill="none" opacity="0.6"/>
      
      {/* Soil */}
      <ellipse cx="200" cy="252" rx="63" ry="8" fill="url(#soilGrad)"/>
      <ellipse cx="195" cy="252" rx="8" ry="2" fill="#4a3426" opacity="0.6"/>
      <ellipse cx="210" cy="253" rx="5" ry="1.5" fill="#4a3426" opacity="0.5"/>
      
      {/* Seed with natural texture */}
      <motion.g
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="200" cy="248" rx="8" ry="10" fill="url(#seedGrad)" filter="url(#softGlow)"/>
        <ellipse cx="197" cy="244" rx="3" ry="4" fill="#d4c4a8" opacity="0.5"/>
        <path d="M 200 243 L 200 253" stroke="#7a6540" strokeWidth="0.5" opacity="0.7"/>
      </motion.g>
      
      {/* Tiny root starting */}
      <motion.path
        d="M 200 258 Q 199 262 198 265"
        stroke="#9d8b6f"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />
      
      {/* Tiny sprout pushing up */}
      <motion.g
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 1, ease: "easeOut" }}
        style={{ transformOrigin: '200px 248px' }}
      >
        <path d="M 200 248 Q 200 242 200 238" stroke="#89b26d" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <motion.ellipse 
          cx="197.5" cy="238" rx="3" ry="1.8" fill="#a8c995" 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8, ease: "backOut" }}
          transform="rotate(-30 197.5 238)"
        />
        <motion.ellipse 
          cx="202.5" cy="238" rx="3" ry="1.8" fill="#a8c995"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8, ease: "backOut" }}
          transform="rotate(30 202.5 238)"
        />
      </motion.g>
    </svg>
  );

  /**
   * Sprout Stage - Fresh young sprout with natural leaves
   */
  const renderSproutStage = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
      <defs>
        <linearGradient id="potGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bc8b5a" />
          <stop offset="50%" stopColor="#a67550" />
          <stop offset="100%" stopColor="#8d5a3a" />
        </linearGradient>
        <radialGradient id="soilGrad2" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#5d4332" />
          <stop offset="100%" stopColor="#3e2a1f" />
        </radialGradient>
        <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9dbf7e" />
          <stop offset="50%" stopColor="#7ca85c" />
          <stop offset="100%" stopColor="#5d8041" />
        </linearGradient>
        <radialGradient id="leafGrad" cx="20%" cy="30%">
          <stop offset="0%" stopColor="#c5e1a5" />
          <stop offset="60%" stopColor="#8fbc6e" />
          <stop offset="100%" stopColor="#618a3f" />
        </radialGradient>
        <filter id="leafShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="0.5" dy="1.5" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.25"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Pot */}
      <ellipse cx="200" cy="282" rx="75" ry="12" fill="#7a5a3a" opacity="0.4"/>
      <path d="M 135 270 Q 130 260 135 250 L 265 250 Q 270 260 265 270 Z" fill="url(#potGrad2)" stroke="#6d4c37" strokeWidth="2"/>
      <ellipse cx="200" cy="250" rx="65" ry="10" fill="url(#potGrad2)"/>
      
      {/* Soil */}
      <ellipse cx="200" cy="252" rx="63" ry="8" fill="url(#soilGrad2)"/>
      
      {/* Gentle swaying stem */}
      <motion.g
        animate={{ rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 252px" }}
      >
        {/* Main stem with natural curve */}
        <path 
          d="M 200 252 Q 199 230 200 210"
          stroke="url(#stemGrad)" 
          strokeWidth="3" 
          strokeLinecap="round"
          fill="none"
          filter="url(#leafShadow)"
        />
        
        {/* First pair of leaves - lower */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}
        >
          {/* Left leaf */}
          <g filter="url(#leafShadow)">
            <ellipse 
              cx="185" cy="230" rx="12" ry="7" 
              fill="url(#leafGrad)"
              transform="rotate(-45 185 230)"
            />
            <path
              d="M 180 230 Q 185 230 190 230"
              stroke="#618a3f" 
              strokeWidth="0.8" 
              fill="none" 
              opacity="0.6"
              transform="rotate(-45 185 230)"
            />
          </g>
          
          {/* Right leaf */}
          <g filter="url(#leafShadow)">
            <ellipse 
              cx="215" cy="230" rx="12" ry="7" 
              fill="url(#leafGrad)"
              transform="rotate(45 215 230)"
            />
            <path
              d="M 210 230 Q 215 230 220 230"
              stroke="#618a3f" 
              strokeWidth="0.8" 
              fill="none" 
              opacity="0.6"
              transform="rotate(45 215 230)"
            />
          </g>
        </motion.g>
        
        {/* Second pair - upper */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "backOut" }}
        >
          <g filter="url(#leafShadow)">
            <ellipse 
              cx="188" cy="218" rx="10" ry="6" 
              fill="url(#leafGrad)"
              transform="rotate(-50 188 218)"
            />
            <path
              d="M 184 218 Q 188 218 192 218"
              stroke="#618a3f" 
              strokeWidth="0.7" 
              fill="none" 
              opacity="0.6"
              transform="rotate(-50 188 218)"
            />
          </g>
          
          <g filter="url(#leafShadow)">
            <ellipse 
              cx="212" cy="218" rx="10" ry="6" 
              fill="url(#leafGrad)"
              transform="rotate(50 212 218)"
            />
            <path
              d="M 208 218 Q 212 218 216 218"
              stroke="#618a3f" 
              strokeWidth="0.7" 
              fill="none" 
              opacity="0.6"
              transform="rotate(50 212 218)"
            />
          </g>
        </motion.g>
        
        {/* Top leaves - smallest */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3, ease: "backOut" }}
        >
          <ellipse cx="197" cy="211" rx="4" ry="2.5" fill="#a8c995" transform="rotate(-25 197 211)"/>
          <ellipse cx="203" cy="211" rx="4" ry="2.5" fill="#a8c995" transform="rotate(25 203 211)"/>
        </motion.g>
      </motion.g>
      
      {/* Dewdrop on one leaf */}
      <motion.ellipse
        cx="187" cy="232" rx="2" ry="2.5" fill="#d4ecf7" opacity="0.9"
        animate={{ opacity: [0.9, 0.6, 0.9], scale: [1, 0.95, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="187" cy="231" r="0.8" fill="#fff" opacity="0.8"/>
    </svg>
  );

  /**
   * Plant Stage - Mature lush plant with natural leaves
   */
  const renderPlantStage = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
      <defs>
        <linearGradient id="potGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bc8b5a" />
          <stop offset="50%" stopColor="#a67550" />
          <stop offset="100%" stopColor="#8d5a3a" />
        </linearGradient>
        <radialGradient id="soilGrad3" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#5d4332" />
          <stop offset="100%" stopColor="#3e2a1f" />
        </radialGradient>
        <linearGradient id="stemGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8fbc6e" />
          <stop offset="100%" stopColor="#5d8041" />
        </linearGradient>
        <radialGradient id="leafGrad3" cx="15%" cy="25%">
          <stop offset="0%" stopColor="#d4e7c5" />
          <stop offset="40%" stopColor="#9dbf7e" />
          <stop offset="100%" stopColor="#6d904f" />
        </radialGradient>
        <filter id="plantShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Pot */}
      <ellipse cx="200" cy="282" rx="75" ry="12" fill="#7a5a3a" opacity="0.4"/>
      <path d="M 135 270 Q 130 260 135 250 L 265 250 Q 270 260 265 270 Z" fill="url(#potGrad3)" stroke="#6d4c37" strokeWidth="2"/>
      <ellipse cx="200" cy="250" rx="65" ry="10" fill="url(#potGrad3)"/>
      
      {/* Soil */}
      <ellipse cx="200" cy="252" rx="63" ry="8" fill="url(#soilGrad3)"/>
      
      {/* Plant with gentle sway */}
      <motion.g
        animate={{ rotate: [0, 0.8, -0.8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 252px" }}
      >
        {/* Main stem with natural curve */}
        <path 
          d="M 200 252 Q 198 210 200 170"
          stroke="url(#stemGrad3)" 
          strokeWidth="5" 
          strokeLinecap="round"
          fill="none"
          filter="url(#plantShadow)"
        />
        
        {/* Lower left branch with leaves */}
        <path d="M 200 220 Q 180 215 165 220" stroke="url(#stemGrad3)" strokeWidth="3" fill="none"/>
        {/* Leaves on lower left */}
        {[
          { x: 155, y: 218, rot: -60, size: 1 },
          { x: 170, y: 214, rot: -50, size: 0.95 },
          { x: 162, y: 225, rot: -70, size: 0.9 }
        ].map((leaf, i) => (
          <motion.g
            key={`ll-${i}`}
            animate={{ rotate: [leaf.rot - 3, leaf.rot + 3, leaf.rot - 3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            filter="url(#plantShadow)"
          >
            <ellipse cx={leaf.x} cy={leaf.y} rx={16 * leaf.size} ry={10 * leaf.size} fill="url(#leafGrad3)"/>
            <path d={`M ${leaf.x} ${leaf.y - 8} L ${leaf.x} ${leaf.y + 8}`} stroke="#6d904f" strokeWidth="1" opacity="0.5"/>
          </motion.g>
        ))}
        
        {/* Lower right branch with leaves */}
        <path d="M 200 220 Q 220 215 235 220" stroke="url(#stemGrad3)" strokeWidth="3" fill="none"/>
        {[
          { x: 245, y: 218, rot: 60, size: 1 },
          { x: 230, y: 214, rot: 50, size: 0.95 },
          { x: 238, y: 225, rot: 70, size: 0.9 }
        ].map((leaf, i) => (
          <motion.g
            key={`lr-${i}`}
            animate={{ rotate: [leaf.rot - 3, leaf.rot + 3, leaf.rot - 3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            filter="url(#plantShadow)"
          >
            <ellipse cx={leaf.x} cy={leaf.y} rx={16 * leaf.size} ry={10 * leaf.size} fill="url(#leafGrad3)"/>
            <path d={`M ${leaf.x} ${leaf.y - 8} L ${leaf.x} ${leaf.y + 8}`} stroke="#6d904f" strokeWidth="1" opacity="0.5"/>
          </motion.g>
        ))}
        
        {/* Middle left branch with leaves */}
        <path d="M 200 195 Q 185 190 172 192" stroke="url(#stemGrad3)" strokeWidth="2.5" fill="none"/>
        {[
          { x: 162, y: 190, rot: -55, size: 0.95 },
          { x: 177, y: 188, rot: -45, size: 0.9 }
        ].map((leaf, i) => (
          <motion.g
            key={`ml-${i}`}
            animate={{ rotate: [leaf.rot - 3, leaf.rot + 3, leaf.rot - 3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            filter="url(#plantShadow)"
          >
            <ellipse cx={leaf.x} cy={leaf.y} rx={14 * leaf.size} ry={9 * leaf.size} fill="url(#leafGrad3)"/>
            <path d={`M ${leaf.x} ${leaf.y - 7} L ${leaf.x} ${leaf.y + 7}`} stroke="#6d904f" strokeWidth="0.9" opacity="0.5"/>
          </motion.g>
        ))}
        
        {/* Middle right branch with leaves */}
        <path d="M 200 195 Q 215 190 228 192" stroke="url(#stemGrad3)" strokeWidth="2.5" fill="none"/>
        {[
          { x: 238, y: 190, rot: 55, size: 0.95 },
          { x: 223, y: 188, rot: 45, size: 0.9 }
        ].map((leaf, i) => (
          <motion.g
            key={`mr-${i}`}
            animate={{ rotate: [leaf.rot - 3, leaf.rot + 3, leaf.rot - 3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            filter="url(#plantShadow)"
          >
            <ellipse cx={leaf.x} cy={leaf.y} rx={14 * leaf.size} ry={9 * leaf.size} fill="url(#leafGrad3)"/>
            <path d={`M ${leaf.x} ${leaf.y - 7} L ${leaf.x} ${leaf.y + 7}`} stroke="#6d904f" strokeWidth="0.9" opacity="0.5"/>
          </motion.g>
        ))}
        
        {/* Top leaves */}
        {[
          { x: 190, y: 175, rot: -40, size: 0.85 },
          { x: 210, y: 175, rot: 40, size: 0.85 },
          { x: 195, y: 168, rot: -25, size: 0.75 },
          { x: 205, y: 168, rot: 25, size: 0.75 }
        ].map((leaf, i) => (
          <motion.g
            key={`t-${i}`}
            animate={{ rotate: [leaf.rot - 2, leaf.rot + 2, leaf.rot - 2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            filter="url(#plantShadow)"
          >
            <ellipse cx={leaf.x} cy={leaf.y} rx={12 * leaf.size} ry={8 * leaf.size} fill="url(#leafGrad3)"/>
            <path d={`M ${leaf.x} ${leaf.y - 6} L ${leaf.x} ${leaf.y + 6}`} stroke="#6d904f" strokeWidth="0.8" opacity="0.5"/>
          </motion.g>
        ))}
      </motion.g>
    </svg>
  );

  /**
   * Blooming Stage - Beautiful natural flowers in bloom
   */
  const renderBloomingStage = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
      <defs>
        <linearGradient id="potGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bc8b5a" />
          <stop offset="50%" stopColor="#a67550" />
          <stop offset="100%" stopColor="#8d5a3a" />
        </linearGradient>
        <radialGradient id="soilGrad4" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#5d4332" />
          <stop offset="100%" stopColor="#3e2a1f" />
        </radialGradient>
        <linearGradient id="stemGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8fbc6e" />
          <stop offset="100%" stopColor="#5d8041" />
        </linearGradient>
        <radialGradient id="leafGrad4" cx="15%" cy="25%">
          <stop offset="0%" stopColor="#c5e1a5" />
          <stop offset="60%" stopColor="#8fbc6e" />
          <stop offset="100%" stopColor="#618a3f" />
        </radialGradient>
        <radialGradient id="petalPink" cx="25%" cy="25%">
          <stop offset="0%" stopColor="#ffebf0" />
          <stop offset="60%" stopColor="#f48fb1" />
          <stop offset="100%" stopColor="#ec407a" />
        </radialGradient>
        <radialGradient id="petalPurple" cx="25%" cy="25%">
          <stop offset="0%" stopColor="#f3e5f5" />
          <stop offset="60%" stopColor="#ce93d8" />
          <stop offset="100%" stopColor="#ab47bc" />
        </radialGradient>
        <radialGradient id="petalWhite" cx="25%" cy="25%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </radialGradient>
        <filter id="flowerShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="0.5" dy="1.5" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.25"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Pot */}
      <ellipse cx="200" cy="282" rx="75" ry="12" fill="#7a5a3a" opacity="0.4"/>
      <path d="M 135 270 Q 130 260 135 250 L 265 250 Q 270 260 265 270 Z" fill="url(#potGrad4)" stroke="#6d4c37" strokeWidth="2"/>
      <ellipse cx="200" cy="250" rx="65" ry="10" fill="url(#potGrad4)"/>
      
      {/* Soil */}
      <ellipse cx="200" cy="252" rx="63" ry="8" fill="url(#soilGrad4)"/>
      
      {/* Plant with gentle sway */}
      <motion.g
        animate={{ rotate: [0, 0.5, -0.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 252px" }}
      >
        {/* Main stem */}
        <path 
          d="M 200 252 Q 198 200 200 150"
          stroke="url(#stemGrad4)" 
          strokeWidth="5.5" 
          strokeLinecap="round"
          fill="none"
          filter="url(#flowerShadow)"
        />
        
        {/* Left branch */}
        <path d="M 200 200 Q 175 190 160 195" stroke="url(#stemGrad4)" strokeWidth="3.5" fill="none"/>
        <path d="M 160 195 Q 155 193 150 195" stroke="url(#stemGrad4)" strokeWidth="2.5" fill="none"/>
        
        {/* Right branch */}
        <path d="M 200 200 Q 225 190 240 195" stroke="url(#stemGrad4)" strokeWidth="3.5" fill="none"/>
        <path d="M 240 195 Q 245 193 250 195" stroke="url(#stemGrad4)" strokeWidth="2.5" fill="none"/>
        
        {/* Upper left branch */}
        <path d="M 200 170 Q 180 165 170 168" stroke="url(#stemGrad4)" strokeWidth="3" fill="none"/>
        
        {/* Upper right branch */}
        <path d="M 200 170 Q 220 165 230 168" stroke="url(#stemGrad4)" strokeWidth="3" fill="none"/>
        
        {/* Leaves scattered on branches */}
        {[
          { x: 155, y: 205, rot: -50, size: 0.9 },
          { x: 245, y: 205, rot: 50, size: 0.9 },
          { x: 175, y: 195, rot: -45, size: 0.85 },
          { x: 225, y: 195, rot: 45, size: 0.85 },
          { x: 165, y: 178, rot: -55, size: 0.8 },
          { x: 235, y: 178, rot: 55, size: 0.8 }
        ].map((leaf, i) => (
          <motion.g
            key={`leaf-${i}`}
            animate={{ rotate: [leaf.rot - 2, leaf.rot + 2, leaf.rot - 2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            filter="url(#flowerShadow)"
          >
            <ellipse cx={leaf.x} cy={leaf.y} rx={13 * leaf.size} ry={8 * leaf.size} fill="url(#leafGrad4)"/>
            <path d={`M ${leaf.x} ${leaf.y - 6} L ${leaf.x} ${leaf.y + 6}`} stroke="#618a3f" strokeWidth="0.8" opacity="0.5"/>
          </motion.g>
        ))}
        
        {/* NATURAL FLOWERS */}
        
        {/* Main center flower - Pink */}
        <motion.g
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "200px 145px" }}
        >
          {/* 5 petals in natural arrangement */}
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const px = 200 + Math.cos(rad) * 10;
            const py = 145 + Math.sin(rad) * 10;
            return (
              <ellipse
                key={`cp-${i}`}
                cx={px}
                cy={py}
                rx="8"
                ry="6"
                fill="url(#petalPink)"
                transform={`rotate(${angle} ${px} ${py})`}
                filter="url(#flowerShadow)"
              />
            );
          })}
          {/* Center */}
          <circle cx="200" cy="145" r="4" fill="#fdd835"/>
          <circle cx="200" cy="145" r="3" fill="#fbc02d" opacity="0.8"/>
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            return (
              <circle
                key={`stamen-${i}`}
                cx={200 + Math.cos(angle) * 2}
                cy={145 + Math.sin(angle) * 2}
                r="0.5"
                fill="#d84315"
              />
            );
          })}
        </motion.g>
        
        {/* Left flower - Purple */}
        <motion.g
          animate={{ rotate: [0, -2, 2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{ transformOrigin: "150px 190px" }}
        >
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const px = 150 + Math.cos(rad) * 8;
            const py = 190 + Math.sin(rad) * 8;
            return (
              <ellipse
                key={`lp-${i}`}
                cx={px}
                cy={py}
                rx="6.5"
                ry="5"
                fill="url(#petalPurple)"
                transform={`rotate(${angle} ${px} ${py})`}
                filter="url(#flowerShadow)"
              />
            );
          })}
          <circle cx="150" cy="190" r="3.5" fill="#fbc02d"/>
          <circle cx="150" cy="190" r="2.5" fill="#f9a825" opacity="0.8"/>
        </motion.g>
        
        {/* Right flower - White/Pink */}
        <motion.g
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ transformOrigin: "250px 190px" }}
        >
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const px = 250 + Math.cos(rad) * 8;
            const py = 190 + Math.sin(rad) * 8;
            return (
              <ellipse
                key={`rp-${i}`}
                cx={px}
                cy={py}
                rx="6.5"
                ry="5"
                fill="url(#petalWhite)"
                transform={`rotate(${angle} ${px} ${py})`}
                filter="url(#flowerShadow)"
              />
            );
          })}
          <circle cx="250" cy="190" r="3.5" fill="#fdd835"/>
          <circle cx="250" cy="190" r="2.5" fill="#fbc02d" opacity="0.8"/>
        </motion.g>
        
        {/* Upper left flower - Pink */}
        <motion.g
          animate={{ rotate: [0, -1.5, 1.5, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          style={{ transformOrigin: "170px 163px" }}
        >
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const px = 170 + Math.cos(rad) * 7;
            const py = 163 + Math.sin(rad) * 7;
            return (
              <ellipse
                key={`ulp-${i}`}
                cx={px}
                cy={py}
                rx="5.5"
                ry="4.5"
                fill="url(#petalPink)"
                transform={`rotate(${angle} ${px} ${py})`}
                filter="url(#flowerShadow)"
              />
            );
          })}
          <circle cx="170" cy="163" r="3" fill="#fbc02d"/>
        </motion.g>
        
        {/* Upper right flower - Purple */}
        <motion.g
          animate={{ rotate: [0, 1.5, -1.5, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          style={{ transformOrigin: "230px 163px" }}
        >
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const px = 230 + Math.cos(rad) * 7;
            const py = 163 + Math.sin(rad) * 7;
            return (
              <ellipse
                key={`urp-${i}`}
                cx={px}
                cy={py}
                rx="5.5"
                ry="4.5"
                fill="url(#petalPurple)"
                transform={`rotate(${angle} ${px} ${py})`}
                filter="url(#flowerShadow)"
              />
            );
          })}
          <circle cx="230" cy="163" r="3" fill="#fdd835"/>
        </motion.g>
      </motion.g>
    </svg>
  );

  /**
   * Tree Stage - Natural organic tree with realistic foliage
   */
  const renderTreeStage = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
      <defs>
        <linearGradient id="potGradTree" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bc8b5a" />
          <stop offset="50%" stopColor="#a67550" />
          <stop offset="100%" stopColor="#8d5a3a" />
        </linearGradient>
        <radialGradient id="soilGradTree" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#5d4332" />
          <stop offset="100%" stopColor="#3e2a1f" />
        </radialGradient>
        <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5d4037" />
          <stop offset="50%" stopColor="#795548" />
          <stop offset="100%" stopColor="#6d4c41" />
        </linearGradient>
        <radialGradient id="foliageGrad1" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#a5d6a7" />
          <stop offset="50%" stopColor="#81c784" />
          <stop offset="100%" stopColor="#66bb6a" />
        </radialGradient>
        <radialGradient id="foliageGrad2" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#81c784" />
          <stop offset="50%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#4caf50" />
        </radialGradient>
        <radialGradient id="foliageGrad3" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="50%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#388e3c" />
        </radialGradient>
        <filter id="treeShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
          <feOffset dx="1" dy="2.5" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Pot */}
      <ellipse cx="200" cy="282" rx="75" ry="12" fill="#7a5a3a" opacity="0.4"/>
      <path d="M 135 270 Q 130 260 135 250 L 265 250 Q 270 260 265 270 Z" fill="url(#potGradTree)" stroke="#6d4c37" strokeWidth="2"/>
      <ellipse cx="200" cy="250" rx="65" ry="10" fill="url(#potGradTree)"/>
      
      {/* Soil */}
      <ellipse cx="200" cy="252" rx="63" ry="8" fill="url(#soilGradTree)"/>
      
      {/* Tree with gentle sway */}
      <motion.g
        animate={{ rotate: [0, 0.3, -0.3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 252px" }}
      >
        {/* Trunk with bark texture - extending from soil upward */}
        <g filter="url(#treeShadow)">
          <rect x="188" y="170" width="24" height="82" fill="url(#trunkGradient)" rx="3"/>
          {/* Bark texture lines */}
          <path d="M 190 180 Q 200 182 210 180" stroke="#4a342f" strokeWidth="1" fill="none" opacity="0.6"/>
          <path d="M 191 190 Q 200 193 209 190" stroke="#4a342f" strokeWidth="1" fill="none" opacity="0.5"/>
          <path d="M 190 200 Q 200 202 210 200" stroke="#4a342f" strokeWidth="1" fill="none" opacity="0.6"/>
          <path d="M 192 210 Q 200 212 208 210" stroke="#4a342f" strokeWidth="1" fill="none" opacity="0.5"/>
          <path d="M 191 220 Q 200 223 209 220" stroke="#4a342f" strokeWidth="1" fill="none" opacity="0.6"/>
          <path d="M 190 230 Q 200 232 210 230" stroke="#4a342f" strokeWidth="1" fill="none" opacity="0.5"/>
          <path d="M 192 240 Q 200 242 208 240" stroke="#4a342f" strokeWidth="1" fill="none" opacity="0.6"/>
          {/* Highlight on trunk */}
          <rect x="190" y="173" width="4" height="75" fill="#8d6e63" opacity="0.3" rx="1"/>
        </g>
        
        {/* Main branches */}
        <path d="M 200 180 Q 170 170 150 165" stroke="url(#trunkGradient)" strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#treeShadow)"/>
        <path d="M 200 180 Q 230 170 250 165" stroke="url(#trunkGradient)" strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#treeShadow)"/>
        <path d="M 200 200 Q 165 195 145 192" stroke="url(#trunkGradient)" strokeWidth="7" strokeLinecap="round" fill="none" filter="url(#treeShadow)"/>
        <path d="M 200 200 Q 235 195 255 192" stroke="url(#trunkGradient)" strokeWidth="7" strokeLinecap="round" fill="none" filter="url(#treeShadow)"/>
        
        {/* Natural organic foliage - layered clusters */}
        {/* Back layer - darkest */}
        {[
          { cx: 145, cy: 170, rx: 25, ry: 20 },
          { cx: 195, cy: 155, rx: 28, ry: 22 },
          { cx: 255, cy: 170, rx: 25, ry: 20 },
          { cx: 220, cy: 160, rx: 24, ry: 19 }
        ].map((cluster, i) => (
          <motion.ellipse
            key={`foliage-back-${i}`}
            cx={cluster.cx}
            cy={cluster.cy}
            rx={cluster.rx}
            ry={cluster.ry}
            fill="url(#foliageGrad3)"
            filter="url(#treeShadow)"
            animate={{ 
              scale: [1, 1.02, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ 
              duration: 4 + i * 0.3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.2
            }}
            style={{ transformOrigin: `${cluster.cx}px ${cluster.cy}px` }}
          />
        ))}
        
        {/* Middle layer */}
        {[
          { cx: 160, cy: 165, rx: 27, ry: 21 },
          { cx: 200, cy: 145, rx: 32, ry: 26 },
          { cx: 240, cy: 165, rx: 27, ry: 21 },
          { cx: 175, cy: 150, rx: 26, ry: 20 },
          { cx: 225, cy: 150, rx: 26, ry: 20 }
        ].map((cluster, i) => (
          <motion.ellipse
            key={`foliage-mid-${i}`}
            cx={cluster.cx}
            cy={cluster.cy}
            rx={cluster.rx}
            ry={cluster.ry}
            fill="url(#foliageGrad2)"
            filter="url(#treeShadow)"
            animate={{ 
              scale: [1, 1.03, 1],
              y: [0, -1, 0]
            }}
            transition={{ 
              duration: 4.5 + i * 0.25, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.15
            }}
          />
        ))}
        
        {/* Front layer - lightest */}
        {[
          { cx: 155, cy: 160, rx: 24, ry: 19 },
          { cx: 185, cy: 140, rx: 29, ry: 24 },
          { cx: 215, cy: 140, rx: 29, ry: 24 },
          { cx: 245, cy: 160, rx: 24, ry: 19 },
          { cx: 200, cy: 135, rx: 26, ry: 21 },
          { cx: 170, cy: 145, rx: 22, ry: 18 },
          { cx: 230, cy: 145, rx: 22, ry: 18 }
        ].map((cluster, i) => (
          <motion.ellipse
            key={`foliage-front-${i}`}
            cx={cluster.cx}
            cy={cluster.cy}
            rx={cluster.rx}
            ry={cluster.ry}
            fill="url(#foliageGrad1)"
            filter="url(#treeShadow)"
            animate={{ 
              scale: [1, 1.04, 1],
              y: [0, -1.5, 0]
            }}
            transition={{ 
              duration: 5 + i * 0.2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
        
        {/* Small leaf details on foliage edges */}
        {[
          { cx: 142, cy: 152, size: 1 },
          { cx: 258, cy: 152, size: 1 },
          { cx: 195, cy: 125, size: 0.9 },
          { cx: 205, cy: 128, size: 0.85 },
          { cx: 165, cy: 138, size: 0.8 }
        ].map((leaf, i) => (
          <motion.ellipse
            key={`detail-leaf-${i}`}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={8 * leaf.size}
            ry={5 * leaf.size}
            fill="#c5e1a5"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
            style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
          />
        ))}
      </motion.g>
    </svg>
  );

  /**
   * Fruiting Tree Stage - Abundant natural tree with realistic fruits
   */
  const renderFruitingTreeStage = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
      <defs>
        <linearGradient id="potGradFruit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bc8b5a" />
          <stop offset="50%" stopColor="#a67550" />
          <stop offset="100%" stopColor="#8d5a3a" />
        </linearGradient>
        <radialGradient id="soilGradFruit" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#5d4332" />
          <stop offset="100%" stopColor="#3e2a1f" />
        </radialGradient>
        <linearGradient id="trunkGradFruit" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5d4037" />
          <stop offset="50%" stopColor="#795548" />
          <stop offset="100%" stopColor="#6d4c41" />
        </linearGradient>
        <radialGradient id="foliageFruit1" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="50%" stopColor="#9ccc65" />
          <stop offset="100%" stopColor="#7cb342" />
        </radialGradient>
        <radialGradient id="foliageFruit2" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#9ccc65" />
          <stop offset="50%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#689f38" />
        </radialGradient>
        <radialGradient id="foliageFruit3" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#8bc34a" />
          <stop offset="50%" stopColor="#7cb342" />
          <stop offset="100%" stopColor="#558b2f" />
        </radialGradient>
        <radialGradient id="appleRed" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="70%" stopColor="#ee5a52" />
          <stop offset="100%" stopColor="#c92a2a" />
        </radialGradient>
        <radialGradient id="appleGreen" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#b4ec51" />
          <stop offset="70%" stopColor="#82c91e" />
          <stop offset="100%" stopColor="#5c940d" />
        </radialGradient>
        <radialGradient id="orangeFruit" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ffc078" />
          <stop offset="70%" stopColor="#ff922b" />
          <stop offset="100%" stopColor="#fd7e14" />
        </radialGradient>
        <radialGradient id="pearYellow" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="70%" stopColor="#fcc419" />
          <stop offset="100%" stopColor="#fab005" />
        </radialGradient>
        <filter id="fruitShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Pot */}
      <ellipse cx="200" cy="282" rx="75" ry="12" fill="#7a5a3a" opacity="0.4"/>
      <path d="M 135 270 Q 130 260 135 250 L 265 250 Q 270 260 265 270 Z" fill="url(#potGradFruit)" stroke="#6d4c37" strokeWidth="2"/>
      <ellipse cx="200" cy="250" rx="65" ry="10" fill="url(#potGradFruit)"/>
      
      {/* Soil */}
      <ellipse cx="200" cy="252" rx="63" ry="8" fill="url(#soilGradFruit)"/>
      
      {/* Trunk and branches - rendered FIRST so foliage goes on top */}
      <motion.g
        animate={{ rotate: [0, 0.25, -0.25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 252px" }}
      >
        {/* Strong trunk with bark - extending down into soil */}
        <g filter="url(#fruitShadow)">
          <rect x="186" y="162" width="28" height="90" fill="url(#trunkGradFruit)" rx="4"/>
          {/* Bark texture */}
          <path d="M 188 170 Q 200 173 212 170" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.6"/>
          <path d="M 189 180 Q 200 184 211 180" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.5"/>
          <path d="M 188 190 Q 200 193 212 190" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.6"/>
          <path d="M 190 200 Q 200 203 210 200" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.5"/>
          <path d="M 189 210 Q 200 214 211 210" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.6"/>
          <path d="M 188 220 Q 200 223 212 220" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.5"/>
          <path d="M 190 230 Q 200 233 210 230" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.6"/>
          <path d="M 189 240 Q 200 243 211 240" stroke="#4a342f" strokeWidth="1.2" fill="none" opacity="0.5"/>
          {/* Highlight */}
          <rect x="188" y="165" width="5" height="82" fill="#8d6e63" opacity="0.3" rx="2"/>
        </g>
        
        {/* Strong main branches */}
        <path d="M 200 175 Q 165 165 140 160" stroke="url(#trunkGradFruit)" strokeWidth="10" strokeLinecap="round" fill="none" filter="url(#fruitShadow)"/>
        <path d="M 200 175 Q 235 165 260 160" stroke="url(#trunkGradFruit)" strokeWidth="10" strokeLinecap="round" fill="none" filter="url(#fruitShadow)"/>
        <path d="M 200 195 Q 160 190 135 185" stroke="url(#trunkGradFruit)" strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#fruitShadow)"/>
        <path d="M 200 195 Q 240 190 265 185" stroke="url(#trunkGradFruit)" strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#fruitShadow)"/>
        <path d="M 200 185 Q 180 175 165 173" stroke="url(#trunkGradFruit)" strokeWidth="7" strokeLinecap="round" fill="none" filter="url(#fruitShadow)"/>
        <path d="M 200 185 Q 220 175 235 173" stroke="url(#trunkGradFruit)" strokeWidth="7" strokeLinecap="round" fill="none" filter="url(#fruitShadow)"/>
        
        {/* Dense layered foliage - back layer */}
        {[
          { cx: 135, cy: 165, rx: 28, ry: 22 },
          { cx: 190, cy: 150, rx: 32, ry: 25 },
          { cx: 265, cy: 165, rx: 28, ry: 22 },
          { cx: 225, cy: 155, rx: 30, ry: 24 },
          { cx: 160, cy: 155, rx: 26, ry: 21 }
        ].map((cluster, i) => (
          <motion.ellipse
            key={`foliage-b-${i}`}
            cx={cluster.cx}
            cy={cluster.cy}
            rx={cluster.rx}
            ry={cluster.ry}
            fill="url(#foliageFruit3)"
            filter="url(#fruitShadow)"
            animate={{ 
              scale: [1, 1.02, 1],
              y: [0, -0.5, 0]
            }}
            transition={{ 
              duration: 5 + i * 0.3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Middle foliage layer */}
        {[
          { cx: 150, cy: 160, rx: 30, ry: 24 },
          { cx: 200, cy: 140, rx: 36, ry: 29 },
          { cx: 250, cy: 160, rx: 30, ry: 24 },
          { cx: 175, cy: 145, rx: 28, ry: 22 },
          { cx: 225, cy: 145, rx: 28, ry: 22 },
          { cx: 140, cy: 170, rx: 24, ry: 19 },
          { cx: 260, cy: 170, rx: 24, ry: 19 }
        ].map((cluster, i) => (
          <motion.ellipse
            key={`foliage-m-${i}`}
            cx={cluster.cx}
            cy={cluster.cy}
            rx={cluster.rx}
            ry={cluster.ry}
            fill="url(#foliageFruit2)"
            filter="url(#fruitShadow)"
            animate={{ 
              scale: [1, 1.03, 1],
              y: [0, -1, 0]
            }}
            transition={{ 
              duration: 5.5 + i * 0.25, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.15
            }}
          />
        ))}
        
        {/* Front foliage layer - brightest */}
        {[
          { cx: 145, cy: 155, rx: 26, ry: 20 },
          { cx: 185, cy: 135, rx: 32, ry: 26 },
          { cx: 215, cy: 135, rx: 32, ry: 26 },
          { cx: 255, cy: 155, rx: 26, ry: 20 },
          { cx: 200, cy: 128, rx: 28, ry: 23 },
          { cx: 165, cy: 142, rx: 24, ry: 19 },
          { cx: 235, cy: 142, rx: 24, ry: 19 },
          { cx: 175, cy: 150, rx: 22, ry: 18 },
          { cx: 225, cy: 150, rx: 22, ry: 18 }
        ].map((cluster, i) => (
          <motion.ellipse
            key={`foliage-f-${i}`}
            cx={cluster.cx}
            cy={cluster.cy}
            rx={cluster.rx}
            ry={cluster.ry}
            fill="url(#foliageFruit1)"
            filter="url(#fruitShadow)"
            animate={{ 
              scale: [1, 1.04, 1],
              y: [0, -1.5, 0]
            }}
            transition={{ 
              duration: 6 + i * 0.2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
        
        {/* REALISTIC FRUITS with natural variations */}
        {[
          { cx: 165, cy: 148, r: 6, gradient: 'appleRed', type: 'apple', delay: 0 },
          { cx: 235, cy: 148, r: 6.5, gradient: 'appleGreen', type: 'apple', delay: 0.15 },
          { cx: 148, cy: 165, r: 6, gradient: 'orangeFruit', type: 'round', delay: 0.3 },
          { cx: 252, cy: 165, r: 6, gradient: 'orangeFruit', type: 'round', delay: 0.45 },
          { cx: 190, cy: 145, r: 5.5, gradient: 'appleRed', type: 'apple', delay: 0.2 },
          { cx: 210, cy: 145, r: 5.5, gradient: 'pearYellow', type: 'pear', delay: 0.35 },
          { cx: 200, cy: 138, r: 6, gradient: 'appleGreen', type: 'apple', delay: 0.5 },
          { cx: 175, cy: 155, r: 5, gradient: 'orangeFruit', type: 'round', delay: 0.25 },
          { cx: 225, cy: 155, r: 5, gradient: 'pearYellow', type: 'pear', delay: 0.4 }
        ].map((fruit, idx) => (
          <motion.g 
            key={`fruit-${idx}`}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3 + idx * 0.2, repeat: Infinity, ease: "easeInOut", delay: fruit.delay }}
            filter="url(#fruitShadow)"
          >
            {/* Fruit shape */}
            {fruit.type === 'pear' ? (
              <>
                <ellipse cx={fruit.cx} cy={fruit.cy} rx={fruit.r} ry={fruit.r * 1.2} fill={`url(#${fruit.gradient})`}/>
                <ellipse cx={fruit.cx} cy={fruit.cy - fruit.r * 0.3} rx={fruit.r * 0.7} ry={fruit.r * 0.8} fill={`url(#${fruit.gradient})`}/>
              </>
            ) : (
              <circle cx={fruit.cx} cy={fruit.cy} r={fruit.r} fill={`url(#${fruit.gradient})`}/>
            )}
            
            {/* Shine highlight */}
            <ellipse
              cx={fruit.cx - fruit.r * 0.3}
              cy={fruit.cy - fruit.r * 0.3}
              rx={fruit.r * 0.4}
              ry={fruit.r * 0.3}
              fill="#fff"
              opacity="0.6"
            />
            
            {/* Small stem */}
            <rect
              x={fruit.cx - 0.5}
              y={fruit.cy - fruit.r - 2}
              width="1"
              height="2"
              fill="#795548"
            />
            
            {/* Small leaf on stem */}
            {idx % 2 === 0 && (
              <ellipse
                cx={fruit.cx + 2}
                cy={fruit.cy - fruit.r - 1}
                rx="2"
                ry="1.2"
                fill="#7cb342"
                transform={`rotate(30 ${fruit.cx + 2} ${fruit.cy - fruit.r - 1})`}
              />
            )}
          </motion.g>
        ))}
        
        {/* Small flowers among foliage */}
        {[
          { cx: 180, cy: 152, color: '#ffebf0' },
          { cx: 220, cy: 152, color: '#ffebf0' },
          { cx: 155, cy: 162, color: '#fff5f8' },
          { cx: 245, cy: 162, color: '#fff5f8' }
        ].map((flower, idx) => (
          <motion.g
            key={`flower-${idx}`}
            animate={{
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.4
            }}
            style={{ transformOrigin: `${flower.cx}px ${flower.cy}px` }}
          >
            {[0, 72, 144, 216, 288].map((angle, i) => {
              const rad = (angle - 90) * Math.PI / 180;
              const px = flower.cx + Math.cos(rad) * 2.5;
              const py = flower.cy + Math.sin(rad) * 2.5;
              return (
                <ellipse
                  key={`petal-${i}`}
                  cx={px}
                  cy={py}
                  rx="2"
                  ry="1.5"
                  fill={flower.color}
                  transform={`rotate(${angle} ${px} ${py})`}
                />
              );
            })}
            <circle cx={flower.cx} cy={flower.cy} r="1.2" fill="#fdd835"/>
          </motion.g>
        ))}
      </motion.g>
    </svg>
  );

  const renderPlant = () => {
    console.log('🌱 Rendering stage:', stage);
    switch (stage) {
      case 'seed': return renderSeedStage();
      case 'sprout': return renderSproutStage();
      case 'plant': return renderPlantStage();
      case 'blooming': return renderBloomingStage();
      case 'tree': return renderTreeStage();
      case 'fruitingTree': return renderFruitingTreeStage();
      default: return renderSeedStage();
    }
  };

  return (
    <div className={`flex justify-center items-center py-8 ${visualState === 'healthy' ? '' : visualState === 'wilting' ? 'opacity-75' : 'opacity-50'}`}>
      <motion.div
        animate={{ 
          scale: showGlow ? [1, 1.05, 1] : 1,
          filter: showGlow ? ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] : 'brightness(1)'
        }}
        transition={{ duration: 2, repeat: showGlow ? Infinity : 0 }}
      >
        {renderPlant()}
      </motion.div>
    </div>
  );
};

export default PlantStageNew;
