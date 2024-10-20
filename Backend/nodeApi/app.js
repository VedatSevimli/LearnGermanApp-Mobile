import {} from 'express-async-error';
import express from 'express';
import dotenv from 'dotenv';
import {} from './src/db/dbConnetction.js';
import { aiRouter, crudRouter, router } from './src/routers/index.js';
import { errorHandlerMiddleware } from './src/middlewares/errorHandler.js';
import cors from 'cors';
import { corsOptions } from './src/helpers/corsOprions.js';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import { appiLimiter } from './src/middlewares/rateLimit.js';
import moment from 'moment-timezone';
import multer from 'multer';
import { ImageUpload } from './src/models/image.model.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

moment.tz.setDefault('Europe/Berlin');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.json({
        message: '<h1>home</h1>'
    });
});

// Middlewares
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(
    express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('uploads/', express.static(path.join(__dirname)));

app.use(cors({ origin: 'http://localhost:3000' })); // to prevent not wanted urls

app.use('/api', appiLimiter);

app.use(
    mongoSanitize({
        replaceWith: '_'
    })
); // prevetn injection attack

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/uploadImages', upload.array('images', 10), async (req, res) => {
    try {
        const files = req.files;
        // Handle each uploaded file
        for (let i = 0; i < files.length; i++) {
            const newImage = new ImageUpload({
                name: files[i].originalname,
                data: files[i].buffer
            });
            await newImage.save();
        }

        res.send('Image uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading image');
    }
});

// Routes
app.use('/api', router);
app.use('/api', crudRouter);
app.use('/api', aiRouter);

// catch erros
app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log('app works', port);
});
