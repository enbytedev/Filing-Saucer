import { Request, Response } from 'express';
import path from 'path';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { RenderUser } from '../render/user.js';
import databaseAccess from '../../../../database/databaseAccess.js';
import config from '../../../../setup/config.js';
import multer from 'multer';

let name: string;

class UploadRoutes {
    async upload(req: Request, res: Response) {
        if (await databaseAccess.checks.isUserStorageFull(String((req.session as UserSessionInterface).email))) { RenderUser.dash(req, res, `you have uploaded the maximum number of files allowed. please delete a few to proceed...`); return;}
        
        try {
            await uploadFile(req, res);
            if (req.file == undefined) { RenderUser.dash(req, res, `no file selected...`); return;}
            databaseAccess.add.upload({
                userId: String((req.session as UserSessionInterface).userId),
                filename: name,
                date: Date.now().toString(),
                private: 0
            });
            RenderUser.dash(req, res, `file uploaded successfully...`);
        } catch (err: any) {
            if (err.code == 'LIMIT_FILE_SIZE') { RenderUser.dash(req, res, `filesize exceeded ${config.maxFileSizeMB}MB; upload aborted...`); }
        }
    }
}

export default UploadRoutes;

const uploadFile = util.promisify(multer({
    storage: multer.diskStorage({   
        destination: path.format({dir: config.uploadDirectory, base: ''}),
        filename: async (req, file, cb) => { cb(null, await genName((req.session as UserSessionInterface).email, path.extname(file.originalname))); }
    }),
    limits: { fileSize: 1000000 * Number(config.maxFileSizeMB) },
}).single('file'));

async function genName(email: any, ext: string) {
    name = crypto.createHash('shake256', {outputLength: 8}).update(uuidv4()).update(email).update(crypto.randomBytes(256)).digest("hex");
    name = name + ext.toLowerCase();
    if (await databaseAccess.checks.isNameTaken(name)) {
        console.warn("Name already taken, retrying... a system administrator should check resource usage if this recurs.", "Upload");
        genName(email, ext);
    }
    return name;
}