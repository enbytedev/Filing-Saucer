import config, { databaseConfiguration, emailConfiguration } from './config.js';
import confectionery from 'confectionery';
import sugarcube from 'sugarcube';
import fs from 'fs';
import setupExpress from '../express/express.js';
import Database from '../database/databaseAccess.js';

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
        console.info("Logging to " + config.logPath, "Setup Tasks");
    }
    verifyVariables();

    process.nextTick(() => {
        console.info("Successfully setup the application.", "Setup Tasks");
    });

    Database.setupDatabase();
    setupExpress();
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
            console.error("Unable to check for updates!", "Setup Tasks");
            console.error(error, "Setup Tasks");
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
    for (let i of Object.keys(databaseConfiguration)) verifySet(databaseConfiguration[i], i);
    for (let i of Object.keys(emailConfiguration)) verifySet(emailConfiguration[i], i);

    if (unsetVariables.length > 0) {
        console.error(unsetVariables.join(", ") + " is not set!", "Setup Tasks");
        process.exit(1);
    }
}

export default setup;