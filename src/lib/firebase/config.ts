
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

export { app, auth, db, storage };
