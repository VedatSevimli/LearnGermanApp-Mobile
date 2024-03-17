import express from 'express';
import {
    AddVerb,
    findAndUpdateVerb,
    findVerb,
    findVerbs,
    getReadingTexts,
    getVerbList
} from '../controllers/verb.controller.js';
import { checkToken } from '../middlewares/auth.js';

export const crud = express.Router();
//TODO:use GET instead of POST
crud.post('/add-new-verb', checkToken, AddVerb);
crud.post('/update-verb', checkToken, findAndUpdateVerb);
crud.get('/get-verb', findVerb);
crud.post('/get-verbs', findVerbs);
crud.get('/get-verbs-with-level', getVerbList);
crud.get('/get-reading-text', getReadingTexts);
