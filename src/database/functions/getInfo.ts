import { connection } from '../databaseAccess.js';

export async function getUserNameFromEmail(email: string, cb: Function) {
    let rows: any = await connection.execute('SELECT `name` FROM `users` WHERE `email` = ?', [email]); cb(rows[0][0].name); return rows[0][0].name;
}

export async function getHistory(email: string | undefined, cb: Function) {
    if (email != undefined) { await connection.execute('SELECT `filename`, `originalname`, `date`, `private` FROM `uploads` WHERE `email` = ?', [email]).then((results: any) => { cb(results[0]); }); }
}

export async function getUserNameFromFile(filename: string): Promise<string> {
    return connection.execute('SELECT `email` FROM `uploads` WHERE `filename` = ?', [filename]).then((results: any) => {
        return connection.execute('SELECT `name` FROM `users` WHERE `email` = ?', [results[0][0].email]).then((results: any) => {
            return results[0][0].name;
        });
    });
}

export async function getOriginalNameFromFile(filename: string) {
    let rows: any = await connection.execute('SELECT `originalname` FROM `uploads` WHERE `filename` = ?', [filename]); return (rows[0][0].originalname);
}