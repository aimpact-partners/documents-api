import { v4 as uuidv4 } from 'uuid';
import '@aimpact/documents-api/initialize';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * To access the firestore database you have to initialize the APP
 * This was done in the definition of the entrypoint
 * bundle: '@aimpact/documents-api/initialize'
 */
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
		const data = { id, userId, path: container, timeCreated, status: 'pending' };
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

	console.log('return knowledgeBoxId', knowledgeBoxId);

	return knowledgeBoxId;
};
