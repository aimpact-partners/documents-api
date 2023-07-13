const BEE = require('@beyond-js/bee');
const functions = require('@google-cloud/functions-framework');

BEE('http://localhost:3090', {});

functions.http('run', async (req, res) => {
	const pathname = req.path;
	console.log('-pathname- ', pathname);

	if (!['/upload', '/embedding'].includes(pathname)) {
		return res.json({ status: false, error: 'endpoint no valid' });
	}

	// Initialize FirestoreApp
	await bimport('@aimpact/documents-api/initialize');

	if (pathname === '/embedding') {
		const { embeddings } = await bimport('@aimpact/documents-api/embeddings');
		return res.json({ status: false, error: 'call embedding' });
		embeddings(req, res);
		return;
	}

	const { uploader } = await bimport('@aimpact/documents-api/upload');

	console.log('call uploader');

	uploader(req, res);
});
