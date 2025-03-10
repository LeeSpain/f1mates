
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  query, 
  where, 
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Using a demo project configuration for development
const firebaseConfig = {
  apiKey: "AIzaSyBnJGm_7Qx7dHGXVBPAT5zKSLq0v1p8QMI",
  authDomain: "f1mates-app.firebaseapp.com",
  projectId: "f1mates-app",
  storageBucket: "f1mates-app.appspot.com",
  messagingSenderId: "346871217397",
  appId: "1:346871217397:web:7ec0e16578e3baf5fbf32d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Firebase Auth helper functions
const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error sending password reset:", error);
    return false;
  }
};

// Firebase DB helper functions
const createRaceCollection = async () => {
  // Create races collection if doesn't exist
  const racesRef = collection(db, 'races');
  const currentYear = new Date().getFullYear();

  // Check if we already have races for current year
  const yearQuery = query(racesRef, where("season", "==", currentYear));
  const racesSnapshot = await getDocs(yearQuery);
  
  if (racesSnapshot.empty) {
    // Add 2025 F1 calendar races (example)
    const races = [
      { name: "Bahrain Grand Prix", date: new Date("2025-03-02"), season: currentYear, circuit: "Bahrain International Circuit" },
      { name: "Saudi Arabian Grand Prix", date: new Date("2025-03-09"), season: currentYear, circuit: "Jeddah Corniche Circuit" },
      { name: "Australian Grand Prix", date: new Date("2025-03-23"), season: currentYear, circuit: "Albert Park Circuit" },
      // Add more races as needed
    ];
    
    // Add each race to Firestore
    for (const race of races) {
      const raceDoc = doc(collection(db, 'races'));
      await setDoc(raceDoc, {
        ...race,
        date: Timestamp.fromDate(race.date),
        createdAt: Timestamp.now()
      });
    }
  }
};

// Email sending function using Firebase Cloud Functions
const sendInviteEmail = async (receiverEmail: string, senderName: string, inviteCode: string) => {
  try {
    const response = await fetch('https://us-central1-f1mates-app.cloudfunctions.net/sendInviteEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: receiverEmail,
        sender: senderName,
        inviteCode: inviteCode,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error sending invite email:", error);
    return false;
  }
};

// Function to save an invitation in the database
const saveInvitation = async (senderUid: string, receiverEmail: string, inviteCode: string) => {
  const inviteRef = doc(collection(db, 'invitations'));
  
  await setDoc(inviteRef, {
    senderUid,
    receiverEmail,
    inviteCode,
    createdAt: Timestamp.now(),
    status: 'pending'
  });
  
  // Also update the user's invites count
  const userRef = doc(db, 'users', senderUid);
  await updateDoc(userRef, {
    sentInvites: arrayUnion(receiverEmail)
  });
  
  return inviteRef.id;
};

// Function to record user's driver selection
const saveDriverSelection = async (
  userId: string, 
  driverGroup: string, 
  driverId: string
) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update the user's driver for the specified group
    await updateDoc(userRef, {
      [`driver${driverGroup}`]: driverId,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving driver selection:", error);
    return false;
  }
};

// Function to create a new prediction
const savePrediction = async (
  userId: string,
  raceId: string,
  prediction: string
) => {
  try {
    const predictionRef = collection(db, 'predictions');
    
    await addDoc(predictionRef, {
      userId,
      raceId,
      prediction,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving prediction:", error);
    return false;
  }
};

// Add driver and swap functionality
const registerDriverSwap = async (
  userId: string,
  oldDriverId: string,
  newDriverId: string,
  driverGroup: 'B' | 'C'
) => {
  try {
    // First check if user has swaps remaining (for Group B)
    if (driverGroup === 'B') {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const swapsRemaining = userData.swapsRemaining || 0;
        
        if (swapsRemaining <= 0) {
          throw new Error("No swaps remaining");
        }
        
        // Update swaps remaining
        await updateDoc(userRef, {
          swapsRemaining: swapsRemaining - 1
        });
      }
    }
    
    // Record the swap
    const swapRef = collection(db, 'swaps');
    await addDoc(swapRef, {
      userId,
      oldDriverId,
      newDriverId,
      driverGroup,
      date: serverTimestamp()
    });
    
    // Update the user's driver
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`driver${driverGroup}`]: newDriverId,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error registering driver swap:", error);
    return false;
  }
};

export { 
  app, 
  auth, 
  db, 
  storage, 
  createRaceCollection, 
  sendInviteEmail,
  saveInvitation,
  sendVerificationEmail,
  sendPasswordReset,
  saveDriverSelection,
  savePrediction,
  registerDriverSwap
};
