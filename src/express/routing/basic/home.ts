import { Response, Request } from 'express';

export default async (_req: Request, res: Response) => {
    res.render('info/home.ejs');
}