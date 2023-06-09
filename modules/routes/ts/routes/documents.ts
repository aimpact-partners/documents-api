import {FilestoreFile} from '../bucket/file';

export const documents = async function (req, res) {
	const fileManager = new FilestoreFile();
	const {path} = req.body;

	try {
		const response = await fileManager.getBucketFiles(path);
		return res.json(response);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error saving embeds');
	}
};
