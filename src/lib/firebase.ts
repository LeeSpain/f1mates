
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMdRCET0GRnwITdvzCsYIQcRQA-tU9QEA",
  authDomain: "f1mates-app.firebaseapp.com",
  projectId: "f1mates-app",
  storageBucket: "f1mates-app.appspot.com",
  messagingSenderId: "215381088459",
  appId: "1:215381088459:web:1e9b235bfabd17bbd08f6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
