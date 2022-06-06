var fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

const port = prompt("==> (Integer) Port: ");
const url = prompt("==> (String) URL: ");
const forcePortRemovalInApp = prompt("==> (Boolean) Force Port Removal: ");
const accessLimit = prompt("==> (Integer) How many times can /share, /view and /download be used per five minutes: ");
const apiLimit = prompt("==> (Integer) How many times can upload and /delete be used per fifteen minutes: ");
var formatted = `port=${port}\nurl=${url}\nforcePortRemovalInApp=${forcePortRemovalInApp}\naccessLimit=${accessLimit}\napiLimit=${apiLimit}`
  fs.writeFileSync(`./Filing-Saucer/.env`, formatted);
console.log(`> Filing Saucer has successfully been configured with the following options:\n${formatted}\n\n> Filing Saucer will now exit. Please start without the --configure option to proceed to the application.`)