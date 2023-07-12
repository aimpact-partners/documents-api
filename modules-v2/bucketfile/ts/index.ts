import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
dotenv.config();

export class BucketFile {
	#storage: Storage;
	#storageBucket = process.env.STORAGEBUCKET;
	#credentials = path.join(__dirname, './credentials.json');

	constructor() {
		console.log('credential bucket', this.#credentials);
		this.#storage = new Storage({ keyFilename: this.#credentials });
	}

	get(destination: string) {
		const bucketName = this.#storageBucket;
		console.log('bucketName', bucketName);
		const file = this.#storage.bucket(bucketName).file(destination);
		return file;
	}

	async upload(uploaded, path: string, destination: string): Promise<string> {
		const bucketName = this.#storageBucket;
		const file = this.#storage.bucket(bucketName).file(destination);
		//await this.#storage.bucket(bucketName).upload(path, { destination });

		return new Promise((resolve, reject) => {
			const stream = file.createWriteStream({
				metadata: { contentType: uploaded.mimetype },
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
	}

	async filterFiles(prefix: string | undefined) {
		try {
			const bucketName = this.#storageBucket;
			const bucket = this.#storage.bucket(bucketName);
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

	async downloadFiles(prefix: string): Promise<string> {
		const bucketName = process.env.STORAGEBUCKET;
		const bucket = this.#storage.bucket(bucketName);
		const [files] = await bucket.getFiles({ prefix });

		const tempPath: string = path.join(os.tmpdir(), 'bucket', bucketName, prefix);
		await fs.promises.mkdir(tempPath, { recursive: true });

		const downloadPromises = files.map(async file => {
			const tempFilePath = path.join(tempPath, path.basename(file.name));
			await file.download({ destination: tempFilePath });
			const readStream = fs.createReadStream(tempFilePath);

			return readStream;
		});

		await Promise.all(downloadPromises);

		return tempPath;
	}
}
