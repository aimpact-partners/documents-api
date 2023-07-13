import * as os from 'os';
import * as fs from 'fs';
import { join } from 'path';
import * as Busboy from 'busboy';
import * as stream from 'stream';
import { BucketFile } from './bucket/file';
import { getExtension } from './utils/get-extension';
import { generateCustomName } from './utils/generate-name';
import { setKnowledgeBox, storeKnowledgeBox } from './knowledge-box';
import { CloudTasksClient } from '@google-cloud/tasks';
import * as dotenv from 'dotenv';
dotenv.config();

const { GCLOUD_PROJECTID, GCLOUD_LOCATION, GCLOUD_QUEUENAME, GCLOUD_KEYFILENAME } = process.env;

// Initialize Cloud Tasks clients
const keyFilename = join(__dirname, GCLOUD_KEYFILENAME);
const tasksClient = new CloudTasksClient({ keyFilename });
const parent = tasksClient.queuePath(GCLOUD_PROJECTID, GCLOUD_LOCATION, GCLOUD_QUEUENAME);

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
		let tempPath: string = join(os.tmpdir(), bucketName); // store on temporal directory
		tempPath = tempPath.replace(/\\/g, '/');
		fs.mkdirSync(tempPath, { recursive: true });

		const docs = [];
		files.map(({ file, filename, mimeType, size }) => {
			let path = join(bucketName, filename);
			path = path.replace(/\\/g, '/');

			// write on bucket
			const bucketWriteStream = bucketFile.get(path).createWriteStream();
			file.pipe(bucketWriteStream);

			// write on local/temporal
			const name = `${generateCustomName(filename)}${getExtension(mimeType)}`;
			const stream = fs.createWriteStream(join(tempPath, name));
			file.pipe(stream);

			const createdAt: number = new Date().getTime();
			docs.push({ name, originalname: filename, path, size, mimeType, createdAt });
		});

		// Publish KnowledgeBox on firestore
		storeKnowledgeBox({ container, userId, knowledgeBoxId, docs }).then(id => {
			// Se hace el procesamiento de la task solo cuando se ejecuta desde la cloud function
			if (process.env.FUNCTION_REGION) {
				// Create a Cloud Task to process the file
				const url = 'https://ftovar8-friendly-barnacle-976xgqj5v6pfv6j-8080.preview.app.github.dev/embedding';

				const specs = {
					id,
					path: tempPath,
					metadata: { container },
					token: process.env.GCLOUD_INVOKER,
				};
				const task = {
					httpRequest: {
						httpMethod: 'POST',
						url,
						headers: { 'Content-Type': 'application/json' },
						body: Buffer.from(JSON.stringify(specs)).toString('base64'),
					},
				};
				tasksClient.createTask({ parent, task });
			}

			return res.json({
				status: true,
				data: { knowledgeBoxId: id, message: 'File(s) uploaded successfully' },
			});
		});
	};

	try {
		const bb = Busboy({ headers: req.headers });
		bb.on('file', onFile);
		bb.on('field', (name, val, info) => (fields[name] = val));
		bb.on('finish', onFinish);

		bb.end(req.rawBody);
	} catch (error) {
		res.json({
			status: false,
			error: `Error uploading file(s): ${error.message}`,
		});
	}
};
