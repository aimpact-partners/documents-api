import { join } from 'path';
import { FilestoreFile } from '../bucket/file';
import { storeKnowledgeBox } from './knowledge-box';
import { getExtension } from './utils/get-extension';
import { generateCustomName } from './utils/generate-name';
import { EmbeddingsAPI } from '@aimpact/documents-api/embeddings';
const model = new EmbeddingsAPI();

/**
 *
 * @param req
 * @param res
 * @returns
 */
export /*bundle*/ const uploader = async function (req, res) {
    if (!req.files.length) {
        return res.status(400).send({ status: false, error: 'No file was uploaded' });
    }
    if (!req.body.type) {
        return res.status(400).send({ status: false, error: 'type is required' });
    }
    if (!req.body.userId) {
        return res.status(400).send({ status: false, error: 'user is required' });
    }
    if (!req.body.project) {
        return res.status(400).send({ status: false, error: 'project is required' });
    }
    if (!req.body.container) {
        return res.status(400).send({ status: false, error: 'container is required' });
    }

    /**
     * project: project name
     * type: document, audio,
     * container: folder name to organize
     * userId
     * knowledgeBoxId: knowledge base identifier, can be empty if a new one is being created
     */

    const { project, type, container, userId, knowledgeBoxId } = req.body;
    try {
        const promises = [];
        Object.values(req.files).forEach(file => {
            // @ts-ignore
            const { path, originalname, mimetype } = file;

            const name = `${generateCustomName(originalname)}${getExtension(mimetype)}`;
            let dest = join(project, userId, type, container, name);
            dest = dest.replace(/\\/g, '/');

            const fileManager = new FilestoreFile();
            promises.push(fileManager.upload(path, dest));
        });
        await Promise.all(promises);

        // publish on firestore
        const id = await storeKnowledgeBox({ container, userId, knowledgeBoxId });

        const p = join(project, userId, type, container);
        const response = await model.update(p, { container });
        if (!response.status) {
            res.json({
                status: false,
                error: `Error updating embedding: ${response.error}`,
            });
        }

        res.json({
            status: true,
            data: { knowledgeBoxId: id, message: 'File(s) uploaded successfully' },
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: false,
            error: `Error uploading file(s): ${error.message}`,
        });
    }
};
