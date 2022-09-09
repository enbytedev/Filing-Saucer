import { Response, Request } from 'express';

export default async (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}