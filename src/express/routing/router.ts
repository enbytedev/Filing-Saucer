import { Express, Router } from 'express';
import routes from './routesAggregate.js';
import { browserRateLimit, apiRateLimit } from './routesAggregate.js';
import { restrictedContent, redirectLoggedIn } from './routesAggregate.js';

const router = Router();

export const setRoutes = (app: Express, cb: Function) => {
    // basic
    router.get("/", redirectLoggedIn, browserRateLimit, routes.basicRoutes.home);

    // auth
    router.get("/login", redirectLoggedIn, browserRateLimit, routes.authRoutes.login);
    router.get("/register", redirectLoggedIn, browserRateLimit, routes.authRoutes.register);

    // logged in
    router.get("/dash", restrictedContent, browserRateLimit, routes.userRoutes.dash);

    // api
    router.post("/login", apiRateLimit, routes.apiRoutes.login);
    router.post("/register", apiRateLimit, routes.apiRoutes.register);
    router.post("/upload", restrictedContent, apiRateLimit, routes.uploadRoutes.upload);
    app.use(router);
    cb();
}