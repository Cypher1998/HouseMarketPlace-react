// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyD8vwz5WFfqzXy3ETzFAyKimdZArQF109k',
  authDomain: 'house-market-place-app-7d86f.firebaseapp.com',
  projectId: 'house-market-place-app-7d86f',
  storageBucket: 'house-market-place-app-7d86f.appspot.com',
  messagingSenderId: '837626722619',
  appId: '1:837626722619:web:deba44eabc99689ee49f1e',
  measurementId: 'G-QDP7L342NP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics();
export const db = getFirestore();
