import { FilestoreFile } from '../bucket/file';
import { join } from 'path';

export /*bundle*/ const list = async function (req, res) {
    const fileManager = new FilestoreFile();
    const { path = '', project, type, userId } = req.query;
    const TYPES = Object.freeze({
        file: 'files',
        files: 'files',
        audio: 'audio',
        audios: 'audio',
    });
    if (!TYPES.hasOwnProperty(type)) {
        return res.status(400).send('invalid type provided');
    }
    if (!userId) {
        return res.status(400).send('No user id provided');
    }
    if (!project) {
        return res.status(400).send('No project provided');
    }

    let finalPath = join(project, userId, TYPES[type]);
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
                const folder = folders.has(name[0]) ? folders.get(name[0]) : [];

                folder.push({ name: name[name.length - 1], path: file.name });
                folders.set(name[0], folder);
                return;
            }
            folders.get('general').push({ name: name[0], path: file.name });
            return;
        });

        const files = [];
        folders.forEach((items, folder) => files.push({ name: folder, items }));

        return res.json({ status: true, data: { files } });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error list documents');
    }
};
