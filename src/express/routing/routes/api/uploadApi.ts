import { Request, Response } from 'express';
import { replaceRegex } from 'sugarcube';
import path from 'path';
import util from 'util';
import fs from 'fs';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { RenderUser } from '../render/user.js';
import databaseAccess from '../../../../database/databaseAccess.js';
import config from '../../../../setup/config.js';
import multer from 'multer';
import { logger } from '../../../../index.js';

let filename: string;

class UploadRoutes {
    async upload(req: Request, res: Response) {
        let userId = (req.session as UserSessionInterface).userId;

        // multer configuration.
        const uploadFile = util.promisify(multer({
            storage: multer.diskStorage({
                destination: path.format({ dir: config.uploadDirectory + path.sep + userId, base: '' }),
                filename: async (req, file, cb) => { cb(null, await genName((req.session as UserSessionInterface).userId, file.originalname)); }
            }),
            limits: { fileSize: 1000000 * Number(config.maxFileSizeMB) },
        }).single('file'));

        if (await databaseAccess.checks.isUserStorageFull(userId)) { RenderUser.dash(req, res, `you have uploaded the maximum number of files allowed. please delete a few to proceed...`); return; }

        try {
            await uploadFile(req, res)
                if (req.file == undefined) { RenderUser.dash(req, res, `no file selected...`); return; }
                databaseAccess.add.upload({
                    userId: String((req.session as UserSessionInterface).userId),
                    filename: filename,
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

async function genName(userId: any, name: string) {
    let i: number = -1;
    let originalName: string = replaceRegex(name, '-', '/', '"', ':', ' ');
    while (fs.existsSync(path.format({ dir: config.uploadDirectory + path.sep + userId, base: name }))) {
        logger.debug("File name already taken, retrying name for userId: " + userId, "Upload");
        i++;
        name = i + '-' + originalName;
    }
    filename = name;
    return name;
}