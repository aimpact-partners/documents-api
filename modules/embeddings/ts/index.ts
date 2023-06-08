import {DocsManager} from './documents';
import {EmbeddingsManager} from './embeddings';

export /*bundle*/ class EmbeddingsAPI {
	#documents: DocsManager;
	get documents() {
		return this.#documents;
	}
	#embeddings: EmbeddingsManager;
	get embeddings() {
		return this.#embeddings;
	}

	constructor() {
		this.#documents = new DocsManager();
		this.#embeddings = new EmbeddingsManager(this.#documents);
	}

	async update(path: string, metadata) {
		await this.#documents.prepare(path, metadata);
		return this.#embeddings.update();
	}
}
