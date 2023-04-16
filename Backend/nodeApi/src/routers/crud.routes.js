import express from 'express';
import {
    AddVerb,
    findAndUpdateVerb,
    findVerb
} from '../controllers/verb.controller.js';
import { checkToken } from '../middlewares/auth.js';

export const crud = express.Router();

crud.post('/add-new-verb', checkToken, AddVerb);
crud.post('/update-verb', checkToken, findAndUpdateVerb);
crud.get('/get-verb', findVerb);
