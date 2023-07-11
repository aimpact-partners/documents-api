const BEE = require('@beyond-js/bee');
const functions = require('@google-cloud/functions-framework');

BEE('http://localhost:3090', {});

functions.http('uploader', async (req, res) => {
	const { uploader } = await bimport('@aimpact/documents-api/upload');
	uploader(req, res);
});
