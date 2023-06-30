import * as functions from '@google-cloud/functions-framework';
import { uploader } from '@aimpact/documents-api/routes';
import * as dotenv from 'dotenv';
dotenv.config();

const { FUNCTION_REGION, CLOUD_FUNCTION } = process.env;
FUNCTION_REGION && CLOUD_FUNCTION === 'upload' && functions.http('upload', uploader);
