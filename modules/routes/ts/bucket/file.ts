import {Storage} from '@google-cloud/storage';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from './credentials';

export class FilestoreFile {
	private app;
	private storage;

	constructor() {
		this.app = initializeApp(firebaseConfig);
		this.storage = new Storage();
	}

	async upload(path: string, destination: string): Promise<string> {
		const bucketName = firebaseConfig.storageBucket;
		await this.storage.bucket(bucketName).upload(path, {destination});
		return destination;
	}

	async filterFiles(prefix) {
		try {
			const bucketName = firebaseConfig.storageBucket;
			const bucket = this.storage.bucket(bucketName);
			let [files] = await bucket.getFiles({prefix});

			files = files.map(file => file.name);
			return {status: true, data: {files}};
		} catch (e) {
			return {status: false, error: e.message};
		}
	}
}
