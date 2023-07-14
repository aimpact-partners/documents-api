import { db } from '@aimpact/documents-api/firestore';

/**
 *
 * @param id
 * @param data
 */
export const setKnowledgeBox = async function (id: string, data) {
	const collection = db.collection('KnowledgeBoxes');
	await collection.doc(id).update(data);
};
