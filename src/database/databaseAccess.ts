import confectionery from 'confectionery';
import config from '../setup/config.js';
import knex from 'knex';
import bcrypt from 'bcrypt';
import { databaseConfiguration } from "../setup/config.js";
import { ensureFileWasDeleted } from '../helpers/databaseHelpers.js';
import { IUser, IToken, IUpload, IUploadStrict } from "./interfaces/tableInterfaces.js";

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
            const user = await this.users().where({ email }).first();
            return user.name;
        },
        getUserNameFromFile: async (filename: string) => {
            const upload = await this.uploads().where({ filename }).first();
            const user = await this.users().where({ email: upload.email }).first();
            return user.name;
        },
        getOriginalNameFromFile: async (filename: string) => {
            const upload = await this.uploads().where({ filename }).first();
            return upload.originalname;
        },
        getTimezoneFromEmail: async (email: string) => {
            const user = await this.users().where({ email }).first();
            return user.timezone;
        },
        getHistory: async (email: string) => {
            const uploads = await this.uploads().where({ email });
            return uploads;
        },
        getHashedPasswordFromEmail: async (email: string) => {
            const user = await this.users().where({ email }).first();
            return user.password;
        }
    }

    public checks = {
        isUserFileOwner: async (email: string, filename: string) => {
            const upload = await this.uploads().where({ filename }).first();
            return upload.email === email;
        },
        isNameTaken: async (name: string) => {
            const user = await this.users().where({ name }).first();
            return user !== undefined;
        },
        isFilePrivate: async (filename: string) => {
            const upload = await this.uploads().where({ filename }).first();
            return upload.private === 1;
        },
        isUserStorageFull: async (email: string) => {
            const uploads = await this.uploads().where({ email });
            return uploads.length >= 10;
        },
        isPasswordCorrect: async (email: string, password: string): Promise<boolean> => {
            const user = await this.users().where({ email }).first();
            return bcrypt.compare(password, user.password);
        },
        isEmailInDatabase: async (email: string) => {
            const user = await this.users().where({ email }).first();
            return user !== undefined;
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
        upload: async (upload: IUploadStrict) => {
            if (upload.email && upload.originalname && await this.checks.isUserStorageFull(upload.email) && await this.checks.isNameTaken(upload.originalname)) {
                await this.uploads().insert(upload);
            }
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
        upload: async (upload: RequireProperty<IUpload, 'filename'>) => {
            let filename = upload.filename;
            await this.uploads().where({ filename }).update(upload);
        }
    }

    /**
     * Setup the database, creating the tables if they don't exist.
     */
    public setupDatabase() {
        logger.debug('Configuring database connection...', 'Database @ Setup Database');
        connection.schema.hasTable('Users').then((exists: boolean) => {
            if (!exists) {
                connection.schema.createTable('Users', (table: any) => {
                    table.string('email').primary();
                    table.string('password');
                    table.string('name');
                    table.string('timezone');
                    table.string('uploads');
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
                    table.string('email');
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
                    table.string('email');
                    table.string('filename');
                    table.string('originalname');
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