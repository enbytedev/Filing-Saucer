import { Request, Response } from 'express';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { getRandomGreeting, tzList } from '../../../../helpers/getSimple.js';
import config from '../../../../setup/config.js';

class Render {
    dash(req: Request, res: Response, message: string) {
        let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
        res.render('user/dash.ejs', { name: name, greeting: getRandomGreeting(), info: `<h3><i>${message}</i></h3>` });
    }
    account(req: Request, res: Response, message: string) {
        let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
        let email = ((req.session as UserSessionInterface).email)?.toLowerCase();
        let timezone = ((req.session as UserSessionInterface).timezone)?.toLowerCase();
        res.render('user/account.ejs', { name: name, email: email, currentTimezone: timezone, timezoneList: tzList, error: message });
    }
}

export const RenderUser = new Render();

class UserRoutes {
    dash(req: Request, res: Response) {
        RenderUser.dash(req, res, `max file size is ${config.maxFileSizeMB}MB`);
    }
    account(req: Request, res: Response) {
        RenderUser.account(req, res, "");
    }
}

export default UserRoutes;