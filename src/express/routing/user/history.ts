import { Response, Request } from 'express';
import { UserSessionInterface } from '../sessionInterfaces.js';
import databaseDao from '../../../database/databaseDao.js';

export default async (req: Request, res: Response) => {
    renderHistory(req, res, "");
}

export function renderHistory(req: Request, res: Response, message: string) {
    databaseDao.getHistory((req.session as UserSessionInterface).email, (history: any) => {
        let files: Array<String> = [];
        for (history of history) {
            files.push(history.filename);
        }
        res.render('user/history.ejs', { info: message, files: files });
    });
}