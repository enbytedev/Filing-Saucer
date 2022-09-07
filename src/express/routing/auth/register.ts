import { Response, Request } from 'express';

export default async (_req: Request, res: Response) => {
    res.render('auth/register.ejs', {error: null});
}