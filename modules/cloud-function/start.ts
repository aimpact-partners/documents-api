import * as functions from '@google-cloud/functions-framework';
import { execute } from '@aimpact/documents-api/execute';
import * as dotenv from 'dotenv';
dotenv.config();

process.env.FUNCTION_REGION && functions.http('execute', execute);
