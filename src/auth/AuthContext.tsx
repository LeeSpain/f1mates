
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  AuthError
} from 'firebase/auth';
import { auth, createRaceCollection, sendVerificationEmail } from '@/lib/firebase';
import { getUserDocument, createUserDocument } from './userService';
import { User, AuthContextType } from './types';
import { toast } from '@/hooks/use-toast';

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
      try {
        if (firebaseUser) {
          // Fetch user data from Firestore
          const user = await getUserDocument(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.displayName,
            firebaseUser.photoURL
          );
          setCurrentUser(user);
          console.log("User authenticated:", user.email);
        } else {
          setCurrentUser(null);
          console.log("No user authenticated");
        }
      } catch (error) {
        console.error("Error in auth state changed:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`Attempting to register user: ${email}`);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully with Firebase");
      
      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
      console.log("User profile updated successfully");
      
      // Send email verification
      await sendVerificationEmail(userCredential.user);
      console.log("Verification email sent");
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user.uid, name, email);
      console.log("User document created in Firestore");
      
      // Show success toast
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });
      
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
      } else if (authError.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (authError.code === 'auth/internal-error') {
        errorMessage = "An internal error occurred. Please try again later.";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`Attempting to log in user: ${email}`);
      
      // For demo purposes only - allows specific admin accounts to bypass actual authentication
      // In production, this should be removed
      if (email === 'admin@f1mates.com' && password === 'Pass123!') {
        // Create a mock admin user
        const mockAdminUser = {
          uid: 'admin-uid-123',
          id: 1,
          name: 'Admin User',
          email: 'admin@f1mates.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser',
          groupAPoints: 0,
          groupBPoints: 0,
          groupCPoints: 0,
          bonusPoints: 0, 
          totalPoints: 0,
          weeklyWins: 0,
          bestGroupCFinish: 'N/A',
          isAdmin: true,
          sentInvites: []
        };
        
        setCurrentUser(mockAdminUser);
        console.log("Mock admin user logged in");
        
        // Show success toast
        toast({
          title: "Logged In",
          description: "Welcome back, Admin!",
        });
        
        return { success: true };
      }
      
      // For demo purposes - allows regular test user to bypass authentication
      if (email === 'user@example.com' && password === 'Pass123!') {
        // Create a mock regular user
        const mockUser = {
          uid: 'user-uid-456',
          id: 2,
          name: 'Regular User',
          email: 'user@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RegularUser',
          groupAPoints: 0,
          groupBPoints: 0,
          groupCPoints: 0,
          bonusPoints: 0,
          totalPoints: 0,
          weeklyWins: 0,
          bestGroupCFinish: 'N/A',
          isAdmin: false,
          sentInvites: []
        };
        
        setCurrentUser(mockUser);
        console.log("Mock regular user logged in");
        
        // Show success toast
        toast({
          title: "Logged In",
          description: "Welcome back!",
        });
        
        return { success: true };
      }
      
      // Normal Firebase authentication flow for non-demo accounts
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      
      // Show success toast
      toast({
        title: "Logged In",
        description: "Welcome back!",
      });
      
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
      } else if (authError.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (authError.code === 'auth/invalid-api-key') {
        errorMessage = "Service temporarily unavailable. Please try again later.";
      }
      
      // Show error toast
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // For demo users, just clear the current user state
      if (currentUser?.email === 'admin@f1mates.com' || currentUser?.email === 'user@example.com') {
        setCurrentUser(null);
        console.log("Mock user logged out");
        
        // Show success toast
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        
        return;
      }
      
      // Normal Firebase logout for non-demo accounts
      await signOut(auth);
      console.log("User logged out successfully");
      
      // Show success toast
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
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
