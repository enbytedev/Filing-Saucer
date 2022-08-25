import setupEnvironment from './env.js';
import setupExpress from './express.js';

export default function setup(): void {
    setupEnvironment();
    setupExpress();
}