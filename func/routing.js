const express = require("express");
const router = express.Router();
const controller = require("./control");
let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files/:name", controller.download);
  router.get("/delete/:name", controller.deletion);
  app.use(router);
};
module.exports = routes;