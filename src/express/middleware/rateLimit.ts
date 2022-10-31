import rateLimit from 'express-rate-limit';
import config from "../../setup/config.js"

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