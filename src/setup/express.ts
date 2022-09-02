import express from 'express';
import path from 'path';
import { setRoutes } from '../express/routing/router.js';
import session from 'express-session';
import uuid from 'node-uuid';
import crypto from 'crypto';

export const app = express();

export default function setupExpress() {
    console.debug("Configuring Express instance...", "ExpressJS");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('view engine', 'ejs'); // Set the view engine to ejs
    app.set('views', path.resolve('./src/express/views')); // Set the views directory to find the ejs files
    app.use('/public', express.static(path.resolve('./src/express/public/'))); // Set the public directory to find the static files (e.x. css, scripts, images)

    console.log(crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex"))
    // Configure user sessions
    app.use(session({
            genid: function(_req) {
                return crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");
            },
            resave: false, 
            saveUninitialized: false, 
            secret: "suuuper secret", 
            cookie: { maxAge: 3600000, 
            secure: false } }));
    console.debug("Configured sessions!", "ExpressJS");

    // Set the routes via ./routes.js
    setRoutes(app, () => {console.debug(`Express server has been configured!`, "ExpressJS")});

    app.listen(process.env.port, () => {
        console.debug(`Express server is listening on port ${process.env.port}!`, "ExpressJS");
    });

    console.info("Successfully setup Express", "Setup");
}