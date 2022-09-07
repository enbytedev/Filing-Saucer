import { connection } from './databaseDao.js';
import bcrypt from 'bcrypt';


export default async (email: string, password: string, name: string, cb: Function) => {
    connection.execute('SELECT * FROM `users` WHERE `email` = ?', [email])
    .then((results: any) => { return results[0].length == 0; })
    .then((isUnique: boolean) => {
        if (password.length < 1) { cb(2); return; }
        if (!isUnique) { cb(1); return; }
        writeUserToDb(email, password, name);
        cb(0);
    }).catch((err: any) => { console.error(err); cb(-1); return; });
}

function writeUserToDb(email: string, password: string, name: string) {
    bcrypt.genSalt(10, function(_err, salt) {
        bcrypt.hash(password, salt, function(_err, hash) {
            connection.execute('INSERT INTO `users` (`email`, `password`, `name`) VALUES (?, ?, ?)', [email, hash, name]);
        });
    })
}