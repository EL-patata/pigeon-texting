import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process?.env?.NEXT_PUBLIC_API_KEY as string,
	authDomain: process?.env?.NEXT_PUBLIC_AUTH_DOMAIN as string,
	projectId: process?.env?.NEXT_PUBLIC_PROJECT_ID as string,
	storageBucket: process?.env?.NEXT_PUBLIC_STORAGE_BUCKET as string,
	messagingSenderId: process?.env?.NEXT_PUBLIC_MESSAGING_SENDER_ID as string,
	appId: process?.env?.NEXT_PUBLIC_APP_ID as string,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);

export const chats = collection(db, 'chats');

export const users = collection(db, 'users');
