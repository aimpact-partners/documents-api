import {join} from 'path';
import * as multer from 'multer';
import {FilestoreFile} from '../bucket/file';
import {generateCustomName} from './utils/generate-name';

export class UploaderDocuments {
	#app;
	#uploader;

	constructor(app) {
		this.#app = app;
		this.#uploader = multer({
			storage: multer.diskStorage({
				destination: 'uploads',
				filename: this.setName,
			}),
		});
		this.#app.post('/upload/documents', this.#uploader.array('file'), this.upload);
	}

	getExtension(mimeType: string): string | null {
		switch (mimeType) {
			case 'text/plain':
				return '.txt';
			case 'application/pdf':
				return '.pdf';
			case 'application/msword':
				return '.doc';
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				return '.docx';
			case 'application/vnd.ms-excel':
				return '.xls';
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				return '.xlsx';
			case 'application/vnd.ms-powerpoint':
				return '.ppt';
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				return '.pptx';
			case 'application/rtf':
				return '.rtf';
			default:
				return null;
		}
	}

	setName = (req: Request, file: multer.File, cb: (error: Error | null, filename: string) => void) => {
		const name = `${generateCustomName(file.originalname)}${this.getExtension(file.mimetype)}`;
		cb(null, name);
	};

	upload = async (req, res) => {
		if (!req.files.length) {
			return res.status(400).send({status: false, error: 'No file was uploaded'});
		}

		const {project, container, topic} = req.body;
		try {
			const promises = [];
			Object.values(req.files).forEach(file => {
				// @ts-ignore
				const {path, originalname, mimetype} = file;

				console.log('file', file);
				const name = `${generateCustomName(originalname)}${this.getExtension(mimetype)}`;
				const dest = join(project, container, topic, name);

				const fileManager = new FilestoreFile();
				promises.push(fileManager.upload(path, dest));
			});
			await Promise.all(promises);

			res.json({
				status: true,
				message: 'File(s) uploaded successfully',
			});
		} catch (error) {
			console.error(error);
			res.status(500).send('Error uploading file(s)');
		}
	};
}
