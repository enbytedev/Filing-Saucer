import { Request, Response } from 'express';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { RenderAuth } from '../render/auth.js';
import { isEmailValid, isStringLongEnough, isPasswordSecure, isValidTimezone } from '../../../../helpers/validateInputs.js';
import { emailConfiguration } from '../../../../setup/config.js';
import databaseAccess from '../../../../database/databaseAccess.js';
import bcrypt from 'bcrypt';
import { transporter } from '../../../../helpers/emailTransporter.js';
import sugarcube from 'sugarcube';

class AuthRoutes {
    async login(req: Request, res: Response) {
        if (!isEmailValid(req.body.email)) { RenderAuth.login(req, res, "Invalid email!"); return; }
        if (!isStringLongEnough(req.body.password)) { RenderAuth.login(req, res, "Please provide a password!"); return; }
        if (!await databaseAccess.checks.isEmailInDatabase(req.body.email)) { RenderAuth.login(req, res, "This email is not registered!"); return; }

        let userId = await databaseAccess.getInfo.getUserIdFromEmail(req.body.email);
        if (await databaseAccess.checks.isPasswordCorrect(userId, req.body.password)) {
            (req.session as UserSessionInterface).userId = userId;
            (req.session as UserSessionInterface).email = req.body.email.toLowerCase();
            (req.session as UserSessionInterface).firstName = await databaseAccess.getInfo.getUserNameFromUserId(userId);
            (req.session as UserSessionInterface).timezone = await databaseAccess.getInfo.getTimezoneFromUserId(userId);
            res.redirect('/dash');
        } else { RenderAuth.login(req, res, "Invalid email or password!"); }
    }
    async register(req: Request, res: Response) {
        if (await databaseAccess.checks.isEmailInDatabase(req.body.email)) { RenderAuth.register(req, res, "This email is already in use!"); return; }
        if (!isEmailValid(req.body.email)) { RenderAuth.register(req, res, "Invalid email!"); return; }
        if (!isStringLongEnough(req.body.name, 2)) { RenderAuth.register(req, res, "Please provide a name longer than one character!"); return; }
        if (!isPasswordSecure(req.body.password)) { RenderAuth.register(req, res, "Your password must have at least 6 characters, uppercase and lowercase letters, and a number!"); return; }
        if (!isValidTimezone(req.body.timezone)) { RenderAuth.register(req, res, "Please provide a valid timezone!"); return; }

        let passwordHash: string = await bcrypt.hash(req.body.password, 10);
        let timezone: string = req.body.timezone;

        if (await databaseAccess.add.user({ email: req.body.email.toLowerCase(), password: passwordHash, name: req.body.name, timezone: timezone })) {
            (req.session as UserSessionInterface).email = req.body.email.toLowerCase();
            (req.session as UserSessionInterface).firstName = req.body.name;
            (req.session as UserSessionInterface).timezone = req.body.timezone;
            res.redirect('/dash');
        } else { RenderAuth.register(req, res, "Something went wrong!"); }
    }
    async requestReset(req: Request, res: Response) {
        // Make email lowercase and remove spaces for database consistency.
        let email = req.body?.email.toLowerCase();
        email = email.replace(/\s+/g, '');

        if (email == "" && isEmailValid(email)) { RenderAuth.requestPasswordReset(req, res, "Please provide an email!"); return; }
        if (!await databaseAccess.checks.isEmailInDatabase(email)) { return RenderAuth.requestPasswordReset(req, res, "Invalid email!"); }

        let token = sugarcube.randomNumber(8);

        databaseAccess.add.token({ userId: await databaseAccess.getInfo.getUserIdFromEmail(email), token: token, expires: (Date.now() + 600000).toString() });

        var mailOptions = {
            from: `${emailConfiguration.from}`,
            to: email,
            subject: 'Password Reset @ Filing Saucer',
            text: `Hello, ${await databaseAccess.getInfo.getUserNameFromEmail(email)}! You have requested a password reset. You may use the code below to reset your password. If you did not request a password reset, please ignore this email.\nCode: ${token}`
        };

        transporter.sendMail(mailOptions, function(error: any, info: any) {
            if (error) {console.error(error);} else {
                console.debug('Email sent: ' + info.response);
                res.render('auth/passwordReset.ejs', { message: 'Email sent! Please check your inbox.' });
            }
        });
    }
    async resetPassword(req: Request, res: Response) {
        if (req.body?.token == "") { RenderAuth.passwordReset(req, res, "Please provide a token!"); return; }
        if (!isPasswordSecure(req.body?.password)) { RenderAuth.passwordReset(req, res, "Your new password must have at least 6 characters, uppercase and lowercase letters, and a number!"); return; }
        let token = req.body.token;
        let passwordHash: string = await bcrypt.hash(req.body.password, 10);
        let response: number = await databaseAccess.update.processUserUpdateToken(token, passwordHash);
        if (response == 0) {
            res.render('auth/login.ejs', { message: 'Password reset! You may now login.' });
        } else if (response == 1) { RenderAuth.passwordReset(req, res, "Token has expired!"); 
        } else if (response == 2) { RenderAuth.passwordReset(req, res, "Invalid token!"); }
    }
}

export default AuthRoutes;

