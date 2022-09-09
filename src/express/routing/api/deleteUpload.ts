import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';
import { UserSessionInterface } from '../sessionInterfaces.js';
import { renderHistory } from '../user/history.js';

export default async (req: Request, res: Response) => {
    await databaseDao.deleteUpload(String((req.session as UserSessionInterface).email), req.params.name)
    await new Promise(r => setTimeout(r, 500));
    renderHistory(req, res, "file deleted successfully...");
}