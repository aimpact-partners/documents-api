const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
const { join } = require('path');
dotenv.config();

const credential = join(__dirname, './credentials.json');
const storage = new Storage({ keyFilename: credential });

(async () => {
	const [buckets] = await storage.getBuckets();
	console.log('Buckets:');
	for (const bucket of buckets) {
		console.log(`- ${bucket.name}`);
	}
	console.log('Listed all storage buckets.');
})();
