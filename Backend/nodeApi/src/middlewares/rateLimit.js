import rateLimit from 'express-rate-limit';

const allowedList = ['::1'];

export const appiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req, res) => {
        if (req.url === '/login' || req.url === '/register') return 5;
        else return 100;
    },
    message: {
        success: false,
        message: 'you have over the limit! you can not log in again '
    },
    skip: (req, res) => allowedList.includes(req.ip), // for which users should be skipped
    standardHeaders: true,
    legacyHeaders: false
});
