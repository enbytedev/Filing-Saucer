import databaseAccess, { connection } from '../../databaseAccess.js';
import bcrypt from 'bcrypt';


export default async (email: string, password: string, name: string, cb: Function) => {
    if (password.length < 1) { cb(2); return; }
    if (await databaseAccess.checks.isEmailInDatabase) { cb(1); return; }
    writeUserToDb(email, password, name);
    cb(0);
}

function writeUserToDb(email: string, password: string, name: string) {
    bcrypt.genSalt(10, function(_err, salt) {
        bcrypt.hash(password, salt, function(_err, hash) {
            connection.execute('INSERT INTO `users` (`email`, `password`, `name`) VALUES (?, ?, ?)', [email, hash, name]);
        });
    })
}