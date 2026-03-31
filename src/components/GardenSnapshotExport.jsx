/**
 * Garden Snapshot Export Component
 * Export current plant state as an image using canvas
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Download, Share2, X, Loader2 } from 'lucide-react';

/**
 * Generate plant SVG based on stage and health
 */
const generatePlantSVG = (stage, health, streak) => {
  const stageColors = {
    seed: { main: '#8B7355', accent: '#A0522D' },
    sprout: { main: '#90EE90', accent: '#228B22' },
    plant: { main: '#32CD32', accent: '#006400' },
    blooming: { main: '#FFB6C1', accent: '#FF69B4' },
    tree: { main: '#228B22', accent: '#006400' },
    fruitingTree: { main: '#FF6347', accent: '#228B22' }
  };

  const colors = stageColors[stage] || stageColors.seed;
  const healthOpacity = Math.max(0.5, health / 100);

  const stageSVGs = {
    seed: `
      <ellipse cx="100" cy="160" rx="20" ry="10" fill="${colors.main}" opacity="${healthOpacity}"/>
      <path d="M100 155 Q100 140 95 130 Q100 135 105 130 Q100 140 100 155" fill="${colors.accent}" opacity="${healthOpacity}"/>
    `,
    sprout: `
      <rect x="97" y="120" width="6" height="50" fill="${colors.accent}" opacity="${healthOpacity}"/>
      <ellipse cx="100" cy="115" rx="15" ry="20" fill="${colors.main}" opacity="${healthOpacity}"/>
      <ellipse cx="85" cy="130" rx="10" ry="15" fill="${colors.main}" opacity="${healthOpacity * 0.9}" transform="rotate(-30 85 130)"/>
    `,
    plant: `
      <rect x="95" y="100" width="10" height="70" fill="#8B4513" opacity="${healthOpacity}"/>
      <ellipse cx="100" cy="80" rx="25" ry="30" fill="${colors.main}" opacity="${healthOpacity}"/>
      <ellipse cx="75" cy="100" rx="15" ry="20" fill="${colors.main}" opacity="${healthOpacity * 0.9}" transform="rotate(-20 75 100)"/>
      <ellipse cx="125" cy="100" rx="15" ry="20" fill="${colors.main}" opacity="${healthOpacity * 0.9}" transform="rotate(20 125 100)"/>
    `,
    blooming: `
      <rect x="95" y="90" width="10" height="80" fill="#8B4513" opacity="${healthOpacity}"/>
      <ellipse cx="100" cy="60" rx="30" ry="35" fill="${colors.accent}" opacity="${healthOpacity}"/>
      <circle cx="100" cy="60" r="10" fill="#FFD700" opacity="${healthOpacity}"/>
      <ellipse cx="70" cy="85" rx="18" ry="22" fill="${colors.main}" opacity="${healthOpacity * 0.9}" transform="rotate(-25 70 85)"/>
      <ellipse cx="130" cy="85" rx="18" ry="22" fill="${colors.main}" opacity="${healthOpacity * 0.9}" transform="rotate(25 130 85)"/>
      <circle cx="75" cy="70" r="8" fill="${colors.accent}" opacity="${healthOpacity}"/>
      <circle cx="125" cy="70" r="8" fill="${colors.accent}" opacity="${healthOpacity}"/>
    `,
    tree: `
      <rect x="90" y="80" width="20" height="90" fill="#8B4513" opacity="${healthOpacity}"/>
      <ellipse cx="100" cy="50" rx="45" ry="50" fill="${colors.main}" opacity="${healthOpacity}"/>
      <ellipse cx="60" cy="70" rx="25" ry="30" fill="${colors.main}" opacity="${healthOpacity * 0.85}"/>
      <ellipse cx="140" cy="70" rx="25" ry="30" fill="${colors.main}" opacity="${healthOpacity * 0.85}"/>
    `,
    fruitingTree: `
      <rect x="90" y="80" width="20" height="90" fill="#8B4513" opacity="${healthOpacity}"/>
      <ellipse cx="100" cy="50" rx="45" ry="50" fill="${colors.accent}" opacity="${healthOpacity}"/>
      <ellipse cx="60" cy="70" rx="25" ry="30" fill="${colors.accent}" opacity="${healthOpacity * 0.85}"/>
      <ellipse cx="140" cy="70" rx="25" ry="30" fill="${colors.accent}" opacity="${healthOpacity * 0.85}"/>
      <circle cx="80" cy="40" r="8" fill="${colors.main}" opacity="${healthOpacity}"/>
      <circle cx="120" cy="35" r="8" fill="${colors.main}" opacity="${healthOpacity}"/>
      <circle cx="100" cy="55" r="8" fill="${colors.main}" opacity="${healthOpacity}"/>
      <circle cx="65" cy="65" r="6" fill="${colors.main}" opacity="${healthOpacity}"/>
      <circle cx="135" cy="60" r="6" fill="${colors.main}" opacity="${healthOpacity}"/>
    `
  };

  const groundGradient = `
    <defs>
      <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#654321;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#3E2723;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
      </linearGradient>
    </defs>
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
      ${groundGradient}
      <!-- Sky background -->
      <rect x="0" y="0" width="200" height="170" fill="url(#skyGrad)"/>
      <!-- Stars -->
      <circle cx="30" cy="30" r="1" fill="white" opacity="0.8"/>
      <circle cx="170" cy="20" r="1" fill="white" opacity="0.6"/>
      <circle cx="80" cy="15" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="150" cy="45" r="1" fill="white" opacity="0.7"/>
      <circle cx="50" cy="50" r="1" fill="white" opacity="0.5"/>
      <!-- Ground -->
      <rect x="0" y="170" width="200" height="30" fill="url(#groundGrad)"/>
      <!-- Plant -->
      <g transform="translate(0, 10)">
        ${stageSVGs[stage] || stageSVGs.seed}
      </g>
      <!-- Stats badge -->
      <rect x="10" y="175" width="80" height="20" rx="5" fill="rgba(0,0,0,0.5)"/>
      <text x="50" y="188" text-anchor="middle" fill="white" font-size="10" font-family="Arial">
        🔥 ${streak} day streak
      </text>
      <!-- Health bar -->
      <rect x="110" y="175" width="80" height="20" rx="5" fill="rgba(0,0,0,0.5)"/>
      <rect x="115" y="180" width="${health * 0.7}" height="10" rx="3" fill="#4ade80"/>
      <text x="150" y="188" text-anchor="middle" fill="white" font-size="8" font-family="Arial">
        ${health}% health
      </text>
    </svg>
  `;
};

