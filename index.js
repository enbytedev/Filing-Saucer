const cors = require("cors");
const express = require("express");
const app = express();
const {origin, port} = require('./config.json');
global.__basedir = __dirname;
var corsOptions = {
  origin: `${origin}`
};
app.use(cors(corsOptions));
const initRoutes = require("./func/routing");
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});