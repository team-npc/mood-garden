/**
 * Mood Postcards Component
 * Create shareable mood art cards
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Image, 
  Share2,
  Download,
  Palette,
  Type,
  Sparkles,
  Copy,
  Check,
  Heart
} from 'lucide-react';

/**
 * Postcard templates
 */
const TEMPLATES = [
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'from-orange-400 via-pink-500 to-purple-600',
    textColor: 'text-white',
    pattern: 'radial-gradient(circle at 50% 120%, rgba(255,200,100,0.3), transparent 50%)'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    textColor: 'text-white',
    pattern: 'linear-gradient(180deg, transparent 60%, rgba(255,255,255,0.1) 100%)'
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    textColor: 'text-white',
    pattern: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.1), transparent 70%)'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'from-violet-400 via-purple-500 to-indigo-600',
    textColor: 'text-white',
    pattern: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    gradient: 'from-yellow-300 via-orange-400 to-red-500',
    textColor: 'text-white',
    pattern: 'radial-gradient(circle at 50% 150%, rgba(255,255,200,0.4), transparent 60%)'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'from-slate-700 via-slate-800 to-slate-900',
    textColor: 'text-white',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(100,100,150,0.3), transparent 50%)'
  },
  {
    id: 'rose',
    name: 'Rose',
    gradient: 'from-pink-300 via-rose-400 to-red-400',
    textColor: 'text-white',
    pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    gradient: 'from-stone-100 to-stone-200',
    textColor: 'text-stone-800',
    pattern: 'none'
  }
];

/**
 * Font options
 */
const FONTS = [
  { id: 'serif', name: 'Serif', style: 'font-serif' },
  { id: 'sans', name: 'Sans', style: 'font-sans' },
  { id: 'mono', name: 'Mono', style: 'font-mono' },
  { id: 'cursive', name: 'Cursive', style: 'font-serif italic' }
];

/**
 * Decorative elements
 */
const DECORATIONS = [
  { id: 'none', name: 'None', element: null },
  { id: 'stars', name: 'Stars', element: '✨' },
  { id: 'hearts', name: 'Hearts', element: '💕' },
  { id: 'leaves', name: 'Leaves', element: '🍃' },
  { id: 'flowers', name: 'Flowers', element: '🌸' },
  { id: 'sparkle', name: 'Sparkle', element: '⭐' }
];

/**
 * Postcard Preview Component
 */
