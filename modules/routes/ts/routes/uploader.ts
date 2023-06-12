import {join} from 'path';
import {FilestoreFile} from '../bucket/file';
import {generateCustomName} from './utils/generate-name';
import {getExtension} from './utils/get-extension';

export const uploader = async function (req, res) {
	if (!req.files.length) {
		return res.status(400).send({status: false, error: 'No file was uploaded'});
	}

	const {project, container, topic} = req.body;
	try {
		const promises = [];
		Object.values(req.files).forEach(file => {
			// @ts-ignore
			const {path, originalname, mimetype} = file;

			const name = `${generateCustomName(originalname)}${getExtension(mimetype)}`;
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