const fs = require('fs');
const https = require('https');
const {url, majVersion, minVersion} = require('./.aerialhelper.json');
const fileName = './.aerialhelper.json';
const file = require(fileName);

let fallback = "https://raw.githubusercontent.com/Aerial-Laptop/.github/main/al-docs/fallback.json";
var colors = require('colors');
var colors = require('colors/safe');

// Main
fileSetup();
versionCheck();

// File setup.
function fileSetup() {
    // Filing Saucer Setup
    var fs = require('fs');
    var dirUploads = `./Filing-Saucer/uploads/temp/`;
    var dirRegistry = `./Filing-Saucer/registry/`;
    var dirViews = `./views/`;
    var dirStatic = `./static/`;
    try {
        if (!fs.existsSync(dirUploads)) {
            fs.mkdirSync(dirUploads, { recursive: true });
            console.log("> ".green.bold+"Successfully created the UPLOADS directory.".cyan);
        }
        if (!fs.existsSync(dirRegistry)) {
            fs.mkdirSync(dirRegistry, { recursive: true });
            console.log("> ".green.bold+"Successfully created the REGISTRY directory.".cyan);
        }
        if (!fs.existsSync(dirViews)) {
            fs.mkdirSync(dirViews, { recursive: true });
            console.log("> ".green.bold+"Successfully created the VIEWS directory.".cyan);
            require("./fileSetup");
        }
        if (!fs.existsSync(dirStatic)) {
            console.log("/!\\ ".yellow.bold+"The static/ directory does not exist! Please populate it with your static/icon.png and static/btmright.png for a complete instance.".yellow.italic);
        }
    } catch {
        console.log("!!! Unable to create directories! Potential fixes:\n> Run from CLI\n> Run as root".red.bold)
    }
}


// Version Checking
// Normal Link
function versionCheck() {
    https.get(url,(res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                if (json.name == undefined) {
                    useFallback();
                    return
                }
                console.log("\n--------".blue.bold+`\nAerial`.brightRed.bold+` Laptop`.brightBlue.bold+" Helper".blue.bold)
                if (json.status === "LEGACY") {
                    var status = colors.yellow;
                } else if (json.status === "ABANDONED") {
                    var status = colors.brightRed;
                } else {
                    var status = colors.green;
                }
                console.log(`Checking status of ${json.name}`.cyan.bold+`\nProject status is `.cyan+status(`${json.status}`))
                if (json.status != "ABANDONED") {
                    console.log(`Currently maintained by: ${json.maintainers}`.cyan.italic)    
                } else {
                    console.log(`Formerly maintained by: ${json.maintainers}`.yellow.italic)
                }
                if (json.majVersion > majVersion) {
                    console.log("! Major update available!\nDownload from ".red.bold + `${json.repo}`.cyan)
                } else if (json.minVersion > minVersion) {
                    console.log("! Minor update available!\nDownload from ".yellow.bold + `${json.repo}`.cyan)
                } else {
                    console.log("Your instance is up to date!".cyan)
                }
                console.log("--------\n".blue.bold)    
            } catch {
                return
            }})
    }).on("error", (error) => {
        useFallback()
    })
}
// Fallback Link
function useFallback() {
    console.log("\n--------".blue.bold+`\nAerial`.brightRed.bold+` Laptop`.brightBlue.bold+" Helper".blue.bold)
    console.log("Aerial Laptop servers offline! Correcting to fallback URL for next reboot.".yellow)
    https.get(fallback,(res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            let json = JSON.parse(body);
            file.url = json.FilingSaucer;
            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
                if (err) return console.log(err);
                console.log('Corrected URL'.cyan);
                console.log("--------\n".blue.bold)  
            });
        })
    })
}
