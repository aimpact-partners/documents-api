import * as functions from '@google-cloud/functions-framework';
import { list } from '@aimpact/documents-api/routes';
import * as dotenv from 'dotenv';
dotenv.config();

process.env.FUNCTION_REGION && functions.http('documents-api-list', list);
