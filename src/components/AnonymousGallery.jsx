/**
 * Anonymous Garden Gallery
 * Community sharing with privacy-first design
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Heart,
  Share2,
  Eye,
  EyeOff,
  Sparkles,
  Trophy,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  Clock,
  Star,
  Send,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  Leaf
} from 'lucide-react';

// Mock data for gallery (in production, this would come from Firebase)
// Note: Internal metrics kept but not displayed to users
const MOCK_GARDENS = [
  {
    id: '1',
    plantStage: 4,
    plantType: 'cherry-blossom',
    plantColor: 'pink',
    _streak: 45,  // Internal, not displayed
    _entriesCount: 156,  // Internal, not displayed
    gardenStatus: 'flourishing',  // Qualitative status shown to users
    createdAt: new Date('2024-01-15'),
    likes: 234,
    isLiked: false,
    featured: true,
    decorations: ['lantern', 'rocks'],
  },
  {
    id: '2',
    plantStage: 3,
    plantType: 'succulent',
    plantColor: 'sage',
    _streak: 21,
    _entriesCount: 89,
    gardenStatus: 'growing',
    createdAt: new Date('2024-02-20'),
    likes: 156,
    isLiked: true,
    featured: false,
    decorations: ['mushrooms'],
  },
  {
    id: '3',
    plantStage: 5,
    plantType: 'bonsai',
    plantColor: 'forest',
    _streak: 120,
    _entriesCount: 423,
    gardenStatus: 'legendary',
    createdAt: new Date('2023-08-01'),
    likes: 891,
    isLiked: false,
    featured: true,
    decorations: ['rocks', 'lantern', 'butterfly'],
  },
  {
    id: '4',
    plantStage: 2,
    plantType: 'lotus',
    plantColor: 'lavender',
    _streak: 7,
    _entriesCount: 28,
    gardenStatus: 'blooming',
    createdAt: new Date('2024-06-01'),
    likes: 45,
    isLiked: false,
    featured: false,
    decorations: [],
  },
  {
    id: '5',
    plantStage: 4,
    plantType: 'sunflower',
    plantColor: 'golden',
    _streak: 60,
    _entriesCount: 201,
    gardenStatus: 'thriving',
    createdAt: new Date('2024-01-01'),
    likes: 312,
    isLiked: true,
    featured: false,
    decorations: ['butterfly', 'flowers'],
  },
];

// Garden status display configs
const GARDEN_STATUS = {
  'legendary': { emoji: '🌟', label: 'Legendary garden' },
  'flourishing': { emoji: '🌸', label: 'Flourishing' },
  'thriving': { emoji: '🌿', label: 'Thriving' },
  'growing': { emoji: '🌱', label: 'Growing' },
  'blooming': { emoji: '✨', label: 'Blooming' },
  'new': { emoji: '🌱', label: 'New garden' }
};

// Plant type display configs
const PLANT_DISPLAY = {
  'cherry-blossom': { emoji: '🌸', name: 'Cherry Blossom' },
  'succulent': { emoji: '🪴', name: 'Succulent' },
  'bonsai': { emoji: '🌳', name: 'Bonsai' },
  'lotus': { emoji: '🪷', name: 'Lotus' },
  'sunflower': { emoji: '🌻', name: 'Sunflower' },
  'cactus': { emoji: '🌵', name: 'Cactus' },
  'rose': { emoji: '🌹', name: 'Rose' },
  'fern': { emoji: '🌿', name: 'Fern' },
};

// Decoration emojis
const DECORATION_EMOJIS = {
  'rocks': '🪨',
  'mushrooms': '🍄',
  'lantern': '🏮',
  'butterfly': '🦋',
  'flowers': '🌸',
  'dewdrops': '💧',
  'fairy': '✨',
};

// Filter options
const FILTER_OPTIONS = {
  sort: [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'newest', label: 'Newest', icon: Clock },
    { id: 'most-loved', label: 'Most Loved', icon: Heart },
  ],
  plantType: [
    { id: 'all', label: 'All Plants' },
    { id: 'cherry-blossom', label: 'Cherry Blossom' },
    { id: 'succulent', label: 'Succulent' },
    { id: 'bonsai', label: 'Bonsai' },
    { id: 'lotus', label: 'Lotus' },
    { id: 'sunflower', label: 'Sunflower' },
  ],
};

// Custom Hook for Gallery
const useGallery = () => {
  const [gardens, setGardens] = useState(MOCK_GARDENS);
  const [filters, setFilters] = useState({
    sort: 'trending',
    plantType: 'all',
    search: '',
  });
  const [isSharing, setIsSharing] = useState(false);

  // Check if user is sharing their garden
  useEffect(() => {
    const sharing = localStorage.getItem('mood-garden-sharing');
    setIsSharing(sharing === 'true');
  }, []);

  // Filter and sort gardens
  const filteredGardens = gardens
    .filter(garden => {
      if (filters.plantType !== 'all' && garden.plantType !== filters.plantType) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'most-loved':
          return b.likes - a.likes;
        case 'trending':
        default:
          // Trending = recent likes + plant stage (internal metrics, not shown)
          return (b.likes + b.plantStage * 10) - (a.likes + a.plantStage * 10);
      }
    });

  const likeGarden = useCallback((gardenId) => {
    setGardens(prev => prev.map(garden => {
      if (garden.id === gardenId) {
        return {
          ...garden,
          isLiked: !garden.isLiked,
          likes: garden.isLiked ? garden.likes - 1 : garden.likes + 1,
        };
      }
      return garden;
    }));
  }, []);

  const toggleSharing = useCallback(() => {
    const newValue = !isSharing;
    setIsSharing(newValue);
    localStorage.setItem('mood-garden-sharing', String(newValue));
  }, [isSharing]);

  return {
    gardens: filteredGardens,
    filters,
    setFilters,
    likeGarden,
    isSharing,
    toggleSharing,
    featuredGardens: filteredGardens.filter(g => g.featured),
  };
};

// Garden Card Component
const GardenCard = ({ garden, onLike, onSendEncouragement }) => {
  const plant = PLANT_DISPLAY[garden.plantType] || PLANT_DISPLAY['succulent'];
  const [showEncourage, setShowEncourage] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
    >
      {/* Featured Badge */}
      {garden.featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 bg-sage-400 text-sage-900 rounded-full text-xs font-medium flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Featured
          </span>
        </div>
      )}

      {/* Plant Display */}
      <div className="relative aspect-square bg-gradient-to-br from-sage-50 to-sage-50 dark:from-sage-900/30 dark:to-sage-900/30 p-6 flex items-center justify-center">
        {/* Decorations */}
        <div className="absolute inset-0 flex items-end justify-around pb-8">
          {garden.decorations?.map((dec, i) => (
            <span key={dec} className="text-xl" style={{ transform: `translateY(-${i * 10}px)` }}>
              {DECORATION_EMOJIS[dec]}
            </span>
          ))}
        </div>

        {/* Plant */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <span className="text-7xl">{plant.emoji}</span>
          
          {/* Stage indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < garden.plantStage 
                    ? 'bg-sage-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {plant.name}
          </span>
          <div className="flex items-center gap-1 text-sm text-sage-500">
            <span>{GARDEN_STATUS[garden.gardenStatus]?.emoji || '🌱'}</span>
            <span className="text-xs">{GARDEN_STATUS[garden.gardenStatus]?.label || 'Growing'}</span>
          </div>
        </div>

        {/* Stats - using qualitative descriptions */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            Active gardener
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {Math.floor((new Date() - garden.createdAt) / (1000 * 60 * 60 * 24))} days
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(garden.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
              garden.isLiked
                ? 'bg-sage-100 dark:bg-sage-900/30 text-sage-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-sage-50 dark:hover:bg-sage-900/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${garden.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{garden.likes}</span>
          </motion.button>

          <button
            onClick={() => setShowEncourage(true)}
            className="p-2 text-gray-400 hover:text-sage-500 hover:bg-sage-50 dark:hover:bg-sage-900/30 rounded-xl transition-colors"
            title="Send encouragement"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Encouragement Modal */}
      <AnimatePresence>
        {showEncourage && (
          <EncouragementModal
            onClose={() => setShowEncourage(false)}
            onSend={(message) => {
              onSendEncouragement?.(garden.id, message);
              setShowEncourage(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Encouragement Modal
const EncouragementModal = ({ onClose, onSend }) => {
  const [selected, setSelected] = useState(null);

  const messages = [
    { emoji: '🌟', text: 'Keep growing!' },
    { emoji: '💪', text: 'You got this!' },
    { emoji: '🌸', text: 'Beautiful progress!' },
    { emoji: '🎉', text: 'Amazing streak!' },
    { emoji: '💚', text: 'So inspiring!' },
    { emoji: '🌈', text: 'Wonderful journey!' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sage-400" />
          Send Encouragement
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {messages.map((msg) => (
            <button
              key={msg.text}
              onClick={() => setSelected(msg)}
              className={`p-3 rounded-xl text-left transition-all ${
                selected?.text === msg.text
                  ? 'bg-sage-100 dark:bg-sage-900/30 border-2 border-sage-500'
                  : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-xl block mb-1">{msg.emoji}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{msg.text}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => selected && onSend(selected)}
            disabled={!selected}
            className="flex-1 py-2 px-4 bg-sage-500 text-white rounded-xl hover:bg-sage-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Featured Gardens Carousel
const FeaturedCarousel = ({ gardens }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (gardens.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % gardens.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + gardens.length) % gardens.length);
  };

  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-sage-400" />
          Featured Gardens
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex"
        >
          {gardens.map((garden) => (
            <div key={garden.id} className="w-full flex-shrink-0 px-1">
              <div className="bg-gradient-to-r from-sage-50 to-sage-50 dark:from-sage-900/20 dark:to-sage-900/20 rounded-2xl p-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <span className="text-5xl">
                    {PLANT_DISPLAY[garden.plantType]?.emoji || '🌱'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {PLANT_DISPLAY[garden.plantType]?.name || 'Plant'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {GARDEN_STATUS[garden.gardenStatus]?.emoji} {GARDEN_STATUS[garden.gardenStatus]?.label || 'Growing beautifully'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-sage-500 fill-current" />
                    <span className="text-sm text-sage-500 font-medium">
                      Loved by the community
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {gardens.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-sage-400 w-4'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Filter Bar
const FilterBar = ({ filters, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Sort Options */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {FILTER_OPTIONS.sort.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setFilters(prev => ({ ...prev, sort: option.id }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.sort === option.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Plant Type Filter */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
            filters.plantType !== 'all'
              ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">
            {filters.plantType === 'all' ? 'Filter' : PLANT_DISPLAY[filters.plantType]?.name}
          </span>
        </button>
      </div>

      {/* Expanded Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {FILTER_OPTIONS.plantType.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilters(prev => ({ ...prev, plantType: option.id }))}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  filters.plantType === option.id
                    ? 'bg-sage-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {PLANT_DISPLAY[option.id]?.emoji || '🌿'} {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sharing Settings
const SharingSettings = ({ isSharing, onToggle }) => {
  return (
    <div className="bg-gradient-to-r from-sage-50 to-sage-50 dark:from-sage-900/30 dark:to-sage-900/30 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSharing ? (
            <Eye className="w-5 h-5 text-sage-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Share Your Garden
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isSharing 
                ? 'Your garden is visible in the community gallery'
                : 'Your garden is private'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={onToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isSharing ? 'bg-sage-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              isSharing ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};

// Main Gallery Component
const AnonymousGallery = ({ isOpen, onClose }) => {
  const {
    gardens,
    filters,
    setFilters,
    likeGarden,
    isSharing,
    toggleSharing,
    featuredGardens,
  } = useGallery();

  const handleSendEncouragement = (gardenId, message) => {
    // In production, this would send to Firebase
    console.log(`Sending "${message.text}" to garden ${gardenId}`);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Users className="w-7 h-7 text-sage-500" />
            Community Gallery
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Sharing Settings */}
        <SharingSettings isSharing={isSharing} onToggle={toggleSharing} />

        {/* Featured Carousel */}
        <FeaturedCarousel gardens={featuredGardens} />

        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Garden Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {gardens.map((garden) => (
              <GardenCard
                key={garden.id}
                garden={garden}
                onLike={likeGarden}
                onSendEncouragement={handleSendEncouragement}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {gardens.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No gardens found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try changing your filters or check back later!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { useGallery, GardenCard, FeaturedCarousel };
export default AnonymousGallery;
