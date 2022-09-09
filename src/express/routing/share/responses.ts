import { Response, Request } from 'express';
import config from '../../../setup/config.js';
import path from 'path';
import databaseDao from '../../../database/databaseDao.js';

const uploadDirectory = path.format({dir: config.uploadDirectory, base: ''});

export async function downloadFile(req: Request, res: Response) {
    databaseDao.getUserNameFromFile(req.params.name, async (userFirstName: any) => {
        if (await databaseDao.isFilePrivate(req.params.name)) { res.render('share/private.ejs', {fileName: req.params.name, userFirstName: userFirstName}); return; }
        res.download(uploadDirectory + req.params.name, (err) => {
            if (err) { res.render('basic/notFound.ejs'); }
        });
    });
}

export async function viewFile(req: Request, res: Response) {
        databaseDao.getUserNameFromFile(req.params.name, async (userFirstName: any) => {
        if (await databaseDao.isFilePrivate(req.params.name)) { res.render('share/private.ejs', {fileName: req.params.name, userFirstName: userFirstName}); return; }
        res.sendFile(req.params.name, {root: uploadDirectory}, (err) => {
            if (err) { res.render('basic/notFound.ejs'); }
        });
    });
}