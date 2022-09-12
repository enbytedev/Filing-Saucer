import { Response, Request } from 'express';
import nodemailer from 'nodemailer';
import databaseAccess from '../../../../database/databaseAccess.js';
import { emailInfo } from '../../../../setup/config.js';

export const transporter = nodemailer.createTransport({
    host: `${emailInfo.emailHost}`,
    port: parseInt(`${emailInfo.emailPort}`),
    secure: true,
    auth: {
        user: `${emailInfo.emailAccount}`,
        pass: `${emailInfo.emailPassword}`
    }
});

export default async (req: Request, res: Response) => {
    if (req.body.email == "") { giveUserError("Please provide an email!"); return; }

    if (await databaseAccess.checks.isEmailInDatabase(req.body.email)) {
        // Make email lowercase for database consistency.
        let email = req.body.email.toLowerCase();
        email = email.replace(/\s+/g, '');
        
        var mailOptions = {
            from: `${emailInfo.emailFrom}`,
            to: req.body.email,
            subject: 'Password Reset @ Filing Saucer',
            text: `Hello, ${await databaseAccess.getInfo.getUserNameFromEmail(req.body.email, () => {})}! You have requested a password reset. You may use the code below to reset your password. If you did not request a password reset, please ignore this email.\nCode: ${await databaseAccess.handleToken.generateToken(req.body.email)}`
        };

        transporter.sendMail(mailOptions, function(error: any, info: any) {
            if (error) {console.error(error);} else {
                console.debug('Email sent: ' + info.response);
                res.render('auth/reset.ejs', { message: 'Email sent! Please check your inbox.' });
            }
        });
    } else { giveUserError("Invalid email!"); }
    
        function giveUserError(message: string) {
            let error = `<div class="glass-clear" style="margin: 50;"><h2><i>${message}</i></h2></div>`
            res.render('auth/forgot.ejs', {message: error});
        }
}