/**
 * Reward Notification Component
 * Displays floating notifications for earned rewards
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Sparkles } from 'lucide-react';

/**
 * Reward Notification Component
 * @param {Object} props - Component props
 * @param {Array} props.rewards - Array of reward objects
 * @param {Function} props.onComplete - Callback when all notifications are shown
 */
const RewardNotification = ({ rewards = [], onComplete }) => {
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (rewards.length === 0) return;

    // Show the first reward
    setIsVisible(true);

    const showNextReward = () => {
      if (currentRewardIndex < rewards.length - 1) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentRewardIndex(prev => prev + 1);
          setIsVisible(true);
        }, 300);
      } else {
        // All rewards shown
        setIsVisible(false);
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    };

    const timer = setTimeout(showNextReward, 3000);
    return () => clearTimeout(timer);
  }, [currentRewardIndex, rewards.length, onComplete]);

  if (rewards.length === 0) return null;

  const currentReward = rewards[currentRewardIndex];

  const getRewardIcon = (type) => {
    switch (type) {
      case 'flower':
        return '🌸';
      case 'fruit':
        return '🍎';
      case 'streak':
        return '🔥';
      case 'milestone':
        return '🏆';
      default:
        return '✨';
    }
  };

  const getRewardMessage = (reward) => {
    switch (reward.type) {
      case 'flower':
        return {
          title: 'A Flower Blooms!',
          message: `Your ${reward.streak}-day streak has earned you a beautiful ${reward.flowerType} flower.`
        };
      case 'fruit':
        return {
          title: 'Sweet Rewards!',
          message: `Your dedication has grown a ${reward.fruitType}! Keep nurturing your garden.`
        };
      case 'streak':
        return {
          title: 'Streak Milestone!',
          message: `${reward.days} days of mindful reflection. Your consistency is inspiring!`
        };
      case 'milestone':
        return {
          title: 'Garden Milestone!',
          message: reward.message || 'You\'ve reached an important milestone in your journey.'
        };
      case 'stage':
        return {
          title: 'Growth Achieved!',
          message: `Your plant has grown to the ${reward.newStage} stage. Beautiful progress!`
        };
      default:
        return {
          title: 'Garden Gift!',
          message: 'Your mindful practice has earned you a special reward.'
        };
    }
  };

  const rewardInfo = getRewardMessage(currentReward);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-sage-100 p-6 relative overflow-hidden">
            {/* Background animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sage-50 to-earth-50 opacity-50"
              animate={{
                background: [
                  'linear-gradient(to right, #f6f7f6, #faf7f0)',
                  'linear-gradient(to right, #e3e6e3, #f3ead8)',
                  'linear-gradient(to right, #f6f7f6, #faf7f0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-3xl">
                  {getRewardIcon(currentReward.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {rewardInfo.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {rewardInfo.message}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
              </div>

              {/* Progress indicator */}
              {rewards.length > 1 && (
                <div className="flex items-center space-x-1 mt-4">
                  {rewards.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        index <= currentRewardIndex ? 'bg-sage-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  initial={{
                    x: Math.random() * 200,
                    y: Math.random() * 100 + 50,
                    opacity: 0
                  }}
                  animate={{
                    y: [null, -20],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardNotification;