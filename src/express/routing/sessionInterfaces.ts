import { Session } from 'express-session';

export interface UserSessionInterface extends Session {
    userName?: string;
    firstName?: string;
}