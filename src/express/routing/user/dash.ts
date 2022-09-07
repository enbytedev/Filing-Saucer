import { Response, Request } from 'express';
import { UserSessionInterface } from '../sessionInterfaces.js';

export default async (req: Request, res: Response) => {
    let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
    res.render('user/dash.ejs', { name: name, panel: "<h2><i>what would you like to do</i></h2>" });
}