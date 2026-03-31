/**
 * Plant Species Collection System
 * Multiple plant types with unique characteristics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Flower, 
  TreeDeciduous,
  Sparkles,
  Lock,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

// Plant Species Definitions
const PLANT_SPECIES = {
  classic: {
    id: 'classic',
    name: 'Classic Garden Plant',
    description: 'A beautiful, versatile plant that grows through all seasons. Perfect for beginners.',
    unlockRequirement: null, // Default plant
    colors: {
      stem: '#4ade80',
      leaf: '#22c55e',
      flower: '#f472b6',
      fruit: '#ef4444'
    },
    growthBonus: 1,
    specialAbility: null,
    emoji: '🌱',
    stages: {
      seed: '🌰',
      sprout: '🌱',
      plant: '🌿',
      blooming: '🌸',
      tree: '🌳',
      fruitingTree: '🌳🍎'
    },
    rarity: 'common'
  },
  
  sakura: {
    id: 'sakura',
    name: 'Cherry Blossom',
    description: 'A graceful Japanese cherry tree with stunning pink blossoms. Flourishes with consistent care.',
    unlockRequirement: { type: 'streak', count: 7 },
    colors: {
      stem: '#92400e',
      leaf: '#4ade80',
      flower: '#fda4af',
      fruit: '#be123c'
    },
    growthBonus: 1.1,
    specialAbility: 'Bonus flowers during spring months',
    emoji: '🌸',
    stages: {
      seed: '🫘',
      sprout: '🌱',
      plant: '🎋',
      blooming: '🌸',
      tree: '🎄',
      fruitingTree: '🍒'
    },
    rarity: 'uncommon'
  },
  
  succulent: {
    id: 'succulent',
    name: 'Desert Succulent',
    description: 'A hardy desert plant that forgives missed entries. Perfect for busy writers.',
    unlockRequirement: { type: 'entries', count: 25 },
    colors: {
      stem: '#86efac',
      leaf: '#4ade80',
      flower: '#fef08a',
      fruit: '#f97316'
    },
    growthBonus: 0.9,
    specialAbility: 'Slower health decay when inactive',
    emoji: '🌵',
    stages: {
      seed: '🪨',
      sprout: '🌱',
      plant: '🌵',
      blooming: '🌻',
      tree: '🌴',
      fruitingTree: '🌴🥥'
    },
    rarity: 'uncommon'
  },
  
  bonsai: {
    id: 'bonsai',
    name: 'Ancient Bonsai',
    description: 'A miniature tree with deep wisdom. Rewards thoughtful, detailed entries.',
    unlockRequirement: { type: 'totalWords', count: 10000 },
    colors: {
      stem: '#78350f',
      leaf: '#15803d',
      flower: '#ffffff',
      fruit: '#fbbf24'
    },
    growthBonus: 1.2,
    specialAbility: 'Extra growth points for longer entries',
    emoji: '🎋',
    stages: {
      seed: '🌰',
      sprout: '🌱',
      plant: '🎋',
      blooming: '🌼',
      tree: '🎍',
      fruitingTree: '🎍✨'
    },
    rarity: 'rare'
  },
  
  lotus: {
    id: 'lotus',
    name: 'Sacred Lotus',
    description: 'A spiritual water lily representing enlightenment. Thrives on emotional depth.',
    unlockRequirement: { type: 'uniqueMoods', count: 10 },
    colors: {
      stem: '#4ade80',
      leaf: '#22d3ee',
      flower: '#f0abfc',
      fruit: '#a855f7'
    },
    growthBonus: 1.15,
    specialAbility: 'Bonus points for varied mood expressions',
    emoji: '🪷',
    stages: {
      seed: '🫧',
      sprout: '🌱',
      plant: '🍀',
      blooming: '🪷',
      tree: '🌺',
      fruitingTree: '🪷💎'
    },
    rarity: 'rare'
  },
  
  moonflower: {
    id: 'moonflower',
    name: 'Moonflower',
    description: 'A mystical night-blooming flower. Grows stronger with evening entries.',
    unlockRequirement: { type: 'nightEntries', count: 10 },
    colors: {
      stem: '#6366f1',
      leaf: '#818cf8',
      flower: '#e0e7ff',
      fruit: '#c4b5fd'
    },
    growthBonus: 1.1,
    specialAbility: 'Double growth for entries after 8 PM',
    emoji: '🌙',
    stages: {
      seed: '⭐',
      sprout: '🌱',
      plant: '🌾',
      blooming: '🌙',
      tree: '✨',
      fruitingTree: '🌙💫'
    },
    rarity: 'rare'
  },
  
  sunflower: {
    id: 'sunflower',
    name: 'Radiant Sunflower',
    description: 'A cheerful giant that loves gratitude. Grows taller with positive entries.',
    unlockRequirement: { type: 'gratitudeEntries', count: 15 },
    colors: {
      stem: '#65a30d',
      leaf: '#84cc16',
      flower: '#fbbf24',
      fruit: '#f59e0b'
    },
    growthBonus: 1.15,
    specialAbility: 'Extra growth for positive/grateful entries',
    emoji: '🌻',
    stages: {
      seed: '🌰',
      sprout: '🌱',
      plant: '🌿',
      blooming: '🌻',
      tree: '🌻🌻',
      fruitingTree: '🌻🌟'
    },
    rarity: 'uncommon'
  },
  
  crystal: {
    id: 'crystal',
    name: 'Crystal Bloom',
    description: 'A rare magical plant made of living crystal. The rarest of all species.',
    unlockRequirement: { type: 'streak', count: 100 },
    colors: {
      stem: '#06b6d4',
      leaf: '#67e8f9',
      flower: '#f0abfc',
      fruit: '#c084fc'
    },
    growthBonus: 1.3,
    specialAbility: 'Sparkles and creates ambient particles',
    emoji: '💎',
    stages: {
      seed: '💎',
      sprout: '🔮',
      plant: '💠',
      blooming: '❄️',
      tree: '🏔️',
      fruitingTree: '💎✨'
    },
    rarity: 'legendary'
  },
  
  bamboo: {
    id: 'bamboo',
    name: 'Lucky Bamboo',
    description: 'A fast-growing symbol of resilience. Recovers quickly from wilting.',
    unlockRequirement: { type: 'comebacks', count: 3 },
    colors: {
      stem: '#84cc16',
      leaf: '#4ade80',
      flower: '#fef08a',
      fruit: '#22c55e'
    },
    growthBonus: 1.05,
    specialAbility: 'Faster health recovery',
    emoji: '🎍',
    stages: {
      seed: '🌰',
      sprout: '🌱',
      plant: '🎋',
      blooming: '🎍',
      tree: '🎋🎋',
      fruitingTree: '🎍🍀'
    },
    rarity: 'uncommon'
  },
  
  rose: {
    id: 'rose',
    name: 'Eternal Rose',
    description: 'A classic symbol of love and beauty. Produces the most beautiful flowers.',
    unlockRequirement: { type: 'flowers', count: 10 },
    colors: {
      stem: '#15803d',
      leaf: '#22c55e',
      flower: '#e11d48',
      fruit: '#be123c'
    },
    growthBonus: 1.1,
    specialAbility: 'Double flower rewards',
    emoji: '🌹',
    stages: {
      seed: '🫘',
      sprout: '🌱',
      plant: '🥀',
      blooming: '🌹',
      tree: '🌹🌹',
      fruitingTree: '🌹❤️'
    },
    rarity: 'rare'
  }
};

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-purple-500',
  legendary: 'from-amber-400 via-yellow-400 to-amber-500'
};

// Single Plant Card Component
const PlantCard = ({ species, isUnlocked, isSelected, onSelect, userStats = {} }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  const canUnlock = () => {
    if (!species.unlockRequirement) return true;
    const { type, count } = species.unlockRequirement;
    
    switch (type) {
      case 'streak':
        return (userStats.longestStreak || 0) >= count;
      case 'entries':
        return (userStats.totalEntries || 0) >= count;
      case 'totalWords':
        return (userStats.totalWords || 0) >= count;
      case 'uniqueMoods':
        return (userStats.uniqueMoods || 0) >= count;
      case 'nightEntries':
        return (userStats.nightEntries || 0) >= count;
      case 'gratitudeEntries':
        return (userStats.gratitudeEntries || 0) >= count;
      case 'comebacks':
        return (userStats.comebacks || 0) >= count;
      case 'flowers':
        return (userStats.flowers || 0) >= count;
      default:
        return false;
    }
  };

  const getProgress = () => {
    if (!species.unlockRequirement) return 100;
    const { type, count } = species.unlockRequirement;
    
    let current = 0;
    switch (type) {
      case 'streak':
        current = userStats.longestStreak || 0;
        break;
      case 'entries':
        current = userStats.totalEntries || 0;
        break;
      case 'totalWords':
        current = userStats.totalWords || 0;
        break;
      case 'uniqueMoods':
        current = userStats.uniqueMoods || 0;
        break;
      default:
        current = 0;
    }
    
    return Math.min(100, (current / count) * 100);
  };

  const getRequirementText = () => {
    if (!species.unlockRequirement) return 'Default plant';
    const { type, count } = species.unlockRequirement;
    
    switch (type) {
      case 'streak':
        return `${count}-day streak`;
      case 'entries':
        return `${count} entries`;
      case 'totalWords':
        return `${count.toLocaleString()} words`;
      case 'uniqueMoods':
        return `${count} mood types`;
      case 'nightEntries':
        return `${count} night entries`;
      case 'gratitudeEntries':
        return `${count} gratitude entries`;
      case 'comebacks':
        return `${count} comebacks`;
      case 'flowers':
        return `${count} flowers earned`;
      default:
        return 'Complete requirement';
    }
  };

  return (
    <motion.div
      layout
      whileHover={isUnlocked ? { scale: 1.02 } : { scale: 1.01 }}
      className={`
        relative p-6 rounded-2xl
        ${isUnlocked 
          ? 'bg-white dark:bg-gray-800 cursor-pointer' 
          : 'bg-gray-100 dark:bg-gray-700/50'
        }
        ${isSelected ? 'ring-4 ring-sage-400 ring-offset-2' : ''}
        border-2 ${isUnlocked ? 'border-sage-200 dark:border-sage-700' : 'border-gray-200 dark:border-gray-600'}
        shadow-lg hover:shadow-xl
        transition-all duration-300
      `}
      onClick={() => isUnlocked && onSelect(species)}
    >
      {/* Rarity Badge */}
      <div className={`
        absolute -top-2 -right-2
        px-3 py-1 rounded-full
        text-xs font-bold text-white
        bg-gradient-to-r ${RARITY_COLORS[species.rarity]}
        shadow-md
      `}>
        {species.rarity.charAt(0).toUpperCase() + species.rarity.slice(1)}
      </div>

      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 rounded-2xl bg-gray-900/50 dark:bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
          <div className="text-center px-4">
            <Lock className="w-8 h-8 text-white mx-auto mb-2 drop-shadow-lg" />
            <p className="text-white text-sm font-semibold drop-shadow-md">
              {getRequirementText()}
            </p>
            <div className="w-28 h-2.5 bg-white/30 rounded-full mt-3 mx-auto overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all shadow-sm"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected Badge */}
      {isSelected && isUnlocked && (
        <div className="absolute top-3 left-3 p-1 bg-sage-500 rounded-full">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Plant Icon */}
      <div className="text-5xl mb-4 text-center">
        {species.emoji}
      </div>

      {/* Plant Name */}
      <h3 className={`
        text-lg font-bold text-center mb-2
        ${isUnlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}
      `}>
        {species.name}
      </h3>

      {/* Description */}
      <p className={`
        text-sm text-center mb-4
        ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}
        line-clamp-2
      `}>
        {species.description}
      </p>

      {/* Stats */}
      {isUnlocked && (
        <div className="flex justify-center gap-4 text-xs">
          <div className="text-center">
            <span className="block font-bold text-sage-600 dark:text-sage-400">
              {Math.round(species.growthBonus * 100)}%
            </span>
            <span className="text-gray-500">Growth</span>
          </div>
          {species.specialAbility && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Info className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      )}

      {/* Special Ability Tooltip */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-20"
          >
            <p className="font-medium mb-1">✨ Special Ability</p>
            <p>{species.specialAbility}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Plant Selection Modal
const PlantSelectionModal = ({ 
  isOpen, 
  onClose, 
  currentSpecies, 
  unlockedSpecies = ['classic'], 
  onSelectSpecies,
  userStats = {}
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState(currentSpecies);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'

  const handleConfirm = () => {
    if (selectedSpecies !== currentSpecies) {
      onSelectSpecies(selectedSpecies);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-sage-500" />
                Plant Collection
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {unlockedSpecies.length} of {Object.keys(PLANT_SPECIES).length} species unlocked
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Plant Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.values(PLANT_SPECIES).map((species) => (
              <PlantCard
                key={species.id}
                species={species}
                isUnlocked={unlockedSpecies.includes(species.id)}
                isSelected={selectedSpecies === species.id}
                onSelect={() => setSelectedSpecies(species.id)}
                userStats={userStats}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {PLANT_SPECIES[selectedSpecies]?.emoji}
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {PLANT_SPECIES[selectedSpecies]?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedSpecies === currentSpecies ? 'Currently selected' : 'Click to select'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="btn-secondary px-6 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedSpecies === currentSpecies || !unlockedSpecies.includes(selectedSpecies)}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Hook for plant species management
const usePlantSpecies = (userId) => {
  const [currentSpecies, setCurrentSpecies] = useState('classic');
  const [unlockedSpecies, setUnlockedSpecies] = useState(['classic']);

  // Load from localStorage
  useEffect(() => {
    if (userId) {
      const savedSpecies = localStorage.getItem(`moodGarden_plantSpecies_${userId}`);
      const savedUnlocked = localStorage.getItem(`moodGarden_unlockedSpecies_${userId}`);
      
      if (savedSpecies) setCurrentSpecies(savedSpecies);
      if (savedUnlocked) setUnlockedSpecies(JSON.parse(savedUnlocked));
    }
  }, [userId]);

  // Save current species
  const selectSpecies = useCallback((speciesId) => {
    if (unlockedSpecies.includes(speciesId)) {
      setCurrentSpecies(speciesId);
      if (userId) {
        localStorage.setItem(`moodGarden_plantSpecies_${userId}`, speciesId);
      }
    }
  }, [userId, unlockedSpecies]);

  // Unlock new species
  const unlockSpecies = useCallback((speciesId) => {
    if (!unlockedSpecies.includes(speciesId)) {
      const updated = [...unlockedSpecies, speciesId];
      setUnlockedSpecies(updated);
      if (userId) {
        localStorage.setItem(`moodGarden_unlockedSpecies_${userId}`, JSON.stringify(updated));
      }
      return true;
    }
    return false;
  }, [userId, unlockedSpecies]);

  // Check for new unlocks based on stats
  const checkUnlocks = useCallback((stats) => {
    const newlyUnlocked = [];
    
    Object.values(PLANT_SPECIES).forEach(species => {
      if (unlockedSpecies.includes(species.id)) return;
      if (!species.unlockRequirement) return;
      
      const { type, count } = species.unlockRequirement;
      let shouldUnlock = false;
      
      switch (type) {
        case 'streak':
          shouldUnlock = (stats.longestStreak || stats.currentStreak || 0) >= count;
          break;
        case 'entries':
          shouldUnlock = (stats.totalEntries || 0) >= count;
          break;
        case 'totalWords':
          shouldUnlock = (stats.totalWords || 0) >= count;
          break;
        case 'uniqueMoods':
          shouldUnlock = (stats.uniqueMoods || 0) >= count;
          break;
        case 'flowers':
          shouldUnlock = (stats.flowers || 0) >= count;
          break;
        // Add more cases as needed
      }
      
      if (shouldUnlock) {
        newlyUnlocked.push(species.id);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      const updated = [...unlockedSpecies, ...newlyUnlocked];
      setUnlockedSpecies(updated);
      if (userId) {
        localStorage.setItem(`moodGarden_unlockedSpecies_${userId}`, JSON.stringify(updated));
      }
    }
    
    return newlyUnlocked;
  }, [userId, unlockedSpecies]);

  // Get current species config
  const getSpeciesConfig = useCallback(() => {
    return PLANT_SPECIES[currentSpecies] || PLANT_SPECIES.classic;
  }, [currentSpecies]);

  return {
    currentSpecies,
    unlockedSpecies,
    selectSpecies,
    unlockSpecies,
    checkUnlocks,
    getSpeciesConfig,
    allSpecies: PLANT_SPECIES
  };
};

export { 
  PLANT_SPECIES, 
  PlantCard, 
  PlantSelectionModal,
  usePlantSpecies 
};

export default PlantSelectionModal;
