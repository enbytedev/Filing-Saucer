const fs = require('fs');
var dirUploads = `./content/uploads/temp/`;
var dirRegistry = `./content/registry/`;
var dirViews = `./views/`;
var dirStatic = `./static/`;
try {
    if (!fs.existsSync(dirUploads)) {
        fs.mkdirSync(dirUploads, { recursive: true });
        console.log("> ".green.bold+"Successfully created the UPLOADS directory: ".cyan+"./content/uploads/temp/".blue);
    }
    if (!fs.existsSync(dirRegistry)) {
        fs.mkdirSync(dirRegistry, { recursive: true });
        console.log("> ".green.bold+"Successfully created the REGISTRY directory: ".cyan+"./content/registry/".blue);
    }
    if (!fs.existsSync(dirViews)) {
        fs.mkdirSync(dirViews, { recursive: true });
        console.log("> ".green.bold+"Successfully created the VIEWS directory: ".cyan+"./views/".blue);
        require("../appUtil/regenFiles");
    }
    if (!fs.existsSync(dirStatic)) {
        console.log("/!\\ ".yellow.bold+"The content/static/ directory does not exist! Please populate it with your static/icon.png and static/btmright.png for a complete instance.".yellow.italic);
    }
} catch {
    console.log("!!! Unable to create directories! Potential fixes:\n> Run from CLI\n> Run as root".red.bold)
}