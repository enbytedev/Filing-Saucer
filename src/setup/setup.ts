import setupEnvironment from './env.js';
import setupExpress from './express.js';
import setupDatabase from './database.js';

export default function setup(): void {
    setupEnvironment();
    setupExpress();
    setupDatabase();
}