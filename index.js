const BEE = require('@beyond-js/bee');
const functions = require('@google-cloud/functions-framework');

BEE('http://localhost:3090', {});

functions.http('uploader', async (req, res) => {
	// Initialize FirestoreApp
	await bimport('@aimpact/documents-api/initialize');

	const { uploader } = await bimport('@aimpact/documents-api/upload');
	uploader(req, res);
});
