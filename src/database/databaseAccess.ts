import knex from 'knex';
import { databaseConfiguration } from "../setup/config.js";
import { ensureFileWasDeleted } from '../helpers/databaseHelpers.js';
import { IUser, IToken, IUpload, IUserStrict, IUploadStrict } from "./interfaces/tableInterfaces.js";

const connection = knex({
    client: 'mysql2',
    connection: {
      host : databaseConfiguration.host,
      port : parseInt(databaseConfiguration.port),
      user : databaseConfiguration.user,
      password : databaseConfiguration.password,
      database : databaseConfiguration.database
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
        isPasswordCorrect: async (email: string, password: string) => {
            // TODO: Reimplement password hashing
            const user = await this.users().where({ email }).first();
            return user.password === password;
        },
        isEmailInDatabase: async (email: string) => {
            const user = await this.users().where({ email }).first();
            return user !== undefined;
        }
    }

    public add = {
        user: async (user: IUserStrict) => {
            if (!await this.checks.isEmailInDatabase(user.email)) {
                await this.users().insert(user);
            } else {
                console.error('User with provided email already exists!', 'Database @ Add User');
            }
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
                console.error(`File ${filename} was not deleted! Not removing from database.`, "Database @ Remove Upload");
            }
        }
    }

    public update = {
        user: async (user: RequireProperty<IUser, 'email'>) => {
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
        connection.schema.hasTable('Users').then((exists: boolean) => {
            if (!exists) {
                connection.schema.createTable('Users', (table: any) => {
                    table.string('email').primary();
                    table.string('password');
                    table.string('name');
                    table.string('timezone');
                    table.string('uploads');
                }).then(() => {
                    console.log('Created Users table');
                });
            }
        });

        connection.schema.hasTable('Tokens').then((exists: boolean) => {
            if (!exists) {
                connection.schema.createTable('Tokens', (table: any) => {
                    table.string('email');
                    table.string('token');
                    table.string('expires');
                }).then(() => {
                    console.log('Created Tokens table');
                });
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
                    console.log('Created Uploads table');
                });
            }
        });
    }
}

export default new Database();