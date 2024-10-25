import express from 'express';
import { auth } from './auth.routes.js';
import { crud } from './crud.routes.js';
import { ai } from './aiRouter.routes.js';
import { mix } from './mix.routes.js';

export const router = express.Router();
export const crudRouter = express.Router();
export const aiRouter = express.Router();
export const mixRouter = express.Router();

router.use(auth);
crudRouter.use(crud);
aiRouter.use(ai);
mixRouter.use(mix);
