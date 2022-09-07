import mysql from 'mysql2/promise';
import { dbInfo } from '../setup/config.js';

import login from './login.js';
import register from './register.js';

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
};

export function setupDatabase() {
    console.debug(`Database information has been input as:\ndatabase name: ${dbInfo.database}\nhost: ${dbInfo.host}\nport: ${dbInfo.port}\nuser: ${dbInfo.user}\npassword: *`, "Database");
        connection.execute(`CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, uploads VARCHAR(255), PRIMARY KEY (id));`).then(() => {
            console.debug("Users table exists or has been created!", "Database");
        }).catch((err: any) => {
            console.error(err, "Database");
            process.exit(1);
        });

    console.info("Successfully setup database", "Setup");
}