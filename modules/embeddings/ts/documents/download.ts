import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';
import { getFirebaseConfig } from '@aimpact/documents-api/firebase-config';

export async function downloadFiles(prefix: string): Promise<string> {
	const storage = new Storage();
	const bucketName = getFirebaseConfig().storageBucket;
	const bucket = storage.bucket(bucketName);
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
