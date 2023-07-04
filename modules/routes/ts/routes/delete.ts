import { BucketFile } from '../bucket/file';
import { join } from 'path';

export /*bundle*/ const deleteDocuments = async function (req, res) {
	const bucketFile = new BucketFile();
	const { path = '', project, userId, type } = req.query;
	if (!userId) {
		return res.status(400).send('No user id provided');
	}
	if (!project) {
		return res.status(400).send('No project provided');
	}

	if (!type) {
		return res.status(400).send('No type provided');
	}
	let finalPath = join(project, type, path);
	finalPath = finalPath.replace(/\\/g, '/');

	try {
		const response = await bucketFile.deleteFiles(finalPath);
		if (!response) {
			return res.json({ status: false, error: 'No files found' });
		}
		return res.json({ status: true });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error saving embeds');
	}
};
