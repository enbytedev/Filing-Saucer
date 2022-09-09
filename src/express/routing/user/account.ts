import { Response, Request } from 'express';
import { UserSessionInterface } from '../sessionInterfaces.js';

export default async (req: Request, res: Response) => {
    renderAccount(req, res, "");
}

export function renderAccount(req: Request, res: Response, message: string) {
    let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
    let email = ((req.session as UserSessionInterface).email)?.toLowerCase();
    res.render('user/account.ejs', { name: name, email: email, error: message });
}