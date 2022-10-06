import { Request, Response } from 'express';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import { getRandomGreeting, tzList } from '../../../../helpers/getSimple.js';
import config from '../../../../setup/config.js';
import databaseAccess from '../../../../database/databaseAccess.js';

class Render {
    dash(req: Request, res: Response, message: string) {
        let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
        res.render('user/dash.ejs', { name: name, greeting: getRandomGreeting(), info: `<h3><i>${message}</i></h3>` });
    }
    account(req: Request, res: Response, message: string) {
        let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
        let email = ((req.session as UserSessionInterface).email)?.toLowerCase();
        let timezone = ((req.session as UserSessionInterface).timezone);
        res.render('user/account.ejs', { name: name, email: email, currentTimezone: timezone, timezoneList: tzList, error: message });
    }
    history(req: Request, res: Response, message: string) {
        let userId: string = String((req.session as UserSessionInterface).userId);
        databaseAccess.getInfo.getHistory(userId).then(async (history: any) => {
            console.log(await databaseAccess.getInfo.getHistory(userId));
            var count = history.length;
            let bundles: Array<any> = [];
            for (var i = 0; i < count; i++) {
                bundles.push([
                    history[i].filename, 
                    history[i].userId, 
                    new Date(parseInt(history[i].date)).toLocaleString('en-US', {timeZone: await databaseAccess.getInfo.getTimezoneFromUserId(userId)}), 
                    history[i].private[0] == 1]);
            }
            res.render('user/history.ejs', { info: message, bundles: bundles });
        });
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
    history(req: Request, res: Response) {
        RenderUser.history(req, res, "");
    }
}

export default UserRoutes;