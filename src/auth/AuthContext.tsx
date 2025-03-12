
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { 
  auth, 
  createRaceCollection, 
  sendVerificationEmail,
  loginWithEmailAndPassword 
} from '@/lib/firebase';
import { getUserDocument, createUserDocument, createDefaultAdminAccount } from './userService';
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

  // Initialize Firebase data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize race data
        await createRaceCollection();
        console.log("Race collection initialized");
        
        // Create default admin account
        await createDefaultAdminAccount();
        console.log("Default admin account initialized");
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    
    initializeData();
  }, []);

  // Set up the auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Store the current user ID for isYou flag in messages
          localStorage.setItem('currentUserId', firebaseUser.uid);
          
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
          localStorage.removeItem('currentUserId');
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

  // Login function - Updated to use our new loginWithEmailAndPassword utility
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`Auth context: Attempting to log in user: ${email}`);
      
      // Use our new login function from authService
      const result = await loginWithEmailAndPassword(email, password);
      
      if (result.success) {
        console.log("Auth context: Login successful");
        
        // Show success toast
        toast({
          title: "Logged In",
          description: "Welcome back!",
        });
      } else {
        console.error("Auth context: Login failed:", result.error);
        
        // Show error toast
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error("Unexpected error in login function:", error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      
      return { 
        success: false, 
        error: "An unexpected error occurred. Please try again." 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Normal Firebase logout
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
