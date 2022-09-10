import { connection } from './databaseDao.js';

export default async (filename: string) => {
    return connection.execute('SELECT `email` FROM `uploads` WHERE `filename` = ?', [filename]).then((results: any) => {
        return connection.execute('SELECT `name` FROM `users` WHERE `email` = ?', [results[0][0].email]).then((results: any) => {
            return results[0][0].name;
        });
    });
}