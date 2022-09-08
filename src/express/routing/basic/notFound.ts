import { Response, Request } from 'express';

export default async (_req: Request, res: Response) => {
    res.render('basic/notFound.ejs');
}