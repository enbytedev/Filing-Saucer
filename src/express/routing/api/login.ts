import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';

export default async (req: Request, res: Response) => {
    databaseDao.loginUser(req.body.email, req.body.password, (result: number | string) => {
        if (result == 0) {
    console.debug(`Successfully logged in user ${req.body.email}`, "Login");
    // TODO: Store user in session and redirect to dash page
        } else if (result != 0) {
    let error = `<div class="glass-clear" style="margin: 50;"><h2><i>${result}</i></h2></div>`
        res.render('auth/login.ejs', {error: error});
        }
    });
}