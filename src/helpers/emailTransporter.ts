import nodemailer from 'nodemailer';
import {emailConfiguration} from '../setup/config.js';

export const transporter = nodemailer.createTransport({
    host: `${emailConfiguration.host}`,
    port: parseInt(`${emailConfiguration.port}`),
    secure: true,
    auth: {
        user: `${emailConfiguration.account}`,
        pass: `${emailConfiguration.password}`
    }
});