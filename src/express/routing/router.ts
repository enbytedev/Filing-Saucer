import { Express, Router } from 'express';
import routes from './routes.js';
import { browserRateLimit, apiRateLimit } from './routes.js';
import { redirectLoggedIn } from './routes.js';

const router = Router();

export const setRoutes = (app: Express, cb: Function) => {
    // basic
    router.get("/", redirectLoggedIn, browserRateLimit, routes.basicRoutes.home);

    // auth
    router.get("/login", redirectLoggedIn, browserRateLimit, routes.authRoutes.login);
    router.get("/register", redirectLoggedIn, browserRateLimit, routes.authRoutes.register);

    // api
    router.post("/api/login", apiRateLimit, routes.apiRoutes.login);
    router.post("/api/register", apiRateLimit, routes.apiRoutes.register);
    app.use(router);
    cb();
}