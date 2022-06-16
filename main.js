global.__basedir = __dirname;

require('dotenv').config({path:"./.env"})
require("./scripts/aeriallaptop/aerialhelper");
const express = require("express");
var colors = require('colors');
const app = express();

// CLI constants
const optionDefinitions = [
  { name: 'configure', alias: 'c', type: Boolean },
  { name: 'regen', alias: 'r', type: Boolean }
]
const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)
const cliArgs = JSON.stringify(options);
const cliArgsParsed = JSON.parse(cliArgs);

// CLI arg handling
if (cliArgsParsed.configure) {
require("./scripts/configure");
}
if (cliArgsParsed.regen) {
require('./scripts/appUtil/regenFiles');
}

// Exit if there is no configuration
if (process.env.port == undefined) {
  console.log("X ".brightRed.bold+".env does not exist! Please run with the ".red+"--configure".brightRed.bgGray+" flag to generate it!".red);
  process.exit()
}

// Require controller and routing
const controller = require("./scripts/control");
const initRoutes = require("./scripts/routing");

app.use(express.urlencoded({ extended: true }));
// Create static route for home page, assets, etc.
app.use(express.static('static'));
initRoutes(app);
app.set('view engine', 'ejs');
app.post('/uploadfile', controller.upload);
// Open app.
app.listen(process.env.port, () => {
  console.log(`FilingSaucer started successfully on port ${process.env.port}!`.green.bold);
  console.log(`To change configuration options, please run application with --configure`.green.italic);
});