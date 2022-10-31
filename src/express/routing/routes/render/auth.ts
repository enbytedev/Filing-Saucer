import { Request, Response } from 'express';
import {tzList} from '../../../../helpers/getSimple.js';

class Render {
    login(_req: Request, res: Response, message: string) {
        res.render('auth/login.ejs', { message: message });
    }
    register(_req: Request, res: Response, message: string) {
        res.render('auth/register.ejs', { timezones: tzList, message: message });
    }
    requestPasswordReset(_req: Request, res: Response, message: string) {
        res.render('auth/requestPasswordReset.ejs', { message: message });
    }
    passwordReset(_req: Request, res: Response, message: string) {
        res.render('auth/passwordReset.ejs', { message: message });
    }
}

export const RenderAuth = new Render();

class AuthRoutes {
    login(_req: Request, res: Response) {
        RenderAuth.login(_req, res, "");
    }
    register(_req: Request, res: Response) {
        RenderAuth.register(_req, res, "");
    }
    logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
    requestPasswordReset(_req: Request, res: Response) {
        RenderAuth.requestPasswordReset(_req, res, "");
    }
    passwordReset(_req: Request, res: Response) {
        RenderAuth.passwordReset(_req, res, "");
    }
}

export default AuthRoutes;