
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  QueryDocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from './types';
import { isAllowedAdmin } from '@/utils/adminUtils';

/**
 * Get or create a user document in Firestore
 */
export const getUserDocument = async (
  firebaseUid: string, 
  email: string | null, 
  displayName: string | null, 
  photoURL: string | null
): Promise<User> => {
  const userRef = doc(db, 'users', firebaseUid);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    const userData = userDoc.data() as Omit<User, 'email' | 'avatar'>;
    return {
      ...userData,
      uid: firebaseUid,
      email: email || '',
      avatar: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || 'User'}`,
    };
  }
  
  // Create default user document if it doesn't exist
  const defaultUserData: Omit<User, 'email' | 'avatar'> = {
    id: parseInt(firebaseUid.substring(0, 8), 16) % 1000, // Generate a numerical ID from UID
    name: displayName || 'User',
    groupAPoints: 0,
    groupBPoints: 0,
    groupCPoints: 0,
    bonusPoints: 0,
    totalPoints: 0,
    weeklyWins: 0,
    bestGroupCFinish: 'N/A',
    isAdmin: email ? isAllowedAdmin(email) : false,
    sentInvites: [], // Initialize empty sent invites array
    uid: firebaseUid
  };
  
  await setDoc(userRef, defaultUserData);
  
  return {
    ...defaultUserData,
    email: email || '',
    avatar: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || 'User'}`,
  };
};

/**
 * Create a new user document in Firestore
 */
export const createUserDocument = async (
  firebaseUid: string,
  name: string,
  email: string
): Promise<boolean> => {
  try {
    // Check if this email should have admin privileges
    const shouldBeAdmin = isAllowedAdmin(email);
    
    // Create user document in Firestore
    const defaultUserData: Omit<User, 'email' | 'avatar'> = {
      id: parseInt(firebaseUid.substring(0, 8), 16) % 1000,
      name,
      groupAPoints: 0,
      groupBPoints: 0,
      groupCPoints: 0,
      bonusPoints: 0,
      totalPoints: 0,
      weeklyWins: 0,
      bestGroupCFinish: 'N/A',
      isAdmin: shouldBeAdmin, // Set admin status based on email
      sentInvites: [],
      uid: firebaseUid
    };
    
    await setDoc(doc(db, 'users', firebaseUid), defaultUserData);
    return true;
  } catch (error) {
    console.error("Error creating user document:", error);
    return false;
  }
};

/**
 * Function to get all players for the leaderboard
 */
export const getAllPlayers = async (): Promise<(User & { isCurrentLeader: boolean; isOnHotStreak: boolean })[]> => {
  try {
    const usersRef = collection(db, 'users');
    // Create a query to exclude admin users and sort by total points
    const usersQuery = query(
      usersRef, 
      where("isAdmin", "==", false), 
      orderBy("totalPoints", "desc")
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    const players: (User & { isCurrentLeader: boolean; isOnHotStreak: boolean })[] = [];
    
    usersSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const userData = doc.data() as Omit<User, 'email' | 'avatar'>;
      const index = players.length; // Get the current index for determining leader
      
      players.push({
        ...userData,
        email: '', // Don't expose emails in leaderboard
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        isCurrentLeader: index === 0, // First player in the sorted list is the leader
        isOnHotStreak: userData.weeklyWins > 1 // Consider players with more than 1 win on a hot streak
      });
    });
    
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};
