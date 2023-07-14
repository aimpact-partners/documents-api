const BEE = require('@beyond-js/bee');
const functions = require('@google-cloud/functions-framework');

BEE('http://localhost:3090', {});

functions.http('run', async (req, res) => {
	const { execute } = await bimport('@aimpact/documents-api/execute');
	execute(req, res);
});
