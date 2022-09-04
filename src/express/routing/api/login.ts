import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';

export default async (req: Request, res: Response) => {
    databaseDao.loginUser(req.body.email, req.body.password).then((results: any) => {
        console.log(results[0].userName);
        (req.session as UserSessionInterface).Email = req.body.email;
        (req.session as UserSessionInterface).UserName = req.body.email;
        console.debug(`Successfully logged in user ${req.body.email}`, "Login");
        res.redirect('/dash');
    }).catch(() => {
        let error = `<div class="glass-clear" style="margin: 50;"><h2><i>Your details are incorrect!</i></h2></div>`
        res.render('auth/login.ejs', {error: error});
    });
}