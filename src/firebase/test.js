// Simple Firestore test - you can delete this file after testing
import { db, auth } from './config';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { addJournalEntry } from './firestore';

export const testFirestore = async () => {
  try {
    console.log('🧪 Testing Firestore connection...');
    
    // Test write
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      message: 'Hello Firestore!',
      timestamp: new Date(),
      test: true
    });
    console.log('✅ Write test successful');
    
    // Test read
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      console.log('✅ Read test successful:', docSnap.data());
    } else {
      console.log('❌ Document not found');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return false;
  }
};

export const testJournalEntry = async () => {
  try {
    console.log('📝 Testing journal entry...');
    
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No authenticated user found');
      return false;
    }
    
    console.log('👤 Current user:', user.uid);
    
    // Test direct collection access
    console.log('🔄 Testing direct collection access...');
    const entriesRef = collection(db, 'users', user.uid, 'entries');
    const testEntry = await addDoc(entriesRef, {
      content: 'Test entry from debug function',
      mood: '🧪',
      createdAt: new Date(),
      wordCount: 6,
      characterCount: 32
    });
    console.log('✅ Direct entry creation successful:', testEntry.id);
    
    // Test using the app's function
    console.log('🔄 Testing app journal function...');
    const entryId = await addJournalEntry(user.uid, 'Test entry using app function', '🎯');
    console.log('✅ App function successful:', entryId);
    
    return true;
  } catch (error) {
    console.error('❌ Journal entry test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message
    });
    return false;
  }
};

// You can call these from browser console
window.testFirestore = testFirestore;
window.testJournalEntry = testJournalEntry;