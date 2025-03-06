
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db, createRaceCollection } from '@/lib/firebase';
import { PlayerStanding } from '@/data/mockData';

// Define the structure for a player/user
export interface User extends Omit<PlayerStanding, 'isCurrentLeader' | 'isOnHotStreak'> {
  email: string;
  avatar: string;
  isAdmin?: boolean;
  uid?: string; // Firebase UID
  sentInvites?: string[]; // Emails of people invited
}

// Define the auth context structure
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  isLoading: true,
});

// Create the auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize race data
  useEffect(() => {
    createRaceCollection().catch(error => {
      console.error("Error creating race collection:", error);
    });
  }, []);

  // Set up the auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'email' | 'avatar'>;
            setCurrentUser({
              ...userData,
              uid: firebaseUser.uid, // Include the UID in the user object
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.displayName || 'User'}`,
            });
          } else {
            // Create default user document if it doesn't exist
            const defaultUserData: Omit<User, 'email' | 'avatar'> = {
              id: parseInt(firebaseUser.uid.substring(0, 8), 16) % 1000, // Generate a numerical ID from UID
              name: firebaseUser.displayName || 'User',
              groupAPoints: 0,
              groupBPoints: 0,
              groupCPoints: 0,
              bonusPoints: 0,
              totalPoints: 0,
              weeklyWins: 0,
              bestGroupCFinish: 'N/A',
              isAdmin: false,
              sentInvites: [], // Initialize empty sent invites array
              uid: firebaseUser.uid
            };
            
            await setDoc(userRef, defaultUserData);
            
            setCurrentUser({
              ...defaultUserData,
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.displayName || 'User'}`,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
      
      // Create user document in Firestore
      const defaultUserData: Omit<User, 'email' | 'avatar'> = {
        id: parseInt(userCredential.user.uid.substring(0, 8), 16) % 1000,
        name: name,
        groupAPoints: 0,
        groupBPoints: 0,
        groupCPoints: 0,
        bonusPoints: 0,
        totalPoints: 0,
        weeklyWins: 0,
        bestGroupCFinish: 'N/A',
        isAdmin: false,
        sentInvites: [],
        uid: userCredential.user.uid
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), defaultUserData);
      
      return true;
    } catch (error) {
      console.error("Error registering user:", error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Function to get all players (for leaderboard)
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
    
    usersSnapshot.forEach((doc, index) => {
      const userData = doc.data() as Omit<User, 'email' | 'avatar'>;
      
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
