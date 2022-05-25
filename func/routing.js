const express = require("express");
const router = express.Router();
const controller = require("./control");
let routes = (app) => {
    // Web client
    router.get("/", controller.web);
    // API
    router.post("/upload", controller.upload);
    router.get("/view/:name", controller.view);
    router.get("/download/:name", controller.download);
    router.get("/delete/:name", controller.deletion);
    app.use(router);
};
module.exports = routes;