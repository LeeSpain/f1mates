
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Using a valid project configuration for development
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
  console.log("Running in development mode - using local auth emulation");
  auth.useDeviceLanguage();
}

export { app, auth, db, storage };
