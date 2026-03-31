/**
 * Enhanced Journal Entry Page with Elegant 3-Column Layout
 * Based on sophisticated journal entry mockup
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Lock,
  MoreHorizontal,
  Save,
  Mic,
  Camera,
  Edit3,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Mood Chip Component
 */
const MoodChip = ({ emoji, label, color, selected, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-3 py-1.5 rounded-[20px] text-xs border transition-all flex items-center gap-1.5 ${
      selected
        ? 'border-[#9a8a5a] bg-[#f5edda]'
        : 'border-[#e0d8ce] bg-transparent text-[#a09070] hover:bg-[#f5ede0]'
    }`}
    style={selected ? { color } : {}}
  >
    {emoji} {label}
  </motion.button>
);

/**
 * Tag Component
 */
const Tag = ({ label, onRemove }) => (
  <div className="px-3 py-1 bg-[#f0e8d8] border border-[#ddd0b8] rounded-[14px] text-[11px] text-[#7a6a40] cursor-pointer hover:bg-[#e8dcc8] transition-colors">
    {label}
  </div>
);

/**
 * Mood History Mini Bar Chart
 */
const MoodHistoryChart = ({ entries = [] }) => {
  const last7Days = [];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dayEntries = entries.filter(e => {
      const entryDate = new Date(e.createdAt);
      return entryDate.toDateString() === date.toDateString();
    });
    last7Days.push({
      day: days[date.getDay()],
      height: dayEntries.length > 0 ? 20 + Math.random() * 20 : 4,
      color: dayEntries[0]?.mood === '😊' ? '#9ac870' : dayEntries[0]?.mood === '😢' ? '#8ab0c0' : '#c8a840',
      isToday: i === 0
    });
  }
  
  return (
    <div className="flex gap-1.5 items-end h-12">
      {last7Days.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${day.height}px` }}
            transition={{ delay: i * 0.1 }}
            className={`w-full rounded-[2px] ${
              day.isToday ? 'border-[1.5px] border-dashed opacity-50' : ''
            }`}
            style={{ 
              background: day.color,
              minHeight: '4px',
              borderColor: day.isToday ? '#8ab050' : 'transparent'
            }}
          />
          <div className={`text-[9px] ${day.isToday ? 'text-[#9a8060]' : 'text-[#c0b090]'}`}>
            {day.day}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Previous Entry Peek Component
 */
