const BEE = require('@beyond-js/bee');
const functions = require('@google-cloud/functions-framework');

BEE('http://localhost:3090', {});

functions.http('run', async (req, res) => {
	const pathname = req.path;

	if (!['/upload', '/embedding'].includes(pathname)) {
		return res.json({ status: false, error: 'endpoint not valid' });
	}

	// Initialize FirestoreApp
	await bimport('@aimpact/documents-api/initialize');

	if (pathname === '/embedding') {
		const { embedding } = await bimport('@aimpact/documents-api/embedding');
		return embedding(req, res);
	}

	const { uploader } = await bimport('@aimpact/documents-api/upload');
	uploader(req, res);
});
