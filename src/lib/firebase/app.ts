import { initializeApp } from 'firebase/app';
import { enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
enableMultiTabIndexedDbPersistence(db);
