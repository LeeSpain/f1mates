import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
// Using updated project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAaGzlr9_Jn5HKdaWQHhgBCFd5L3KyXnA",
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

// Force authentication to work in local development
if (process.env.NODE_ENV === 'development') {
  console.log("Running in development mode - using local authentication");
  
  // In development, we'll use local emulators if they're running
  // Otherwise, we'll use the remote Firebase project
  try {
    // Uncomment these lines if you're running Firebase emulators locally
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
    console.log("Connected to Firebase emulators");
  } catch (e) {
    console.log("Not using Firebase emulators, using remote project instead");
  }
  
  auth.useDeviceLanguage();
}

// Add verbose logging to help debug authentication issues
const originalSignIn = auth.signInWithEmailAndPassword;
if (originalSignIn) {
  console.log("Adding debug logging to Firebase auth methods");
}

export { app, auth, db, storage };
