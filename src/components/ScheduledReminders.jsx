/**
 * Scheduled Reminders Component
 * Browser notification reminders for journaling
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  Clock, 
  Plus, 
  Trash2, 
  X, 
  Check,
  AlertCircle
} from 'lucide-react';

const REMINDERS_KEY = 'mood-garden-reminders';

/**
 * Default reminder times
 */
const DEFAULT_TIMES = [
  { id: 'morning', label: 'Morning', time: '09:00', enabled: false },
  { id: 'evening', label: 'Evening', time: '20:00', enabled: false },
  { id: 'custom', label: 'Custom', time: '12:00', enabled: false }
];

/**
 * Check if notifications are supported and permitted
 */
const checkNotificationSupport = () => {
  if (!('Notification' in window)) {
    return { supported: false, permission: 'denied' };
  }
  return { supported: true, permission: Notification.permission };
};

/**
 * Request notification permission
 */
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'denied';
  
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  
  const result = await Notification.requestPermission();
  return result;
};

/**
 * Show a test notification
 */
const showTestNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('🌱 Mood Garden', {
      body: 'Time to water your garden! Write a journal entry to help your plant grow.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'mood-garden-reminder',
      requireInteraction: false
    });
  }
};

/**
 * Schedule a notification for a specific time
 */
const scheduleNotification = (time, message = 'Time to journal!') => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  let scheduledTime = new Date(now);
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // If time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const delay = scheduledTime.getTime() - now.getTime();
  
  const timeoutId = setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('🌱 Mood Garden', {
        body: message,
        icon: '/favicon.ico',
        tag: 'mood-garden-reminder',
        requireInteraction: true
      });
    }
  }, delay);
  
  return timeoutId;
};

/**
 * Scheduled Reminders Modal
 */
const ScheduledReminders = ({ isOpen, onClose }) => {
  const [reminders, setReminders] = useState([]);
  const [notificationStatus, setNotificationStatus] = useState({ supported: false, permission: 'default' });
  const [activeTimeouts, setActiveTimeouts] = useState([]);
  const [newReminderTime, setNewReminderTime] = useState('12:00');

  // Load reminders and check notification support on mount
  useEffect(() => {
    const status = checkNotificationSupport();
    setNotificationStatus(status);
    
    const savedReminders = localStorage.getItem(REMINDERS_KEY);
    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {
        setReminders(DEFAULT_TIMES);
      }
    } else {
      setReminders(DEFAULT_TIMES);
    }
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    }
  }, [reminders]);

  // Schedule active reminders
  useEffect(() => {
    // Clear existing timeouts
    activeTimeouts.forEach(clearTimeout);
    
    if (notificationStatus.permission !== 'granted') return;
    
    const newTimeouts = [];
    reminders.filter(r => r.enabled).forEach(reminder => {
      const timeoutId = scheduleNotification(
        reminder.time, 
        `🌱 Time for your ${reminder.label.toLowerCase()} reflection!`
      );
      newTimeouts.push(timeoutId);
    });
    
    setActiveTimeouts(newTimeouts);
    
    return () => newTimeouts.forEach(clearTimeout);
  }, [reminders, notificationStatus.permission]);

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setNotificationStatus(prev => ({ ...prev, permission: result }));
  };

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const updateReminderTime = (id, time) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, time } : r
    ));
  };

  const addReminder = () => {
    const newReminder = {
      id: `custom-${Date.now()}`,
      label: `Reminder ${reminders.length}`,
      time: newReminderTime,
      enabled: true
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const removeReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-md w-full my-8 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Journaling Reminders</h2>
                <p className="text-sm text-cream-200">Never miss a reflection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification Permission Status */}
          {!notificationStatus.supported ? (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-2 text-red-300">
                <AlertCircle className="w-5 h-5" />
                <span>Notifications are not supported in this browser</span>
              </div>
            </div>
          ) : notificationStatus.permission === 'denied' ? (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-2 text-red-300">
                <BellOff className="w-5 h-5" />
                <div>
                  <span className="font-medium">Notifications blocked</span>
                  <p className="text-sm mt-1">Please enable notifications in your browser settings.</p>
                </div>
              </div>
            </div>
          ) : notificationStatus.permission !== 'granted' ? (
            <div className="p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-300">
                  <Bell className="w-5 h-5" />
                  <span>Enable notifications to receive reminders</span>
                </div>
                <button
                  onClick={handleRequestPermission}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Enable
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-300">
                  <Check className="w-5 h-5" />
                  <span>Notifications enabled</span>
                </div>
                <button
                  onClick={showTestNotification}
                  className="text-sm text-green-400 hover:text-green-300"
                >
                  Test notification
                </button>
              </div>
            </div>
          )}

          {/* Reminders List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-cream-100 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Scheduled Reminders</span>
            </h3>
            
            {reminders.map((reminder) => (
              <div 
                key={reminder.id}
                className={`p-4 rounded-xl border transition-all ${
                  reminder.enabled 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : 'bg-deep-700/50 border-deep-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      disabled={notificationStatus.permission !== 'granted'}
                      className={`w-10 h-6 rounded-full transition-colors relative ${
                        reminder.enabled ? 'bg-amber-500' : 'bg-deep-600'
                      } ${notificationStatus.permission !== 'granted' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span 
                        className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                          reminder.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <div>
                      <div className="font-medium text-cream-100">{reminder.label}</div>
                      <input
                        type="time"
                        value={reminder.time}
                        onChange={(e) => updateReminderTime(reminder.id, e.target.value)}
                        className="bg-transparent text-cream-400 text-sm outline-none"
                        disabled={notificationStatus.permission !== 'granted'}
                      />
                    </div>
                  </div>
                  
                  {reminder.id.startsWith('custom') && (
                    <button
                      onClick={() => removeReminder(reminder.id)}
                      className="p-2 text-cream-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Custom Reminder */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="bg-deep-700 border border-deep-500 rounded-xl px-4 py-2 text-cream-100"
              />
              <button
                onClick={addReminder}
                disabled={notificationStatus.permission !== 'granted'}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Reminder</span>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="text-sm text-cream-500 text-center">
            Reminders will trigger browser notifications at the scheduled times.
            Keep this tab open for reminders to work.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduledReminders;
