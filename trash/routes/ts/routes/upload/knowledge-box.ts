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

export const setKnowledgeBox = async function (id, data) {
	const collection = db.collection(table);
	await collection.doc(id).update(data);
};

export const storeKnowledgeBox = async ({ container, userId, knowledgeBoxId, docs }: ISpecs) => {
	const collection = db.collection(table);
	if (!knowledgeBoxId) {
		const id = uuidv4();
		const timeCreated: number = new Date().getTime();
		const data = { id, userId, path: container, timeCreated };
		await collection.doc(id).set(data);
		knowledgeBoxId = id;
	}

	const batch = db.batch();

	const documentsSubcollection = collection.doc(knowledgeBoxId).collection('documents');

	for (let docData of docs) {
		let newDocRef = documentsSubcollection.doc();
		batch.set(newDocRef, docData);
	}

	await batch.commit();
	return knowledgeBoxId;
};
