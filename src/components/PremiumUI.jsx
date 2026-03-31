/**
 * Premium UI Components
 * Skeleton loaders, empty states, and other premium UI elements
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Sparkles, 
  PenLine, 
  Heart,
  Cloud,
  Sun,
  BookOpen,
  Search
} from 'lucide-react';

// Shimmer Animation Keyframes (inline style approach)
const shimmerGradient = `
  linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  )
`;

/**
 * Skeleton loader with shimmer effect
 */
export const Skeleton = ({ 
  className = '', 
  width, 
  height, 
  rounded = 'rounded-lg',
  animate = true 
}) => {
  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700 relative overflow-hidden
        ${rounded}
        ${className}
      `}
      style={{ width, height }}
    >
      {animate && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: shimmerGradient
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </div>
  );
};

/**
 * Skeleton Card - for loading journal entry cards
 */
export const SkeletonCard = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <Skeleton width={48} height={48} rounded="rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton height={16} className="w-1/3" />
          <Skeleton height={12} className="w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton height={12} className="w-full" />
        <Skeleton height={12} className="w-4/5" />
        <Skeleton height={12} className="w-3/5" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton width={60} height={24} rounded="rounded-full" />
        <Skeleton width={80} height={24} rounded="rounded-full" />
      </div>
    </div>
  );
};

/**
 * Skeleton Plant - for loading plant display
 */
export const SkeletonPlant = () => {
  return (
    <div className="flex flex-col items-center py-8">
      <Skeleton width={200} height={200} rounded="rounded-full" />
      <div className="mt-6 space-y-3 text-center">
        <Skeleton height={24} className="w-32 mx-auto" />
        <Skeleton height={16} className="w-48 mx-auto" />
      </div>
    </div>
  );
};

/**
 * Empty State Component
 * Beautiful illustrations for empty states
 */
export const EmptyState = ({ 
  type = 'journal',
  title,
  description,
  action,
  actionLabel
}) => {
  const configs = {
    journal: {
      icon: BookOpen,
      defaultTitle: "Your journal awaits",
      defaultDescription: "Start your mindfulness journey by writing your first entry. Your plant will grow with every word.",
      illustration: JournalIllustration
    },
    search: {
      icon: Search,
      defaultTitle: "No entries found",
      defaultDescription: "Try adjusting your search or filters to find what you're looking for.",
      illustration: SearchIllustration
    },
    garden: {
      icon: Leaf,
      defaultTitle: "Plant your first seed",
      defaultDescription: "Write a journal entry to plant your first seed and begin watching your garden grow.",
      illustration: GardenIllustration
    },
    achievements: {
      icon: Sparkles,
      defaultTitle: "Achievements await",
      defaultDescription: "Keep journaling to unlock badges and celebrate your mindfulness milestones.",
      illustration: AchievementsIllustration
    }
  };

  const config = configs[type] || configs.journal;
  const Illustration = config.illustration;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <Illustration />
      </div>

      {/* Content */}
      <div className="max-w-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title || config.defaultTitle}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {description || config.defaultDescription}
        </p>

        {/* Action Button */}
        {action && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action}
            className="btn-primary px-6 py-3 inline-flex items-center gap-2"
          >
            <Icon className="w-5 h-5" />
            <span>{actionLabel || 'Get Started'}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Journal Empty State Illustration
 */
const JournalIllustration = () => (
  <div className="relative w-48 h-48">
    {/* Background glow */}
    <div className="absolute inset-0 bg-sage-200/30 dark:bg-sage-800/30 rounded-full blur-2xl" />
    
    {/* Main illustration */}
    <motion.div
      className="relative flex items-center justify-center w-full h-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        {/* Book base */}
        <div className="w-32 h-40 bg-gradient-to-br from-sage-100 to-sage-200 dark:from-sage-800 dark:to-sage-700 rounded-lg shadow-lg transform rotate-3">
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-sage-300 dark:bg-sage-600 rounded-l-lg" />
        </div>
        
        {/* Floating pen */}
        <motion.div
          className="absolute -top-4 -right-4"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <PenLine className="w-8 h-8 text-earth-500 dark:text-earth-400" />
        </motion.div>

        {/* Sparkles */}
        <motion.div
          className="absolute -top-2 left-4"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-gold-400" />
        </motion.div>
      </div>
    </motion.div>
  </div>
);

/**
 * Search Empty State Illustration
 */
const SearchIllustration = () => (
  <div className="relative w-48 h-48">
    <div className="absolute inset-0 bg-blue-200/30 dark:bg-blue-800/30 rounded-full blur-2xl" />
    
    <motion.div
      className="relative flex items-center justify-center w-full h-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        <motion.div
          animate={{ x: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Search className="w-24 h-24 text-gray-300 dark:text-gray-600" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-2 -right-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Cloud className="w-12 h-12 text-gray-200 dark:text-gray-700" />
        </motion.div>
      </div>
    </motion.div>
  </div>
);

/**
 * Garden Empty State Illustration
 */
const GardenIllustration = () => (
  <div className="relative w-48 h-48">
    <div className="absolute inset-0 bg-sage-200/30 dark:bg-sage-800/30 rounded-full blur-2xl" />
    
    <motion.div
      className="relative flex items-center justify-center w-full h-full"
    >
      <div className="relative">
        {/* Pot */}
        <div className="w-24 h-16 bg-gradient-to-b from-earth-400 to-earth-500 rounded-b-3xl" />
        
        {/* Soil */}
        <div className="absolute top-0 left-2 right-2 h-4 bg-earth-600 rounded-full -translate-y-1/2" />
        
        {/* Seed sprouting */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          initial={{ height: 0 }}
          animate={{ height: 30 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-1 bg-gradient-to-t from-green-500 to-green-400 h-full rounded-full" />
        </motion.div>
        
        {/* Sun */}
        <motion.div
          className="absolute -top-8 right-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="w-10 h-10 text-yellow-400" />
        </motion.div>

        {/* Floating hearts */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${30 + i * 20}%`, bottom: '100%' }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 1, 0] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: i * 0.8,
              repeatDelay: 2
            }}
          >
            <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

