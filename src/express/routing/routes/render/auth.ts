import { Request, Response } from 'express';
import tzList from '../../../../helpers/tzList.js';

class Render {
    login(_req: Request, res: Response, message: string) {
        res.render('auth/login.ejs', { message: message });
    }
    register(_req: Request, res: Response, message: string) {
        res.render('auth/register.ejs', { timezones: tzList, message: message });
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
}

export default AuthRoutes;