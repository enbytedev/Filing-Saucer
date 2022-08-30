import mysql from 'mysql2';
import { dbInfo } from '../setup/config.js';

export const connection = mysql.createConnection({
    host     : dbInfo.host,
    port     : parseInt(dbInfo.port),
    user     : dbInfo.user,
    password : dbInfo.password,
});

export default {
    newUser: (email: string, password: string) => {
        connection.execute(`INSERT INTO users (userName, password) VALUES ('${email}', '${password}')`);
    },
    loginUser: (email: string, password: string, callback: Function) => {
        connection.query({sql: `SELECT * FROM users WHERE userName = '${email}'`, rowsAsArray: true}, (err: any, results: any) => {
            if (err) {console.error(err);}
            if (results[0] != undefined) {
                if (results[0][2] == password) {
                    callback(0);
                } else {
                    callback("The password provided is incorrect.");
                }
            } else {
                callback("No user with that email address exists.");
            }
        });
    },
}

export function setupDatabase() {
    console.debug(`Successfully configured database:\nhost: ${dbInfo.host}\nport: ${dbInfo.port}\nuser: ${dbInfo.user}\npassword: *`, "Database");

    connection.query('CREATE DATABASE IF NOT EXISTS filing_saucer', function (err: Error) {
        if (err) throw err;
        console.debug("Successfully verified existence of database filing_saucer or created it if it did not exist", "Database");
    })
    connection.query('USE filing_saucer', function (err: Error) {
        if (err) throw err;
        console.debug("Successfully selected database", "Database");
    })
    connection.query('CREATE TABLE IF NOT EXISTS users (userId int(10) unsigned NOT NULL AUTO_INCREMENT, userName varchar(255) DEFAULT NULL, password varchar(255) DEFAULT NULL, primary key(userId), UNIQUE KEY `userName` (`userName`));', function (err: Error) {
        if (err) throw err;
        console.debug("Successfully verified existence of table users or created it if it did not exist", "Database");
    })
    console.info("Successfully setup database", "Setup");
}