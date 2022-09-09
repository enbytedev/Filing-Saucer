import { Response, Request } from 'express';
import config from '../../../setup/config.js';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.format({dir: config.uploadDirectory, base: ''});

export default async (req: Request, res: Response) => {
    if (fs.existsSync(uploadDirectory + req.params.name)) {
    let enablePreview = false;
    if (isPreviewable(req.params.name)) { enablePreview = true; }
    res.render('share/share.ejs', {fileName: req.params.name, userFirstName: "test", enablePreview: enablePreview});
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