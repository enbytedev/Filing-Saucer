import { Response, Request } from 'express';
import databaseAccess from '../../../../database/databaseAccess.js';
import { UserSessionInterface } from '../../sessionInterfaces.js';

export default async (req: Request, res: Response) => {
    if (req.body.email == "" || req.body.password == "") { giveUserError("Please provide an email and password!"); return; }

    // Make email lowercase for database consistency.
    let email = req.body.email.toLowerCase();
    email = email.replace(/\s+/g, '');

    databaseAccess.userAccount.login(email, req.body.password, (isCorrect: boolean) => {
        if (isCorrect) {
            databaseAccess.getInfo.getUserNameFromEmail(email, (name: any) => {
                (req.session as UserSessionInterface).email = email;
                (req.session as UserSessionInterface).firstName = name;
                res.redirect('/dash');
            });
        } else { giveUserError("Invalid email or password!"); }
    });

    function giveUserError(message: string) {
        let error = `<div class="glass-clear" style="margin: 50;"><h2><i>${message}</i></h2></div>`
        res.render('auth/login.ejs', {error: error});
    }
}