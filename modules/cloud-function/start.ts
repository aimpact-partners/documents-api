import * as functions from '@google-cloud/functions-framework';
import { execute } from '@aimpact/documents-api/execute';
import * as dotenv from 'dotenv';
dotenv.config();

process.env.CLOUD_FUNCTION && functions.http('execute', execute);
