import { Express, Router } from 'express';
import routes from './routes.js';
import { browserRateLimit, apiRateLimit } from './routes.js';

const router = Router();

export const setRoutes = (app: Express, cb: Function) => {
    // basic
    router.get("/", browserRateLimit, routes.basicRoutes.home);

    // auth
    router.get("/login", browserRateLimit, routes.authRoutes.login);

    // api
    router.post("/api/login", apiRateLimit, routes.apiRoutes.login);
    app.use(router);
    cb();
}