import config from '../../setup/config.js';
import rateLimit from 'express-rate-limit';
import basicRoutes from "./basic/exports.js";
import authRoutes from "./auth/export.js";
import apiRoutes from './api/export.js';

const routes = {
    basicRoutes,
    authRoutes,
    apiRoutes,
}

export const browserRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: parseInt(config.browserRateLimit),
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many access requests created from this IP, please try again after 5 minutes!',
})

export const apiRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: parseInt(config.apiRateLimit),
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many access requests created from this IP, please try again after 5 minutes!',
})

export default routes;