import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';

export default async (req: Request, res: Response) => {
    if (req.body.email == "" || req.body.password == "") { giveUserError("Please provide an email and password!"); return; }
    databaseDao.loginUser(req.body.email, req.body.password, (isCorrect: boolean) => {
        if (isCorrect) {
            (req.session as UserSessionInterface).userName = req.body.email;
            console.debug(`Successfully logged in user ${req.body.email}`, "Login");
            res.redirect('/dash');
        } else { giveUserError("Invalid email or password!"); }
    });

    function giveUserError(message: string) {
        let error = `<div class="glass-clear" style="margin: 50;"><h2><i>${message}</i></h2></div>`
        res.render('auth/login.ejs', {error: error});
    }
}