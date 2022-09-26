import { Request, Response } from 'express';

class BasicRoutes {
    home(_req: Request, res: Response) {
        res.render('basic/home.ejs');
    }
    Err404(_req: Request, res: Response) {
        res.render('basic/Err404.ejs');
    }
}

export default new BasicRoutes();