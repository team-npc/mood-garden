/**
 * Enhanced Dashboard Page with Classy Design
 * Based on elegant dashboard mockup with orb backgrounds and sophisticated cards
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Flame,
  Flower2,
  Cloud,
  Moon,
  Sun,
  Bell,
  Settings,
  Plus,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Background Orbs Component
 */
const BackgroundOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(45, 106, 30, 0.18), transparent)',
        filter: 'blur(80px)',
        top: '-100px',
        right: '-100px'
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.18, 0.22, 0.18]
      }}
      transition={{ duration: 8, repeat: Infinity }}
    />
    <motion.div
      className="absolute w-[350px] h-[350px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(26, 74, 46, 0.18), transparent)',
        filter: 'blur(80px)',
        bottom: '100px',
        left: '-80px'
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.18, 0.25, 0.18]
      }}
      transition={{ duration: 10, repeat: Infinity, delay: 2 }}
    />
    <motion.div
      className="absolute w-[200px] h-[200px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(74, 140, 42, 0.18), transparent)',
        filter: 'blur(80px)',
        top: '40%',
        left: '30%'
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.18, 0.28, 0.18]
      }}
      transition={{ duration: 12, repeat: Infinity, delay: 4 }}
    />
  </div>
);

/**
 * Elegant Card Container
 */
