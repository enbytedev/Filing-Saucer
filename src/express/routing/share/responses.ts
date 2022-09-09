import { Response, Request } from 'express';
import config from '../../../setup/config.js';
import path from 'path';

const uploadDirectory = path.format({dir: config.uploadDirectory, base: ''});

export function downloadFile(req: Request, res: Response) {
    res.download(uploadDirectory + req.params.name, (err) => {
        if (err) { res.render('basic/notFound.ejs'); }
    });
}

export function viewFile(req: Request, res: Response) {
    res.sendFile(req.params.name, {root: uploadDirectory}, (err) => {
        if (err) { res.render('basic/notFound.ejs'); }
    });
}