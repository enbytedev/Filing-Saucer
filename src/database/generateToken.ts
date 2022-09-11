import { connection } from './databaseAccess.js';
import sugarcube from 'sugarcube';

export default async (email: string) => {
    let token = sugarcube.misc.randomNumber(8);

    await connection.execute('DELETE FROM `tokens` WHERE `email` = ?', [email]);
    await connection.execute('INSERT INTO `tokens` (`email`, `token`, `expires`) VALUES (?, ?, ?)', [email, token, (Date.now() + 600000).toString()]);
    return token;
}