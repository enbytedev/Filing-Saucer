import { connection } from '../../databaseAccess.js';
import bcrypt from 'bcrypt';


export default async (email: string, name: string | null, newpassword: string | null, password: string, cb: Function) => {

    connection.execute('SELECT `password` FROM `users` WHERE `email` = ?', [email]).then((results: any) => {
        if (results[0].length === 0) { return false; } else {
            bcrypt.compare(password, results[0][0].password, async function(_err: any, isCorrect: boolean) {
                if (isCorrect) {
                    if (newpassword != null) {await updatePassword(email, newpassword);}
                    if (name != null) {await updateName(email, name);}
                    return cb(0);
                } else { return cb(1); }
            });
        }
    })
}
    
function updateName(email: string, name: string) {
            connection.execute('UPDATE `users` SET `name` = ? WHERE `email` = ?', [name, email]);
}

function updatePassword(email: string, password: string) {
    bcrypt.genSalt(10, function(_err, salt) {
        bcrypt.hash(password, salt, function(_err, hash) {
            connection.execute('UPDATE `users` SET `password` = ? WHERE `email` = ?', [hash, email]);
        });
    })
}