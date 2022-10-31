import { Express, Router } from 'express';
import { browserRateLimit, apiRateLimit } from '../middleware/rateLimit.js';
import { sendToDashIfLoggedIn, sendToLoginIfNotLoggedIn } from '../middleware/redirectIf.js';
import { logger } from '../express.js';
// import { browserRateLimit, apiRateLimit } from '../middleware/rateLimit.js';
// import { sendToLoginIfNotLoggedIn, sendToDashIfLoggedIn } from '../middleware/redirectIf.js';

import RoutesAggregate from './routes/routesAggregate.js';

const Routes = new RoutesAggregate();

const router = Router();
const apiRouter = Router();

/**
 * Set the routes to the ExpressJS instance
 * @param app The ExpressJS instance 
 */
export const setRoutes = (app: Express) => {
    logger.debug(`Configuring Express routing...`, "ExpressJS Setup")

    /* render */
    // basic
    router.get("/", sendToDashIfLoggedIn, browserRateLimit, Routes.render.basic.home);
    // auth
    router.get("/login", sendToDashIfLoggedIn, browserRateLimit, Routes.render.auth.login);
    router.get("/register", sendToDashIfLoggedIn, browserRateLimit, Routes.render.auth.register);
    router.get("/logout", sendToLoginIfNotLoggedIn, apiRateLimit, Routes.render.auth.logout);
    router.get("/forgot", sendToDashIfLoggedIn, browserRateLimit, Routes.render.auth.requestPasswordReset);
    router.get("/reset", sendToDashIfLoggedIn, browserRateLimit, Routes.render.auth.passwordReset);
    // user
    router.get("/dash", sendToLoginIfNotLoggedIn, browserRateLimit, Routes.render.user.dash);
    router.get("/account", sendToLoginIfNotLoggedIn, browserRateLimit, Routes.render.user.account);
    router.get("/history", sendToLoginIfNotLoggedIn, browserRateLimit, Routes.render.user.history);
    // share
    router.get("/share/:fileId", browserRateLimit, Routes.render.share.share);

    /* api */
    // auth api
    apiRouter.post("/login", apiRateLimit, Routes.api.auth.login);
    apiRouter.post("/register", apiRateLimit, Routes.api.auth.register);
    router.post("/forgot", apiRateLimit, Routes.api.auth.requestReset);
    router.post("/reset", apiRateLimit, Routes.api.auth.resetPassword);

    // upload api
    apiRouter.post("/upload/new", sendToLoginIfNotLoggedIn, apiRateLimit, Routes.api.upload.newUpload);

    // update api
    apiRouter.post("/update/file", sendToLoginIfNotLoggedIn, apiRateLimit, Routes.api.updateFile.process);
    apiRouter.post("/update/account", sendToLoginIfNotLoggedIn, apiRateLimit, Routes.api.updateUser.updateAccount);

    /* 404 */
    router.get("*", browserRateLimit, Routes.render.basic.notFound);
    apiRouter.get("*", browserRateLimit, Routes.render.basic.notFound);

    // // logged in
    // router.get("/dash", restrictedContent, browserRateLimit, routes.userRoutes.dash);
    // router.get("/history", restrictedContent, browserRateLimit, routes.userRoutes.history);
    // router.get("/account", restrictedContent, browserRateLimit, routes.userRoutes.account);

    // // api
    // router.get("/logout", restrictedContent, apiRateLimit, routes.apiRoutes.logout);
    // router.get("/delete/:name", restrictedContent, apiRateLimit, routes.apiRoutes.deleteUpload);
    // router.get("/update/file/:name/:setting/:value", restrictedContent, apiRateLimit, routes.apiRoutes.updateUpload);
    // router.post("/update/account", restrictedContent, apiRateLimit, routes.apiRoutes.updateUser);
    // router.post("/login", apiRateLimit, routes.apiRoutes.login);
    // router.post("/register", apiRateLimit, routes.apiRoutes.register);
    // router.post("/upload", restrictedContent, apiRateLimit, routes.apiRoutes.createUpload);
    app.use(router);
    app.use('/api', apiRouter);
}