import { Response, Request } from 'express';

export default async (req: Request, _res: Response) => {
    console.log(req.body.email);
    console.log(req.body.password);
}