
import { 
  User,
  sendEmailVerification, 
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './config';

/**
 * Send a verification email to the user
 */
export const sendVerificationEmail = async (user: User): Promise<boolean> => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

/**
 * Send a password reset email
 */
export const sendPasswordReset = async (email: string): Promise<boolean> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error sending password reset:", error);
    return false;
  }
};

/**
 * Login with email and password
 */
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    console.log(`Attempting login with email: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(`Login successful for: ${email}`);
    return { 
      success: true, 
      user: userCredential.user 
    };
  } catch (error: any) {
    console.error("Login error:", error);
    
    let errorMessage = "Login failed. Please check your email and password.";
    
    // Map Firebase errors to user-friendly messages
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed login attempts. Please try again later.";
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = "This account has been disabled. Please contact support.";
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = "Invalid login credentials. Please check your email and password.";
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};
