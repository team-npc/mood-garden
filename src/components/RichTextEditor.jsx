/**
 * Rich Text Editor - Advanced journal entry editor with formatting
 * Features: Bold, italic, lists, markdown, voice-to-text, emoji picker
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Mic,
  Smile,
  Eye,
  EyeOff,
  Save,
  Download,
  Undo,
  Redo,
  Type,
  Clock,
  BookOpen
} from 'lucide-react';

/**
 * Emoji Picker Component
 */
const EmojiPicker = ({ isOpen, onSelect, onClose }) => {
  const emojis = [
    { category: 'Moods', items: ['😊', '😢', '😤', '😴', '😰', '😌', '🥳', '😔', '😍', '🤗', '😎', '🤔', '😱', '🥰', '😭'] },
    { category: 'Nature', items: ['🌱', '🌻', '🌺', '🌸', '🌼', '🌿', '🌲', '🌳', '🍀', '🌾', '🌴', '🌵', '🌷', '🌹', '🏵️'] },
    { category: 'Weather', items: ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '💨', '🌪️', '🌫️', '🌈'] },
    { category: 'Hearts', items: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗'] }
  ];
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-10 bottom-full mb-2 left-0 bg-deep-700 border border-deep-600 rounded-xl p-3 shadow-2xl w-80"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-3">
        {emojis.map((group) => (
          <div key={group.category}>
            <div className="text-xs text-cream-500 mb-1.5 font-medium">{group.category}</div>
            <div className="grid grid-cols-8 gap-1">
              {group.items.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onSelect(emoji);
                    onClose();
                  }}
                  className="text-2xl hover:bg-deep-600 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Voice-to-Text Component
 */
const VoiceInput = ({ onTranscript, isActive, onToggle }) => {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onTranscript(transcript);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!recognitionRef.current) return;
    
    if (isActive) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [isActive]);
  
  if (!isSupported) return null;
  
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-red-500 text-white animate-pulse'
          : 'text-cream-400 hover:text-cream-200 hover:bg-deep-700'
      }`}
      title="Voice-to-text"
    >
      <Mic className="w-4 h-4" />
    </button>
  );
};

/**
 * Markdown Toolbar
 */
const FormattingToolbar = ({ 
  onFormat, 
  onEmojiClick, 
  onVoiceToggle, 
  isVoiceActive,
  showPreview,
  onTogglePreview,
  wordCount,
  readingTime
}) => {
  const tools = [
    { icon: Bold, action: 'bold', label: 'Bold' },
    { icon: Italic, action: 'italic', label: 'Italic' },
    { icon: List, action: 'list', label: 'Bullet List' },
    { icon: ListOrdered, action: 'numbered', label: 'Numbered List' },
    { icon: Quote, action: 'quote', label: 'Quote' },
    { icon: Code, action: 'code', label: 'Code' }
  ];
  
  return (
    <div className="flex items-center justify-between py-2 px-3 border-b border-deep-600 bg-deep-700/30">
      {/* Formatting Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.action}
            onClick={() => onFormat(tool.action)}
            className="p-2 text-cream-400 hover:text-cream-200 hover:bg-deep-700 rounded-lg transition-colors"
            title={tool.label}
          >
            <tool.icon className="w-4 h-4" />
          </button>
        ))}
        
        <div className="w-px h-5 bg-deep-600 mx-1" />
        
        {/* Emoji Picker */}
        <button
          onClick={onEmojiClick}
          className="p-2 text-cream-400 hover:text-cream-200 hover:bg-deep-700 rounded-lg transition-colors"
          title="Insert Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>
        
        {/* Voice Input */}
        <VoiceInput
          isActive={isVoiceActive}
          onToggle={onVoiceToggle}
          onTranscript={() => {}}
        />
      </div>
      
      {/* Stats & Preview */}
      <div className="flex items-center gap-3 text-xs text-cream-500">
        <div className="flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5" />
          <span>{wordCount} words</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{readingTime} min read</span>
        </div>
        <button
          onClick={onTogglePreview}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-deep-700 transition-colors"
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Markdown Renderer for Preview
 */
const MarkdownPreview = ({ content }) => {
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet lists
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Numbered lists
    text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    // Quotes
    text = text.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    // Paragraphs
    text = text.replace(/\n\n/g, '</p><p>');
    text = '<p>' + text + '</p>';
    
    return text;
  };
  
  return (
    <div
      className="prose prose-invert prose-sm max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      style={{
        '--tw-prose-body': '#e8f0e9',
        '--tw-prose-headings': '#c8e6c9',
        '--tw-prose-quotes': '#a5d6a7',
        '--tw-prose-bold': '#c8e6c9',
      }}
    />
  );
};

/**
 * Smart Suggestions Sidebar
 */
const SmartSuggestions = ({ content, onInsert }) => {
  const suggestions = [
    {
      type: 'prompt',
      icon: '💭',
      title: 'Continue your thought',
      text: 'What emotions are behind this feeling?'
    },
    {
      type: 'prompt',
      icon: '🎯',
      title: 'Add detail',
      text: 'Describe the scene in more detail.'
    },
    {
      type: 'sentence',
      icon: '✍️',
      title: 'Start with',
      text: 'Looking back on today, I realize that...'
    }
  ];
  
  if (!content || content.length < 50) {
    return (
      <div className="text-center py-6 text-cream-600 text-sm">
        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Start writing to see<br />smart suggestions</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onInsert(suggestion.text)}
          className="w-full text-left p-3 bg-deep-700/30 hover:bg-deep-700/50 rounded-lg border border-deep-600 hover:border-sage-500 transition-all group"
        >
          <div className="flex items-start gap-2">
            <span className="text-xl">{suggestion.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-cream-400 mb-1">{suggestion.title}</div>
              <div className="text-sm text-cream-200 group-hover:text-sage-300 transition-colors">
                {suggestion.text}
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

/**
 * Main Rich Text Editor Component
 */
const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing...',
  autoFocus = false
}) => {
  const [content, setContent] = useState(value);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef(null);
  
  // Calculate stats
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  // Auto-save to history
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  // Sync with parent
  useEffect(() => {
    onChange?.(content);
  }, [content]);
  
  const handleFormat = (action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formatted = content;
    
    switch (action) {
      case 'bold':
        formatted = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        break;
      case 'italic':
        formatted = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        break;
      case 'list':
        formatted = content.substring(0, start) + `\n- ${selectedText}` + content.substring(end);
        break;
      case 'numbered':
        formatted = content.substring(0, start) + `\n1. ${selectedText}` + content.substring(end);
        break;
      case 'quote':
        formatted = content.substring(0, start) + `\n> ${selectedText}` + content.substring(end);
        break;
      case 'code':
        formatted = content.substring(0, start) + `\`${selectedText}\`` + content.substring(end);
        break;
    }
    
    setContent(formatted);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(end + 2, end + 2);
    }, 0);
  };
  
  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + emoji + content.substring(start);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };
  
  const handleInsertSuggestion = (text) => {
    setContent(content + (content ? '\n\n' : '') + text);
    textareaRef.current?.focus();
  };
  
  return (
    <div className="flex gap-4 h-full">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-deep-800/50 rounded-xl border border-deep-600 overflow-hidden">
        {/* Toolbar */}
        <FormattingToolbar
          onFormat={handleFormat}
          onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)}
          onVoiceToggle={() => setIsVoiceActive(!isVoiceActive)}
          isVoiceActive={isVoiceActive}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          wordCount={wordCount}
          readingTime={readingTime}
        />
        
        {/* Editor/Preview */}
        <div className="flex-1 relative">
          {showPreview ? (
            <MarkdownPreview content={content} />
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className="w-full h-full p-4 bg-transparent text-cream-200 placeholder-cream-600 outline-none resize-none text-base leading-relaxed font-['Lora',serif]"
              style={{ fontFamily: 'Lora, serif' }}
            />
          )}
          
          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <div className="absolute bottom-4 left-4">
                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bottom Actions */}
        <div className="flex items-center justify-between py-2 px-3 border-t border-deep-600 bg-deep-700/30">
          <div className="flex gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-1.5 text-cream-400 hover:text-cream-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 text-cream-400 hover:text-cream-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs text-cream-600">
            {isVoiceActive && (
              <span className="flex items-center gap-1.5 text-red-400 animate-pulse">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                Recording...
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Smart Suggestions Sidebar */}
      <div className="w-64 bg-deep-800/50 rounded-xl border border-deep-600 p-3">
        <h3 className="text-sm font-medium text-cream-300 mb-3">Writing Help</h3>
        <SmartSuggestions content={content} onInsert={handleInsertSuggestion} />
      </div>
    </div>
  );
};

export default RichTextEditor;
export { MarkdownPreview, FormattingToolbar, SmartSuggestions };
