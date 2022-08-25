import mysql from 'mysql2';
import { dbInfo } from './config.js';

export default function setupDatabase() {
    console.debug("Configuring database...", "Database Setup");
    var connection = mysql.createConnection({
        host     : dbInfo.host,
        port     : parseInt(dbInfo.port),
        user     : 'root',
        password : 'root'
    });
    console.debug(`Successfully configured database:\nhost: ${dbInfo.host}\nport: ${dbInfo.port}\nuser: ${dbInfo.user}\npassword: *`, "Database");
    
    connection.connect();
    console.debug("Successfully connected to database", "Database Setup");

    connection.query('CREATE DATABASE IF NOT EXISTS filing_saucer', function (err) {
        if (err) throw err;
        console.debug("Successfully verified existence of database filing_saucer or created it if it did not exist", "Database");
    })
    connection.query('USE filing_saucer', function (err) {
        if (err) throw err;
        console.debug("Successfully selected database", "Database");
    })
    connection.query('CREATE TABLE IF NOT EXISTS users (userId int(10) unsigned NOT NULL AUTO_INCREMENT, userName varchar(255) DEFAULT NULL, password varchar(255) DEFAULT NULL, primary key(userId), UNIQUE KEY `userName` (`userName`));', function (err) {
        if (err) throw err;
        console.debug("Successfully verified existence of table users or created it if it did not exist", "Database");
    })
    

    console.info("Successfully setup database", "Setup");

}