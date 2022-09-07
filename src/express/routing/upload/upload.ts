import multer from 'multer';
import path from 'path';
import util from 'util';
import { v1 as uuidv1 } from 'uuid';
import crypto from 'crypto';
// import databaseDao from '../../../database/databaseDao.js';

const storageConfig = multer.diskStorage({   
    destination: 'uploads', 
      filename: (_req, file, cb) => {
          cb(null, genName()
             + path.extname(file.originalname))
    }
});

const upload = util.promisify(multer({
    storage: storageConfig,
    limits: {
      fileSize: 1000000 * 100 // 100 MB max file size
    },
}).single('file'));

function genName() {
    let name = crypto.createHash('shake256', {outputLength: 8}).update(uuidv1()).update(crypto.randomBytes(256)).digest("hex");
    return name;
}

export default async (req: any, res: any) => {
    upload(req, res);
    // TODO: Store and pass genName() to databaseDao.newFileUpload()
    // databaseDao.newFileUpload(req.session.email, name);
    
}