/**
 * Achievements Empty State Illustration
 */
const AchievementsIllustration = () => (
  <div className="relative w-48 h-48">
    <div className="absolute inset-0 bg-gold-200/30 dark:bg-gold-800/30 rounded-full blur-2xl" />
    
    <motion.div
      className="relative flex items-center justify-center w-full h-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        {/* Trophy silhouette */}
        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        
        {/* Orbiting stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%'
            }}
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5
            }}
          >
            <div 
              className="absolute"
              style={{
                transform: `translateX(${40 + i * 10}px) translateY(-50%)`
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              >
                <Sparkles className={`w-4 h-4 text-gold-${300 + i * 100}`} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

/**
 * Loading Spinner with Plant Theme
 */
export const PlantSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <Leaf className={`${sizes[size]} text-sage-500`} />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: 'radial-gradient(circle, rgba(104, 166, 125, 0.3) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};

/**
 * Progress Ring Component
 */
export const ProgressRing = ({ 
  progress = 0, 
  size = 80, 
  strokeWidth = 6,
  color = 'stroke-sage-500',
  bgColor = 'stroke-gray-200 dark:stroke-gray-700',
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Floating Action Button
 */
export const FloatingActionButton = ({ 
  icon: Icon, 
  onClick, 
  label,
  color = 'primary'
}) => {
  const colors = {
    primary: 'bg-sage-500 hover:bg-sage-600 text-white',
    gold: 'bg-gold-500 hover:bg-gold-600 text-white',
    rose: 'bg-rose-500 hover:bg-rose-600 text-white'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full shadow-luxury-lg
        flex items-center justify-center
        ${colors[color]}
        transition-colors duration-200
      `}
    >
      <Icon className="w-6 h-6" />
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </motion.button>
  );
};

export default {
  Skeleton,
  SkeletonCard,
  SkeletonPlant,
  EmptyState,
  PlantSpinner,
  ProgressRing,
  FloatingActionButton
};
