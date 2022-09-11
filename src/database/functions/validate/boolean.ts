import { connection } from '../../databaseAccess.js';
import config from '../../../setup/config.js';
import bcrypt from 'bcrypt';

export async function isUserFileOwner(filename: string, email: string) {
    return await connection.execute('SELECT `email` FROM `uploads` WHERE `filename` = ?', [filename])
    .then((rows: any) => { return rows[0][0].email == email; });
}

export async function isNameTaken(filename: string) {
    return await connection.execute('SELECT `filename` FROM `uploads` WHERE `filename` = ?', [filename])
    .then((rows: any) => { return rows[0].length > 0; });
}

export async function isFilePrivate(filename: string) {
    return await connection.execute('SELECT `private` FROM `uploads` WHERE `filename` = ?', [filename])
    .then((rows: any) => { return rows[0][0].private[0] == 1; });
}

export async function isUserStorageFull(email: string) {
    return await connection.execute('SELECT `email` FROM `uploads` WHERE `email` = ?', [email])
    .then((rows: any) => { return rows[0].length >= config.maxUploadCount; })
}

export async function isPasswordCorrect(email: string, password: string) {
    return await connection.execute('SELECT `password` FROM `users` WHERE `email` = ?', [email])
    .then((rows: any) => {
        return new Promise((resolve) => {
            bcrypt.compare(password, rows[0][0].password, function(_err: any, isCorrect: boolean) {
                resolve(isCorrect);
                return;
            });
        });
    });
}