/**
 * Garden Snapshot Export Modal
 */
const GardenSnapshotExport = ({ plantData = {}, isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isOpen) return null;

  const { stage = 'seed', health = 100, currentStreak = 0 } = plantData;

  const generatePreview = async () => {
    setExporting(true);
    
    try {
      const svgString = generatePlantSVG(stage, health, currentStreak);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      console.error('Error generating preview:', err);
    } finally {
      setExporting(false);
    }
  };

  const downloadImage = () => {
    if (!previewUrl) {
      generatePreview();
      return;
    }

    const link = document.createElement('a');
    link.download = `mood-garden-${new Date().toISOString().split('T')[0]}.png`;
    link.href = previewUrl;
    link.click();
  };

  const shareImage = async () => {
    if (!previewUrl) return;

    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], 'mood-garden.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Mood Garden',
          text: `Check out my plant! 🌱 ${currentStreak} day streak, ${health}% health`,
          files: [file]
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Image copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Generate preview on mount
  React.useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
  }, [isOpen, stage, health, currentStreak]);

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-md w-full my-8 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-leaf-600 to-sage-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Garden Snapshot</h2>
                <p className="text-sm text-cream-200">Share your plant's progress</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="bg-deep-700/50 rounded-xl p-4 flex items-center justify-center">
            {exporting && !previewUrl ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-8 h-8 text-leaf-400 animate-spin mb-2" />
                <span className="text-cream-400 text-sm">Generating preview...</span>
              </div>
            ) : previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Garden snapshot preview" 
                className="max-w-full rounded-lg shadow-lg"
              />
            ) : (
              <div 
                className="w-full aspect-square flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: generatePlantSVG(stage, health, currentStreak) }}
              />
            )}
          </div>

          {/* Hidden canvas for export */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Plant Info */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-deep-700/30 rounded-xl p-3">
              <div className="text-xl">🌱</div>
              <div className="text-sm text-cream-400">Stage</div>
              <div className="font-medium text-cream-100 capitalize">{stage}</div>
            </div>
            <div className="bg-deep-700/30 rounded-xl p-3">
              <div className="text-xl">❤️</div>
              <div className="text-sm text-cream-400">Health</div>
              <div className="font-medium text-cream-100">{health}%</div>
            </div>
            <div className="bg-deep-700/30 rounded-xl p-3">
              <div className="text-xl">🔥</div>
              <div className="text-sm text-cream-400">Streak</div>
              <div className="font-medium text-cream-100">{currentStreak} days</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={downloadImage}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            {navigator.share && (
              <button
                onClick={shareImage}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GardenSnapshotExport;
