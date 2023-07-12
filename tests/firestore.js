const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const credentials = require('./credentials.json');

initializeApp({ credential: admin.credential.cert(credentials) });
const db = getFirestore();

(async () => {
	const entries = [];
	const items = await db.collection('Users').get();

	items.forEach(item => entries.push(item.data()));
	console.log('collection', entries);
})();
