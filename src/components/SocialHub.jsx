/**
 * Social Features Hub - Centralized social experience
 * Friend profiles, activity feed, group gardens, mood circles
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Heart,
  MessageCircle,
  TrendingUp,
  Award,
  Gift,
  Search,
  Filter,
  X,
  Settings,
  Bell,
  Share2,
  Crown,
  Star
} from 'lucide-react';

/**
 * Mock data generator for social features
 */
const generateMockFriends = () => [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarah_writes',
    avatar: '👩',
    streak: 45,
    level: 8,
    lastEntry: '2 hours ago',
    mood: '😊',
    isOnline: true,
    mutualFriends: 12,
    gardenScore: 850
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: 'mindful_mike',
    avatar: '👨',
    streak: 32,
    level: 6,
    lastEntry: '5 hours ago',
    mood: '😌',
    isOnline: true,
    mutualFriends: 8,
    gardenScore: 720
  },
  {
    id: '3',
    name: 'Emma Davis',
    username: 'emma_journals',
    avatar: '👧',
    streak: 67,
    level: 10,
    lastEntry: '1 day ago',
    mood: '😴',
    isOnline: false,
    mutualFriends: 15,
    gardenScore: 1050
  },
  {
    id: '4',
    name: 'Alex Rivera',
    username: 'alex_reflects',
    avatar: '🧑',
    streak: 21,
    level: 5,
    lastEntry: '3 hours ago',
    mood: '🤔',
    isOnline: true,
    mutualFriends: 6,
    gardenScore: 580
  }
];

const generateMockActivities = () => [
  {
    id: '1',
    user: { name: 'Sarah Johnson', avatar: '👩' },
    type: 'milestone',
    content: 'reached a 45-day streak! 🔥',
    timestamp: '2 hours ago',
    likes: 12,
    comments: 3
  },
  {
    id: '2',
    user: { name: 'Mike Chen', avatar: '👨' },
    type: 'entry',
    content: 'wrote a heartfelt entry about gratitude',
    timestamp: '5 hours ago',
    likes: 8,
    comments: 2
  },
  {
    id: '3',
    user: { name: 'Emma Davis', avatar: '👧' },
    type: 'achievement',
    content: 'unlocked the "Garden Sage" badge! 🏆',
    timestamp: '1 day ago',
    likes: 24,
    comments: 7
  },
  {
    id: '4',
    user: { name: 'Alex Rivera', avatar: '🧑' },
    type: 'challenge',
    content: 'completed the 30 Days of Gratitude challenge',
    timestamp: '1 day ago',
    likes: 15,
    comments: 4
  }
];

/**
 * Friend Card Component
 */
