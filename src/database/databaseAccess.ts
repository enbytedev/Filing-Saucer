import confectionery from 'confectionery';
import config from '../setup/config.js';
import knex from 'knex';
import bcrypt from 'bcrypt';
import { databaseConfiguration } from "../setup/config.js";
import { ensureFileWasDeleted } from '../helpers/databaseHelpers.js';
import { IUser, IToken, IUpload, IUploadOptional } from "./interfaces/tableInterfaces.js";

export const logger = confectionery.createLogger("Database");
// Display debug information if debug mode is enabled
if (config.debugMode == "true") {
    logger.setLevel(4, 4);
}
logger.setFormat('CLASSIC');
// Use logfiles if logPath is set.
if (config.logPath != '') {
    logger.setLogPath(config.logPath);
    logger.info("Logging to " + config.logPath, "Database Logger");
}

const connection = knex({
    client: 'mysql2',
    connection: {
        host: databaseConfiguration.host,
        port: parseInt(databaseConfiguration.port),
        user: databaseConfiguration.user,
        password: databaseConfiguration.password,
        database: databaseConfiguration.database
    },
    pool: { min: 2, max: 10 }
});

class Database {
    public users = () => connection('Users');
    public tokens = () => connection('Tokens');
    public uploads = () => connection('Uploads');

    public getInfo = {
        getUserNameFromEmail: async (email: string) => {
            const user = await this.users().where({ email: email }).first();
            return user.name;
        },
        getUserIdFromEmail: async (email: string) => {
            const user = await this.users().where({ email }).first();
            return user.userId;
        },
        getUserNameFromFileId: async (fileId: string) => {
            const upload = await this.uploads().where({ fileId }).first();
            const user = await this.users().where({ userId: upload.userId }).first();
            return user.name;
        },
        getUserNameFromUserId: async (userId: string) => {
            const user = await this.users().where({ userId }).first();
            return user.name;
        },
        getUserIdFromFileId: async (fileId: string) => {
            const upload = await this.uploads().where({ fileId }).first();
            const user = await this.users().where({ userId: upload.userId }).first();
            return user.userId;
        },
        getTimezoneFromUserId: async (userId: string) => {
            const user = await this.users().where({ userId }).first();
            return user.timezone;
        },
        getHistory: async (userId: string) => {
            const uploads = await this.uploads().where({ userId });
            return uploads;
        },
        getHashedPasswordFromUserId: async (userId: string) => {
            const user = await this.users().where({ userId }).first();
            return user.password;
        },
        getFileNameFromFileId: async (fileId: string) => {
            const upload = await this.uploads().where({ fileId }).first();
            return upload.filename;
        }
    }

    public checks = {
        isUserFileOwner: async (userId: string, filename: string) => {
            const upload = await this.uploads().where({ filename }).first();
            return upload.userId === userId;
        },
        isNameTaken: async (name: string) => {
            const user = await this.users().where({ name }).first();
            return user !== undefined;
        },
        isFilePrivate: async (fileId: string) => {
            const upload = await this.uploads().where({ fileId }).first();
            return upload.private === 1;
        },
        isUserStorageFull: async (userId: string) => {
            const uploads = await this.uploads().where({ userId });
            return uploads.length >= 10;
        },
        isPasswordCorrect: async (userId: string, password: string): Promise<boolean> => {
            const user = await this.users().where({ userId }).first();
            return bcrypt.compare(password, user.password);
        },
        isEmailInDatabase: async (email: string) => {
            const user = await this.users().where({ email }).first();
            return user !== undefined;
        },
        isFileInDatabase: async (fileId: string) => {
            const upload = await this.uploads().where({ fileId }).first();
            return upload !== undefined;
        }
    }

    public add = {
        user: async (user: IUser): Promise<boolean> => {
            return await this.users().insert(user).then((res) => {
                if (res) {
                    logger.debug('Added user ' + user.email, 'Database @ Add User');
                    return true;
                } else {
                    logger.error('Failed to add user ' + user.email, 'Database @ Add User');
                    return false;
                }
            });
        },
        token: async (token: IToken) => {
            await this.tokens().insert(token);
        },
        upload: async (upload: IUpload) => {
            await this.uploads().insert(upload);
        }
    }

    public remove = {
        token: async (token: string) => {
            await this.tokens().where({ token }).del();
        },
        upload: async (filename: string) => {
            if (ensureFileWasDeleted(filename)) {
                await this.uploads().where({ filename }).del();
            } else {
                logger.error(`File ${filename} was not deleted! Not removing from database.`, "Database @ Remove Upload");
            }
        }
    }

    public update = {
        user: async (user: IUser) => {
            let email = user.email.toLowerCase();
            await this.users().where({ email }).update(user);
        },
        file: async (upload: RequireProperty<IUploadOptional, 'fileId'>) => {
            let fileId = upload.fileId;
            await this.uploads().where({ fileId }).update(upload);
        },
        processUserUpdateToken: async (token: string, hashedPassword: string) => {
            if (token == undefined) { return 2; }
            const tokenInfo = await this.tokens().where({ token: token }).first();
            // Check if token exists
            if (!tokenInfo) { return 2; }
            // Make sure token is not expired
            let expires = new Date(parseInt(tokenInfo.expires)).toString();
            let currentDate = Date.now().toString();
            if (expires > currentDate) {
                let userId = tokenInfo.userId;
                await this.tokens().where({ token: token }).del();

                await this.users().where({ userId }).update({ password: hashedPassword });

                return 0;
            } else { return 1; }
            
        },
    }

    /**
     * Setup the database, creating the tables if they don't exist.
     */
    public setupDatabase() {
        logger.debug('Configuring database connection...', 'Database @ Setup Database');
        connection.schema.hasTable('Users').then((exists: boolean) => {
            if (!exists) {
                connection.schema.createTable('Users', (table: any) => {
                    table.increments('userId').primary();
                    table.string('email').unique();
                    table.string('password');
                    table.string('name');
                    table.string('timezone');
                }).then(() => {
                    logger.log('Created Users table', 'Database @ Setup Database');
                });
            } else {
                logger.debug('Users table already exists', 'Database @ Setup Database');
            }
        });

        connection.schema.hasTable('Tokens').then((exists: boolean) => {
            if (!exists) {
                connection.schema.createTable('Tokens', (table: any) => {
                    table.string('userId');
                    table.string('token');
                    table.string('expires');
                }).then(() => {
                    logger.log('Created Tokens table', 'Database @ Setup Database');
                });
            } else {
                logger.debug('Tokens table already exists', 'Database @ Setup Database');
            }
        });

        connection.schema.hasTable('Uploads').then((exists: boolean) => {
            if (!exists) {
                connection.schema.createTable('Uploads', (table: any) => {
                    table.increments('fileId').primary();
                    table.string('userId');
                    table.string('filename');
                    table.string('date');
                    table.boolean('private');
                }).then(() => {
                    logger.log('Created Uploads table', 'Database @ Setup Database');
                });
            } else {
                logger.debug('Uploads table already exists', 'Database @ Setup Database');
            }
        });
    }
}

export default new Database();