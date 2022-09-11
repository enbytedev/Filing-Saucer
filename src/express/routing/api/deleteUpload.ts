import { Response, Request } from 'express';
import databaseAccess from '../../../database/databaseAccess.js';
import { UserSessionInterface } from '../sessionInterfaces.js';
import { renderHistory } from '../user/history.js';

export default async (req: Request, res: Response) => {
    await databaseAccess.deleteUpload(String((req.session as UserSessionInterface).email), req.params.name)
    await new Promise(r => setTimeout(r, 500));
    renderHistory(req, res, "file deleted successfully...");
}