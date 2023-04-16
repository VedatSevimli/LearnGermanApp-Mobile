import nodemailer from 'nodemailer';
import { APIError } from './error.js';

export const sendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587, // it is safe to send a mail on this port
        secure: true, // if you use ort 465 you have to set this as true
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        },
        logger: true,
        debug: true
    });

    transporter.sendMail(mailOptions, (error, info) => {
        console.log({ info, mailOptions, error });
        if (error) {
            console.log('the mail could not send ');
            throw new APIError('any error in sendAMil func', 400);
        }
        return true;
    });
};
