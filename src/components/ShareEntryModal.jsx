/**
 * Entry Sharing Component
 * Generate shareable links for journal entries
 * Note: Full sharing requires backend support. This provides a local preview approach.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  Link2, 
  Eye,
  EyeOff,
  Lock,
  Globe,
  Twitter,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

/**
 * Generate a shareable text snippet for an entry
 */
const generateShareText = (entry, options = {}) => {
  const { includeDate = true, includeMood = true, maxLength = 280 } = options;
  
  let text = '';
  
  if (includeMood && entry.mood) {
    text += `${entry.mood} `;
  }
  
  // Get first few sentences or truncate
  const content = entry.content || '';
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const preview = sentences.slice(0, 2).join('. ').trim();
  
  if (preview.length > maxLength - 50) {
    text += preview.substring(0, maxLength - 53) + '...';
  } else {
    text += preview + (preview && !preview.match(/[.!?]$/) ? '.' : '');
  }
  
  if (includeDate) {
    const date = entry.createdAt?.toDate?.() || new Date(entry.createdAt);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
    text += ` — ${dateStr}`;
  }
  
  text += '\n\n🌱 From my Mood Garden';
  
  return text;
};

/**
 * Generate shareable HTML/image content
 */
const generateShareCard = (entry) => {
  const date = entry.createdAt?.toDate?.() || new Date(entry.createdAt);
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric' 
  });
  
  return {
    mood: entry.mood || '🌱',
    date: dateStr,
    preview: (entry.content || '').substring(0, 200) + (entry.content?.length > 200 ? '...' : ''),
    tags: entry.tags || [],
    wordCount: entry.content?.split(/\s+/).length || 0
  };
};

/**
 * Share Entry Modal
 */
const ShareEntryModal = ({ entry, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareOptions, setShareOptions] = useState({
    includeDate: true,
    includeMood: true,
    includeContent: true
  });
  const [shareMethod, setShareMethod] = useState('copy'); // 'copy', 'twitter', 'native'

  const shareCard = entry ? generateShareCard(entry) : null;
  const shareText = entry ? generateShareText(entry, shareOptions) : '';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [shareText]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mood Garden Entry - ${shareCard?.date}`,
          text: shareText
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  }, [shareText, shareCard]);

  const handleTwitterShare = useCallback(() => {
    const tweetText = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  }, [shareText]);

  if (!isOpen || !entry) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-cream-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Share2 className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Share Entry</h2>
                  <p className="text-sm text-cream-200">Share your reflection with others</p>
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
            {/* Entry Preview Card */}
            <div className="bg-gradient-to-br from-deep-600 to-deep-700 rounded-2xl p-5 border border-deep-500">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{shareCard?.mood}</span>
                <span className="text-xs text-cream-500">{shareCard?.date}</span>
              </div>
              <p className="text-cream-200 text-sm leading-relaxed">
                {shareCard?.preview}
              </p>
              {shareCard?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {shareCard.tags.slice(0, 3).map((tag, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-deep-500/50 rounded-lg text-xs text-cream-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-deep-500">
                <span className="text-xs text-leaf-400">🌱 Mood Garden</span>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-cream-300">Include in share:</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShareOptions(prev => ({ ...prev, includeMood: !prev.includeMood }))}
                  className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                    shareOptions.includeMood 
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                      : 'bg-deep-600 text-cream-400 border border-deep-500'
                  }`}
                >
                  {shareOptions.includeMood ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
                  Mood
                </button>
                <button
                  onClick={() => setShareOptions(prev => ({ ...prev, includeDate: !prev.includeDate }))}
                  className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                    shareOptions.includeDate 
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                      : 'bg-deep-600 text-cream-400 border border-deep-500'
                  }`}
                >
                  {shareOptions.includeDate ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
                  Date
                </button>
              </div>
            </div>

            {/* Share Text Preview */}
            <div>
              <h3 className="text-sm font-medium text-cream-300 mb-2">Preview:</h3>
              <div className="bg-deep-700/50 rounded-xl p-4 border border-deep-500">
                <p className="text-sm text-cream-300 whitespace-pre-wrap">{shareText}</p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start space-x-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Sharing creates a text snippet only. Your full entry stays private in your account.
              </p>
            </div>

            {/* Share Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleCopy}
                className="flex flex-col items-center space-y-2 p-4 bg-deep-600 hover:bg-deep-500 rounded-xl transition-colors"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-green-400" />
                ) : (
                  <Copy className="w-6 h-6 text-cream-300" />
                )}
                <span className="text-xs text-cream-400">{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleTwitterShare}
                className="flex flex-col items-center space-y-2 p-4 bg-deep-600 hover:bg-deep-500 rounded-xl transition-colors"
              >
                <Twitter className="w-6 h-6 text-blue-400" />
                <span className="text-xs text-cream-400">Twitter</span>
              </button>

              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center space-y-2 p-4 bg-deep-600 hover:bg-deep-500 rounded-xl transition-colors"
                >
                  <Share2 className="w-6 h-6 text-cream-300" />
                  <span className="text-xs text-cream-400">Share</span>
                </button>
              )}

              {!navigator.share && (
                <button
                  disabled
                  className="flex flex-col items-center space-y-2 p-4 bg-deep-700 rounded-xl opacity-50 cursor-not-allowed"
                >
                  <Lock className="w-6 h-6 text-cream-500" />
                  <span className="text-xs text-cream-500">Private</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * Share button component for entry items
 */
export const ShareEntryButton = ({ entry, onShare }) => (
  <button
    onClick={() => onShare(entry)}
    className="p-2 text-cream-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
    title="Share entry"
  >
    <Share2 className="w-4 h-4" />
  </button>
);

export default ShareEntryModal;
