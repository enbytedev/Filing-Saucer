const express = require("express");
const router = express.Router();
const rateLimit = require('express-rate-limit')
const uploadRoute = require(`${__scriptsDir}/routing/upload`);
const deleteRoute = require(`${__scriptsDir}/routing/delete`);
const accessRoute = require(`${__scriptsDir}/routing/access`);
const historyRoute = require(`${__scriptsDir}/routing/history`);


const accessLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: process.env.accessLimit,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many access requests created from this IP, please try again after 5 minutes!',
})
const apiLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.apiLimit,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many upload/deletion requests created from this IP, please try again after 15 minutes!',
})

let routes = (app) => {
    // Home
    router.get("/", accessLimit, accessRoute.home);
    // Access content
    router.get("/share/:name", accessLimit, accessRoute.share);
    router.get("/view/:name", accessLimit, accessRoute.view);
    router.get("/download/:name", accessLimit, accessRoute.download);
    router.get("/history", accessLimit, historyRoute.history);
    // API
    router.post("/upload", apiLimit, uploadRoute.upload);
    router.get("/delete/:name", apiLimit, deleteRoute.deletion);
    app.use(router);
};
module.exports = routes;