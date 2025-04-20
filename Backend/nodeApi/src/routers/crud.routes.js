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
import { authenticateAPIKey } from '../middlewares/auth.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const crud = express.Router();
//TODO:use GET instead of POST..
crud.get('/', (req, res) =>
    new Response(null, 'Health check is successful').success(res)
);
crud.post('/add-new-verb', authenticateAPIKey, checkToken, AddVerb);
crud.post('/update-verb', authenticateAPIKey, checkToken, findAndUpdateVerb);
crud.get('/get-verb', authenticateAPIKey, findVerb);
crud.post('/get-verbs', authenticateAPIKey, findVerbs); //name sould be changed
crud.get('/get-verbs-with-level', authenticateAPIKey, getVerbList);
crud.get('/get-reading-text', authenticateAPIKey, getReadingTexts);
crud.post('/add-reading-text', authenticateAPIKey, addReadingTexts);
crud.post(
    '/update-verb-image-url',
    upload.single('imageUrl'),
    updateVerbImageUrl
);
