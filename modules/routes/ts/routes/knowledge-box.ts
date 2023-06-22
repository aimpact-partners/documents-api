import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseConfig } from '@aimpact/documents-api/firebase-config';

initializeApp(getFirebaseConfig());

const db = getFirestore();
const table = 'KnowledgeBoxes';
export const storeKnowledgeBox = async ({ container, userId, knowledgeBoxId }) => {
    if (knowledgeBoxId) return knowledgeBoxId;

    const collection = db.collection(table);

    const id = uuidv4();
    const data = { id, userId, path: container };
    await collection.doc(id).set(data);
    return id;
};