const PreviousEntryPeek = ({ entry, onClick }) => {
  if (!entry) return null;
  
  return (
    <motion.div
      whileHover={{ borderColor: '#c8b87a' }}
      onClick={onClick}
      className="bg-[#faf6ee] border border-[#e8e0d0] rounded-xl p-3.5 cursor-pointer transition-all"
    >
      <div className="text-[10px] text-[#b0a080] mb-1.5">
        {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="font-serif text-[13px] text-[#5a4a28] italic mb-1">
        {entry.content?.slice(0, 40)}...
      </div>
      <div className="text-[11px] text-[#a09070] leading-relaxed mb-2">
        {entry.content?.slice(41, 100)}...
      </div>
      <span className="inline-block text-[10px] text-[#8a9a5a] bg-[#f0f5e0] px-2 py-0.5 rounded-[10px]">
        {entry.mood} reflective
      </span>
    </motion.div>
  );
};

/**
 * Plant Response Component
 */
const PlantResponse = ({ message = "You noticed something beautiful today. I felt it too." }) => (
  <div 
    className="rounded-xl p-4 text-center"
    style={{
      background: 'linear-gradient(135deg, #f5f9ed, #eef5e0)',
      border: '1px solid #d8e8c0'
    }}
  >
    <div className="flex justify-center mb-2">
      <motion.div
        animate={{
          rotate: [-2, 2, -2],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-[54px]"
      >
        🌱
      </motion.div>
    </div>
    <div className="font-serif text-xs text-[#5a7a2a] italic leading-relaxed">
      "{message}"
    </div>
    <div className="text-[10px] text-[#90a860] mt-1.5">
      a new bud is forming ✦
    </div>
  </div>
);

/**
 * Main Enhanced Journal Entry Component
 */
const EnhancedJournalEntry = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('😌');
  const [tags, setTags] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  
  const moods = [
    { emoji: '😌', label: 'calm', color: '#4a7a5a' },
    { emoji: '😊', label: 'joyful', color: '#8a7a20' },
    { emoji: '😢', label: 'heavy', color: '#5a5a8a' },
    { emoji: '😴', label: 'tired', color: '#8a6a4a' },
    { emoji: '😰', label: 'anxious', color: '#8a4a4a' }
  ];
  
  const prompts = [
    "What did your body feel like as you walked?",
    "What thoughts kept circling back to you?",
    "What brought you peace in this moment?",
    "What would you tell your past self?"
  ];
  
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  
  const handleSave = async () => {
    if (!currentUser || !content.trim()) return;
    
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'entries'), {
        title: title || 'Untitled',
        content,
        mood: selectedMood,
        tags,
        isPrivate,
        wordCount: content.split(/\s+/).length,
        createdAt: serverTimestamp()
      });
      
      navigate('/journal');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        fontFamily: "'DM Sans', sans-serif",
        background: '#f7f3ee',
        color: '#2c2416'
      }}
    >
      {/* Left Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-[220px] flex-shrink-0 bg-[#f0ebe3] border-r border-[#e0d8ce] py-7 flex flex-col"
      >
        {/* Logo */}
        <div className="px-5 pb-6 border-b border-[#e0d8ce] mb-2">
          <div className="font-serif text-[17px] text-[#5a4a2a] flex items-center gap-2 italic">
            <span className="text-lg not-italic">🌿</span> mood garden
          </div>
        </div>
        
        {/* Navigation */}
        <div className="px-3.5 pt-4 pb-2 text-[10px] text-[#a09070] uppercase tracking-[0.12em]">
          spaces
        </div>
        <div className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-white bg-[#efe7d8] border-r-2 border-[#9a7a3a] font-medium">
          <span className="text-sm w-4 text-center">✦</span> Journal
        </div>
        <div className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-[#7a6a4a] cursor-pointer hover:bg-black/[0.04] transition-colors">
          <span className="text-sm w-4 text-center">🌱</span> My Garden
        </div>
        <div className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-[#7a6a4a] cursor-pointer hover:bg-black/[0.04] transition-colors">
          <span className="text-sm w-4 text-center">◎</span> Focus
        </div>
        
        {/* Mini Plant */}
        <div className="mt-auto px-5 pt-5 pb-2 border-t border-[#e0d8ce]">
          <div className="text-[10px] text-[#a09070] uppercase tracking-[0.1em] mb-2.5">
            your plant
          </div>
          <div className="flex items-end gap-3">
            <div className="text-[44px]">🌱</div>
            <div>
              <div className="font-serif text-xs text-[#6a5530] italic">Lumina Rose</div>
              <div className="text-[10px] text-[#a09070] mt-0.5">Budding · day 12</div>
              <div className="h-[3px] bg-[#e0d8ce] rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#8ab54a] to-[#c8d870] w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[#e0d8ce] bg-[#f7f3ee]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/journal')}
              className="text-xs text-[#a09070] cursor-pointer flex items-center gap-1.5 hover:text-[#7a6a4a] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> entries
            </button>
            <div className="font-serif text-base text-[#4a3520]">New entry</div>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="bg-transparent border border-[#d0c8bc] text-[#7a6a4a] px-3.5 py-1.5 rounded-[20px] text-xs cursor-pointer hover:bg-[#efe7d8] hover:border-[#b8a888] transition-all">
              <MoreHorizontal className="w-3.5 h-3.5 inline mr-1" /> options
            </button>
            <button 
              onClick={() => setIsPrivate(!isPrivate)}
              className={`bg-transparent border px-3.5 py-1.5 rounded-[20px] text-xs cursor-pointer transition-all ${
                isPrivate
                  ? 'border-[#9a8a5a] bg-[#f5edda] text-[#7a6a4a]'
                  : 'border-[#d0c8bc] text-[#7a6a4a] hover:bg-[#efe7d8]'
              }`}
            >
              <Lock className="w-3 h-3 inline mr-1" /> private
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              className="bg-[#5a7a2a] text-[#f0f7e0] border-none px-5 py-2 rounded-[20px] text-xs font-medium cursor-pointer hover:bg-[#6a8a3a] transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 inline mr-1.5" />
              {isSaving ? 'Saving...' : 'Save entry'}
            </button>
          </div>
        </div>
        
        {/* Body Split */}
        <div className="flex flex-1">
          {/* Editor Column */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 px-11 py-10 flex flex-col border-r border-[#e8e0d5]"
          >
            {/* Date line */}
            <div className="text-[11px] text-[#b0a080] uppercase tracking-[0.1em] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8b87a] inline-block" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this moment a name…"
              className="font-serif text-[26px] text-[#3a2c14] bg-transparent border-none outline-none w-full mb-5 border-b border-transparent focus:border-[#e0d0b0] transition-colors placeholder:text-[#c8b890]"
              style={{ fontFamily: "'Lora', serif" }}
            />
            
            {/* Mood Row */}
            <div className="flex items-center gap-2 py-3 mb-5 border-t border-b border-[#ede5d8]">
              <span className="text-[11px] text-[#b0a080] mr-1">feeling</span>
              {moods.map(mood => (
                <MoodChip
                  key={mood.emoji}
                  {...mood}
                  selected={selectedMood === mood.emoji}
                  onClick={() => setSelectedMood(mood.emoji)}
                />
              ))}
            </div>
            
            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start wherever you are…"
                className="w-full min-h-[320px] font-serif text-base leading-[1.85] text-[#3a2c14] bg-transparent border-none outline-none resize-none placeholder:text-[#c8b890] placeholder:italic"
                style={{ fontFamily: "'Lora', serif" }}
              />
            </div>
            
            {/* Writing Prompt Nudge */}
            {content.length < 50 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-[#faf6ee] border-l-2 border-[#c8a84a] rounded-r-lg"
              >
                <div className="text-[10px] text-[#b09050] uppercase tracking-[0.1em] mb-1">
                  a gentle nudge
                </div>
                <div className="font-serif text-[13px] text-[#7a6030] italic leading-relaxed">
                  "{currentPrompt}"
                </div>
              </motion.div>
            )}
            
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-4 mt-4 border-t border-[#ede5d8]">
              <span className="text-[11px] text-[#b0a080]">tags</span>
              {tags.map((tag, i) => (
                <Tag key={i} label={tag} onRemove={() => setTags(tags.filter((_, idx) => idx !== i))} />
              ))}
              <button 
                onClick={() => {
                  const tag = prompt('Enter tag:');
                  if (tag) setTags([...tags, `#${tag}`]);
                }}
                className="px-3 py-1 border border-dashed border-[#d0c0a0] rounded-[14px] text-[11px] text-[#b0a070] cursor-pointer hover:bg-[#f5ede0] transition-colors"
              >
                + add tag
              </button>
            </div>
          </motion.div>
          
          {/* Right Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[248px] flex-shrink-0 px-6 py-8 flex flex-col gap-6"
          >
            {/* Mood History */}
            <div>
              <div className="text-[10px] text-[#b0a080] uppercase tracking-[0.12em] mb-3">
                your week in mood
              </div>
              <MoodHistoryChart entries={recentEntries} />
              <div className="text-[10px] text-[#c0b090] italic mt-2">
                today is still unfolding ↑
              </div>
            </div>
            
            {/* Previous Entry */}
            <div>
              <div className="text-[10px] text-[#b0a080] uppercase tracking-[0.12em] mb-3">
                yesterday
              </div>
              <PreviousEntryPeek 
                entry={recentEntries[0]}
                onClick={() => {}}
              />
            </div>
            
            {/* Plant Response */}
            <div>
              <div className="text-[10px] text-[#b0a080] uppercase tracking-[0.12em] mb-3">
                how lumina is feeling
              </div>
              <PlantResponse />
            </div>
            
            {/* Gentle Note */}
            <div className="font-serif text-xs text-[#a09070] italic leading-relaxed text-center px-1">
              "There's no right way to do this. Just keep showing up."
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-8 py-2.5 border-t border-[#e8e0d5] bg-[#f7f3ee]">
          <div className="flex gap-3.5 items-center">
            <button className="text-[13px] text-[#b0a080] cursor-pointer p-1 rounded-md hover:text-[#7a6a4a] transition-colors" title="Voice note">
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button className="text-[13px] text-[#b0a080] cursor-pointer p-1 rounded-md hover:text-[#7a6a4a] transition-colors" title="Add photo">
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button className="text-[13px] text-[#b0a080] cursor-pointer p-1 rounded-md hover:text-[#7a6a4a] transition-colors" title="Draw">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button className="text-[13px] text-[#b0a080] cursor-pointer p-1 rounded-md hover:text-[#7a6a4a] transition-colors" title="Wellness check">
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-[#c0b090] italic">
            your words are private and yours alone
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJournalEntry;
