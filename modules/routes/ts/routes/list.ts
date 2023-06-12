import { FilestoreFile } from '../bucket/file';
import { join } from 'path';
export const list = async function (req, res) {
	const fileManager = new FilestoreFile();
	const { path = '', project, type, userId } = req.query;
	if (!userId) {
		return res.status(400).send('No user id provided');
	}
	if (!project) {
		return res.status(400).send('No project provided');
	}

	let finalPath = join(project, userId, type);
	finalPath = finalPath.replace(/\\/g, '/');
	const filter = path ? `${finalPath}/${path}` : finalPath;

	try {
		const filesRefs = await fileManager.filterFiles(filter);
		const folders = new Map();
		folders.set('general', []);
		filesRefs.forEach(file => {
			let name = file.name
				.replace(finalPath, '')
				.split('/')
				.filter(i => i !== '');
			if (name.length > 1) {
				const folder = folders.has(name) ? folders.get(name[0]) : [];
				folder.push({ name: name[name.length - 1], path: file.name });
				folders.set(name[0], folder);
				return;
			}
			folders.get('general').push({ name: file.name, path: file.name });
			return;
		});
		const files = [];
		folders.forEach((items, folder) => files.push({ name: folder, items }));

		return res.json({ status: true, data: { files } });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error saving embeds');
	}
};
