const express = require("express");
const router = express.Router();
const controller = require("./control");
const rateLimit = require('express-rate-limit')
 
const accessLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many access requests created from this IP, please try again after 5 minutes!',
})
const apiLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many upload/deletion requests created from this IP, please try again after 15 minutes!',
})

let routes = (app) => {
    // Web client
    router.get("/", controller.web);
    // Access content
    router.get("/view/:name", accessLimit, controller.view);
    router.get("/download/:name", accessLimit, controller.download);
    // API
    router.post("/upload", apiLimit, controller.upload);
    router.get("/delete/:name", apiLimit, controller.deletion);
    app.use(router);
};
module.exports = routes;