import confectionery from 'confectionery';
import express from 'express';
import path from 'path';
import { setRoutes } from './routing/router.js';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import config from '../setup/config.js';

export const app = express();

export const logger = confectionery.createLogger("ExpressJS");
// Display debug information if debug mode is enabled
if (config.debugMode == "true") {
    logger.setLevel(4, 4);
}
logger.setFormat('CLASSIC');
// Use logfiles if logPath is set.
if (config.logPath != '') {
    logger.setLogPath(config.logPath);
    logger.info("Logging to " + config.logPath, "ExpressJS Logger");
}

/**
 * Setup the ExpressJS instance
 */
export default function setupExpress() {
    configureExpress();
    configureSessions()

    setRoutes(app);

    // Start the server
    app.listen(config.port, () => {
        logger.info(`Express server is listening on port ${config.port}!`, "ExpressJS Setup");
    });
}

/**
 * Configure the ExpressJS instance.
 * This configures the view engine, the public directory and the body parser. This is called before the routes are set.
 */
function configureExpress() {
    logger.debug("Configuring Express instance...", "configureExpress @ ExpressJS Setup");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('view engine', 'ejs'); // Set the view engine to ejs
    app.set('views', path.resolve('./src/webpages')); // Set the views directory to find the ejs files
    app.use('/public', express.static(path.resolve('./src/express/public/'))); // Set the public directory to find the static files (e.x. css, scripts, images)
}

/**
 * Configure the user sessions
 */
function configureSessions() {
    logger.debug("Configuring Express sessions...", "configureSessions @ ExpressJS Setup");
    app.use(session({
        genid: function (_req) {
            return crypto.createHash('sha256').update(uuidv4()).update(crypto.randomBytes(256)).digest("hex");
        },
        resave: false,
        saveUninitialized: false,
        secret: "suuuper secret",
        cookie: { maxAge: 3600000, secure: false }
    }));
}