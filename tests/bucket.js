const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
dotenv.config();

const projectId = process.env.PROJECTID;
const bucketName = process.env.STORAGEBUCKET;

console.log('--', projectId, bucketName);

const storage = new Storage({ projectId });

const bucket = storage.bucket(bucketName);

console.log('B= ', bucket);

(async () => {
	const [buckets] = await storage.getBuckets();
	console.log('Buckets:');

	for (const bucket of buckets) {
		console.log(`- ${bucket.name}`);
	}

	console.log('Listed all storage buckets.');
})();
