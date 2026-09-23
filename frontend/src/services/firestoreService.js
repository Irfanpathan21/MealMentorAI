import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Save or update user health profile & clinical targets
 */
export const saveUserProfile = async (uid, profileData) => {
  if (!uid) return { success: false, error: 'No user ID provided' };
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        ...profileData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error('Firestore saveUserProfile error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Retrieve user profile from Firestore
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Firestore getUserProfile error:', error);
    return null;
  }
};

/**
 * Log a meal entry into the user's meals subcollection
 */
export const logMeal = async (uid, mealData) => {
  if (!uid) return { success: false, error: 'User must be authenticated' };
  try {
    const mealsCol = collection(db, 'users', uid, 'meals');
    const docRef = await addDoc(mealsCol, {
      ...mealData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Firestore logMeal error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Real-time listener for user profile updates
 */
export const subscribeToUserProfile = (uid, callback) => {
  if (!uid) return () => {};
  const userDocRef = doc(db, 'users', uid);
  return onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    },
    (err) => console.error('Firestore profile listen error:', err)
  );
};

/**
 * Real-time listener for recently logged meals
 */
export const subscribeToMeals = (uid, callback) => {
  if (!uid) return () => {};
  const mealsCol = collection(db, 'users', uid, 'meals');
  const q = query(mealsCol, orderBy('createdAt', 'desc'), limit(15));
  return onSnapshot(
    q,
    (snapshot) => {
      const meals = [];
      snapshot.forEach((doc) => {
        meals.push({ id: doc.id, ...doc.data() });
      });
      callback(meals);
    },
    (err) => console.error('Firestore meals listen error:', err)
  );
};
