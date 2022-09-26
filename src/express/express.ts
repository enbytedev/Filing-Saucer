import express from 'express';
import path from 'path';
import { setRoutes } from './routing/router.js';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import config from '../setup/config.js';

export const app = express();

/**
 * Setup the ExpressJS instance
 */
export default function setupExpress() {
    configureExpress();
    configureSessions()

    setRoutes(app);

    // Start the server
    app.listen(config.port, () => {
        console.info(`Express server is listening on port ${config.port}!`, "ExpressJS");
    });
}

/**
 * Configure the ExpressJS instance.
 * This configures the view engine, the public directory and the body parser. This is called before the routes are set.
 */
function configureExpress() {
    console.debug("Configuring Express instance...", "ExpressJS Setup");
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
    console.debug("Configuring Express sessions...", "ExpressJS Setup");
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