
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { auth, createRaceCollection } from '@/lib/firebase';
import { getUserDocument, createUserDocument } from './userService';
import { User, AuthContextType } from './types';

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => ({ success: false, error: 'Context not initialized' }),
  logout: async () => {},
  register: async () => ({ success: false, error: 'Context not initialized' }),
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
          const user = await getUserDocument(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.displayName,
            firebaseUser.photoURL
          );
          setCurrentUser(user);
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
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user.uid, name, email);
      
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error registering user:", authError);
      
      let errorMessage = "Failed to register. Please try again.";
      
      // Map Firebase errors to user-friendly messages
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please try another one.";
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please check and try again.";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error logging in:", authError);
      
      let errorMessage = "Login failed. Please check your email and password.";
      
      // Map Firebase errors to user-friendly messages
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (authError.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (authError.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact support.";
      }
      
      return { success: false, error: errorMessage };
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

// Re-export the playerService function for external use
export { getAllPlayers } from './userService';
export type { User } from './types';
