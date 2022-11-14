import { initializeApp } from 'firebase/app';
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
enableIndexedDbPersistence(db);
