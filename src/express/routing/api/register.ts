import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';

const emailRegex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);

export default async (req: Request, res: Response) => {
    // Make email lowercase for database consistency.
    let email = req.body.email.toLowerCase();
    
    // Check if email is valid
    if (!emailRegex.test(email)) {
        let error = `<div class="glass-clear" style="margin: 50;"><h2><i>Your email is invalid!</i></h2></div>`
        res.render('auth/register.ejs', {error: error});
        return;
    }

    // Register user in database and then log them in. Give error message for different conditions.
    databaseDao.registerUser(email, req.body.password).then((results: number) => {
        if (results == 0) {
            (req.session as UserSessionInterface).userName = email;
            res.redirect('/dash');
        } else if (results == 1) {
            giveUserError("Email already in use!");
        } else if (results == -1) {
            giveUserError("Something went wrong!");
        }
    });

    function giveUserError(message: string) {
        let error = `<div class="glass-clear" style="margin: 50;"><h2><i>${message}</i></h2></div>`
        res.render('auth/register.ejs', {error: error});
    }
}