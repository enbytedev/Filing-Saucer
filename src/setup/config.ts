import * as dotenv from 'dotenv';

dotenv.config()

interface GeneralConfiguration {
    port: string;
    fullUrl: string;
    maxFileSizeMB: string;
    browserRateLimit: string;
    apiRateLimit: string;
    uploadDirectory: string;
    maxUploadCount: string;
    debugMode: string;
    logPath: string;
    checkUpdates: string;
    [keys: string]: any;
}

interface DatabaseConfiguration {
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
    [keys: string]: any;
}

interface EmailConfiguration {
    host: string;
    port: string;
    account: string;
    password: string;
    from: string;
    [keys: string]: any;
}

const generalConfiguration = {
    port: process.env.port ?? '8080',
    fullUrl: process.env.fullUrl ?? '',
    browserRateLimit: process.env.browserRateLimit ?? '150',
    apiRateLimit: process.env.apiRateLimit ?? '75',
    maxFileSizeMB: process.env.maxFileSizeMB ?? '20',
    logPath: process.env.logPath ?? 'logs/',
    checkUpdates: process.env.checkUpdates ?? 'true',
    debugMode: process.env.debugMode ?? 'false',
    uploadDirectory: process.env.uploadDirectory ?? 'uploads/',
    maxUploadCount: process.env.maxUploadCount ?? '10'
} as GeneralConfiguration;
export default generalConfiguration;

export const databaseConfiguration = {
    host: process.env.dbHost ?? '',
    port: process.env.dbPort ?? '',
    user: process.env.dbUser ?? '',
    password: process.env.dbPassword ?? '',
    database: process.env.dbName ?? ''
} as DatabaseConfiguration;

export const emailConfiguration = {
    host: process.env.emailHost ?? '',
    port: process.env.emailPort ?? '',
    account: process.env.emailAccount ?? '',
    password: process.env.emailPassword ?? '',
    from: process.env.emailFrom ?? ''
} as EmailConfiguration;