import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase's client configuration is public, but it must be copied from a real
// Firebase Web app (Firebase Console → Project settings → Your apps).
const firebaseConfig = {
 apiKey: "AIzaSyC6j1IzgT8UfB5tHLFxHLH2zXF44IFDZF0",
  authDomain: "smartlearn-234d0.firebaseapp.com",
  projectId: "smartlearn-234d0",
  storageBucket: "smartlearn-234d0.firebasestorage.app",
  messagingSenderId: "701903018813",
  appId: "1:701903018813:web:fab480e06de8ec77310354"
}

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
)

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

export async function signIn(email, password){
  if (!auth) throw new Error('Firebase is not configured yet.')
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signUp(email, password){
  if (!auth) throw new Error('Firebase is not configured yet.')
  return createUserWithEmailAndPassword(auth, email, password)
}
