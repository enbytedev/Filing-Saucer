import setup from './setup/setup.js';
import config from './setup/config.js';
import confectionery from 'confectionery';
import kitchenlight from 'kitchenlight'; // Import kitchenlight to use it's debugger tools. It doesn't need to be used in the code.
kitchenlight.applyToConsole(); // Apply kitchenlight to the console.

export const logger = confectionery.createLogger("Main");

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

setup();