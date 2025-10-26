/**
 * Create Test Accounts Script
 * Run this to create test accounts with pre-populated data
 */

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
import { auth, db } from './config.js';

/**
 * Test account configurations
 */
const TEST_ACCOUNTS = [
  {
    email: 'tree.gardener@test.com',
    password: 'Test123456',
    displayName: 'Tree Gardener',
    streak: 30,
    stage: 'tree',
    description: '30-day streak with mature tree'
  },
  {
    email: 'fruiting.master@test.com',
    password: 'Test123456',
    displayName: 'Fruiting Master',
    streak: 45,
    stage: 'fruitingTree',
    description: '45-day streak with fruiting tree'
  },
  {
    email: 'blooming.soul@test.com',
    password: 'Test123456',
    displayName: 'Blooming Soul',
    streak: 15,
    stage: 'blooming',
    description: '15-day streak with blooming plant'
  }
];

/**
 * Journal entry templates for variety
 */
const ENTRY_TEMPLATES = [
  {
    content: "Today was a beautiful day. I spent time in nature and felt grateful for the simple things in life.",
    mood: "😌"
  },
  {
    content: "Reflecting on my progress and feeling proud of how far I've come. Growth takes time and patience.",
    mood: "✨"
  },
  {
    content: "Practiced mindfulness during my morning walk. The fresh air and sunshine lifted my spirits.",
    mood: "💚"
  },
  {
    content: "Had a meaningful conversation with a friend today. Connection with others brings such joy.",
    mood: "🌟"
  },
  {
    content: "Accomplished something I'd been putting off. It feels good to take action on my goals.",
    mood: "🌱"
  },
  {
    content: "Took time to rest and recharge today. Sometimes doing nothing is exactly what we need.",
    mood: "😊"
  },
  {
    content: "Learned something new and exciting. The joy of discovery never gets old.",
    mood: "🎯"
  },
  {
    content: "Felt challenged today but pushed through. Proud of my resilience and determination.",
    mood: "💪"
  },
  {
    content: "Enjoyed a quiet evening with a good book. These peaceful moments are precious.",
    mood: "📚"
  },
  {
    content: "Cooked a delicious meal and shared it with loved ones. Food and love, the perfect combination.",
    mood: "🍲"
  }
];

/**
 * Create entries for the past N days
 */
const createEntriesForStreak = async (uid, streakDays) => {
  console.log(`Creating ${streakDays} days of entries...`);
  const entriesRef = collection(db, 'users', uid, 'entries');
  
  for (let i = streakDays - 1; i >= 0; i--) {
    const daysAgo = i;
    const entryDate = new Date();
    entryDate.setDate(entryDate.getDate() - daysAgo);
    entryDate.setHours(20, 0, 0, 0); // 8 PM each day
    
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
      console.log(`  Created entry ${streakDays - i}/${streakDays}`);
    }
  }
  
  console.log(`✅ Created ${streakDays} entries`);
};

/**
 * Calculate plant stage based on growth
 */
const calculateStage = (growthPoints, streak) => {
  if (growthPoints >= 40 && streak >= 10) return 'fruitingTree';
  if (growthPoints >= 25 && streak >= 7) return 'tree';
  if (growthPoints >= 15 && streak >= 5) return 'blooming';
  if (growthPoints >= 7 && streak >= 3) return 'plant';
  if (growthPoints >= 3 && streak >= 2) return 'sprout';
  return 'seed';
};

/**
 * Create plant document with proper stage
 */
const createPlantDocument = async (uid, streakDays, desiredStage) => {
  console.log(`Creating plant with stage: ${desiredStage}`);
  const plantRef = doc(db, 'users', uid, 'plant', 'current');
  
  const growthPoints = streakDays;
  const calculatedStage = calculateStage(growthPoints, streakDays);
  const stage = desiredStage || calculatedStage;
  
  // Generate flowers for streak milestones
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
  
  // Generate fruits for longer streaks
  const fruits = [];
  if (stage === 'fruitingTree') {
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
    stage: stage,
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
  console.log(`✅ Plant created: ${stage} (${flowers.length} flowers, ${fruits.length} fruits)`);
};

/**
 * Create a single test account
 */
const createTestAccount = async (accountConfig) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Creating test account: ${accountConfig.displayName}`);
  console.log(`Email: ${accountConfig.email}`);
  console.log(`Description: ${accountConfig.description}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    // Try to sign in first (in case account already exists)
    let userCredential;
    try {
      console.log('Checking if account exists...');
      userCredential = await signInWithEmailAndPassword(
        auth,
        accountConfig.email,
        accountConfig.password
      );
      console.log('✅ Account already exists, using existing account');
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
        console.log('Creating new account...');
        userCredential = await createUserWithEmailAndPassword(
          auth,
          accountConfig.email,
          accountConfig.password
        );
        console.log('✅ Account created successfully');
      } else {
        throw signInError;
      }
    }
    
    const user = userCredential.user;
    
    // Create entries
    await createEntriesForStreak(user.uid, accountConfig.streak);
    
    // Create plant
    await createPlantDocument(user.uid, accountConfig.streak, accountConfig.stage);
    
    console.log(`\n✅ Test account "${accountConfig.displayName}" is ready!`);
    console.log(`   📧 Email: ${accountConfig.email}`);
    console.log(`   🔑 Password: ${accountConfig.password}`);
    console.log(`   🌳 Stage: ${accountConfig.stage}`);
    console.log(`   🔥 Streak: ${accountConfig.streak} days`);
    console.log(`   📝 Entries: ${accountConfig.streak}`);
    
  } catch (error) {
    console.error(`❌ Error creating account ${accountConfig.email}:`, error.message);
    throw error;
  }
};

/**
 * Main function to create all test accounts
 */
export const createAllTestAccounts = async () => {
  console.log('\n🌱 MOOD GARDEN TEST ACCOUNT GENERATOR 🌱\n');
  console.log(`Creating ${TEST_ACCOUNTS.length} test accounts...\n`);
  
  for (const accountConfig of TEST_ACCOUNTS) {
    try {
      await createTestAccount(accountConfig);
    } catch (error) {
      console.error(`Failed to create ${accountConfig.email}, continuing...`);
    }
    
    // Wait a bit between accounts to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ALL TEST ACCOUNTS CREATED SUCCESSFULLY! 🎉');
  console.log('='.repeat(60));
  console.log('\nYou can now log in with any of these accounts:');
  TEST_ACCOUNTS.forEach(account => {
    console.log(`\n📧 ${account.email}`);
    console.log(`🔑 ${account.password}`);
    console.log(`🌳 ${account.description}`);
  });
  console.log('\n');
};

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAllTestAccounts()
    .then(() => {
      console.log('Done! You can now close this window.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