const PostcardPreview = ({ 
  template, 
  quote, 
  mood, 
  date, 
  font, 
  decoration,
  showMood = true,
  showDate = true
}) => {
  const templateData = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];
  const fontData = FONTS.find(f => f.id === font) || FONTS[0];
  const decorData = DECORATIONS.find(d => d.id === decoration) || DECORATIONS[0];
  
  return (
    <div 
      className={`aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br ${templateData.gradient} relative shadow-2xl`}
      style={{ backgroundImage: templateData.pattern }}
    >
      {/* Decorative elements */}
      {decorData.element && (
        <>
          <span className="absolute top-4 left-4 text-2xl opacity-70">{decorData.element}</span>
          <span className="absolute top-6 right-6 text-xl opacity-50">{decorData.element}</span>
          <span className="absolute bottom-8 left-8 text-xl opacity-40">{decorData.element}</span>
          <span className="absolute bottom-4 right-4 text-2xl opacity-60">{decorData.element}</span>
        </>
      )}
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        {/* Mood emoji */}
        {showMood && mood && (
          <span className="text-4xl mb-4 drop-shadow-lg">{mood}</span>
        )}
        
        {/* Quote */}
        <p className={`text-lg md:text-xl leading-relaxed ${templateData.textColor} ${fontData.style} max-w-[90%] drop-shadow-lg`}>
          "{quote}"
        </p>
        
        {/* Date */}
        {showDate && date && (
          <p className={`mt-4 text-sm ${templateData.textColor} opacity-70`}>
            {new Date(date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        )}
      </div>
      
      {/* Mood Garden watermark */}
      <div className="absolute bottom-3 right-3">
        <span className={`text-xs ${templateData.textColor} opacity-50`}>
          🌱 Mood Garden
        </span>
      </div>
    </div>
  );
};

/**
 * Main Mood Postcards Component
 */
const MoodPostcards = ({ isOpen, onClose, entry = null }) => {
  const [quote, setQuote] = useState(entry?.content?.slice(0, 100) || '');
  const [selectedTemplate, setSelectedTemplate] = useState('sunset');
  const [selectedFont, setSelectedFont] = useState('serif');
  const [selectedDecoration, setSelectedDecoration] = useState('none');
  const [showMood, setShowMood] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const postcardRef = useRef(null);

  // Extract first sentence or 100 chars from entry
  const getDefaultQuote = useCallback((content) => {
    if (!content) return '';
    const firstSentence = content.split(/[.!?]/)[0];
    return firstSentence.length > 100 
      ? firstSentence.slice(0, 100) + '...' 
      : firstSentence;
  }, []);

  // Update quote when entry changes
  React.useEffect(() => {
    if (entry?.content) {
      setQuote(getDefaultQuote(entry.content));
    }
  }, [entry, getDefaultQuote]);

  const handleCopyToClipboard = async () => {
    const text = `"${quote}" - ${entry?.mood || '🌱'} on ${new Date(entry?.createdAt || Date.now()).toLocaleDateString()}\n\n#MoodGarden`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Create canvas for download
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    
    // Draw gradient background
    const colors = template.gradient.match(/from-(\w+)-\d+ via-(\w+)-\d+ to-(\w+)-\d+/);
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#fb923c'); // orange
    gradient.addColorStop(0.5, '#ec4899'); // pink
    gradient.addColorStop(1, '#9333ea'); // purple
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '24px serif';
    
    // Word wrap the quote
    const words = quote.split(' ');
    let lines = [];
    let currentLine = '"';
    
    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      if (testLine.length > 40) {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine.trim() + '"');
    
    const startY = 300 - (lines.length * 15);
    lines.forEach((line, i) => {
      ctx.fillText(line, 400, startY + (i * 35));
    });
    
    // Add mood emoji
    if (showMood && entry?.mood) {
      ctx.font = '48px serif';
      ctx.fillText(entry.mood, 400, startY - 60);
    }
    
    // Add watermark
    ctx.font = '14px sans-serif';
    ctx.globalAlpha = 0.5;
    ctx.fillText('🌱 Mood Garden', 730, 580);
    
    // Download
    const link = document.createElement('a');
    link.download = 'mood-postcard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Mood Postcard',
          text: `"${quote}" - from my Mood Garden 🌱`,
          url: window.location.origin
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyToClipboard();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-deep-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-violet-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Mood Postcard</h2>
                  <p className="text-sm text-pink-200">Create shareable mood art</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[75vh]">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Preview */}
              <div ref={postcardRef}>
                <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Preview
                </h3>
                <PostcardPreview
                  template={selectedTemplate}
                  quote={quote}
                  mood={entry?.mood}
                  date={entry?.createdAt}
                  font={selectedFont}
                  decoration={selectedDecoration}
                  showMood={showMood}
                  showDate={showDate}
                />
                
                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="flex-1 py-2 bg-sage-600 hover:bg-sage-500 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyToClipboard}
                    className="flex-1 py-2 bg-leaf-600 hover:bg-leaf-500 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </motion.button>
                </div>
              </div>
              
              {/* Customization */}
              <div className="space-y-4">
                {/* Quote Input */}
                <div>
                  <label className="text-cream-200 font-medium mb-2 block flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-400" />
                    Your Quote
                  </label>
                  <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value.slice(0, 150))}
                    placeholder="Enter your quote or feeling..."
                    className="w-full p-3 bg-deep-700 border border-deep-600 rounded-xl text-cream-100 placeholder-cream-600 outline-none focus:border-pink-500 resize-none h-24"
                  />
                  <span className="text-xs text-cream-500">{quote.length}/150</span>
                </div>
                
                {/* Template Selection */}
                <div>
                  <label className="text-cream-200 font-medium mb-2 block flex items-center gap-2">
                    <Palette className="w-4 h-4 text-pink-400" />
                    Template
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`aspect-square rounded-xl bg-gradient-to-br ${template.gradient} transition-all ${
                          selectedTemplate === template.id
                            ? 'ring-2 ring-white scale-105'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={template.name}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Font Selection */}
                <div>
                  <label className="text-cream-200 font-medium mb-2 block">Font Style</label>
                  <div className="flex gap-2">
                    {FONTS.map(font => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all ${font.style} ${
                          selectedFont === font.id
                            ? 'bg-pink-500/30 text-pink-300 ring-1 ring-pink-400'
                            : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
                        }`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Decoration Selection */}
                <div>
                  <label className="text-cream-200 font-medium mb-2 block">Decoration</label>
                  <div className="flex gap-2">
                    {DECORATIONS.map(dec => (
                      <button
                        key={dec.id}
                        onClick={() => setSelectedDecoration(dec.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all ${
                          selectedDecoration === dec.id
                            ? 'bg-violet-500/30 text-violet-300 ring-1 ring-violet-400'
                            : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
                        }`}
                      >
                        {dec.element || 'None'}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Toggle Options */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showMood}
                      onChange={(e) => setShowMood(e.target.checked)}
                      className="w-4 h-4 rounded accent-pink-500"
                    />
                    <span className="text-cream-300 text-sm">Show Mood</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDate}
                      onChange={(e) => setShowDate(e.target.checked)}
                      className="w-4 h-4 rounded accent-pink-500"
                    />
                    <span className="text-cream-300 text-sm">Show Date</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodPostcards;
