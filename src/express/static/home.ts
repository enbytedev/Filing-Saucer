import { Response } from 'express';

export default async (res: Response) => {
    res.render('home.ejs');
}