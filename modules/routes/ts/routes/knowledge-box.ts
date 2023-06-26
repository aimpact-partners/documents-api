import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseConfig } from '@aimpact/documents-api/firebase-config';
import * as admin from 'firebase-admin';

initializeApp(getFirebaseConfig());

const db = getFirestore();
const table = 'KnowledgeBoxes';
interface ISpecs {
	container: string;
	userId: string;
	knowledgeBoxId?: string;
	docs: any[];
}
export const storeKnowledgeBox = async ({ container, userId, knowledgeBoxId, docs }: ISpecs) => {
	const collection = db.collection(table);
	if (!knowledgeBoxId) {
		const id = uuidv4();
		const data = { id, userId, path: container };
		await collection.doc(id).set(data);
		knowledgeBoxId = id;
	}

	const batch = db.batch();

	const documentsSubcollection = collection.doc(knowledgeBoxId).collection('documents');
	console.log(3, documentsSubcollection);
	for (let docData of docs) {
		let newDocRef = documentsSubcollection.doc();
		batch.set(newDocRef, docData);
	}

	await batch.commit();
	console.log(4);
	return knowledgeBoxId;
};
