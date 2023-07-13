import { getFirestore } from 'firebase-admin/firestore';

/**
 * To access the firestore database you have to initialize the APP
 * This was done in the definition of the entrypoint
 * bundle: '@aimpact/documents-api/initialize'
 */
const db = getFirestore();
const table = 'KnowledgeBoxes';

/**
 *
 * @param id
 * @param data
 */
export const setKnowledgeBox = async function (id: string, data) {
	const collection = db.collection(table);
	await collection.doc(id).update(data);
};
