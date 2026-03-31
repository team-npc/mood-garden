/**
 * Drawing Canvas Component
 * Touch-friendly drawing/sketching canvas for visual journaling
 * Production-ready with undo/redo, color picker, and export
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pen,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Palette,
  Minus,
  Plus,
  X,
  Square,
  Circle,
  Image,
  Sparkles
} from 'lucide-react';
import { hapticFeedback, generateId } from '../utils/helpers';

// Preset colors
const COLOR_PRESETS = [
  '#1a1a1a', '#6b7280', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#68a67d', '#8b7355', '#d4af37', '#f9fafb'
];

// Brush sizes
const BRUSH_SIZES = [2, 4, 8, 12, 20, 32];

// Drawing Tools
const TOOLS = {
  PEN: 'pen',
  ERASER: 'eraser',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
};

// Custom Hook for Canvas Drawing
const useCanvas = (canvasRef, options = {}) => {
  const {
    width = 800,
    height = 600,
    initialColor = '#1a1a1a',
    initialSize = 4,
    onChange
  } = options;

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState(initialColor);
  const [brushSize, setBrushSize] = useState(initialSize);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const contextRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    contextRef.current = ctx;
    saveState();
  }, [width, height]);

  // Save canvas state for undo/redo
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
    onChange?.(imageData);
  }, [historyIndex, onChange]);

  // Restore canvas state
  const restoreState = useCallback((dataUrl) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
    };
    img.src = dataUrl;
  }, []);

  // Get position from event
  const getPosition = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((e) => {
    e.preventDefault();
    const ctx = contextRef.current;
    if (!ctx) return;

    const pos = getPosition(e);
    startPosRef.current = pos;

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === TOOLS.ERASER ? '#ffffff' : color;
      ctx.lineWidth = tool === TOOLS.ERASER ? brushSize * 2 : brushSize;
    }

    setIsDrawing(true);
    hapticFeedback('light');
  }, [tool, color, brushSize, getPosition]);

  // Draw
  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const ctx = contextRef.current;
    if (!ctx) return;

    const pos = getPosition(e);

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }, [isDrawing, tool, getPosition]);

  // End drawing
  const endDrawing = useCallback((e) => {
    if (!isDrawing) return;
    e?.preventDefault();

    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const pos = e ? getPosition(e) : startPosRef.current;

    // Draw shapes
    if (tool === TOOLS.RECTANGLE) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(
        startPosRef.current.x,
        startPosRef.current.y,
        pos.x - startPosRef.current.x,
        pos.y - startPosRef.current.y
      );
    } else if (tool === TOOLS.CIRCLE) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      const radius = Math.sqrt(
        Math.pow(pos.x - startPosRef.current.x, 2) +
        Math.pow(pos.y - startPosRef.current.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPosRef.current.x, startPosRef.current.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.closePath();
    setIsDrawing(false);
    saveState();
  }, [isDrawing, tool, color, brushSize, getPosition, saveState]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    restoreState(history[newIndex]);
    hapticFeedback('light');
  }, [historyIndex, history, restoreState]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    restoreState(history[newIndex]);
    hapticFeedback('light');
  }, [historyIndex, history, restoreState]);

  // Clear canvas
  const clear = useCallback(() => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    saveState();
    hapticFeedback('medium');
  }, [saveState]);

  // Export as image
  const exportImage = useCallback((format = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    return canvas.toDataURL(`image/${format}`);
  }, []);

  // Download image
  const downloadImage = useCallback((filename = 'drawing') => {
    const dataUrl = exportImage('png');
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `${filename}-${generateId()}.png`;
    link.href = dataUrl;
    link.click();
    hapticFeedback('success');
  }, [exportImage]);

  return {
    isDrawing,
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    startDrawing,
    draw,
    endDrawing,
    undo,
    redo,
    clear,
    exportImage,
    downloadImage,
  };
};

// Color Picker Component
const ColorPicker = ({ color, onChange, presets = COLOR_PRESETS }) => {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-3">
      {/* Preset Colors */}
      <div className="flex flex-wrap gap-2">
        {presets.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all
              ${color === c 
                ? 'border-sage-500 scale-110 shadow-lg' 
                : 'border-gray-200 dark:border-gray-600 hover:scale-105'
              }
            `}
            style={{ backgroundColor: c }}
            aria-label={`Select color ${c}`}
          />
        ))}
      </div>

      {/* Custom Color */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 uppercase font-mono">
          {color}
        </span>
      </div>
    </div>
  );
};

// Brush Size Selector
const BrushSizeSelector = ({ size, onChange, sizes = BRUSH_SIZES }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => {
          const currentIndex = sizes.indexOf(size);
          if (currentIndex > 0) onChange(sizes[currentIndex - 1]);
        }}
        disabled={size === sizes[0]}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`
              flex items-center justify-center rounded-full transition-all
              ${size === s 
                ? 'bg-sage-500' 
                : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
              }
            `}
            style={{ width: s + 16, height: s + 16 }}
            aria-label={`Brush size ${s}`}
          >
            <div
              className={`rounded-full ${size === s ? 'bg-white' : 'bg-gray-500'}`}
              style={{ width: s, height: s }}
            />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          const currentIndex = sizes.indexOf(size);
          if (currentIndex < sizes.length - 1) onChange(sizes[currentIndex + 1]);
        }}
        disabled={size === sizes[sizes.length - 1]}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toolbar Component
const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onDownload,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const tools = [
    { id: TOOLS.PEN, icon: Pen, label: 'Pen' },
    { id: TOOLS.ERASER, icon: Eraser, label: 'Eraser' },
    { id: TOOLS.RECTANGLE, icon: Square, label: 'Rectangle' },
    { id: TOOLS.CIRCLE, icon: Circle, label: 'Circle' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Tools */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={`
              p-2 rounded-lg transition-all
              ${tool === id 
                ? 'bg-sage-500 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
            aria-label={label}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Color Picker Toggle */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-sage-400 transition-colors"
          style={{ backgroundColor: color }}
          aria-label="Select color"
        >
          <Palette className="w-5 h-5" style={{ color: color === '#ffffff' || color === '#f9fafb' ? '#666' : '#fff' }} />
        </button>

        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-luxury-lg border border-gray-200 dark:border-gray-700 z-20"
            >
              <ColorPicker color={color} onChange={setColor} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brush Size */}
      <BrushSizeSelector size={brushSize} onChange={setBrushSize} />

      {/* Divider */}
      <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />

      {/* History Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Clear canvas"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          onClick={onDownload}
          className="p-2 rounded-lg text-sage-600 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors"
          aria-label="Download drawing"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Main Drawing Canvas Component
const DrawingCanvas = ({
  width = 800,
  height = 600,
  onChange,
  initialImage,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width, height });

  const {
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    canUndo,
    canRedo,
    startDrawing,
    draw,
    endDrawing,
    undo,
    redo,
    clear,
    downloadImage,
  } = useCanvas(canvasRef, { 
    width: dimensions.width, 
    height: dimensions.height,
    onChange 
  });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32;
        const newWidth = Math.min(containerWidth, width);
        const newHeight = (newWidth / width) * height;
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width, height]);

  return (
    <div ref={containerRef} className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onClear={clear}
        onDownload={() => downloadImage('mood-garden-drawing')}
      />

      {/* Canvas */}
      <div className="relative bg-white rounded-2xl shadow-luxury border border-gray-200 dark:border-gray-700 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="cursor-crosshair touch-none"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height 
          }}
        />

        {/* Canvas overlay hint */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
          <Sparkles className="w-4 h-4 inline mr-1" />
          Draw your feelings
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Use your mouse or touch to draw • Pinch to zoom on mobile
      </p>
    </div>
  );
};

// Drawing Modal Wrapper
const DrawingModal = ({ isOpen, onClose, onSave, initialImage }) => {
  const [currentDrawing, setCurrentDrawing] = useState(null);

  const handleSave = () => {
    if (currentDrawing) {
      onSave?.(currentDrawing);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Image className="w-6 h-6 text-sage-500" />
            Visual Journal
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors"
            >
              Save Drawing
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="p-4">
          <DrawingCanvas
            width={800}
            height={500}
            onChange={setCurrentDrawing}
            initialImage={initialImage}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export { useCanvas, ColorPicker, BrushSizeSelector, DrawingModal, TOOLS, COLOR_PRESETS };
export default DrawingCanvas;
