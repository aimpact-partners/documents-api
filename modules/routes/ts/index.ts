import {upload} from './upload';
import {uploader} from './routes/uploader';
import {embedding} from './routes/embedding';
import {documents} from './routes/documents';

export /*bundle*/
function routes(app) {
	app.get('/', (req, res) => res.send('AImpact Documents http server'));
	app.post('/embedding', embedding);
	app.post('/documents', documents);
	app.post('/upload', upload.array('file'), uploader);
}
