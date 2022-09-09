import { connection } from './databaseDao.js';
import bcrypt from 'bcrypt';

export default async (email: string, password: string) => {
    bcrypt.genSalt(10, function(_err, salt) {
        bcrypt.hash(password, salt, function(_err, hash) {
            connection.execute('UPDATE `users` SET `password` = ? WHERE `email` = ?', [hash, email]);
        });
    })
}