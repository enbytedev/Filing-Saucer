import { Response, Request } from 'express';
import databaseDao from '../../../database/databaseDao.js';

export default async (req: Request, _res: Response) => {
    databaseDao.loginUser(req.body.email, req.body.password, (result: number | string) => {
        if (result == 0) {
    console.debug(`Successfully logged in user ${req.body.email}`, "Login");
        } else if (result != 0) {
    console.debug(`Failed to log in user ${req.body.email}. ${result}`, "Login");
        }
    });
}