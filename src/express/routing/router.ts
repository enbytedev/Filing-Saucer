import config from '../../setup/config.js';
import rateLimit from 'express-rate-limit';
import { Express, Router } from 'express';
import routes from './routes.js';

const router = Router();
const browserRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: parseInt(config.browserRateLimit),
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many access requests created from this IP, please try again after 5 minutes!',
})

export const setRoutes = (app: Express, cb: Function) => {
    // Home
    router.get("/", browserRateLimit, routes.basicRoutes.home);

    app.use(router);
    cb();
}