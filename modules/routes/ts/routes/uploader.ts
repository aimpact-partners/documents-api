import { join } from 'path';
import { FilestoreFile } from '../bucket/file';
import { generateCustomName } from './utils/generate-name';
import { getExtension } from './utils/get-extension';
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

    /**
     * project,
     * type: document, audio,
     * container: folder name to organize
     * userId
     */

    const { project, type, container, userId } = req.body;
    const p = join(project, userId, type, container);
    try {
        const promises = [];
        Object.values(req.files).forEach(file => {
            // @ts-ignore
            const { path, originalname, mimetype } = file;

            const name = `${generateCustomName(originalname)}${getExtension(mimetype)}`;
            let dest = join(project, userId, type, container, name);
            dest.replace(/\\/g, '/');
            const fileManager = new FilestoreFile();
            promises.push(fileManager.upload(path, dest));
        });
        await Promise.all(promises);

        //TODO agregar llamada a firestore para guardar los archivos subidos
        const response = await model.update(p, { container });

        res.json({
            status: true,
            message: 'File(s) uploaded successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file(s)');
    }
};
