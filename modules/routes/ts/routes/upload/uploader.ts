import { join } from 'path';
import * as Busboy from 'busboy';
import * as stream from 'stream';
import { EmbeddingsAPI } from '@aimpact/documents-api/embeddings';
import { FilestoreFile } from '../../bucket/file';
import { getExtension } from '../utils/get-extension';
import { generateCustomName } from '../utils/generate-name';
import { setKnowledgeBox, storeKnowledgeBox } from './knowledge-box';

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
			const { filename, mimeType } = info;
			let size = 0;
			file.on('data', data => (size += data.length));
			file.on('end', () => {
				const fileProm = new Promise((resolve, reject) => {
					const pass = new stream.PassThrough();
					file.pipe(pass);
					fileWrites.push({ file: pass, filename, mimeType, size });
					resolve(true);
				});
				promises.push(fileProm);
			});
		});
		bb.on('finish', async () => {
			const { project, userId, type, container, knowledgeBoxId } = fields;
			if (!project || !userId || !type || !container) {
				return res.json({
					status: false,
					error: `Error uploading files: All fields (project, user, type, container) are required`,
				});
			}

			await Promise.all(promises);

			const bucketName = join(project, userId, type, container);
			fileWrites.map(async ({ file, filename, mimeType, size }) => {
				let path = join(bucketName, filename);
				path = path.replace(/\\/g, '/');
				const blob = fileManager.getFile(path);
				const blobStream = blob.createWriteStream();
				file.pipe(blobStream);

				const name = `${generateCustomName(filename)}${getExtension(mimeType)}`;
				const createdAt: number = new Date().getTime();
				filePaths.push({ name, originalname: filename, path, size, mimeType, createdAt });

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
				data: { knowledgeBoxId: 'id', message: 'File(s) uploaded successfully' },
			});
		});

		// TODO @ftovar8 @jircdev validar el funcionamiento de estos metodos
		process.env.CLOUD_FUNCTION ? bb.end(req.rawBody) : req.pipe(bb);
	} catch (error) {
		res.json({
			status: false,
			error: `Error uploading file(s): ${error.message}`,
		});
	}
};
