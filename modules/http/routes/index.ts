import { uploader } from '@aimpact/documents-api/upload';
import { embedding } from '@aimpact/documents-api/embedding';

export /*bundle*/
function routes(app) {
	app.get('/', (req, res) => res.send('Documents API http server'));
	app.post('/upload', uploader);
	app.post('/embedding', embedding);
}
