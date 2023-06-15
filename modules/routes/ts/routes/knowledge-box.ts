import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseConfig } from '@aimpact/documents-api/firebase-config';

initializeApp(getFirebaseConfig());

const db = getFirestore();
const table = 'KnowledgeBoxes';
export const storeKnowledgeBox = async container => {
    if (!container) return false;

    const collection = db.collection(table);

    const id = uuidv4();
    const data = { id: id, path: container };
    const item = await collection.doc(id).set(data);
    return id;
};
