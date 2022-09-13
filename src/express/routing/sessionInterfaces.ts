import { Session } from 'express-session';

export interface UserSessionInterface extends Session {
    email?: string;
    firstName?: string;
    timezone?: string;
}