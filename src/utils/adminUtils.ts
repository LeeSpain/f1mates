
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Sets the admin status for a user
 * @param uid Firebase user ID
 * @param isAdmin Boolean to set admin status
 * @returns Promise resolving to true if successful
 */
export const setUserAsAdmin = async (uid: string, isAdmin: boolean = true): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { isAdmin });
    return true;
  } catch (error) {
    console.error("Error setting admin status:", error);
    return false;
  }
};

/**
 * Function to check if a provided email is in the allowed admin list
 * This is just for demo purposes - in production, this should be secured with proper auth rules
 */
export const isAllowedAdmin = (email: string): boolean => {
  // For demo purposes, these are allowed admin emails
  const allowedAdmins = [
    'admin@f1mates.com',
    'admin@f1mates.app',
    'test@test.com',  // Adding a test email for easy testing
  ];
  
  return allowedAdmins.includes(email.toLowerCase());
};
