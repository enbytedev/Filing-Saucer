import multer from 'multer';
import path from 'path';
import util from 'util';
import { v1 as uuidv1 } from 'uuid';
import crypto from 'crypto';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';

const upload = util.promisify(multer({
    storage: multer.diskStorage({   
        destination: 'uploads', 
          filename: (req, file, cb) => {
              cb(null, genName((req.session as UserSessionInterface).email, path.extname(file.originalname)) + path.extname(file.originalname))
        }
    }),
    limits: {
      fileSize: 1000000 * 100 // 100 MB max file size
    },
}).single('file'));

function genName(email: any, ext: string) {
    let name = crypto.createHash('shake256', {outputLength: 8}).update(uuidv1()).update(email).update(crypto.randomBytes(256)).digest("hex");
    name = name + ext;
    writeUploadToDatabase(email, name);
    return name;
}

function writeUploadToDatabase(email: any, name: string) {
    databaseDao.newFileUpload(email, name);
}

export default async (req: any, res: any) => {
    upload(req, res);
}