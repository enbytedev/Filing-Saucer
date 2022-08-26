import express from 'express';
import path from 'path';
import { setRoutes } from '../express/routing/router.js';

export const app = express();

export default function setupExpress() {
    console.debug("Configuring Express instance...", "ExpressJS");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('view engine', 'ejs'); // Set the view engine to ejs
    app.set('views', path.resolve('./src/express/views')); // Set the views directory to find the ejs files
    app.use('/public', express.static(path.resolve('./src/express/public/'))); // Set the public directory to find the static files (e.x. css, scripts, images)

    // Set the routes via ./routes.js
    setRoutes(app, () => {console.debug(`Express server has been configured!`, "ExpressJS")});

    app.listen(process.env.port, () => {
        console.debug(`Express server is listening on port ${process.env.port}!`, "ExpressJS");
    });

    console.info("Successfully setup Express", "Setup");
}