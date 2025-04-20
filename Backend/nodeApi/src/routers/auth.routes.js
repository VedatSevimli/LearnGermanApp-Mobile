import express from 'express';
import {
    login,
    register,
    me,
    forgetPassword,
    resetCodeCheck,
    resetPassword,
    saveUserProccess
} from '../controllers/auth.controllers.js';
import { authValidation } from '../middlewares/validation/auth.validation.js';
import { checkToken } from '../middlewares/auth.js';
import { authenticateAPIKey } from '../middlewares/auth.js';

export const auth = express.Router();

auth.post('/login', authValidation.login, authenticateAPIKey, login);

auth.post('/register', authValidation.register, authenticateAPIKey, register);

auth.get('/me', authenticateAPIKey, checkToken, me);

auth.post('/forget-password', authenticateAPIKey, forgetPassword);
auth.post('/reset-code-check', authenticateAPIKey, resetCodeCheck);
auth.post('/reset-password', authenticateAPIKey, resetPassword);
auth.post('/save-user-proccess', authenticateAPIKey, saveUserProccess);

auth.post('/uploads', authenticateAPIKey, (req, res) => {
    // * TODO:check it
    upload(req, res, (err) => {
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
