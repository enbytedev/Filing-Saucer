import { Response, Request } from 'express';
import { UserSessionInterface } from '../sessionInterfaces.js';
import tzList from '../../../helpers/tzList.js';

export default async (req: Request, res: Response) => {
    renderAccount(req, res, "");
}

export function renderAccount(req: Request, res: Response, message: string) {
    let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
    let email = ((req.session as UserSessionInterface).email)?.toLowerCase();
    let timezone = ((req.session as UserSessionInterface).timezone)?.toLowerCase();
    res.render('user/account.ejs', { name: name, email: email, currentTimezone: timezone, timezoneList: tzList, error: message });
}