import mysql from 'mysql2/promise';
import config from '../setup/config.js';
import { dbInfo } from '../setup/config.js';

import login from './login.js';
import register from './register.js';
import createUpload from './createUpload.js';
import deleteUpload from './deleteUpload.js';
import getUserNameFromFile from './getUserNameFromFile.js';
import updateUser from './updateUser.js';
import generateToken from './generateToken.js';
import validateToken from './validateToken.js';
import changePassword from './changePassword.js';

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
    getUserNameFromEmail: async (email: string, cb: Function) => {
        let rows: any = await connection.execute('SELECT `name` FROM `users` WHERE `email` = ?', [email]); cb(rows[0][0].name); return rows[0][0].name;
    },
    getHistory: async (email: string | undefined, cb: Function) => {
        if (email != undefined) { await connection.execute('SELECT `filename`, `originalname`, `date`, `private` FROM `uploads` WHERE `email` = ?', [email]).then((results: any) => { cb(results[0]); }); }
    },
    createUpload: async (email: string, filename: string, originalname: string) => {
        createUpload(email, filename, originalname);
    },
    deleteUpload: async (email: string, filename: string) => {
        deleteUpload(email, filename);
    },
    getUserNameFromFile: async (filename: string, cb: Function) => {
        getUserNameFromFile(filename, (name: string) => { cb(name); });
    },
    getOriginalNameFromFile: async (filename: string, cb: Function) => {
        let rows: any = await connection.execute('SELECT `originalname` FROM `uploads` WHERE `filename` = ?', [filename]); cb(rows[0][0].originalname);
    },
    isFilePrivate: async (filename: string) => {
        let rows: any = await connection.execute('SELECT `private` FROM `uploads` WHERE `filename` = ?', [filename]); return rows[0][0].private[0] == 1;
    },
    isNameTaken: async (filename: string) => {
        let rows: any = await connection.execute('SELECT `filename` FROM `uploads` WHERE `filename` = ?', [filename]); if (rows[0].length > 0) { return true; } else { return false; };
    },
    isCurrentUserOwner: async (filename: string, email: string) => {
        return await connection.execute('SELECT `email` FROM `uploads` WHERE `filename` = ?', [filename]).then((rows: any) => {
            if (rows[0][0].email == email) { return true; } else { return false; }; });
    },
    setFilePrivate: async (filename: string, isPrivate: boolean) => {
        connection.execute('UPDATE `uploads` SET `private` = ? WHERE `filename` = ?', [isPrivate ? 1 : 0, filename]);
    },
    isUserFull: async (email: string) => {
        return connection.execute('SELECT `email` FROM `uploads` WHERE `email` = ?', [email]).then((rows: any) => { return rows[0].length >= config.maxUploadCount; });
    },
    updateUser: async (email: string, name: string, newpassword: string | null, password: string, cb: Function) => {
        updateUser(email, name, newpassword, password, cb);
    },
    generateToken: async (email: string) => {
        return generateToken(email);
    },
    validateToken: async (email: string, token: string) => {
        return validateToken(email, token);
    },
    changePassword: async (email: string, password: string, cb: Function) => {
        changePassword(email, password);
        cb();
    }
}

export function setupDatabase() {
    console.debug(`Database information has been input as:\ndatabase name: ${dbInfo.database}\nhost: ${dbInfo.host}\nport: ${dbInfo.port}\nuser: ${dbInfo.user}\npassword: *`, "Database");
        connection.execute(`CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, uploads VARCHAR(255), PRIMARY KEY (id));`)
        .then(() => { console.debug("Table `users` exists or has been created; ready to proceed!", "Database"); })
        .catch((err: any) => { console.error(err, "Database"); process.exit(1); });
        connection.execute(`CREATE TABLE IF NOT EXISTS uploads (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, filename VARCHAR(255) NOT NULL, originalname VARCHAR(255) NOT NULL, date VARCHAR(255) NOT NULL, private BIT NOT NULL, PRIMARY KEY (id));`)
        .then(() => { console.debug("Table `uploads` exists or has been created; ready to proceed!", "Database"); })
        .catch((err: any) => { console.error(err, "Database"); process.exit(1); });
        connection.execute(`CREATE TABLE IF NOT EXISTS tokens (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, token VARCHAR(255) NOT NULL, expires VARCHAR(255) NOT NULL, PRIMARY KEY (id));`)
        .then(() => { console.debug("Table `tokens` exists or has been created; ready to proceed!", "Database"); })
        .catch((err: any) => { console.error(err, "Database"); process.exit(1); });

    console.info("Successfully setup database", "Setup");
}