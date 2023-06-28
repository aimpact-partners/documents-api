import { upload } from './routes/upload';
import { list } from './routes/list';
import { uploader } from './routes/upload/uploader';
import { embedding } from './routes/embedding';
import { deleteDocuments } from './routes/delete';

export /*bundle*/
function routes(app) {
	app.get('/', (req, res) => res.send('AImpact Documents http server'));
	app.post('/embedding', embedding);
	app.get('/list', list);
	app.delete('/delete', deleteDocuments);
	app.post('/upload', upload.array('file'), uploader);
}
