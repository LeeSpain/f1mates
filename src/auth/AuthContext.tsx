
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { PlayerStanding } from '@/data/mockData';

// Define the structure for a player/user
export interface User extends Omit<PlayerStanding, 'isCurrentLeader' | 'isOnHotStreak'> {
  email: string;
  avatar: string;
  isAdmin?: boolean;
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

  // Set up the auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'email' | 'avatar'>;
            setCurrentUser({
              ...userData,
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
              isAdmin: false
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultUserData);
            
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
        isAdmin: false
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
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    const players: (User & { isCurrentLeader: boolean; isOnHotStreak: boolean })[] = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data() as Omit<User, 'email' | 'avatar'>;
      
      // Skip admin users
      if (userData.isAdmin) return;
      
      players.push({
        ...userData,
        email: '', // Don't expose emails in leaderboard
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        isCurrentLeader: false, // Will be calculated below
        isOnHotStreak: userData.weeklyWins > 1 // Consider players with more than 1 win on a hot streak
      });
    });
    
    // Sort by total points
    players.sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Mark the top player as leader
    if (players.length > 0) {
      players[0].isCurrentLeader = true;
    }
    
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};
