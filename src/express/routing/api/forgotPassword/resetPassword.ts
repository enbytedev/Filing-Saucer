import { Response, Request } from 'express';
import databaseAccess from '../../../../database/databaseAccess.js';

export default async (req: Request, res: Response) => {
    if (req.body.code == "") { giveUserError("Please provide the token sent to your email!"); return; }
    if (req.body.email == "") { giveUserError("Please provide your email!"); return; }
    if (req.body.password == "") { giveUserError("Please provide a password!"); return; }

    // Make email lowercase for database consistency.
    let email = req.body.email.toLowerCase();
    email = email.replace(/\s+/g, '');

    let result: number = await databaseAccess.handleToken.validateToken(email, req.body.code)
    if (result == 0) {
        databaseAccess.userAccount.updateUser("password", email, req.body.password)
        res.render('auth/login.ejs', { error: 'Password changed! Please login.' });
    } else if (result == 1) { 
        giveUserError("Token has expired. Please request a new token.");
        return;
    } else if (result == -1) { giveUserError("Invalid token!"); return; }

function giveUserError(message: string) {
    let error = `<div class="glass-clear" style="margin: 50;"><h2><i>${message}</i></h2></div>`
    res.render('auth/reset.ejs', {message: error});
}
}