import { Request, Response } from 'express';

class BasicRoutes {
    home(_req: Request, res: Response) {
        res.render('basic/home.ejs');
    }
    notFound(_req: Request, res: Response) {
        res.render('basic/notFound.ejs');
    }
}

export default BasicRoutes;