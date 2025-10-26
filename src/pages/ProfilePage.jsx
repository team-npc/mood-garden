/**
 * Profile Page Component
 * User settings, preferences, and account management
 */

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  LogOut, 
  Trash2,
  Download,
  Clock,
  Mail,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useJournal } from '../hooks/useJournal';
import { exportAsJSON } from '../utils/exportData';
import { recalculatePlantStage } from '../firebase/firestore';

/**
 * Profile Page Component
 */
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { entries } = useJournal();
  
  // Load notification settings from localStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('reminderTime') || '20:00';
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Handle theme change
   * @param {string} newTheme - New theme setting
   */
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  /**
   * Handle notification settings change
   * @param {boolean} enabled - Whether notifications are enabled
   */
  const handleNotificationChange = (enabled) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', JSON.stringify(enabled));
    
    if (enabled) {
      // Request notification permission if not already granted
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
            // Show a welcome notification
            new Notification('Mindful Reminders Enabled! 🌱', {
              body: `You'll receive gentle reminders at ${reminderTime} each day.`,
              icon: '/favicon.ico'
            });
          }
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        // Show confirmation notification
        new Notification('Reminders Activated! ✨', {
          body: `Daily reminder set for ${reminderTime}`,
          icon: '/favicon.ico'
        });
      }
    }
    
    console.log('Notifications:', enabled);
  };

  /**
   * Handle reminder time change
   * @param {string} time - New reminder time
   */
  const handleReminderTimeChange = (time) => {
    setReminderTime(time);
    localStorage.setItem('reminderTime', time);
    
    // Show feedback notification if enabled
    if (notifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Reminder Time Updated! ⏰', {
        body: `New reminder time: ${time}`,
        icon: '/favicon.ico'
      });
    }
    
    console.log('Reminder time:', time);
  };

  /**
   * Handle data export
   */
  const handleExportData = () => {
    try {
      const success = exportAsJSON(user, entries);
      
      if (success) {
        alert('✅ Your data has been exported successfully!');
      } else {
        alert('❌ Failed to export data. Please try again.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('❌ Failed to export data. Please try again.');
    }
  };

  /**
   * Handle plant recalculation (fix stuck plants)
   */
  const handleRecalculatePlant = async () => {
    try {
      console.log('Starting plant recalculation...');
      const newStage = await recalculatePlantStage(user.uid);
      console.log('Recalculation successful, new stage:', newStage);
      alert(`✅ Plant recalculated! New stage: ${newStage}\n\nPlease refresh the Garden page to see the updated plant.`);
      // Reload the page after a short delay to see the changes
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error recalculating plant:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      alert(`❌ Failed to recalculate plant: ${error.message}\n\nCheck the console for details.`);
    }
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = () => {
    // In a real app, you would show a proper confirmation flow
    console.log('Account deletion would be handled here');
    alert('Account deletion feature would be implemented here');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and customize your garden experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-1">
            <div className="card text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-sage-200 dark:border-sage-700 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-24 h-24 bg-gradient-to-br from-sage-100 to-earth-100 dark:from-sage-800 dark:to-earth-800 rounded-full flex items-center justify-center border-4 border-sage-200 dark:border-sage-700 shadow-lg ${user?.photoURL ? 'hidden' : 'flex'}`}
                  style={{ display: user?.photoURL ? 'none' : 'flex' }}
                >
                  <span className="text-4xl font-bold text-sage-600 dark:text-sage-300">
                    {(user?.displayName || user?.email || 'A')[0].toUpperCase()}
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {user?.displayName || 'Anonymous Gardener'}
              </h2>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  Member since {new Date(user?.metadata?.creationTime || new Date()).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="md:col-span-2 space-y-6">
            {/* Theme Settings */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  {theme === 'light' ? (
                    <Sun className="w-4 h-4 text-sage-600" />
                  ) : (
                    <Moon className="w-4 h-4 text-sage-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Theme Preference</h3>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'border-sage-500 bg-sage-50 text-sage-700 dark:bg-sage-900 dark:text-sage-200'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Sun className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">Light</div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'border-sage-500 bg-sage-50 text-sage-700 dark:bg-sage-900 dark:text-sage-200'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Moon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">Dark</div>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-sage-100 to-sage-200 dark:from-sage-900/40 dark:to-sage-800/40 rounded-xl flex items-center justify-center shadow-sm">
                  <Bell className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mindful Reminders</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gentle nudges for your journaling practice</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Main Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sage-50/50 to-earth-50/50 dark:from-gray-700/30 dark:to-gray-700/30 rounded-xl border border-sage-100 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      notifications 
                        ? 'bg-sage-100 dark:bg-sage-900/50 ring-2 ring-sage-300 dark:ring-sage-700' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Bell className={`w-6 h-6 transition-colors ${
                        notifications ? 'text-sage-600 dark:text-sage-400' : 'text-gray-400 dark:text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Enable Reminders</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {notifications ? 'Active - We\'ll remind you daily' : 'Paused - No reminders'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(!notifications)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
                      notifications 
                        ? 'bg-gradient-to-r from-sage-500 to-sage-600 shadow-sage-200 dark:shadow-sage-900' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                        notifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {/* Time Picker - Enhanced */}
                {notifications && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1 h-1 bg-sage-500 rounded-full"></div>
                      <span>Choose your preferred reminder time</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800/50 rounded-xl border-2 border-sage-200 dark:border-sage-700/50 shadow-sm">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Daily Reminder Time
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-1">
                            <input
                              type="time"
                              value={reminderTime}
                              onChange={(e) => handleReminderTimeChange(e.target.value)}
                              className="input-field pr-10 font-mono text-lg"
                            />
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-500 dark:text-sage-400 pointer-events-none" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          We'll send a gentle reminder at {reminderTime} each day
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Time Presets */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                        Quick Presets
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { time: '09:00', label: 'Morning', icon: '🌅' },
                          { time: '12:00', label: 'Noon', icon: '☀️' },
                          { time: '18:00', label: 'Evening', icon: '🌆' },
                          { time: '21:00', label: 'Night', icon: '🌙' }
                        ].map((preset) => (
                          <button
                            key={preset.time}
                            onClick={() => handleReminderTimeChange(preset.time)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              reminderTime === preset.time
                                ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30 dark:border-sage-600'
                                : 'border-gray-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-sage-700 bg-white dark:bg-gray-800/50'
                            }`}
                          >
                            <div className="text-xl mb-1">{preset.icon}</div>
                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{preset.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{preset.time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Info Box */}
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-blue-500 dark:text-blue-400 text-xl">💡</div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                          Why gentle reminders work
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          Consistent, mindful check-ins help build a sustainable journaling habit without pressure or guilt.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-sage-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Privacy & Data</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleExportData}
                  className="w-full btn-secondary text-left flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export My Data</span>
                </button>
                
                <button
                  onClick={handleRecalculatePlant}
                  className="w-full btn-secondary text-left flex items-center space-x-2"
                >
                  <span className="w-4 h-4">🌱</span>
                  <span>Fix Plant Growth</span>
                </button>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="font-medium mb-1 dark:text-gray-200">Your Privacy Matters</p>
                  <p>
                    All your journal entries are private and encrypted. 
                    We never share your personal thoughts with anyone.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-sage-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account Actions</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full btn-secondary text-left flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-left flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>

            {/* App Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About Mood Garden</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p><strong className="dark:text-gray-300">Version:</strong> 2.0.0</p>
                <p><strong className="dark:text-gray-300">Created with:</strong> React, Firebase, TailwindCSS</p>
                <p className="pt-2">
                  Mood Garden is designed to support your mental wellbeing through 
                  mindful journaling and gentle encouragement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone, 
              and all your journal entries and plant progress will be permanently lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;