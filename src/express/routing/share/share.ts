import { Response, Request } from 'express';
import path from 'path';
import fs from 'fs';
import config from '../../../setup/config.js';
import databaseDao from '../../../database/databaseDao.js';

const uploadDirectory = path.format({dir: config.uploadDirectory, base: ''});

export default async (req: Request, res: Response) => {
    if (fs.existsSync(uploadDirectory + req.params.name)) {
    databaseDao.getUserNameFromFile(req.params.name, async (userFirstName: any) => {
        res.render('share/share.ejs', {fileName: req.params.name, userFirstName: userFirstName.toLowerCase(), enablePreview: await isPreviewable(req.params.name)});
    });
    } else { res.render('basic/notFound.ejs'); }
}

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