var fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });
var colors = require('colors');
var colors = require('colors/safe');


console.log("Entered Setup".cyan.bold);
var port = prompt("==> (8080)".gray.bold+" Port: ".blue);
var url = prompt("==> (http://localhost)".gray.bold+" URL: ".blue);
var forcePortRemovalInApp = prompt("==> (false)".gray.bold+" Force Port Removal: ".blue);
var accessLimit = prompt("==> (40)".gray.bold+" Access Limit (/share, /view, /download PER 5 MINUTES): ".blue);
var apiLimit = prompt("==> (10)".gray.bold+" API Limit (/delete, /upload PER 15 MINUTES): ".blue);
var applicationName = prompt("==> (FilingSaucer)".gray.bold+" Application Name: ".blue);
var organizationName = prompt("==> (Aerial Laptop)".gray.bold+" Organization Name: ".blue);
var aerialhelper = prompt("==> (true)".gray.bold+" Enable AerialHelper: ".blue);
if (port == "") {port = 8080;}
if (url == "") {url = `http://localhost`;}
if (forcePortRemovalInApp == "") {forcePortRemovalInApp = false;}
if (accessLimit == "") {accessLimit = 40;}
if (apiLimit == "") {apiLimit = 10;}
if (applicationName == "") {applicationName = "FilingSaucer";}
if (organizationName == "") {organizationName = "Aerial Laptop";}
if (aerialhelper == "") {aerialhelper = true;}

var formatted = `port=${port}
url=${url}
forcePortRemovalInApp=${forcePortRemovalInApp}
accessLimit=${accessLimit}
apiLimit=${apiLimit}
applicationName=${applicationName}
organizationName=${organizationName}
aerialhelper=${aerialhelper}`
var createStream = fs.createWriteStream(`./.env`);
createStream.end();
fs.writeFileSync(`./.env`, formatted);
console.log("> ".green.bold+"Successfully created the configuration file: ".cyan+"./.env".blue);
console.log("> ".green.bold+`Filing Saucer has successfully been configured with the following options:\n${formatted}\n\n`+"> ".green.bold+`Filing Saucer will now exit. Please start without the --configure option to proceed to the application.`.cyan)
process.exit()