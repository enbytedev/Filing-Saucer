import fs from 'fs';
import path from 'path';
import config from '../../../setup/config.js';
import { connection } from '../../databaseAccess.js';

const uploadDirectory = path.format({dir: config.uploadDirectory, base: ''});

export default async (email: string, filename: string) => {
    await connection.execute('SELECT `email` FROM `uploads` WHERE `filename` = ?', [filename]).then((results: any) => {
        if (results[0][0].email == email) {
            if (fs.existsSync(uploadDirectory + filename)) {
                fs.unlinkSync(uploadDirectory + filename)
            }
            connection.execute('DELETE FROM `uploads` WHERE `email` = ? AND `filename` = ?', [email, filename]);
        }
    });
}