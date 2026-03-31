/**
 * Accountability Partners Component
 * Connect with friends for streak support
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users,
  UserPlus,
  Heart,
  MessageCircle,
  Bell,
  Flame,
  Trophy,
  Copy,
  Check,
  Send,
  Clock,
  Star
} from 'lucide-react';

/**
 * Generate mock partner data
 */
const generateMockPartners = () => [
  {
    id: 'partner-1',
    name: 'Garden Buddy',
    avatar: '🌻',
    streak: 15,
    lastActive: new Date().toISOString(),
    status: 'online',
    achievements: ['7-day streak', 'Early Bird', 'Night Owl'],
    encouragement: 'Keep going! You\'re doing amazing! 🌟'
  },
  {
    id: 'partner-2', 
    name: 'Mindful Friend',
    avatar: '🌸',
    streak: 8,
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    status: 'away',
    achievements: ['First Entry', 'Consistency King'],
    encouragement: 'Proud of your progress! 💪'
  }
];

/**
 * Partner Card Component
 */
const PartnerCard = ({ partner, onNudge, onMessage }) => {
  const [nudgeSent, setNudgeSent] = useState(false);
  
  const handleNudge = () => {
    onNudge(partner.id);
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-deep-700/50 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <span className="text-3xl">{partner.avatar}</span>
          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(partner.status)} border-2 border-deep-700`} />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-cream-200 font-medium">{partner.name}</h3>
            {partner.streak >= 7 && (
              <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Flame className="w-3 h-3" />
                {partner.streak}
              </span>
            )}
          </div>
          <p className="text-xs text-cream-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getTimeAgo(partner.lastActive)}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNudge}
            className={`p-2 rounded-lg transition-colors ${
              nudgeSent
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-deep-600 text-cream-400 hover:text-cream-200'
            }`}
            title="Send nudge"
          >
            {nudgeSent ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMessage(partner)}
            className="p-2 bg-deep-600 rounded-lg text-cream-400 hover:text-cream-200 transition-colors"
            title="Send message"
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="flex flex-wrap gap-1 mt-3">
        {partner.achievements.map((achievement, i) => (
          <span key={i} className="text-xs bg-deep-600/50 text-cream-400 px-2 py-0.5 rounded-full">
            {achievement}
          </span>
        ))}
      </div>
      
      {/* Encouragement */}
      {partner.encouragement && (
        <div className="mt-3 p-2 bg-pink-500/10 rounded-lg">
          <p className="text-sm text-pink-300 italic flex items-start gap-2">
            <Heart className="w-4 h-4 shrink-0 mt-0.5" />
            "{partner.encouragement}"
          </p>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Invite Section
 */
const InviteSection = () => {
  const [copied, setCopied] = useState(false);
  const inviteCode = 'MOOD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-xl p-4 border border-violet-500/30">
      <div className="flex items-center gap-2 mb-2">
        <UserPlus className="w-5 h-5 text-violet-400" />
        <h3 className="text-cream-200 font-medium">Invite a Friend</h3>
      </div>
      <p className="text-sm text-cream-400 mb-3">
        Share your invite code to connect with an accountability partner
      </p>
      <div className="flex gap-2">
        <div className="flex-1 bg-deep-700 rounded-lg px-3 py-2 font-mono text-cream-200 text-center">
          {inviteCode}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyCode}
          className="px-4 py-2 bg-violet-500 hover:bg-violet-400 text-white rounded-lg flex items-center gap-1"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
      </div>
    </div>
  );
};

/**
 * Join Section
 */
const JoinSection = ({ onJoin }) => {
  const [code, setCode] = useState('');
  
  const handleJoin = () => {
    if (code.trim().length >= 4) {
      onJoin(code.trim().toUpperCase());
      setCode('');
    }
  };
  
  return (
    <div className="bg-deep-700/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-sage-400" />
        <h3 className="text-cream-200 font-medium">Join with Code</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter invite code"
          className="flex-1 bg-deep-600 border border-deep-500 rounded-lg px-3 py-2 text-cream-200 placeholder-cream-600 outline-none focus:border-sage-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoin}
          disabled={code.length < 4}
          className="px-4 py-2 bg-sage-500 hover:bg-sage-400 text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
        >
          <UserPlus className="w-4 h-4" />
          Join
        </motion.button>
      </div>
    </div>
  );
};

/**
 * Message Modal
 */
const MessageModal = ({ partner, onClose, onSend }) => {
  const [message, setMessage] = useState('');
  
  const quickMessages = [
    "Don't forget to journal today! 📝",
    "You've got this! 💪",
    "Thinking of you! 💕",
    "Keep up the great work! ⭐"
  ];
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(partner.id, message);
      onClose();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-deep-800 rounded-2xl w-full max-w-md p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{partner.avatar}</span>
            <span className="text-cream-200 font-medium">{partner.name}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-deep-600 rounded-lg">
            <X className="w-5 h-5 text-cream-400" />
          </button>
        </div>
        
        {/* Quick messages */}
        <div className="flex flex-wrap gap-1 mb-3">
          {quickMessages.map((msg, i) => (
            <button
              key={i}
              onClick={() => setMessage(msg)}
              className="text-xs bg-deep-700 hover:bg-deep-600 text-cream-400 px-2 py-1 rounded-full"
            >
              {msg}
            </button>
          ))}
        </div>
        
        {/* Message input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-deep-700 border border-deep-600 rounded-lg px-3 py-2 text-cream-200 placeholder-cream-600 outline-none focus:border-sage-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-sage-500 hover:bg-sage-400 text-white rounded-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Main Accountability Partners Component
 */
const AccountabilityPartners = ({ isOpen, onClose, userStreak = 0 }) => {
  const [partners, setPartners] = useState([]);
  const [messagePartner, setMessagePartner] = useState(null);
  
  // Load partners
  useEffect(() => {
    const saved = localStorage.getItem('accountabilityPartners');
    if (saved) {
      setPartners(JSON.parse(saved));
    } else {
      // Start with mock data for demo
      const mock = generateMockPartners();
      setPartners(mock);
      localStorage.setItem('accountabilityPartners', JSON.stringify(mock));
    }
  }, []);
  
  const handleNudge = (partnerId) => {
    // In real app, this would send a notification
    console.log('Nudge sent to', partnerId);
  };
  
  const handleMessage = (partnerId, message) => {
    // In real app, this would send a message
    console.log('Message to', partnerId, ':', message);
  };
  
  const handleJoin = (code) => {
    // In real app, this would validate the code and add partner
    const newPartner = {
      id: `partner-${Date.now()}`,
      name: 'New Buddy',
      avatar: ['🌷', '🌺', '🌹', '🌼'][Math.floor(Math.random() * 4)],
      streak: 0,
      lastActive: new Date().toISOString(),
      status: 'online',
      achievements: [],
      encouragement: null
    };
    
    const updated = [...partners, newPartner];
    setPartners(updated);
    localStorage.setItem('accountabilityPartners', JSON.stringify(updated));
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
          className="bg-deep-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-violet-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Accountability Partners</h2>
                  <p className="text-sm text-pink-200">Support each other's journey</p>
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
          
          <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4">
            {/* Your Stats */}
            <div className="bg-deep-700/50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-cream-400 text-sm">Your current streak</p>
                <p className="text-2xl font-bold text-cream-200 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  {userStreak} days
                </p>
              </div>
              <div className="text-right">
                <p className="text-cream-400 text-sm">Partners</p>
                <p className="text-2xl font-bold text-cream-200">{partners.length}</p>
              </div>
            </div>
            
            {/* Partners List */}
            {partners.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-cream-200 font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  Your Partners
                </h3>
                {partners.map(partner => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    onNudge={handleNudge}
                    onMessage={setMessagePartner}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-cream-600 mx-auto mb-3" />
                <h3 className="text-cream-300 font-medium mb-1">No partners yet</h3>
                <p className="text-cream-500 text-sm">
                  Invite a friend or join with a code below
                </p>
              </div>
            )}
            
            {/* Invite Section */}
            <InviteSection />
            
            {/* Join Section */}
            <JoinSection onJoin={handleJoin} />
            
            {/* Benefits */}
            <div className="bg-deep-700/30 rounded-xl p-4">
              <h3 className="text-cream-200 font-medium mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Benefits of Partners
              </h3>
              <ul className="space-y-1 text-sm text-cream-400">
                <li>• Get reminded to journal when you forget</li>
                <li>• Celebrate streaks together</li>
                <li>• Share encouragement on tough days</li>
                <li>• Stay motivated through accountability</li>
              </ul>
            </div>
          </div>
        </motion.div>
        
        {/* Message Modal */}
        <AnimatePresence>
          {messagePartner && (
            <MessageModal
              partner={messagePartner}
              onClose={() => setMessagePartner(null)}
              onSend={handleMessage}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountabilityPartners;
