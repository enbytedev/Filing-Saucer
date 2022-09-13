import { Response, Request } from 'express';
import { UserSessionInterface } from '../sessionInterfaces.js';
import databaseAccess from '../../../database/databaseAccess.js';

export default async (req: Request, res: Response) => {
    renderHistory(req, res, "");
}

export async function renderHistory(req: Request, res: Response, message: string) {
    let email = String((req.session as UserSessionInterface).email);
    databaseAccess.getInfo.getHistory(email, async (history: any) => {
        var count = history.length;
        let bundles: Array<any> = [];
        for (var i = 0; i < count; i++) {
            bundles.push([history[i].filename, history[i].originalname, new Date(parseInt(history[i].date)).toLocaleString('en-US', {timeZone: await databaseAccess.getInfo.getTimezoneFromEmail(email)}), history[i].private[0] == 1]);
        }

        res.render('user/history.ejs', { info: message, bundles: bundles });
    });
}