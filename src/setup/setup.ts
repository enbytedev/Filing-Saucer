import { logger } from '../index.js';
import config, { databaseConfiguration, emailConfiguration } from './config.js';
import sugarcube from 'sugarcube';
import fs from 'fs';
import setupExpress from '../express/express.js';
import Database from '../database/databaseAccess.js';

/**
 * Setup the application
 */
function setup() {
    verifyVariables();
    setupExpress();
    checkForUpdates();

    process.nextTick(() => {
        logger.info("Successfully setup the application.", 'Setup');
    });
    
    Database.setupDatabase();
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
            logger.error("Unable to check for updates!", "Setup Tasks");
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
        logger.error(unsetVariables.join(", ") + " is not set!", "Setup Tasks");
        process.exit(1);
    }
}

export default setup;