import * as os from 'os';
import * as fs from 'fs';
import { join } from 'path';
import * as Busboy from 'busboy';
import * as stream from 'stream';
import { EmbeddingsAPI } from '@aimpact/documents-api/embeddings';
import { BucketFile } from './bucket/file';
import { getExtension } from './utils/get-extension';
import { generateCustomName } from './utils/generate-name';
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
	const files = [];
	const fields: IFileSpecs = {};
	const bucketFile = new BucketFile();

	const onFile = (nameV, file, info) => {
		const { filename, mimeType } = info;

		// todo: @ftovar8 solve size

		const pass = new stream.PassThrough();
		file.pipe(pass);
		files.push({ file: pass, filename, mimeType, size: 10 });
	};

	const onFinish = () => {
		const { project, userId, type, container, knowledgeBoxId } = fields;
		if (!project || !userId || !type || !container) {
			return res.json({
				status: false,
				error: `Error uploading files: All fields (project, user, type, container) are required`,
			});
		}

		const bucketName = join(project, userId, type, container);

		// stroe on temporal directory
		let tempPath: string = join(os.tmpdir(), bucketName);
		tempPath = tempPath.replace(/\\/g, '/');
		fs.mkdirSync(tempPath, { recursive: true });

		const docs = [];
		files.map(({ file, filename, mimeType, size }) => {
			let path = join(bucketName, filename);
			path = path.replace(/\\/g, '/');

			const bucketWriteStream = bucketFile.get(path).createWriteStream();
			file.pipe(bucketWriteStream);

			const name = `${generateCustomName(filename)}${getExtension(mimeType)}`;
			const stream = fs.createWriteStream(join(tempPath, name));
			file.pipe(stream);

			const createdAt: number = new Date().getTime();
			docs.push({ name, originalname: filename, path, size, mimeType, createdAt });
		});

		// Publish on firestore
		let kbId: string;
		storeKnowledgeBox({ container, userId, knowledgeBoxId, docs })
			.then(id => {
				kbId = id;
				return model.update(tempPath, { container });
			})
			.then(response => setKnowledgeBox(kbId, { status: response.status ? 'ready' : 'failed' }))
			.then(() => {
				res.json({
					status: true,
					data: { knowledgeBoxId: kbId, message: 'File(s) uploaded successfully' },
				});
			})
			.catch(exc => {
				setKnowledgeBox(kbId, { status: 'failed' });
				res.json({ status: false, error: 'Error storing knowledge box' });
			});
	};

	try {
		const bb = Busboy({ headers: req.headers });
		bb.on('file', onFile);
		bb.on('field', (name, val, info) => (fields[name] = val));
		bb.on('finish', onFinish);

		// TODO @ftovar8 @jircdev validar el funcionamiento de estos metodos
		process.env.CLOUD_FUNCTION ? bb.end(req.rawBody) : req.pipe(bb);
	} catch (error) {
		res.json({
			status: false,
			error: `Error uploading file(s): ${error.message}`,
		});
	}
};
