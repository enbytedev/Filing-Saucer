import multer from 'multer';
import path from 'path';
import util from 'util';
import { v1 as uuidv1 } from 'uuid';
import crypto from 'crypto';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';
import config from '../../../setup/config.js';
import { renderDash } from '../user/dash.js';

const upload = util.promisify(multer({
    storage: multer.diskStorage({   
        destination: path.format({dir: config.uploadDirectory, base: ''}),
        filename: (req, file, cb) => { cb(null, genName((req.session as UserSessionInterface).email, path.extname(file.originalname))); }
    }),
    limits: { fileSize: 1000000 * Number(config.maxFileSizeMB) },
}).single('file'));

let name = '';

function genName(email: any, ext: string) {
    name = crypto.createHash('shake256', {outputLength: 8}).update(uuidv1()).update(email).update(crypto.randomBytes(256)).digest("hex");
    name = name + ext.toLowerCase();
    return name;
}

function writeUploadToDatabase(email: any, name: string) {
    databaseDao.createUpload(email, name);
}

export default async (req: any, res: any) => {
        try {
            await upload(req, res);
            if (req.file == undefined) { renderDash(req, res, `no file selected...`); }
            else {
            writeUploadToDatabase((req.session as UserSessionInterface).email, name);
            renderDash(req, res, `file uploaded successfully...`);
            }
        } catch (err: any) {
            if (err.code == 'LIMIT_FILE_SIZE') { renderDash(req, res, `filesize exceeded ${config.maxFileSizeMB}MB; upload aborted...`); }
        }
}