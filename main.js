require('dotenv').config()
const cors = require("cors");
const express = require("express");
const app = express();
const optionDefinitions = [
  { name: 'configure', alias: 'c', type: Boolean }
]
const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)
const cliArgs = JSON.stringify(options);
const cliArgsParsed = JSON.parse(cliArgs);
if (cliArgsParsed.configure) {
  require("./func/configure.js")
  process.exit()
}

const controller = require("./func/control");
require("./aerialhelper");
var colors = require('colors');

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
  console.log(`FilingSaucer started successfully on port ${process.env.port}!`.green.bold);
  console.log(`To change configuration options, please run application with --configure`.green.italic);
});