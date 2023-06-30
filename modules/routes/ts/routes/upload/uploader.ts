import { join } from 'path';
import { FilestoreFile } from '../../bucket/file';
import { setKnowledgeBox, storeKnowledgeBox } from './knowledge-box';
import { EmbeddingsAPI } from '@aimpact/documents-api/embeddings';
import * as Busboy from 'busboy';
import * as stream from 'stream';

const model = new EmbeddingsAPI();

interface IFileSpecs {
    project?: string;
    type?: string;
    container?: string;
    userId?: string;
    knowledgeBoxId?: string;
}

/**
 *
 * @param req
 * @param res
 * @returns
 */
export /*bundle*/ const uploader = async function (req, res) {
    const fields: IFileSpecs = {};
    const promises = [];
    const fileWrites = [];
    try {
        const filePaths = [];
        const fileManager = new FilestoreFile();
        const bb = Busboy({ headers: req.headers });

        bb.on('field', (name, val, info) => (fields[name] = val));
        bb.on('file', (nameV, file, info) => {
            const { filename } = info;
            const fileProm = new Promise((resolve, reject) => {
                const pass = new stream.PassThrough();
                file.pipe(pass);
                fileWrites.push({ file: pass, filename: filename });
                resolve(true);
            });
            promises.push(fileProm);
        });

        // Escuchar el evento 'finish' cuando la carga del formulario está completa
        bb.on('finish', async () => {
            const { project, userId, type, container, knowledgeBoxId } = fields;
            // Ensure all fields are provided
            if (!project || !userId || !type || !container) {
                return res.json({
                    status: false,
                    error: `Error uploading files: All fields (project, user, type, container) are required`,
                });
            }

            await Promise.all(promises);

            const bucketName = join(project, userId, type, container);
            fileWrites.map(async ({ file, filename }) => {
                let destination = join(bucketName, filename);
                destination = destination.replace(/\\/g, '/');
                const blob = fileManager.getFile(destination);
                const blobStream = blob.createWriteStream();
                file.pipe(blobStream);
                await new Promise((resolve, reject) => {
                    blobStream.on('error', reject);
                    blobStream.on('finish', resolve);
                });
            });

            // publish on firestore
            const id = await storeKnowledgeBox({ container, userId, knowledgeBoxId, docs: filePaths });

            // update embedding
            (async () => {
                try {
                    const response = await model.update(join(project, userId, type, container), { container });
                    if (!response.status) setKnowledgeBox(id, { status: 'failed' });
                    else setKnowledgeBox(id, { status: 'ready' });
                } catch (e) {
                    setKnowledgeBox(id, { status: 'failed' });
                }
            })();

            // res.writeHead(200, { Connection: 'close' });
            return res.json({
                status: true,
                data: { knowledgeBoxId: id, message: 'File(s) uploaded successfully' },
            });
        });

        bb.end(req.rawBody);
        return req.pipe(bb);
    } catch (error) {
        res.json({
            status: false,
            error: `Error uploading file(s): ${error.message}`,
        });
    }
};
