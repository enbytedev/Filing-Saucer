import { Response, Request } from 'express';
import path from 'path';
import fs from 'fs';
import config from '../../../setup/config.js';
import databaseAccess from '../../../database/databaseAccess.js';

const uploadDirectory = path.format({dir: config.uploadDirectory, base: ''});

export default async (req: Request, res: Response) => {
    if (!fs.existsSync(uploadDirectory + req.params.name)) { res.render('basic/notFound.ejs'); return; }
    let userFirstName = (await databaseAccess.getInfo.getUserNameFromFile(req.params.name)).toLowerCase();
    if (await databaseAccess.checks.isFilePrivate(req.params.name)) { res.render('share/private.ejs', {fileName: req.params.name, userFirstName: userFirstName}); return; }
    res.render('share/share.ejs', {fileName: req.params.name, originalFileName: await databaseAccess.getInfo.getOriginalNameFromFile(req.params.name), userFirstName: userFirstName.toLowerCase(), enablePreview: await isPreviewable(req.params.name)});

    function isPreviewable(fileName: string) {
        if (fileName.endsWith('.png') 
        || fileName.endsWith('.jpg') 
        || fileName.endsWith('.jpeg') 
        || fileName.endsWith('.gif') 
        || fileName.endsWith('.txt') 
        || fileName.endsWith('.pdf')
        || fileName.endsWith('.md')
        || fileName.endsWith('.mp3')
        || fileName.endsWith('.wav')
        || fileName.endsWith('.ogg')
        || fileName.endsWith('.mp4')) {
            return true;
        }
        return false;
    }
}