import multer from 'multer';
import path from 'path';
import util from 'util';
import { v1 as uuidv1 } from 'uuid';
import crypto from 'crypto';
import databaseAccess from '../../../database/databaseAccess.js';
import { UserSessionInterface } from '../sessionInterfaces.js';
import config from '../../../setup/config.js';
import { renderDash } from '../user/dash.js';

const upload = util.promisify(multer({
    storage: multer.diskStorage({   
        destination: path.format({dir: config.uploadDirectory, base: ''}),
        filename: async (req, file, cb) => { cb(null, await genName((req.session as UserSessionInterface).email, path.extname(file.originalname))); }
    }),
    limits: { fileSize: 1000000 * Number(config.maxFileSizeMB) },
}).single('file'));

let name = '';

async function genName(email: any, ext: string) {
    name = crypto.createHash('shake256', {outputLength: 8}).update(uuidv1()).update(email).update(crypto.randomBytes(256)).digest("hex");
    name = name + ext.toLowerCase();
    if (await databaseAccess.isNameTaken(name)) {
        console.warn("Name already taken, retrying... a system administrator should check resource usage if this recurs.", "Upload");
        genName(email, ext);
    }
    return name;
}

export default async (req: any, res: any) => {
    if (await databaseAccess.isUserStorageFull(String((req.session as UserSessionInterface).email))) { renderDash(req, res, `you have uploaded the maximum number of files allowed. please delete a few to proceed...`); } else {
        try {
            await upload(req, res);
            if (req.file == undefined) { renderDash(req, res, `no file selected...`); }
            else {
                databaseAccess.createUpload(String((req.session as UserSessionInterface).email), name, req.file.originalname);
                renderDash(req, res, `file uploaded successfully...`);
            }
        } catch (err: any) {
            if (err.code == 'LIMIT_FILE_SIZE') { renderDash(req, res, `filesize exceeded ${config.maxFileSizeMB}MB; upload aborted...`); }
        }
    }
}