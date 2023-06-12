import { upload } from './upload';
import { uploader } from './routes/uploader';
import { embedding } from './routes/embedding';
import { list } from './routes/list';
import { filter } from './routes/filter';

export /*bundle*/
function routes(app) {
	app.get('/', (req, res) => res.send('AImpact Documents http server'));
	app.post('/embedding', embedding);
	app.get('/list', list);
	app.get('/filter', filter);
	app.post('/delete', list);
	app.post('/upload', upload.array('file'), uploader);
}
