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
  Mail,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Profile Page Component
 */
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');
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
    // In a real app, you would persist this to Firestore and update the UI
    console.log('Theme changed to:', newTheme);
  };

  /**
   * Handle notification settings change
   * @param {boolean} enabled - Whether notifications are enabled
   */
  const handleNotificationChange = (enabled) => {
    setNotifications(enabled);
    // In a real app, you would persist this to Firestore
    console.log('Notifications:', enabled);
  };

  /**
   * Handle reminder time change
   * @param {string} time - New reminder time
   */
  const handleReminderTimeChange = (time) => {
    setReminderTime(time);
    // In a real app, you would persist this to Firestore
    console.log('Reminder time:', time);
  };

  /**
   * Handle data export
   */
  const handleExportData = () => {
    // In a real app, you would fetch user data and create a downloadable file
    console.log('Exporting user data...');
    alert('Data export feature would be implemented here');
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600">
            Manage your account and customize your garden experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-1">
            <div className="card text-center">
              <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-sage-600" />
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.displayName || 'Anonymous Gardener'}
              </h2>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
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
                <h3 className="text-lg font-semibold text-gray-900">Theme Preference</h3>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex-1 p-3 rounded-lg border ${
                    theme === 'light'
                      ? 'border-sage-500 bg-sage-50 text-sage-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Sun className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">Light</div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex-1 p-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-sage-500 bg-sage-50 text-sage-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Moon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">Dark</div>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-sage-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Mindful Reminders</div>
                    <div className="text-sm text-gray-600">Get gentle reminders to journal</div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-sage-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {notifications && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => handleReminderTimeChange(e.target.value)}
                      className="input-field w-32"
                    />
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
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Data</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleExportData}
                  className="w-full btn-secondary text-left flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export My Data</span>
                </button>
                
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">Your Privacy Matters</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Mood Garden</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Version:</strong> 2.0.0</p>
                <p><strong>Created with:</strong> React, Firebase, TailwindCSS</p>
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 mb-6">
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