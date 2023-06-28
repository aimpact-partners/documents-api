import * as multer from 'multer';
import { getExtension } from '../utils/get-extension';
import { generateCustomName } from '../utils/generate-name';

const setName = (req: Request, file: multer.File, cb: (error: Error | null, filename: string) => void) => {
	const name = `${generateCustomName(file.originalname)}${getExtension(file.mimetype)}`;
	cb(null, name);
};

const storage = multer.memoryStorage();
export const upload = multer({
	storage,
	fileName: setName,
});
