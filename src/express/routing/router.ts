import { Express, Router } from 'express';
import { browserRateLimit } from '../middleware/rateLimit.js';
import { sendToDashIfLoggedIn } from '../middleware/redirectIf.js';
import { logger } from '../express.js';
// import { browserRateLimit, apiRateLimit } from '../middleware/rateLimit.js';
// import { sendToLoginIfNotLoggedIn, sendToDashIfLoggedIn } from '../middleware/redirectIf.js';

import basic from './routes/basic.js';
import auth from './routes/auth.js';

const router = Router();

/**
 * Set the routes to the ExpressJS instance
 * @param app The ExpressJS instance 
 */
export const setRoutes = (app: Express) => {
    logger.debug(`Configuring Express routing...`, "ExpressJS Setup") 
    // basic
    router.get("/", sendToDashIfLoggedIn, browserRateLimit, basic.home);

    // auth
    router.get("/login", sendToDashIfLoggedIn, browserRateLimit, auth.login);
    router.get("/register", sendToDashIfLoggedIn, browserRateLimit, auth.register);
    // router.get("/forgot", redirectLoggedIn, browserRateLimit, routes.authRoutes.forgot);
    // router.get("/reset", redirectLoggedIn, browserRateLimit, routes.authRoutes.reset);

    // // share
    // router.get("/share/:name", browserRateLimit, routes.shareRoutes.share);
    // router.get("/share/:name/download", browserRateLimit, routes.shareRoutes.downloadFile);
    // router.get("/share/:name/view", browserRateLimit, routes.shareRoutes.viewFile);

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
    // router.post("/forgot", apiRateLimit, routes.apiRoutes.requestReset);
    // router.post("/reset", apiRateLimit, routes.apiRoutes.resetPassword);

    // 404s
    router.get("*", browserRateLimit, basic.Err404);

    app.use(router);
}