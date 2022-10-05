import { Request, Response } from 'express';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { RenderUser } from '../render/user.js';
import {isStringLongEnough, isPasswordSecure, isValidTimezone } from '../../../../helpers/validateInputs.js';
import databaseAccess from '../../../../database/databaseAccess.js';
import bcrypt from 'bcrypt';

class UserRoutes {
    async updateAccount(req: Request, res: Response) {
        let timezone: string;
        let passwordHash: string;

        if (!await databaseAccess.checks.isPasswordCorrect(String((req.session as UserSessionInterface).email), req.body.oldpassword)) { RenderUser.account(req, res, "Incorrect password!"); return; }
        if (!isStringLongEnough(req.body.name, 2)) { RenderUser.account(req, res, "Name must be at least 2 characters long!"); return; }

        // If the timezone was changed, validate it and update it; otherwise assign it back to the session value.
        if (req.body.timezone !== (req.session as UserSessionInterface).timezone.toLowerCase()) {
            if (!isValidTimezone(req.body.timezone)) { RenderUser.account(req, res, "Please provide a valid timezone!"); return; }
            timezone = req.body.timezone;
        } else { timezone = (req.session as UserSessionInterface).timezone; }

        // Update password if it is not the default on the form
        if (req.body.password !== "******") {
            if (!isPasswordSecure(req.body.password)) { RenderUser.account(req, res, "Your password must have at least 6 characters, uppercase and lowercase letters, and a number!"); return; }
            passwordHash = await bcrypt.hash(req.body.password, 10);
        } else {
            // If the password is not changed, then use the old password hash; don't rehash.
            passwordHash = await databaseAccess.getInfo.getHashedPasswordFromEmail(String((req.session as UserSessionInterface).email));
        }

        await databaseAccess.update.user({
            email: String((req.session as UserSessionInterface).email),
            password: passwordHash,
            name: req.body.name,
            timezone: timezone
        }).then(() => {
        (req.session as UserSessionInterface).firstName = req.body.name;
        (req.session as UserSessionInterface).timezone = req.body.timezone;
        RenderUser.account(req, res, "Account updated!");
        }).catch(() => {
            RenderUser.account(req, res, "Something went wrong!");
        });
    }
}

export default UserRoutes;

