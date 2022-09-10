import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';
import { renderHistory } from '../user/history.js';

export default async (req: Request, res: Response) => {
    if (req.params.setting == "private") { setPrivate(req, res); }
}

export async function setPrivate(req: Request, res: Response) {
    if (await databaseDao.isCurrentUserFileOwner(req.params.name, String((req.session as UserSessionInterface).email))) {
        await databaseDao.setFilePrivacy(req.params.name, req.params.value == "true");
        await new Promise(r => setTimeout(r, 500));
        renderHistory(req, res, `privacy for ${req.params.name} set to ${req.params.value}`);
    }
}