import * as functions from '@google-cloud/functions-framework';
import { list } from '@aimpact/documents-api/routes';
import * as dotenv from 'dotenv';
dotenv.config();

const { FUNCTION_REGION, CLOUD_FUNCTION_NAME } = process.env;
FUNCTION_REGION && CLOUD_FUNCTION_NAME === 'list' && functions.http('list', list);
