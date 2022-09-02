import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';

export default async (req: Request, res: Response) => {
    databaseDao.loginUser(req.body.email, req.body.password, (result: number | string) => {
        if (result == 0) {
            req.session.regenerate(function(err) {
                if (err) {
                    console.error(err);
                } else {
                    (req.session as UserSessionInterface).Email = req.body.email;
                    (req.session as UserSessionInterface).UserName = req.body.email;
                    console.debug(`Successfully logged in user ${req.body.email}`, "Login");
                    res.redirect('/dash');
                }
            });
        } else if (result != 0) {
    let error = `<div class="glass-clear" style="margin: 50;"><h2><i>${result}</i></h2></div>`
        res.render('auth/login.ejs', {error: error});
        }
    });
}