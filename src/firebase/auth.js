/**
 * Firebase Authentication utilities
 * Handles user registration, login, logout, and authentication state
 */

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password  
 * @param {string} displayName - User's display name
 * @returns {Promise<Object>} User object
 */
export const registerWithEmail = async (email, password, displayName) => {
  try {
    console.log('🔄 Starting registration for:', email);
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ User created:', user.uid);
    
    // Update user profile with display name
    await updateProfile(user, { displayName });
    console.log('✅ Profile updated with display name:', displayName);
    
    // Create user document in Firestore
    await createUserDocument(user);
    console.log('✅ User document created successfully');
    
    return user;
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
};

/**
 * Sign in user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object
 */
export const signInWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign in user with Google
 * @returns {Promise<Object>} User object
 */
export const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    
    // Create user document if it doesn't exist
    await createUserDocument(user);
    
    return user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Create user document in Firestore
 * @param {Object} user - Firebase user object
 * @returns {Promise<void>}
 */
export const createUserDocument = async (user) => {
  try {
    console.log('🔄 Creating user document for:', user.uid);
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    // Only create document if it doesn't exist
    if (!userSnap.exists()) {
      console.log('📝 Creating new user document...');
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous Gardener',
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        preferences: {
          theme: 'light',
          notifications: true,
          reminderTime: '20:00'
        }
      });
      console.log('✅ User document created successfully');
      
      // Initialize user's plant
      await initializeUserPlant(user.uid);
      console.log('✅ Plant initialized successfully');
    } else {
      console.log('📝 User document already exists, updating last active...');
      // Update last active timestamp
      await setDoc(userRef, {
        lastActive: serverTimestamp()
      }, { merge: true });
      console.log('✅ Last active timestamp updated');
    }
  } catch (error) {
    console.error('❌ Error creating user document:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Initialize user's plant document
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
export const initializeUserPlant = async (uid) => {
  try {
    console.log('🌱 Initializing plant for user:', uid);
    const plantRef = doc(db, 'users', uid, 'plant', 'current');
    
    await setDoc(plantRef, {
      stage: 'seed',
      health: 100,
      lastWatered: serverTimestamp(),
      lastEntryDate: null,
      daysSinceLastEntry: 0,
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      flowers: [],
      fruits: [],
      specialEffects: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {
        timeToNextStage: 1, // Days needed for next stage
        growthPoints: 0,
        wiltingStarted: false,
        lastGrowthCheck: serverTimestamp()
      }
    });
    console.log('✅ Plant document created successfully');
  } catch (error) {
    console.error('❌ Error initializing plant:', error);
    console.error('Plant error details:', {
      code: error.code,
      message: error.message,
      uid: uid
    });
    throw error;
  }
};