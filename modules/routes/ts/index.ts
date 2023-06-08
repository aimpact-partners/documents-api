import {upload} from './upload';
import {embedding} from './routes/embedding';
import {uploader} from './routes/uploader';

export /*bundle*/
function routes(app) {
	app.get('/', (req, res) => res.send('AImpact Documents http server'));
	app.post('/embedding', embedding);
	app.post('/upload', upload.array('file'), uploader);
}
