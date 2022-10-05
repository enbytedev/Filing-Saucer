import { Request, Response } from 'express';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { RenderAuth } from '../render/auth.js';
import { isEmailValid, isStringLongEnough, isPasswordSecure, isValidTimezone } from '../../../../helpers/validateInputs.js';
import databaseAccess from '../../../../database/databaseAccess.js';
import bcrypt from 'bcrypt';

class AuthRoutes {
    async login(req: Request, res: Response) {
        if (!isEmailValid(req.body.email)) { RenderAuth.login(req, res, "Invalid email!"); return; }
        if (!isStringLongEnough(req.body.password)) { RenderAuth.login(req, res, "Please provide a password!"); return; }

        if (await databaseAccess.checks.isPasswordCorrect(req.body.email, req.body.password)) {
                (req.session as UserSessionInterface).email = req.body.email.toLowerCase();
                (req.session as UserSessionInterface).firstName = await databaseAccess.getInfo.getUserNameFromEmail(req.body.email);
                (req.session as UserSessionInterface).timezone = await databaseAccess.getInfo.getTimezoneFromEmail(req.body.email);
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

        if (await databaseAccess.add.user({email: req.body.email.toLowerCase(), password: passwordHash, name: req.body.name, timezone: timezone})) {
            (req.session as UserSessionInterface).email = req.body.email.toLowerCase();
            (req.session as UserSessionInterface).firstName = req.body.name;
            (req.session as UserSessionInterface).timezone = req.body.timezone;
            res.redirect('/dash');
        } else { RenderAuth.register(req, res, "Something went wrong!"); }
    }
}

export default AuthRoutes;

