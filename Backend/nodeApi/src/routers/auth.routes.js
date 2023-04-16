import express from 'express';
import {
    login,
    register,
    me,
    forgetPassword,
    resetCodeCheck,
    resetPassword
} from '../controllers/auth.controllers.js';
import { authValidation } from '../middlewares/validation/auth.validation.js';
import { checkToken } from '../middlewares/auth.js';

export const auth = express.Router();

auth.post('/login', authValidation.login, login);

auth.post('/register', authValidation.register, register);

auth.get('/me', checkToken, me);

auth.post('/forget-password', forgetPassword);
auth.post('/reset-code-check', resetCodeCheck);
auth.post('/reset-password', resetPassword);

auth.post('/uploads', (req, res) => {
    // * TODO:check it
    console.log('/uploads');
    upload(req, res, (err) => {
        console.log(err);
        if (err instanceof multer.MulterError) {
            throw new APIError('error while uploading multer problem', err);
        } else if (err) {
            throw new APIError('error while uploading', err);
        } else {
            return new Response(req.savedImages, 'image is uploaded').success(
                res
            );
        }
    });
});