const Card = ({ children, className = '', gradient = false, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/[0.04] border border-white/[0.07] rounded-[20px] p-5 relative overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Plant Card with Elegant Visualization
 */
const PlantCard = ({ plant, entries }) => {
  const stage = plant?.stage || 0;
  const stageNames = ['Seed', 'Sprout', 'Seedling', 'Young Plant', 'Mature', 'Blooming'];
  const progress = ((stage + 1) / 6) * 100;
  
  return (
    <Card 
      className="row-span-2 flex flex-col items-center justify-end min-h-[340px] pb-6"
      style={{
        background: 'linear-gradient(160deg, rgba(30,60,20,0.7) 0%, rgba(15,35,15,0.9) 100%)',
        borderColor: 'rgba(80,160,60,0.2)'
      }}
    >
      {/* Plant visualization */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        <motion.div
          animate={{
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[120px]"
        >
          {['🌱', '🌿', '🪴', '🌳', '🌲', '🌸'][stage] || '🌱'}
        </motion.div>
      </div>
      
      {/* Plant info */}
      <div className="text-center w-full">
        <div className="font-serif text-lg italic text-[#a5d6a7] mb-0.5">
          Lumina Rose
        </div>
        <div className="text-[11px] text-[#5a8a5a] uppercase tracking-wider">
          {stageNames[stage]} · Stage {stage + 1} of 6
        </div>
        
        {/* Progress bar */}
        <div className="w-full mt-3">
          <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #4caf50, #8bc34a)'
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-[#4a7a4a]">Seedling</span>
            <span className="text-[10px] text-[#4a7a4a]">Blooming</span>
          </div>
        </div>
      </div>
      
      {/* Decorative leaf glow */}
      <div className="absolute -bottom-8 -right-8 text-[120px] opacity-[0.08] pointer-events-none rotate-[-20deg]">
        🌿
      </div>
    </Card>
  );
};

/**
 * Streak Card
 */
const StreakCard = ({ streak = 0, history = [] }) => {
  const last12Days = history.slice(-12);
  
  return (
    <Card
      style={{
        background: 'linear-gradient(135deg, rgba(45,100,30,0.5), rgba(20,50,15,0.8))',
        borderColor: 'rgba(100,180,60,0.15)'
      }}
    >
      <div className="text-[10px] text-[#4a7a4a] uppercase tracking-wider mb-3">
        Writing streak
      </div>
      <div className="font-serif text-[56px] text-[#c8e6c9] leading-none font-normal">
        {streak}
      </div>
      <div className="text-xs text-[#6b9e6b] tracking-wide mt-0.5">
        days in a row
      </div>
      
      {/* Mini dots */}
      <div className="flex gap-1.5 mt-3.5">
        {last12Days.map((day, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`w-2 h-2 rounded-full ${
              i === last12Days.length - 1
                ? 'bg-[#8bc34a] shadow-[0_0_6px_rgba(139,195,74,0.5)]'
                : day
                ? 'bg-[#4caf50]'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      
      {streak >= 10 && (
        <div className="text-xs text-[#4a7a4a] mt-3 italic">
          Your plant bloomed on day 10 ✦
        </div>
      )}
    </Card>
  );
};

/**
 * Mood Distribution Card
 */
const MoodCard = ({ entries = [] }) => {
  const moodData = entries.reduce((acc, entry) => {
    const mood = entry.mood || '😌';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});
  
  const total = Object.values(moodData).reduce((sum, count) => sum + count, 0);
  const moodList = Object.entries(moodData).map(([mood, count]) => ({
    mood,
    label: { '😊': 'joyful', '😢': 'heavy', '😤': 'frustrated', '😴': 'tired', '😰': 'anxious', '😌': 'calm' }[mood] || 'calm',
    percent: total > 0 ? (count / total) * 100 : 0,
    color: { '😊': '#8bc34a', '😢': '#5a5a9a', '😤': '#9a7a4a', '😴': '#7a5a3a', '😰': '#9a5a5a', '😌': '#3a9a6a' }[mood] || '#3a9a6a'
  }));
  
  return (
    <Card>
      <div className="text-[10px] text-[#4a7a4a] uppercase tracking-wider mb-3">
        Mood this week
      </div>
      
      {/* Mood tags */}
      <div className="flex flex-wrap gap-2 mb-3.5">
        {moodList.slice(0, 4).map(({ mood, label }) => (
          <div key={mood} className="flex items-center gap-1.5 bg-white/5 rounded-[20px] px-2.5 py-1 text-xs text-[#a5c8a5]">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: moodData[mood] ? '#4caf50' : '#5a5a9a' }} />
            {label}
          </div>
        ))}
      </div>
      
      {/* Mood bars */}
      <div className="space-y-1.5">
        {moodList.slice(0, 4).map(({ mood, label, percent, color }) => (
          <div key={mood} className="flex items-center gap-2">
            <div className="text-[11px] text-[#6b9e6b] w-[52px]">{label}</div>
            <div className="flex-1 h-1 bg-white/[0.07] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ background: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/**
 * Wellness Score Card
 */
const WellnessCard = ({ score = 74 }) => {
  const getBadge = (score) => {
    if (score >= 80) return { label: 'Thriving', color: '#81c784' };
    if (score >= 60) return { label: 'Growing', color: '#aed581' };
    if (score >= 40) return { label: 'Steady', color: '#9ccc65' };
    return { label: 'Nurturing', color: '#7cb342' };
  };
  
  const badge = getBadge(score);
  
  return (
    <Card>
      <div className="text-[10px] text-[#4a7a4a] uppercase tracking-wider mb-2.5">
        Wellness score
      </div>
      <div className="flex items-start justify-between">
        <div className="font-serif text-[38px] text-[#c8e6c9] leading-none">
          {score}
        </div>
        <div 
          className="text-[11px] px-2.5 py-1 rounded-xl border"
          style={{
            background: 'rgba(76,175,80,0.15)',
            borderColor: 'rgba(76,175,80,0.25)',
            color: badge.color
          }}
        >
          {badge.label}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {['consistent sleep', 'positive outlook', 'social moments'].map((tag, i) => (
          <div key={i} className="text-[11px] text-[#5a8a5a] bg-white/[0.04] border border-white/[0.07] rounded-[10px] px-2 py-0.5">
            {tag}
          </div>
        ))}
      </div>
    </Card>
  );
};

/**
 * Daily Prompt Card
 */
const PromptCard = () => {
  const prompts = [
    "What small thing made the world feel gentler today?",
    "What moment surprised you with its beauty?",
    "What did you learn about yourself this week?",
    "What are you grateful for in this very moment?"
  ];
  
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  
  return (
    <Card>
      <div className="text-[10px] text-[#4a7a4a] uppercase tracking-wider mb-2">
        Today's prompt
      </div>
      <div className="font-serif text-sm text-[#9aca9a] leading-relaxed italic my-2">
        "{prompt}"
      </div>
      <div className="text-[11px] text-[#4a7a4a] cursor-pointer flex items-center gap-1 hover:text-[#6b9e6b] transition-colors">
        Write about this ↗
      </div>
    </Card>
  );
};

/**
 * Recent Entries Card
 */
const RecentEntriesCard = ({ entries = [] }) => {
  const recent = entries.slice(0, 3);
  
  return (
    <Card className="col-span-2">
      <div className="text-[10px] text-[#4a7a4a] uppercase tracking-wider mb-2.5">
        Recent entries
      </div>
      <div className="space-y-2.5">
        {recent.map((entry, i) => (
          <div key={i} className="flex items-start gap-2.5 pb-2.5 border-b border-white/5 last:border-0 last:pb-0">
            <div 
              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: '#4caf50' }}
            />
            <div className="flex-1">
              <div className="text-[13px] text-[#b0ccb0] font-medium">
                {entry.content?.slice(0, 40)}...
              </div>
              <div className="text-[11px] text-[#4a7a4a] mt-0.5">
                {new Date(entry.createdAt).toLocaleDateString()} · {entry.mood} · {entry.wordCount || 0} words
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/**
 * Main Enhanced Dashboard Component
 */
const EnhancedDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [plant, setPlant] = useState(null);
  const [streak, setStreak] = useState(0);
  const [isDark, setIsDark] = useState(true);
  
  useEffect(() => {
    loadData();
  }, [currentUser]);
  
  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      // Load entries
      const entriesQuery = query(
        collection(db, 'users', currentUser.uid, 'entries'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const entriesSnapshot = await getDocs(entriesQuery);
      const entriesData = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(entriesData);
      
      // Load plant
      const plantQuery = query(collection(db, 'users', currentUser.uid, 'plant'));
      const plantSnapshot = await getDocs(plantQuery);
      if (!plantSnapshot.empty) {
        setPlant(plantSnapshot.docs[0].data());
      }
      
      // Calculate streak
      const today = new Date().toDateString();
      let currentStreak = 0;
      for (let i = 0; i < entriesData.length; i++) {
        const entryDate = new Date(entriesData[i].createdAt?.seconds * 1000).toDateString();
        const expectedDate = new Date(Date.now() - i * 86400000).toDateString();
        if (entryDate === expectedDate) {
          currentStreak++;
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const userName = currentUser?.displayName?.split(' ')[0] || 'friend';
  
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#0d1a0f', color: '#e8f0e9' }}
    >
      <BackgroundOrbs />
      
      {/* Content */}
      <div className="relative z-10 max-w-[960px] mx-auto p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-[11px] text-[#6b9e6b] font-medium uppercase tracking-[0.12em] mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Day {entries.length} of your garden
            </div>
            <div className="font-serif text-[26px] text-[#c8e6c9] font-normal">
              {getGreeting()}, <em className="italic text-[#a5d6a7]">{userName}</em>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate('/journal')}
              className="bg-[#2e7d32] text-[#c8e6c9] border-none rounded-[24px] px-5 py-2.5 font-medium text-[13px] cursor-pointer hover:bg-[#388e3c] transition-colors"
            >
              + Write today
            </button>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-[38px] h-[38px] rounded-full border border-[#2a4a2a] bg-white/[0.04] flex items-center justify-center cursor-pointer text-[#6b9e6b] text-[15px] hover:bg-white/[0.08] transition-colors"
            >
              {isDark ? '☾' : '☀'}
            </button>
            <button className="w-[38px] h-[38px] rounded-full border border-[#2a4a2a] bg-white/[0.04] flex items-center justify-center cursor-pointer text-[#6b9e6b] text-[15px] hover:bg-white/[0.08] transition-colors">
              ⚙
            </button>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="row-span-2">
            <PlantCard plant={plant} entries={entries} />
          </div>
          <StreakCard streak={streak} history={entries.map(e => !!e.content)} />
          <MoodCard entries={entries} />
          <WellnessCard score={74} />
          <PromptCard />
        </div>
        
        {/* Bottom Strip */}
        <div className="grid grid-cols-3 gap-4">
          <RecentEntriesCard entries={entries} />
          <Card>
            <div className="text-[10px] text-[#4a7a4a] uppercase tracking-wider mb-2.5">
              Daily challenges
            </div>
            <div className="space-y-2">
              {[
                { label: 'Write for 5 minutes', done: true },
                { label: 'Use 2 tags', done: true },
                { label: 'Mention one gratitude', done: false },
                { label: '150+ word entry', done: false }
              ].map((challenge, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div 
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                      challenge.done
                        ? 'bg-[rgba(76,175,80,0.2)] border border-[rgba(76,175,80,0.3)] text-[#81c784]'
                        : 'bg-white/[0.04] border border-white/10'
                    }`}
                  >
                    {challenge.done && '✓'}
                  </div>
                  <span className={challenge.done ? 'text-[#4a7a4a] line-through' : 'text-[#7aaa7a]'}>
                    {challenge.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
