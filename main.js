require('dotenv').config()
const cors = require("cors");
const express = require("express");
const app = express();
const controller = require("./func/control");
global.__basedir = __dirname;
var corsOptions = {
  origin: `http://localhost:8081`
};
app.use(cors(corsOptions));
const initRoutes = require("./func/routing");
app.use(express.urlencoded({ extended: true }));
// Create static route for home page, assets and custom client distribution.
app.use(express.static('static'));
initRoutes(app);
app.set('view engine', 'ejs');
app.post('/uploadfile', controller.upload);
// Open app.
app.listen(process.env.port, () => {
  console.log(`FilingSaucer started successfully on port ${process.env.port}!`);
});