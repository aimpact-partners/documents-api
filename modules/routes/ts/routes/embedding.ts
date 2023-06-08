import {EmbeddingsAPI} from '@aimpact/documents-api/embeddings';
const model = new EmbeddingsAPI();

export const embedding = async function (req, res) {
	const {path, metadata} = req.body;
	try {
		const response = await model.update(path, metadata);
		res.json(response);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error saving embeds');
	}
};
