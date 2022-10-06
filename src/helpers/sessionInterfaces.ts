import { Session } from 'express-session';

export interface UserSessionInterface extends Session {
    userId: string;
    email: string;
    firstName: string;
    timezone: string;
}