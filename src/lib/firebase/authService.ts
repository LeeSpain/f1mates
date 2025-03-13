
import { 
  User,
  sendEmailVerification, 
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
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
  if (!email || !password) {
    console.error("Login error: Email or password is empty");
    return { 
      success: false, 
      error: "Email and password are required" 
    };
  }

  try {
    console.log(`Attempting login with email: ${email}`);
    
    // For development testing - check if we're using the demo admin account
    if (process.env.NODE_ENV === 'development' && email === 'admin@f1mates.app') {
      console.log("Using demo admin account - attempting login");
    }
    
    // We're adding detailed logging to diagnose the issue
    console.log("Firebase auth initiated:", !!auth);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(`Login successful for: ${email}`);
    return { 
      success: true, 
      user: userCredential.user 
    };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error("Login error:", firebaseError.code, firebaseError.message);
    
    let errorMessage = "Login failed. Please check your email and password.";
    
    // Map Firebase errors to user-friendly messages
    if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (firebaseError.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed login attempts. Please try again later.";
    } else if (firebaseError.code === 'auth/user-disabled') {
      errorMessage = "This account has been disabled. Please contact support.";
    } else if (firebaseError.code === 'auth/invalid-credential') {
      errorMessage = "Invalid login credentials. Please check your email and password.";
    } else if (firebaseError.code === 'auth/invalid-email') {
      errorMessage = "Invalid email format. Please enter a valid email address.";
    } else if (firebaseError.code === 'auth/network-request-failed') {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (firebaseError.code === 'auth/internal-error') {
      errorMessage = "An internal error occurred. Please try again later.";
    } else if (firebaseError.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already in use with a different provider. Please try another login method.";
    } else if (firebaseError.code === 'auth/invalid-api-key') {
      errorMessage = "Authentication configuration error. Please contact support.";
      console.error("CRITICAL: Firebase API key is invalid. Check your configuration.");
    } else if (firebaseError.code === 'auth/app-deleted') {
      errorMessage = "The authentication service is unavailable. Please try again later.";
    } else if (firebaseError.code === 'auth/app-not-authorized') {
      errorMessage = "This app is not authorized to use Firebase Authentication.";
    } else if (firebaseError.code === 'auth/argument-error') {
      errorMessage = "Invalid login parameters. Please try again.";
      console.error("CRITICAL: Argument error in authentication. Check parameters:", email, password ? "password-provided" : "no-password");
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

// Export additional helpful functions
export { signInWithEmailAndPassword };
