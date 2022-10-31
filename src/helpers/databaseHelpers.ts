import fs from 'fs';
import config from '../setup/config.js';

export function ensureFileWasDeleted(filename: string): boolean {
    if (fs.existsSync(config.uploadDirectory + filename)) {
        return false;
    }
    return true;
}