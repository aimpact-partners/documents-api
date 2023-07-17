import { DocsManager } from './documents';
import { EmbeddingsManager } from './embeddings';
import { setKnowledgeBox } from './knowledge-box';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 *
 * @param req
 * @param res
 * @returns
 */
export /*bundle*/ const embedding = async (req, res) => {
	const { id, path, metadata, token } = req.body;

	if (token !== process.env.GCLOUD_INVOKER) {
		return res.status(400).send({ status: false, error: 'Token request not valid' });
	}

	if (!id) return { status: false, error: `knowledgeBox id is required` };
	if (!path) return { status: false, error: `path is required` };

	const documents = new DocsManager();
	const response = await documents.prepare(path, metadata);

	const status = !response.status ? 'failed' : 'processed';
	await setKnowledgeBox(id, { status });

	const embeddings = new EmbeddingsManager(documents);
	return !response.status ? response : await embeddings.update();
};
