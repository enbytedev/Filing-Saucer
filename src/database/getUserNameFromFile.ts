import { connection } from './databaseDao.js';

export default async (filename: string, cb: Function) => {
    connection.execute('SELECT `email` FROM `uploads` WHERE `filename` = ?', [filename]).then((results: any) => {
        connection.execute('SELECT `name` FROM `users` WHERE `email` = ?', [results[0][0].email]).then((results: any) => {
            cb(results[0][0].name);
        });
    });
}