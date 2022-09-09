import * as dotenv from 'dotenv';
import { URL } from 'url';

export const __dirname = new URL('.', import.meta.url).pathname;

dotenv.config()

export default {
    port: process.env.port ?? '',
    fullUrl: process.env.fullUrl ?? '',
    browserRateLimit: process.env.browserRateLimit ?? '',
    apiRateLimit: process.env.apiRateLimit ?? '',
    maxFileSizeMB: process.env.maxFileSizeMB ?? '',
    logPath: process.env.logPath ?? '',
    checkUpdates: process.env.checkUpdates ?? '',
    logLevel: process.env.logLevel ?? '',
    uploadDirectory: process.env.uploadDirectory ?? ''
}

export const dbInfo = {
    host: process.env.dbHost ?? '',
    port: process.env.dbPort ?? '',
    user: process.env.dbUser ?? '',
    password: process.env.dbPassword ?? '',
    database: process.env.dbName ?? ''
}