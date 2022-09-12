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
    router.get("/forgot", redirectLoggedIn, browserRateLimit, routes.authRoutes.forgot);
    router.get("/reset", redirectLoggedIn, browserRateLimit, routes.authRoutes.reset);

    // share
    router.get("/share/:name", browserRateLimit, routes.shareRoutes.share);
    router.get("/share/:name/download", browserRateLimit, routes.shareRoutes.downloadFile);
    router.get("/share/:name/view", browserRateLimit, routes.shareRoutes.viewFile);

    // logged in
    router.get("/dash", restrictedContent, browserRateLimit, routes.userRoutes.dash);
    router.get("/history", restrictedContent, browserRateLimit, routes.userRoutes.history);
    router.get("/account", restrictedContent, browserRateLimit, routes.userRoutes.account);

    // api
    router.get("/logout", restrictedContent, apiRateLimit, routes.apiRoutes.logout);
    router.get("/delete/:name", restrictedContent, apiRateLimit, routes.apiRoutes.deleteUpload);
    router.get("/update/file/:name/:setting/:value", restrictedContent, apiRateLimit, routes.apiRoutes.updateUpload);
    router.post("/update/account", restrictedContent, apiRateLimit, routes.apiRoutes.updateUser);
    router.post("/login", apiRateLimit, routes.apiRoutes.login);
    router.post("/register", apiRateLimit, routes.apiRoutes.register);
    router.post("/upload", restrictedContent, apiRateLimit, routes.apiRoutes.createUpload);
    router.post("/forgot", apiRateLimit, routes.apiRoutes.requestReset);
    router.post("/reset", apiRateLimit, routes.apiRoutes.resetPassword);

    // 404s
    router.get("*", browserRateLimit, routes.basicRoutes.notFound);
    
    app.use(router);
    cb();
}