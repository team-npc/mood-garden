/**
 * Test Accounts Generator Page
 * Create test accounts with pre-populated data
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Users, Loader, CheckCircle, XCircle } from 'lucide-react';

const TEST_ACCOUNTS = [
  {
    email: 'tree.gardener@test.com',
    password: 'Test123456',
    displayName: 'Tree Gardener',
    streak: 30,
    stage: 'tree',
    description: '30-day streak with mature tree',
    icon: '🌳'
  },
  {
    email: 'fruiting.master@test.com',
    password: 'Test123456',
    displayName: 'Fruiting Master',
    streak: 45,
    stage: 'fruitingTree',
    description: '45-day streak with fruiting tree',
    icon: '🍎'
  },
  {
    email: 'blooming.soul@test.com',
    password: 'Test123456',
    displayName: 'Blooming Soul',
    streak: 15,
    stage: 'blooming',
    description: '15-day streak with blooming plant',
    icon: '🌸'
  }
];

const ENTRY_TEMPLATES = [
  { content: "Today was a beautiful day. I spent time in nature and felt grateful for the simple things in life.", mood: "😌" },
  { content: "Reflecting on my progress and feeling proud of how far I've come. Growth takes time and patience.", mood: "✨" },
  { content: "Practiced mindfulness during my morning walk. The fresh air and sunshine lifted my spirits.", mood: "💚" },
  { content: "Had a meaningful conversation with a friend today. Connection with others brings such joy.", mood: "🌟" },
  { content: "Accomplished something I'd been putting off. It feels good to take action on my goals.", mood: "🌱" },
  { content: "Took time to rest and recharge today. Sometimes doing nothing is exactly what we need.", mood: "😊" },
  { content: "Learned something new and exciting. The joy of discovery never gets old.", mood: "🎯" },
  { content: "Felt challenged today but pushed through. Proud of my resilience and determination.", mood: "💪" },
  { content: "Enjoyed a quiet evening with a good book. These peaceful moments are precious.", mood: "📚" },
  { content: "Cooked a delicious meal and shared it with loved ones. Food and love, the perfect combination.", mood: "🍲" }
];

const TestAccountsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [createdAccounts, setCreatedAccounts] = useState([]);
  const navigate = useNavigate();

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: Date.now() }]);
  };

  const createEntriesForStreak = async (uid, streakDays) => {
    addLog(`Creating ${streakDays} days of entries...`, 'info');
    const entriesRef = collection(db, 'users', uid, 'entries');
    
    for (let i = streakDays - 1; i >= 0; i--) {
      const daysAgo = i;
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - daysAgo);
      entryDate.setHours(20, 0, 0, 0);
      
      const template = ENTRY_TEMPLATES[Math.floor(Math.random() * ENTRY_TEMPLATES.length)];
      
      const entryData = {
        content: `Day ${streakDays - i} reflection: ${template.content}`,
        mood: template.mood,
        createdAt: Timestamp.fromDate(entryDate),
        wordCount: template.content.split(/\s+/).length,
        characterCount: template.content.length
      };
      
      const entryDoc = doc(entriesRef);
      await setDoc(entryDoc, entryData);
      
      if ((streakDays - i) % 10 === 0) {
        addLog(`  Created entry ${streakDays - i}/${streakDays}`, 'info');
      }
    }
    
    addLog(`✅ Created ${streakDays} entries`, 'success');
  };

  const createPlantDocument = async (uid, streakDays, desiredStage) => {
    addLog(`Creating plant with stage: ${desiredStage}`, 'info');
    const plantRef = doc(db, 'users', uid, 'plant', 'current');
    
    const growthPoints = streakDays;
    
    const flowers = [];
    const flowerMilestones = Math.floor(streakDays / 3);
    const flowerTypes = ['cherry', 'daisy', 'rose', 'sunflower', 'tulip'];
    
    for (let i = 0; i < Math.min(flowerMilestones, 10); i++) {
      flowers.push({
        type: flowerTypes[i % flowerTypes.length],
        earnedAt: Timestamp.fromDate(new Date()),
        streak: (i + 1) * 3
      });
    }
    
    const fruits = [];
    if (desiredStage === 'fruitingTree') {
      const fruitMilestones = Math.floor(streakDays / 5);
      const fruitTypes = ['apple', 'orange', 'pear', 'plum', 'cherry'];
      
      for (let i = 0; i < Math.min(fruitMilestones, 8); i++) {
        fruits.push({
          type: fruitTypes[i % fruitTypes.length],
          earnedAt: Timestamp.fromDate(new Date()),
          streak: (i + 1) * 5
        });
      }
    }
    
    const lastEntryDate = new Date();
    lastEntryDate.setHours(20, 0, 0, 0);
    
    const plantData = {
      stage: desiredStage,
      health: 100,
      lastWatered: Timestamp.fromDate(lastEntryDate),
      lastEntryDate: Timestamp.fromDate(lastEntryDate),
      daysSinceLastEntry: 0,
      totalEntries: streakDays,
      currentStreak: streakDays,
      longestStreak: streakDays,
      flowers: flowers,
      fruits: fruits,
      specialEffects: [],
      createdAt: Timestamp.fromDate(new Date(Date.now() - streakDays * 24 * 60 * 60 * 1000)),
      updatedAt: serverTimestamp(),
      metadata: {
        timeToNextStage: 1,
        growthPoints: growthPoints,
        wiltingStarted: false,
        lastGrowthCheck: serverTimestamp()
      }
    };
    
    await setDoc(plantRef, plantData);
    addLog(`✅ Plant created: ${desiredStage} (${flowers.length} flowers, ${fruits.length} fruits)`, 'success');
  };

  const createTestAccount = async (accountConfig) => {
    addLog(`\n${'='.repeat(40)}`, 'info');
    addLog(`Creating: ${accountConfig.displayName}`, 'info');
    addLog(`Email: ${accountConfig.email}`, 'info');
    addLog(`${'='.repeat(40)}\n`, 'info');
    
    try {
      let userCredential;
      try {
        addLog('Checking if account exists...', 'info');
        userCredential = await signInWithEmailAndPassword(
          auth,
          accountConfig.email,
          accountConfig.password
        );
        addLog('✅ Account already exists, using existing account', 'success');
      } catch (signInError) {
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          addLog('Creating new account...', 'info');
          userCredential = await createUserWithEmailAndPassword(
            auth,
            accountConfig.email,
            accountConfig.password
          );
          addLog('✅ Account created successfully', 'success');
        } else {
          throw signInError;
        }
      }
      
      const user = userCredential.user;
      
      await createEntriesForStreak(user.uid, accountConfig.streak);
      await createPlantDocument(user.uid, accountConfig.streak, accountConfig.stage);
      
      addLog(`\n✅ "${accountConfig.displayName}" is ready!`, 'success');
      addLog(`   Stage: ${accountConfig.stage}`, 'success');
      addLog(`   Streak: ${accountConfig.streak} days\n`, 'success');
      
      return { ...accountConfig, success: true };
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
      return { ...accountConfig, success: false, error: error.message };
    }
  };

  const handleCreateAccounts = async () => {
    setIsCreating(true);
    setLogs([]);
    setCreatedAccounts([]);
    
    addLog('🌱 MOOD GARDEN TEST ACCOUNT GENERATOR 🌱\n', 'success');
    addLog(`Creating ${TEST_ACCOUNTS.length} test accounts...\n`, 'info');
    
    const results = [];
    
    for (const accountConfig of TEST_ACCOUNTS) {
      try {
        const result = await createTestAccount(accountConfig);
        results.push(result);
      } catch (error) {
        addLog(`Failed to create ${accountConfig.email}, continuing...`, 'error');
        results.push({ ...accountConfig, success: false, error: error.message });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    addLog('\n' + '='.repeat(40), 'success');
    addLog('🎉 PROCESS COMPLETE! 🎉', 'success');
    addLog('='.repeat(40) + '\n', 'success');
    
    setCreatedAccounts(results);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
            🌱 Test Account Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create pre-populated test accounts with journal entries and plant growth
          </p>
        </div>

        {/* Account Preview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {TEST_ACCOUNTS.map((account) => (
            <div key={account.email} className="card text-center">
              <div className="text-4xl mb-2">{account.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {account.displayName}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {account.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {account.streak} days • {account.stage}
              </div>
            </div>
          ))}
        </div>

        {/* Create Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCreateAccounts}
            disabled={isCreating}
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            {isCreating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creating Accounts...</span>
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                <span>Create Test Accounts</span>
              </>
            )}
          </button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="card bg-gray-900 mb-8">
            <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'success' ? 'text-green-400' :
                    'text-blue-300'
                  }`}
                >
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created Accounts */}
        {createdAccounts.length > 0 && (
          <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Login Credentials
            </h3>
            <div className="space-y-4">
              {createdAccounts.map((account) => (
                <div
                  key={account.email}
                  className={`p-4 rounded-lg ${
                    account.success
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {account.icon} {account.displayName}
                    </span>
                    {account.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Email:</span>{' '}
                      <span className="font-mono text-gray-900 dark:text-gray-100">
                        {account.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Password:</span>{' '}
                      <span className="font-mono text-gray-900 dark:text-gray-100">
                        {account.password}
                      </span>
                    </div>
                    {account.success && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {account.description}
                      </div>
                    )}
                    {!account.success && (
                      <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Error: {account.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAccountsPage;
