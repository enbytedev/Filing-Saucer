import config from '../setup/config.js';
import confectionery from 'confectionery';

export const logger = confectionery.createLogger("Main");

export function processLogger() {
    // Display debug information if debug mode is enabled
    if (config.debugMode == "true") {
        logger.setLevel(4, 4);
    }
    logger.setFormat('CLASSIC');
    // Use logfiles if logPath is set.
    if (config.logPath != '') {
        logger.setLogPath(config.logPath);
        logger.info("Logging to " + config.logPath, "Main Logger");
    }

    console.debug = function(message: string) { logger.debug(message, "Main Logger") }
    console.log = function(message: string) { logger.info(message, "Main Logger") }
    console.warn = function(message: string) { logger.warn(message, "Main Logger") }
    console.error = function(message: string) { logger.error(message, "Main Logger") }
}