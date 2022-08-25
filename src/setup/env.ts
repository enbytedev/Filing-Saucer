import config from './config.js';
import confectionery from 'confectionery';
import sugarcube from 'sugarcube';

function setup() {
    // Use console as log object
    confectionery.config.useObject(console);
    // Set the log level to the one specified in .env
    confectionery.config.setLevel(config.logLevel);
    
    // Use logfiles if logPath is set.
    if (config.logPath != '') {
        confectionery.config.logPath(config.logPath);
        console.info("Logging to " + config.logPath, "Setup");
    }

    console.debug("Configuring environment...", "Environment Setup");

    // Exit if any required variables are not set
    verifySet(config.port, "port");
    verifySet(config.fullUrl, "fullUrl");
    verifySet(config.maxFileSizeMB, "maxFileSizeMB");
    verifySet(config.accessRateLimit, "accessRateLimit");
    verifySet(config.apiRateLimit, "apiRateLimit");

    // Check for updates if checkUpdates is true
    if (config.checkUpdates == "true") {
        sugarcube.misc.updateChecker.github("https://api.github.com/repos/enbytedev/filing-saucer/releases/latest", sugarcube.getValue.jsonKeySearch("package.json", "version"), true);
    }

    console.info("Successfully setup Environment", "Setup");
}

function verifySet(variable: string, name: string) {
    if (variable == '') {
        console.error(name + " is not set!", "Environment Setup");
        process.exit(1);
    } else {
        console.debug(name + " is set: " + variable, "Environment Setup");
    }
}

export default setup;