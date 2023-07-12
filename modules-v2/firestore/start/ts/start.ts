// import { initializeApp } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getFirebaseConfig } from '@aimpact/documents-api/firebase-config';

// console.log('start initializeApp', getFirebaseConfig());

// initializeApp(getFirebaseConfig());
// export /*bundle */ const db = getFirestore();

// console.log('bundle start db', db);
//-

import { join } from 'path';
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const credentials = join(__dirname, './credentials.json');

initializeApp({ credential: admin.credential.cert(credentials) });

export /*bundle */ const db = getFirestore();

console.log('bundle start db', !!db);
(async () => {
	const entries = [];
	const items = await db.collection('Users').get();

	items.forEach(item => entries.push(item.data()));
	console.log('collection', entries);
})();
