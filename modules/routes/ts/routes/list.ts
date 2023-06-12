import { FilestoreFile } from '../bucket/file';
import { join } from 'path';
export const list = async function (req, res) {
	const fileManager = new FilestoreFile();
	const { path = '', project, userId } = req.query;
	if (!userId) {
		return res.status(400).send('No user id provided');
	}
	if (!project) {
		return res.status(400).send('No project provided');
	}

	const finalPath = join(project, path);

	try {
		const filesRefs = await fileManager.filterFiles(finalPath);
		const files = filesRefs.map(file => file.name);
		return res.json({ status: true, data: { files } });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error saving embeds');
	}
};
