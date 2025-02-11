import express from 'express';
import {
    AddVerb,
    findAndUpdateVerb,
    findVerb,
    findVerbs,
    getReadingTexts,
    getVerbList,
    updateVerbImageUrl,
    addReadingTexts
} from '../controllers/verb.controller.js';
import { checkToken } from '../middlewares/auth.js';
import multer from 'multer';
import { Response } from '../utils/response.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const crud = express.Router();
//TODO:use GET instead of POST..
crud.get('/', (req, res) =>
    new Response(null, 'Health check is successful').success(res)
);
crud.post('/add-new-verb', checkToken, AddVerb);
crud.post('/update-verb', checkToken, findAndUpdateVerb);
crud.get('/get-verb', findVerb);
crud.post('/get-verbs', findVerbs); //name sould be changed
crud.get('/get-verbs-with-level', getVerbList);
crud.get('/get-reading-text', getReadingTexts);
crud.post('/add-reading-text', addReadingTexts);
crud.post(
    '/update-verb-image-url',
    upload.single('imageUrl'),
    updateVerbImageUrl
);
