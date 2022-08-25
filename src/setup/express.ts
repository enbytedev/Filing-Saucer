import express from 'express';

export const app = express();

export default function setupExpress() {
    console.debug("Configuring Express instance...", "ExpressJS Setup");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
    app.listen(process.env.port, () => {
        console.debug(`Express server started successfully on port ${process.env.port}!`, "Setup");
    });

    console.info("Successfully setup Express", "Setup");
}