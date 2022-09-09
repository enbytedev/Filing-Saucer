import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';
import { renderAccount } from '../user/account.js';

export default async (req: Request, res: Response) => {
    if (req.body.password == "*****") { req.body.password = null; }
    if (req.body.name == await databaseDao.getUserNameFromEmail(String((req.session as UserSessionInterface).email), () => {})) { req.body.newpassword = null; }
    databaseDao.updateUser(String((req.session as UserSessionInterface).email), req.body.name, req.body.password, req.body.oldpassword, async (err: number) => {
        if (err == 0) {
            (req.session as UserSessionInterface).firstName = req.body.name;
            await new Promise(r => setTimeout(r, 500));
            renderAccount(req, res, "Account updated"); 
        }
        else if (err == 1) { renderAccount(req, res, "Wrong password"); }
        else { renderAccount(req, res, "Something went wrong"); }
    });
}