
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: This configuration was updated with the correct project details.
const firebaseConfig = {
  "projectId": "colorplan",
  "appId": "1:1086526560028:web:600e15f976155783138cd9",
  "storageBucket": "colorplan.firebasestorage.app",
  "apiKey": "AIzaSyC4m2yy0UsiDKIK8UUAYEqQXvDXBtmrceg",
  "authDomain": "colorplan.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1086526560028"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});


export { app, auth, db };
