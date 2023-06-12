import { Storage } from '@google-cloud/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './credentials';

export class FilestoreFile {
	private app;
	private storage;

	constructor() {
		this.app = initializeApp(firebaseConfig);
		this.storage = new Storage();
	}

	async upload(path: string, destination: string): Promise<string> {
		const bucketName = firebaseConfig.storageBucket;
		await this.storage.bucket(bucketName).upload(path, { destination });
		return destination;
	}

	async filterFiles(prefix: string | undefined) {
		try {
			const bucketName = firebaseConfig.storageBucket;
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
			console.log(13, files);
			await Promise.all(files.map(file => file.delete()));
			return true;
		} catch (e) {
			return { status: false, error: e.message };
		}
	}
}
