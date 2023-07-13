import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import type { DocsManager } from './documents';
import * as dotenv from 'dotenv';
dotenv.config();

export /*bundle*/ class EmbeddingsManager {
	#client: PineconeClient;
	#documents: DocsManager;
	#embedding: OpenAIEmbeddings;

	constructor(documents: DocsManager) {
		this.#documents = documents;
		this.#client = new PineconeClient();
		this.#embedding = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY });
	}

	async update() {
		await this.#client.init({
			apiKey: process.env.PINECONE_API_KEY,
			environment: process.env.PINECONE_ENVIRONMENT,
		});

		const indexes = await this.#client.listIndexes();
		if (!indexes.length && !indexes.includes(process.env.PINECONE_INDEX_NAME)) {
			return { status: false, error: `Embedding index "${process.env.PINECONE_INDEX_NAME}" not found` };
		}
		if (!this.#documents.items.length) {
			return { status: false, error: `Documents not found in path "${this.#documents.path}"` };
		}

		const pineconeIndex = this.#client.Index(process.env.PINECONE_INDEX_NAME);
		await PineconeStore.fromDocuments(this.#documents.items, this.#embedding, { pineconeIndex });

		return { status: true, data: { message: 'Updated embeds' } };
	}
}
