
import { getDoc } from 'firebase/firestore';

// Re-export from config
export { app, auth, db, storage } from './config';

// Re-export from authService
export { 
  sendVerificationEmail, 
  sendPasswordReset,
  loginWithEmailAndPassword
} from './authService';

// Re-export from raceService
export { createRaceCollection } from './raceService';

// Re-export from inviteService
export { sendInviteEmail, saveInvitation } from './inviteService';

// Re-export from driverService
export { 
  saveDriverSelection, 
  savePrediction, 
  registerDriverSwap 
} from './driverService';
