import * as functions from '@google-cloud/functions-framework';
import { upload, uploader } from '@aimpact/documents-api/routes';
import * as dotenv from 'dotenv';
dotenv.config();

const run = () => {
    upload();
    uploader();
};

const { FUNCTION_REGION, CLOUD_FUNCTION_NAME } = process.env;
FUNCTION_REGION && CLOUD_FUNCTION_NAME === 'upload' && functions.http('upload', run);
