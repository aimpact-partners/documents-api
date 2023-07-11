import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseConfig } from '@aimpact/documents-api/firebase-config';

console.log('start initializeApp', getFirebaseConfig());

initializeApp(getFirebaseConfig());
export /*bundle */ const db = getFirestore();

console.log('bundle start db', db);
