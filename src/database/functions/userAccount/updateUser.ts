import { connection } from '../../databaseAccess.js';
import bcrypt from 'bcrypt';

export default async (operation: string, email: string, argument: string) => {
    if (operation === 'name') {
        return updateName(email, argument);
    } else if (operation === 'password') {
        return updatePassword(email, argument);
    } else if (operation === 'timezone') {
        return updateTimezone(email, argument);
    }
}

function updatePassword(email: string, password: string) {
    bcrypt.genSalt(10, function(_err, salt) {
        bcrypt.hash(password, salt, function(_err, hash) {
            connection.execute('UPDATE `users` SET `password` = ? WHERE `email` = ?', [hash, email]);
            return true;
        });
    })
}

function updateName(email: string, name: string) {
    connection.execute('UPDATE `users` SET `name` = ? WHERE `email` = ?', [name, email]);
    return true;
}

function updateTimezone(email: string, timezone: string) {
    connection.execute('UPDATE `users` SET `timezone` = ? WHERE `email` = ?', [timezone, email]);
    return true;
}