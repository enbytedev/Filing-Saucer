import config, { dbInfo, emailInfo } from './config.js';
import confectionery from 'confectionery';
import sugarcube from 'sugarcube';
import fs from 'fs';

/**
 * Setup the application
 */
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
    verifyVariables();

    process.nextTick(() => {
        console.info("Successfully setup the application.", "Setup");
    });
    checkForUpdates();
}

/**
 * Check for updates
 */
function checkForUpdates() {
    if (config.checkUpdates == "true") {
        try {
            let packageJson = JSON.parse(fs.readFileSync("package.json", 'utf8'));
            sugarcube.misc.updateChecker.github("https://api.github.com/repos/enbytedev/filing-saucer/releases/latest", packageJson["version"], true);
        } catch (error) {
            console.error("Unable to check for updates!", "Setup");
            console.error(error, "Setup");
        }
    }
}

/**
 * Verify that all required variables are set
 */
function verifyVariables() {
    let unsetVariables: Array<String> = [];
    function verifySet(variable: string, name: string) {
        if (!variable?.length) {
            unsetVariables.push(name);
        }
    }

    for (let i of Object.keys(config)) verifySet(config[i], i);
    for (let i of Object.keys(dbInfo)) verifySet(dbInfo[i], i);
    for (let i of Object.keys(emailInfo)) verifySet(emailInfo[i], i);

    if (unsetVariables.length > 0) {
        console.error(unsetVariables.join(", ") + " is not set!", "Environment");
        process.exit(1);
    }
}

export default setup;