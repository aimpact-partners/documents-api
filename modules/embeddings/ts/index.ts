import { DocsManager } from './documents';
import { EmbeddingsManager } from './embeddings';

/**
 *
 * @param req
 * @param res
 * @returns
 */
export /*bundle*/ const embeddings = async function (req, res) {
	const documents = new DocsManager();
	const embeddings = new EmbeddingsManager(documents);

	const { path, metadata } = req.body;
	console.log('path, metadata', path, metadata);
	return 'HASTA AQUI';

	// async update(path: string, metadata) {
	const response = await documents.prepare(path, metadata);
	return !response.status ? response : await embeddings.update();
};
