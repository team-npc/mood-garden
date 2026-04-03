/**
 * Anonymous Garden Component
 * Community garden of anonymized moods
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Globe, 
  Users,
  Flower2,
  Heart,
  MessageCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';

/**
 * Generate mock community data
 */
const generateCommunityPlants = () => {
  const moods = ['😊', '😢', '😤', '😴', '😰', '😌'];
  const plants = [];
  
  // Generate 30-50 random plants
  const count = 30 + Math.floor(Math.random() * 20);
  
  for (let i = 0; i < count; i++) {
    const mood = moods[Math.floor(Math.random() * moods.length)];
    const stage = Math.floor(Math.random() * 5);
    const x = 5 + Math.random() * 90;
    const y = 15 + Math.random() * 70;
    const size = 0.5 + Math.random() * 0.8;
    const hearts = Math.floor(Math.random() * 50);
    const timeAgo = Math.floor(Math.random() * 48);
    
    plants.push({
      id: `plant-${i}`,
      mood,
      stage,
      x,
      y,
      size,
      hearts,
      timeAgo,
      message: getRandomMessage(mood)
    });
  }
  
  return plants;
};

const getRandomMessage = (mood) => {
  const messages = {
    '😊': [
      'Feeling grateful for small moments',
      'Today was a good day!',
      'Found joy in unexpected places',
      'Grateful for my morning coffee',
      'Celebrated a small win today'
    ],
    '😢': [
      'Taking it one day at a time',
      'Healing is not linear',
      'It\'s okay to not be okay',
      'Finding strength in vulnerability',
      'This too shall pass'
    ],
    '😤': [
      'Learning to process my emotions',
      'Setting healthy boundaries',
      'Using this energy productively',
      'Deep breaths help',
      'Working through frustrations'
    ],
    '😴': [
      'Rest is productive too',
      'Prioritizing self-care today',
      'Energy will return',
      'Allowing myself to slow down',
      'Recovery mode activated'
    ],
    '😰': [
      'One step at a time',
      'Breathing through it',
      'Tomorrow is a new day',
      'Finding moments of peace',
      'Courage is feeling fear and doing it anyway'
    ],
    '😌': [
      'Finding peace in stillness',
      'Present moment awareness',
      'Contentment feels good',
      'Inner calm radiates outward',
      'Grateful for this peace'
    ]
  };
  
  const moodMessages = messages[mood] || messages['😌'];
  return moodMessages[Math.floor(Math.random() * moodMessages.length)];
};

/**
 * Plant SVG Component
 */
