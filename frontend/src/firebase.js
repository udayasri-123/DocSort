// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  
  apiKey: "AIzaSyAFX0Y_E9-3j9aOEgTXHSGY4PSXghR6Iwg",
  authDomain: "docsort-ee93e.firebaseapp.com",
  projectId: "docsort-ee93e",
  storageBucket: "docsort-ee93e.firebasestorage.app",
  messagingSenderId: "926414975658",
  appId: "1:926414975658:web:41a15008077fe4c5f116d3",
  measurementId: "G-ZZJHKY94V0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
