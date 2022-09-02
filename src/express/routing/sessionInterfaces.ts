import { Session } from 'express-session';

export interface UserSessionInterface extends Session {
    UserName?: string;
    Email?: string;
}