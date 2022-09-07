import mysql from 'mysql2/promise';
import { dbInfo } from '../setup/config.js';

import login from './login.js';
import register from './register.js';
import fileUpload from './fileUpload.js';

export const connection = mysql.createPool({
    host     : dbInfo.host,
    port     : parseInt(dbInfo.port),
    user     : dbInfo.user,
    password : dbInfo.password,
    database : dbInfo.database, // Replaces `CREATE DATABASE IF NOT EXISTS filing_saucer;` for flexibility.
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default {
    registerUser: async (email: string, password: string, name: string, cb: Function) => {
        register(email, password, name, (code: number) => { cb(code); });
    },
    loginUser: async (email: string, password: string, cb: Function) => {
        login(email, password, (isCorrect: boolean) => { cb(isCorrect); });
    },
    getName: async (email: string, cb: Function) => {
        let rows: any = await connection.execute('SELECT `name` FROM `users` WHERE `email` = ?', [email]);
        cb(rows[0][0].name);
    },
    newFileUpload: async (email: string, filename: string) => {
        fileUpload(email, filename);
    }
};

export function setupDatabase() {
    console.debug(`Database information has been input as:\ndatabase name: ${dbInfo.database}\nhost: ${dbInfo.host}\nport: ${dbInfo.port}\nuser: ${dbInfo.user}\npassword: *`, "Database");
        connection.execute(`CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, uploads VARCHAR(255), PRIMARY KEY (id));`)
        .then(() => { console.debug("Table `users` exists or has been created; ready to proceed!", "Database"); })
        .catch((err: any) => { console.error(err, "Database"); process.exit(1); });
        connection.execute(`CREATE TABLE IF NOT EXISTS uploads (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, filename VARCHAR(255) NOT NULL, date VARCHAR(255) NOT NULL, PRIMARY KEY (id));`)
        .then(() => { console.debug("Table `uploads` exists or has been created; ready to proceed!", "Database"); })
        .catch((err: any) => { console.error(err, "Database"); process.exit(1); });

    console.info("Successfully setup database", "Setup");
}