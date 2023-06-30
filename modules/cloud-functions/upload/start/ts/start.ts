import * as functions from '@google-cloud/functions-framework';
import { uploader } from '@aimpact/documents-api/routes';
import * as dotenv from 'dotenv';
dotenv.config();

const { FUNCTION_REGION, CLOUD_FUNCTION_NAME } = process.env;
FUNCTION_REGION && CLOUD_FUNCTION_NAME === 'upload' && functions.http('upload', uploader);
