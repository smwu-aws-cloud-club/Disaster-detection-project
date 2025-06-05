import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCnIqHUpsH9MN6cBvrXmUz37cInpSc6mKU",
  authDomain: "disaster-detection-project.firebaseapp.com",
  projectId: "disaster-detection-project",
  storageBucket: "disaster-detection-project.firebasestorage.app",
  messagingSenderId: "444335381733",
  appId: "1:444335381733:web:1e7054695e62b0a541080c",
  measurementId: "G-DTCW9W6F4R",
};

const app = initializeApp(firebaseConfig);

export const getFCMToken = async () => {
  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}; 