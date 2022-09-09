import { connection } from './databaseDao.js';

export default async (email: string, token: string) => {

    return await connection.execute('SELECT * FROM `tokens` WHERE `email` = ? AND `token` = ?', [email, token]).then((rows: any) => {
        if (rows[0].length > 0) {
            let expiry = new Date(parseInt(rows[0][0].expiry));
            let currentDate = Date.now().toString();
            if (expiry.toString() > currentDate) {
                clearTokens(email);
                return 0;
            } else {
                clearTokens(email);
                return 1;
            }
        } else {
            clearTokens(email);
            return -1;
        }
    });

    function clearTokens(_email: string) {
        // connection.execute('DELETE FROM `tokens` WHERE `email` = ?', [email]);
    }
}