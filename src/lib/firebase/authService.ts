
import { 
  User,
  sendEmailVerification, 
  sendPasswordResetEmail 
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
