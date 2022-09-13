import { Response, Request } from 'express';
import tzList from '../../../helpers/tzList.js';

export default async (_req: Request, res: Response) => {
    renderRegister(_req, res, "");
}

export function renderRegister(_req: Request, res: Response, message: string) {
    let displayMessage = null;
    if (message != "") { displayMessage = `<div class="glass-clear" style="margin: 50;"><h2><i>${message}</i></h2></div>` };
    res.render('auth/register.ejs', {timezones: tzList, message: displayMessage});
}