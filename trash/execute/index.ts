import { uploader } from '@aimpact/documents-api/upload';
import { embedding } from '@aimpact/documents-api/embedding';
declare const bimport: (module: string) => any;

export /*bundle*/ const execute = async (req, res) => {
	const pathname = req.path;
	if (!['/upload', '/embedding'].includes(pathname)) {
		return res.json({ status: false, error: 'endpoint not valid' });
	}

	if (pathname === '/embedding') {
		return embedding(req, res);
	}

	uploader(req, res);
};
