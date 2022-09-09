import { Response, Request } from 'express';
import { UserSessionInterface } from '../sessionInterfaces.js';
import config from '../../../setup/config.js';

export default async (req: Request, res: Response) => {
    renderDash(req, res, `max file size is ${config.maxFileSizeMB}MB`);
}

export function renderDash(req: Request, res: Response, message: string) {
    let name = ((req.session as UserSessionInterface).firstName)?.toLowerCase();
    res.render('user/dash.ejs', { name: name, greeting: getRandomGreeting(), info: `<h3><i>${message}</i></h3>` });
}

export function getRandomGreeting() {
    let greetings = ["hello", "hi there", "hola", "bonjour", "guten tag", "salve"];
    return greetings[Math.floor(Math.random() * greetings.length)];
}