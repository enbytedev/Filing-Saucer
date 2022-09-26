import { Request, Response, NextFunction } from 'express';
import { UserSessionInterface } from '../../helpers/sessionInterfaces.js';

export function sendToLoginIfNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    if ((req.session as UserSessionInterface).email) {
        next();
    } else {
        res.redirect("/login");
    }
}

export function sendToDashIfLoggedIn(req: Request, res: Response, next: NextFunction) {
    if ((req.session as UserSessionInterface).email) {
        res.redirect("/dash");
    } else {
        next();
    }
}