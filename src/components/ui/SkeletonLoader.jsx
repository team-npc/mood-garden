/**
 * Skeleton Loader Components
 * Consistent loading states with dark mode support
 */

import React from 'react';

/**
 * Base Skeleton Component
 */
const Skeleton = ({ className = '', animate = true }) => (
  <div 
    className={`
      bg-sage-200 dark:bg-deep-600 rounded
      ${animate ? 'animate-pulse' : ''}
      ${className}
    `}
  />
);

/**
 * Text Line Skeleton
 */
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

/**
 * Avatar Skeleton
 */
export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return <Skeleton className={`${sizes[size]} rounded-full ${className}`} />;
};

/**
 * Card Skeleton
 */
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-deep-700 rounded-2xl p-6 border border-sage-200 dark:border-deep-500 ${className}`}>
    <div className="flex items-start gap-4">
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <SkeletonText lines={3} />
      </div>
    </div>
  </div>
);

/**
 * Journal Entry Skeleton
 */
export const SkeletonJournalEntry = ({ className = '' }) => (
  <div className={`bg-white dark:bg-deep-700 rounded-2xl p-5 border border-sage-200 dark:border-deep-500 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
    <SkeletonText lines={4} />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  </div>
);

/**
 * Stats Card Skeleton
 */
export const SkeletonStats = ({ className = '' }) => (
  <div className={`bg-white dark:bg-deep-700 rounded-2xl p-6 border border-sage-200 dark:border-deep-500 ${className}`}>
    <Skeleton className="h-5 w-24 mb-4" />
    <Skeleton className="h-12 w-20 mb-2" />
    <Skeleton className="h-3 w-32" />
  </div>
);

/**
 * Sidebar Skeleton
 */
export const SkeletonSidebar = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    <div className="bg-white dark:bg-deep-700 rounded-2xl p-5 border border-sage-200 dark:border-deep-500">
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
    <div className="bg-white dark:bg-deep-700 rounded-2xl p-5 border border-sage-200 dark:border-deep-500">
      <Skeleton className="h-5 w-28 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Full Page Loading Skeleton for Journal
 */
export const JournalPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white dark:from-deep-900 dark:to-deep-800 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="bg-white dark:bg-deep-700 rounded-2xl p-5 border border-sage-200 dark:border-deep-500">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          
          {/* Entries */}
          <div className="space-y-4">
            <SkeletonJournalEntry />
            <SkeletonJournalEntry />
            <SkeletonJournalEntry />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SkeletonSidebar />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
