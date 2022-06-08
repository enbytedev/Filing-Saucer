require('dotenv').config({path:"./.env"})
const cors = require("cors");
const express = require("express");
var colors = require('colors');
const app = express();
const optionDefinitions = [
  { name: 'configure', alias: 'c', type: Boolean }
]
const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)
const cliArgs = JSON.stringify(options);
const cliArgsParsed = JSON.parse(cliArgs);
if (cliArgsParsed.configure) {
  var fs = require('fs');
  const prompt = require("prompt-sync")({ sigint: true });
  
  var port = prompt("==> (8080) Port: ");
  var url = prompt("==> (http://localhost) URL: ");
  var forcePortRemovalInApp = prompt("==> (false) Force Port Removal: ");
  var accessLimit = prompt("==> (40) How many times can /share, /view and /download be used per five minutes: ");
  var apiLimit = prompt("==> (10) How many times can upload and /delete be used per fifteen minutes: ");
  if (port == "") {port = 8080;}
  if (url == "") {url = `http://localhost`;}
  if (forcePortRemovalInApp == "") {forcePortRemovalInApp = false;}
  if (accessLimit == "") {accessLimit = 40;}
  if (apiLimit == "") {apiLimit = 10;}

  var formatted = `port=${port}\nurl=${url}\nforcePortRemovalInApp=${forcePortRemovalInApp}\naccessLimit=${accessLimit}\napiLimit=${apiLimit}`
  var createStream = fs.createWriteStream(`./.env`);
  createStream.end();
    fs.writeFileSync(`./.env`, formatted);
  console.log("> ".green.bold+"Successfully created the configuration file: ".cyan+"./.env".blue);
  console.log("> ".green.bold+`Filing Saucer has successfully been configured with the following options:\n${formatted}\n\n`+"> ".green.bold+`Filing Saucer will now exit. Please start without the --configure option to proceed to the application.`.cyan)
  process.exit()
}
if (process.env.port == undefined) {
  console.log("X ".brightRed.bold+".env does not exist! Please run with the ".red+"--configure".brightRed.bgGray+" flag to generate it!".red);
  process.exit()
}

const controller = require("./func/control");

if (process.pkg) {
  require("./aerialhelper");  
}

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