import { list } from './routes/list';
import { embedding } from './routes/embedding';
import { deleteDocuments } from './routes/delete';
import { uploader } from './routes/upload/uploader';

export /*bundle*/
function routes(app) {
    app.get('/', (req, res) => res.send('AImpact Documents http server'));
    app.post('/embedding', embedding);
    app.get('/list', list);
    app.delete('/delete', deleteDocuments);
    app.post('/upload', uploader);
}
