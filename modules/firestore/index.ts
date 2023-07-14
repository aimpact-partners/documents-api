import { join } from 'path';
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const credentials = join(__dirname, './credentials.json');
initializeApp({ credential: admin.credential.cert(credentials) });

export /*bundle*/ const db = getFirestore();
