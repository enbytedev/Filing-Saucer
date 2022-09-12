import mysql from 'mysql2/promise';
import { dbInfo } from '../setup/config.js';

import login from './functions/userAccount/loginUser.js';
import register from './functions/userAccount/registerUser.js';
import createUpload from './createUpload.js';
import deleteUpload from './deleteUpload.js';
import updateUser from './functions/userAccount/updateUser.js';
import generateToken from './generateToken.js';
import validateToken from './validateToken.js';

import { isUserFileOwner, isNameTaken, isFilePrivate, isUserStorageFull, isPasswordCorrect } from './functions/checks.js';

import { getUserNameFromEmail, getHistory, getUserNameFromFile, getOriginalNameFromFile } from './functions/getInfo.js';

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
    getInfo: {
        getUserNameFromEmail,
        getHistory,
        getUserNameFromFile,
        getOriginalNameFromFile
    },
    checks: {
        isUserFileOwner,
        isNameTaken,
        isFilePrivate,
        isUserStorageFull,
        isPasswordCorrect
    },
    userAccount: {
        login,
        register,
        updateUser
    },
    handleUpload: {
        createUpload,
        deleteUpload
    },
    setFilePrivacy: async (filename: string, isPrivate: boolean) => {
        connection.execute('UPDATE `uploads` SET `private` = ? WHERE `filename` = ?', [isPrivate ? 1 : 0, filename]);
    },
    generateToken: async (email: string) => {
        return generateToken(email);
    },
    validateToken: async (email: string, token: string) => {
        return validateToken(email, token);
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