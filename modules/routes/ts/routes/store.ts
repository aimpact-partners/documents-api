import {ChainAPI} from '@aimpact/langchain/api';

export class StoreKnowledge {
	#app;
	#api;

	constructor(app) {
		this.#app = app;
		this.#api = new ChainAPI();
		this.#app.post('/store-knowledge', this.store);
	}

	store = async (req, res) => {
		const {path} = req.body;
		try {
			await this.#api.update(path);

			res.json({
				status: true,
				message: 'File(s) uploaded successfully',
			});
		} catch (error) {
			console.error(error);
			res.status(500).send('Error uploading file(s)');
		}
	};
}