const FriendCard = ({ friend, onViewProfile, onSendGift, onSendEncouragement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-deep-700/50 border border-deep-600 rounded-xl p-4 hover:border-sage-500 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="text-4xl">{friend.avatar}</div>
            {friend.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-deep-700 rounded-full" />
            )}
          </div>
          <div>
            <h3 className="text-cream-200 font-medium">{friend.name}</h3>
            <p className="text-xs text-cream-500">@{friend.username}</p>
          </div>
        </div>
        {friend.level >= 10 && (
          <Crown className="w-5 h-5 text-yellow-400" />
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-deep-800/50 rounded-lg p-2 text-center">
          <div className="text-orange-400 font-bold">{friend.streak}</div>
          <div className="text-[10px] text-cream-600">Streak</div>
        </div>
        <div className="bg-deep-800/50 rounded-lg p-2 text-center">
          <div className="text-sage-400 font-bold">Lv {friend.level}</div>
          <div className="text-[10px] text-cream-600">Level</div>
        </div>
        <div className="bg-deep-800/50 rounded-lg p-2 text-center">
          <div className="text-purple-400 font-bold">{friend.gardenScore}</div>
          <div className="text-[10px] text-cream-600">Score</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3 text-xs text-cream-500">
        <span className="text-lg">{friend.mood}</span>
        <span>Last entry: {friend.lastEntry}</span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onViewProfile(friend)}
          className="flex-1 py-1.5 bg-sage-600 hover:bg-sage-500 text-white rounded-lg text-sm transition-colors"
        >
          View Garden
        </button>
        <button
          onClick={() => onSendEncouragement(friend)}
          className="p-1.5 bg-deep-600 hover:bg-deep-500 text-cream-300 rounded-lg transition-colors"
          title="Send encouragement"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSendGift(friend)}
          className="p-1.5 bg-deep-600 hover:bg-deep-500 text-cream-300 rounded-lg transition-colors"
          title="Send gift"
        >
          <Gift className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Activity Feed Component
 */
const ActivityFeedItem = ({ activity, onLike, onComment }) => {
  const [liked, setLiked] = useState(false);
  
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'milestone': return '🔥';
      case 'achievement': return '🏆';
      case 'entry': return '📝';
      case 'challenge': return '🎯';
      default: return '✨';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-deep-700/50 border border-deep-600 rounded-xl p-4 hover:border-deep-500 transition-all"
    >
      <div className="flex gap-3">
        <div className="text-3xl">{activity.user.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-cream-200">{activity.user.name}</span>
            <span className="text-cream-500 text-sm">{activity.content}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-cream-600 mb-2">
            <span>{activity.timestamp}</span>
            <span className="text-xl">{getActivityIcon()}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setLiked(!liked);
                onLike?.(activity.id);
              }}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? 'text-red-400' : 'text-cream-500 hover:text-cream-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{activity.likes + (liked ? 1 : 0)}</span>
            </button>
            <button
              onClick={() => onComment?.(activity.id)}
              className="flex items-center gap-1.5 text-sm text-cream-500 hover:text-cream-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{activity.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-cream-500 hover:text-cream-300 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Friend Profile Modal
 */
const FriendProfileModal = ({ friend, isOpen, onClose }) => {
  if (!isOpen || !friend) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-deep-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-sage-600 to-leaf-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{friend.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">{friend.name}</h2>
                <p className="text-sage-200">@{friend.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-deep-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl text-orange-400 font-bold mb-1">{friend.streak}</div>
              <div className="text-xs text-cream-500">Day Streak</div>
            </div>
            <div className="bg-deep-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl text-sage-400 font-bold mb-1">Lv {friend.level}</div>
              <div className="text-xs text-cream-500">Level</div>
            </div>
            <div className="bg-deep-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl text-purple-400 font-bold mb-1">{friend.gardenScore}</div>
              <div className="text-xs text-cream-500">Garden Score</div>
            </div>
            <div className="bg-deep-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl text-blue-400 font-bold mb-1">{friend.mutualFriends}</div>
              <div className="text-xs text-cream-500">Mutual</div>
            </div>
          </div>
          
          {/* Mock Garden Preview */}
          <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-xl p-6 mb-6">
            <h3 className="text-white font-medium mb-3">Their Garden</h3>
            <div className="flex justify-center">
              <div className="text-6xl animate-sway">🌳</div>
            </div>
            <p className="text-center text-green-200 mt-3 text-sm">
              A thriving garden with {friend.level} plants
            </p>
          </div>
          
          {/* Recent Achievements */}
          <div>
            <h3 className="text-cream-200 font-medium mb-3">Recent Achievements</h3>
            <div className="space-y-2">
              {[
                { icon: '🏆', title: 'Garden Keeper', date: '2 days ago' },
                { icon: '🔥', title: '30-Day Streak', date: '1 week ago' },
                { icon: '⭐', title: 'Consistent Writer', date: '2 weeks ago' }
              ].map((achievement, i) => (
                <div key={i} className="flex items-center gap-3 bg-deep-700/30 rounded-lg p-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="text-cream-200 text-sm">{achievement.title}</div>
                    <div className="text-cream-600 text-xs">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Main Social Hub Component
 */
const SocialHub = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  useEffect(() => {
    setFriends(generateMockFriends());
    setActivities(generateMockActivities());
  }, []);
  
  const handleViewProfile = (friend) => {
    setSelectedFriend(friend);
    setShowProfileModal(true);
  };
  
  const handleSendEncouragement = (friend) => {
    // Mock sending encouragement
    alert(`Sent encouragement to ${friend.name}! 💚`);
  };
  
  const handleSendGift = (friend) => {
    // Mock sending gift
    alert(`Sent a plant accessory to ${friend.name}! 🎁`);
  };
  
  if (!isOpen) return null;
  
  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-deep-800 rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-600 to-leaf-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Social Hub</h2>
                  <p className="text-sm text-sage-200">Connect with fellow gardeners</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white">
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-deep-700">
            {[
              { id: 'friends', icon: Users, label: 'Friends', count: friends.length },
              { id: 'activity', icon: TrendingUp, label: 'Activity', count: activities.length },
              { id: 'discover', icon: Search, label: 'Discover' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sage-500/20 text-sage-400 border-b-2 border-sage-500'
                    : 'text-cream-500 hover:text-cream-300 hover:bg-deep-700/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.count && (
                  <span className="px-1.5 py-0.5 bg-deep-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'friends' && (
              <div>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search friends..."
                      className="w-full pl-10 pr-4 py-2.5 bg-deep-700 border border-deep-600 rounded-xl text-cream-200 placeholder-cream-600 outline-none focus:border-sage-500"
                    />
                  </div>
                </div>
                
                {/* Friends Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {filteredFriends.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      onViewProfile={handleViewProfile}
                      onSendGift={handleSendGift}
                      onSendEncouragement={handleSendEncouragement}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                {activities.map((activity) => (
                  <ActivityFeedItem
                    key={activity.id}
                    activity={activity}
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'discover' && (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-cream-600 mx-auto mb-4" />
                <h3 className="text-xl text-cream-300 font-medium mb-2">Discover New Friends</h3>
                <p className="text-cream-500 mb-6">
                  Find like-minded journalers to connect with
                </p>
                <button className="px-6 py-2.5 bg-sage-600 hover:bg-sage-500 text-white rounded-xl transition-colors">
                  Browse Suggested Friends
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Friend Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <FriendProfileModal
            friend={selectedFriend}
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SocialHub;