const PlantSVG = ({ stage, mood, size = 1 }) => {
  const colors = {
    '😊': '#fbbf24',
    '😢': '#3b82f6',
    '😤': '#ef4444',
    '😴': '#8b5cf6',
    '😰': '#f97316',
    '😌': '#14b8a6'
  };
  
  const color = colors[mood] || '#84cc16';
  const plantHeight = 20 + stage * 15;
  
  return (
    <svg 
      viewBox="0 0 50 80" 
      style={{ 
        width: `${30 * size}px`, 
        height: `${50 * size}px`,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
      }}
    >
      {/* Stem */}
      <path
        d={`M25 80 Q25 ${80 - plantHeight / 2} 25 ${80 - plantHeight}`}
        stroke="#4ade80"
        strokeWidth="3"
        fill="none"
      />
      
      {/* Leaves */}
      {stage >= 1 && (
        <>
          <ellipse cx="18" cy={75 - plantHeight * 0.3} rx="8" ry="4" fill="#4ade80" transform={`rotate(-30 18 ${75 - plantHeight * 0.3})`} />
          <ellipse cx="32" cy={75 - plantHeight * 0.3} rx="8" ry="4" fill="#4ade80" transform={`rotate(30 32 ${75 - plantHeight * 0.3})`} />
        </>
      )}
      
      {/* Flower/Top */}
      {stage >= 2 && (
        <circle cx="25" cy={80 - plantHeight} r={5 + stage * 2} fill={color}>
          <animate attributeName="r" values={`${5 + stage * 2};${6 + stage * 2};${5 + stage * 2}`} dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      
      {/* Mood emoji */}
      <text x="25" y={80 - plantHeight - 10 - stage * 3} fontSize="12" textAnchor="middle">
        {mood}
      </text>
    </svg>
  );
};

/**
 * Plant Card (for detail view)
 */
const PlantCard = ({ plant, onHeart, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="absolute bottom-4 left-4 right-4 bg-deep-800/95 backdrop-blur rounded-xl p-4 border border-deep-600"
  >
    <button
      onClick={onClose}
      className="absolute top-2 right-2 p-1 hover:bg-deep-600 rounded-lg"
    >
      <X className="w-4 h-4 text-cream-400" />
    </button>
    
    <div className="flex items-start gap-3">
      <span className="text-3xl">{plant.mood}</span>
      <div className="flex-1">
        <p className="text-cream-200 italic">"{plant.message}"</p>
        <p className="text-xs text-cream-500 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {plant.timeAgo === 0 ? 'Just now' : `${plant.timeAgo}h ago`}
        </p>
      </div>
    </div>
    
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-deep-600">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onHeart(plant.id)}
        className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
      >
        <Heart className="w-4 h-4" fill="currentColor" />
        <span className="text-sm">{plant.hearts}</span>
      </motion.button>
      
      <span className="text-xs text-cream-500">
        Anonymous gardener
      </span>
    </div>
  </motion.div>
);

/**
 * Community Stats - Using qualitative descriptions instead of numbers
 */
const CommunityStats = ({ plants }) => {
  const stats = useMemo(() => {
    const moodCounts = {};
    plants.forEach(p => {
      moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1;
    });
    
    const sortedMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a);
    
    // Qualitative garden size descriptions
    const plantCount = plants.length;
    const gardenSize = plantCount >= 50 ? 'Lush' : plantCount >= 30 ? 'Growing' : plantCount >= 15 ? 'Blooming' : 'Budding';
    
    // Qualitative community warmth descriptions  
    const totalHearts = plants.reduce((sum, p) => sum + p.hearts, 0);
    const warmth = totalHearts >= 100 ? 'Overflowing' : totalHearts >= 50 ? 'Warm' : totalHearts >= 20 ? 'Cozy' : 'Growing';
    
    return {
      gardenSize,
      communityWarmth: warmth,
      dominantMood: sortedMoods[0]?.[0] || '😊'
    };
  }, [plants]);
  
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="bg-deep-700/50 rounded-xl p-3 text-center">
        <Flower2 className="w-4 h-4 text-sage-400 mx-auto mb-1" />
        <span className="text-sm font-medium text-cream-200">{stats.gardenSize}</span>
        <span className="text-xs text-cream-500 block">Garden</span>
      </div>
      <div className="bg-deep-700/50 rounded-xl p-3 text-center">
        <Heart className="w-4 h-4 text-pink-400 mx-auto mb-1" />
        <span className="text-sm font-medium text-cream-200">{stats.communityWarmth}</span>
        <span className="text-xs text-cream-500 block">Community</span>
      </div>
      <div className="bg-deep-700/50 rounded-xl p-3 text-center">
        <TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1" />
        <span className="text-2xl">{stats.dominantMood}</span>
        <span className="text-xs text-cream-500 block">Vibe</span>
      </div>
    </div>
  );
};

/**
 * Main Anonymous Garden Component
 */
const AnonymousGarden = ({ isOpen, onClose, entries = [] }) => {
  const [communityPlants, setCommunityPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [contributeMessage, setContributeMessage] = useState('');
  
  // Generate initial community data
  useEffect(() => {
    setCommunityPlants(generateCommunityPlants());
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCommunityPlants(generateCommunityPlants());
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleHeart = (plantId) => {
    setCommunityPlants(prev => 
      prev.map(p => p.id === plantId ? { ...p, hearts: p.hearts + 1 } : p)
    );
  };
  
  const handleContribute = () => {
    if (!contributeMessage.trim()) return;
    
    // Add user's plant to the garden
    const userMood = entries[0]?.mood || '😌';
    const newPlant = {
      id: `plant-user-${Date.now()}`,
      mood: userMood,
      stage: Math.min(4, Math.floor(entries.length / 5)),
      x: 5 + Math.random() * 90,
      y: 15 + Math.random() * 70,
      size: 0.7 + Math.random() * 0.5,
      hearts: 1,
      timeAgo: 0,
      message: contributeMessage
    };
    
    setCommunityPlants(prev => [...prev, newPlant]);
    setContributeMessage('');
    setShowContribute(false);
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
          className="bg-deep-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Community Garden</h2>
                  <p className="text-sm text-indigo-200">Anonymous mood flowers from around the world</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ rotate: 180 }}
                  onClick={handleRefresh}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {/* Stats */}
            <CommunityStats plants={communityPlants} />
            
            {/* Garden View */}
            <div 
              className="relative bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-200 rounded-2xl overflow-hidden"
              style={{ height: '350px' }}
            >
              {/* Sky decorations */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" />
              <motion.div
                animate={{ x: [-20, 50, -20] }}
                transition={{ duration: 30, repeat: Infinity }}
                className="absolute top-8 left-10 text-3xl opacity-60"
              >
                ☁️
              </motion.div>
              <motion.div
                animate={{ x: [20, -30, 20] }}
                transition={{ duration: 25, repeat: Infinity }}
                className="absolute top-12 right-20 text-2xl opacity-50"
              >
                ☁️
              </motion.div>
              
              {/* Plants */}
              {communityPlants.map((plant) => (
                <motion.div
                  key={plant.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute cursor-pointer"
                  style={{ 
                    left: `${plant.x}%`, 
                    top: `${plant.y}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <PlantSVG stage={plant.stage} mood={plant.mood} size={plant.size} />
                </motion.div>
              ))}
              
              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-800 to-transparent" />
              
              {/* Selected plant card */}
              <AnimatePresence>
                {selectedPlant && (
                  <PlantCard
                    plant={selectedPlant}
                    onHeart={handleHeart}
                    onClose={() => setSelectedPlant(null)}
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Contribute Section */}
            <div className="mt-4">
              {!showContribute ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContribute(true)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Plant Your Flower
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-deep-700/50 rounded-xl p-4"
                >
                  <p className="text-cream-300 text-sm mb-2">
                    Share an anonymous message with the community:
                  </p>
                  <textarea
                    value={contributeMessage}
                    onChange={(e) => setContributeMessage(e.target.value.slice(0, 100))}
                    placeholder="A thought, feeling, or encouragement..."
                    className="w-full p-3 bg-deep-600 border border-deep-500 rounded-xl text-cream-100 placeholder-cream-600 outline-none focus:border-indigo-500 resize-none h-20"
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-cream-500">{contributeMessage.length}/100</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowContribute(false)}
                        className="px-4 py-2 text-cream-400 hover:text-cream-200"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContribute}
                        disabled={!contributeMessage.trim()}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl disabled:opacity-50"
                      >
                        Plant 🌱
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Info */}
            <p className="text-xs text-cream-500 text-center mt-3">
              <Users className="w-3 h-3 inline mr-1" />
              All entries are anonymous. Spread kindness! 💚
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnonymousGarden;
