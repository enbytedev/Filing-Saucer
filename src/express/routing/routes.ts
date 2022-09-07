import { Request, Response, NextFunction } from 'express';
import { UserSessionInterface } from './sessionInterfaces.js';
import config from '../../setup/config.js';
import rateLimit from 'express-rate-limit';
import basicRoutes from "./basic/exports.js";
import authRoutes from "./auth/export.js";
import apiRoutes from './api/export.js';
import userRoutes from './user/exports.js';

const routes = {
    basicRoutes,
    authRoutes,
    apiRoutes,
    userRoutes,
}

export function restrictedContent(req: Request, res: Response, next: NextFunction) {
    if ((req.session as UserSessionInterface).email) {
      next();
    } else {
      res.redirect("/login");
    }
  }
  
export function redirectLoggedIn(req: Request, res: Response, next: NextFunction) {
    if ((req.session as UserSessionInterface).email) {
      res.redirect("/dash");
    } else {
      next();
    }
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