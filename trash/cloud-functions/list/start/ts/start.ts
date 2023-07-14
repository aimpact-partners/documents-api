import * as functions from '@google-cloud/functions-framework';
import { list } from '@aimpact/documents-api/routes';
import * as dotenv from 'dotenv';
dotenv.config();

const setHeaders = res => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
};
const run = (req, res) => {
    setHeaders(res);
    list(req, res);
};

const { FUNCTION_REGION, CLOUD_FUNCTION_NAME } = process.env;
FUNCTION_REGION && CLOUD_FUNCTION_NAME === 'list' && functions.http('list', run);
