const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

const credential = require('./credentials.json');

initializeApp({ credential: admin.credential.cert(credential) });
const db = getFirestore();

(async () => {
	const entries = [];
	const items = await db.collection('Users').get();

	items.forEach(item => entries.push(item.data()));
	console.log('collection', entries);
})();
