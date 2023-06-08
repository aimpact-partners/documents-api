import {StoreKnowledge} from './routes/store';
import {UploaderDocuments} from './routes/uploader';

export /*bundle*/
function routes(app) {
	app.get('/', (req, res) => res.send('AImpact Documents http server'));
	new StoreKnowledge(app);
	new UploaderDocuments(app);
}
