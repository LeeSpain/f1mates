
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, query, where, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Using a demo project configuration for development
const firebaseConfig = {
  apiKey: "AIzaSyC-3XM_DqavCinSMk0iBvdLmIVGWXxRh-I",
  authDomain: "demo-project-f1-racing.firebaseapp.com",
  projectId: "demo-project-f1-racing",
  storageBucket: "demo-project-f1-racing.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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

export { 
  app, 
  auth, 
  db, 
  storage, 
  createRaceCollection, 
  sendInviteEmail,
  saveInvitation 
};
