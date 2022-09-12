import { Response, Request } from 'express';
import config from '../../../setup/config.js';
import path from 'path';
import databaseAccess from '../../../database/databaseAccess.js';
import { UserSessionInterface } from '../sessionInterfaces.js';

const uploadDirectory = path.format({dir: config.uploadDirectory, base: ''});

export async function downloadFile(req: Request, res: Response) {
    let userFirstName = (await databaseAccess.getInfo.getUserNameFromFile(req.params.name)).toLowerCase();
    if (await databaseAccess.checks.isFilePrivate(req.params.name)) {
        if (await databaseAccess.checks.isUserFileOwner(req.params.name, String((req.session as UserSessionInterface).email))) {
            res.download(uploadDirectory + req.params.name, (err) => {
                if (err) { res.render('basic/notFound.ejs'); }
            });
            return;
        } else {
        res.render('share/private.ejs', {fileName: req.params.name, userFirstName: userFirstName});
        return;
    }
    }
    res.download(uploadDirectory + req.params.name, (err) => {
        if (err) { res.render('basic/notFound.ejs'); }
    });
}

export async function viewFile(req: Request, res: Response) {
    let userFirstName = (await databaseAccess.getInfo.getUserNameFromFile(req.params.name)).toLowerCase();
    if (await databaseAccess.checks.isFilePrivate(req.params.name)) { res.render('share/private.ejs', {fileName: req.params.name, userFirstName: userFirstName}); return; }
        res.sendFile(req.params.name, {root: uploadDirectory}, (err) => {
            if (err) { res.render('basic/notFound.ejs'); }
        });
}