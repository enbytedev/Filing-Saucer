import { connection } from './databaseDao.js';
import bcrypt from 'bcrypt';


export default async (email: string, password: string, cb: Function) => {
    connection.execute('SELECT `password` FROM `users` WHERE `userName` = ?', [email]).then((results: any) => {
        bcrypt.compare(password, results[0][0].password, function(_err: any, isCorrect: boolean) {
            cb(isCorrect);
        });
    });
}