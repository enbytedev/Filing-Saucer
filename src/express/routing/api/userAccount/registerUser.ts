import { Response, Request } from 'express';
import databaseAccess from '../../../../database/databaseAccess.js';
import { renderRegister } from '../../auth/register.js';
import emailRegex from '../../../../helpers/emailRegex.js';
import tzList from '../../../../helpers/tzList.js';

export default async (req: Request, res: Response) => {
    if (req.body.email == "" 
    || req.body.password == "" 
    || req.body.name == "" 
    || req.body.timezone == "") { 
        renderRegister(req, res, "Please fill in all fields!"); return; 
    }

    if (!tzList.includes(req.body.timezone)) { renderRegister(req, res, "Invalid timezone!"); return; }

    let email = req.body.email.toLowerCase(); // Make email lowercase for database consistency.
    email = email.replace(/\s+/g, ''); // Remove all whitespace from email.
    
    // Check if email is valid
    if (!emailRegex.test(email)) {
        let error = `<div class="glass-clear" style="margin: 50;"><h2><i>Your email is invalid!</i></h2></div>`
        res.render('auth/register.ejs', {error: error});
        return;
    }

    // Register user in database and then log them in. Give error message for different conditions.
    databaseAccess.userAccount.register(email, req.body.password, req.body.name, req.body.timezone, (response: number) => {
        if (response == 0) {
            res.redirect('/login');
        } else if (response == -1) {
            renderRegister(req, res, "Something went wrong!");
        } else if (response == 1) {
            renderRegister(req, res, "This email is already in use!");
        } else if (response == 2) {
            renderRegister(req, res, "Please provide a password!");
        }
    });

}