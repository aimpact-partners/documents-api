import { Storage } from '@google-cloud/storage';
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from '@aimpact/documents-api/firebase-config';

export class FilestoreFile {
	private app;
	private storage;

	constructor() {
		this.app = initializeApp(getFirebaseConfig());
		this.storage = new Storage();
	}

	async upload(uploaded, path: string, destination: string): Promise<string> {
		const bucketName = getFirebaseConfig().storageBucket;
		const file = this.storage.bucket(bucketName).file(destination);
		//await this.storage.bucket(bucketName).upload(path, { destination });

		return new Promise((resolve, reject) => {
			const stream = file.createWriteStream({
				metadata: {
					contentType: uploaded.mimetype,
				},
			});
			stream.on('error', err => {
				console.error(err);
				reject(err);
			});
			stream.on('finish', () => {
				resolve(destination);
			});
			stream.end(uploaded.buffer);
		});

		return destination;
	}

	async filterFiles(prefix: string | undefined) {
		try {
			const bucketName = getFirebaseConfig().storageBucket;
			const bucket = this.storage.bucket(bucketName);
			const specs = prefix ? { prefix } : {};
			let [files] = await bucket.getFiles(specs);

			return files;
		} catch (e) {
			return { status: false, error: e.message };
		}
	}

	async deleteFiles(prefix: string | undefined) {
		try {
			const files = await this.filterFiles(prefix);

			await Promise.all(files.map(file => file.delete()));
			return true;
		} catch (e) {
			return { status: false, error: e.message };
		}
	}
}
