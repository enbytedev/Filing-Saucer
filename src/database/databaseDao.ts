import mysql from 'mysql2/promise';
import { dbInfo } from '../setup/config.js';

const connection = mysql.createPool({
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
    registerUser: async (email: string, password: string) => {
        return connection.execute('SELECT * FROM `users` WHERE `userName` = ?', [email]).then((results: any) => { return results[0].length == 0; }).then((isUnique: boolean) => {
            if (isUnique) {
                if (email.length > 0 && password.length > 0) {
                connection.execute('INSERT INTO `users` (`userName`, `password`) VALUES (?, ?)', [email, password]);
                console.debug(`Successfully created user ${email}`, "Register");
                return 0;
                } else {
                    return -1;
                }
            } else {
                console.debug(`Did not create user ${email}. Email exists!`, "Register");
                return 1;
            }
        }).catch((err: any) => {
            console.error(err);
            return -1;
        });
    },
    loginUser: async (email: string, password: string) => {
        return connection.execute('SELECT * FROM `users` WHERE `userName` = ? AND password = ?', [email, password]).then((results: any) => {
            return results[0];
        });
    },
};

export function setupDatabase() {
    console.debug(`Database information has been input as:\ndatabase name: ${dbInfo.database}\nhost: ${dbInfo.host}\nport: ${dbInfo.port}\nuser: ${dbInfo.user}\npassword: *`, "Database");
        connection.execute(`CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, userName VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY (id));`).then(() => {
            console.debug("Users table exists or has been created!", "Database");
        }).catch((err: any) => {
            console.error(err, "Database");
            process.exit(1);
        });

    console.info("Successfully setup database", "Setup");
}