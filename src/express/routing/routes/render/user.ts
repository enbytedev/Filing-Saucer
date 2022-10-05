import { Request, Response } from 'express';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { getRandomGreeting } from '../../../../helpers/getSimple.js';
import config from '../../../../setup/config.js';

class Render {
    dash(req: Request, res: Response, message: string) {
        let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
        res.render('user/dash.ejs', { name: name, greeting: getRandomGreeting(), info: `<h3><i>${message}</i></h3>` });
    }
}

export const RenderUser = new Render();

class UserRoutes {
    dash(req: Request, res: Response) {
        RenderUser.dash(req, res, `max file size is ${config.maxFileSizeMB}MB`);
    }
}

export default UserRoutes;