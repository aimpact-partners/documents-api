import { FilestoreFile } from '../bucket/file';

export const list = async function (req, res) {
	const fileManager = new FilestoreFile();
	const { path } = req.query;

	try {
		const response = await fileManager.filterFiles(path);
		return res.json(response);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error saving embeds');
	}
};
