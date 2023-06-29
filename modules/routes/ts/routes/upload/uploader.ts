import { join } from 'path';
import { FilestoreFile } from '../../bucket/file';
import { setKnowledgeBox, storeKnowledgeBox } from './knowledge-box';
import { getExtension } from '../utils/get-extension';
import { generateCustomName } from '../utils/generate-name';
import { EmbeddingsAPI } from '@aimpact/documents-api/embeddings';
import * as Busboy from 'busboy';

const model = new EmbeddingsAPI();

/**
 *
 * @param req
 * @param res
 * @returns
 */
export /*bundle*/ const uploader = async function (req, res) {
	const { project, type, container, userId, knowledgeBoxId } = req.body;
	console.log(req);
	try {
		const promises = [];

		const filePaths = [];

		const bb = Busboy({ headers: req.headers, body: req.body });
		bb.on('field', (name, val, info) => {
			console.log(35, name, typeof val, info);
		});
		bb.on('file', (name, file, info) => {
			console.log(36, 'se carga', name);
		});

		bb.on('finish', function () {
			console.log('Upload complete');
			res.writeHead(200, { Connection: 'close' });
			res.end("That's all folks!");
		});
		return req.pipe(bb);
		/* 	Object.values(req.files).forEach(file => {
			// @ts-ignore

			const { path, size, originalname, mimetype, buffer } = file;

			const name = `${generateCustomName(originalname)}${getExtension(mimetype)}`;
			let dest = join(project, userId, type, container, name);
			const createdAt: number = new Date().getTime();
			filePaths.push({ path: dest, originalname, size, mimetype, name, createdAt });
			dest = dest.replace(/\\/g, '/');

			const fileManager = new FilestoreFile();
			promises.push(fileManager.upload(file, path, dest));
		});
		await Promise.all(promises);

		// publish on firestore
		const id = await storeKnowledgeBox({ container, userId, knowledgeBoxId, docs: filePaths });

		const p = join(project, userId, type, container);
		//update embedding
		(async () => {
			try {
				const response = await model.update(p, { container });
				if (!response.status) setKnowledgeBox(id, { status: 'failed' });
				else setKnowledgeBox(id, { status: 'ready' });
			} catch (e) {
				setKnowledgeBox(id, { status: 'failed' });
			}
		})();

		res.json({
			status: true,
			data: { knowledgeBoxId: id, message: 'File(s) uploaded successfully' },
	 	});*/
	} catch (error) {
		console.log(500, error);
		res.json({
			status: false,
			error: `Error uploading file(s): ${error.message}`,
		});
	}
};
