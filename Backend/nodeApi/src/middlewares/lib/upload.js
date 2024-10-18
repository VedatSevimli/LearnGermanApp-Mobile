import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { APIError } from '../../utils/error.js';

const fileFilter = (req, file, callback) => {
    //maybe i will use it later
    const acceptedExtensions = [
        'image/jgp',
        'image/gif',
        'image/jgep',
        'image/png'
    ];
    if (!acceptedExtensions.includes(file.mimetype)) {
        callback(new APIError('this file is not supported'), false);
    }

    callback(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // const rootDir = path.dirname(require.main.filename);
        const rootDir = path.dirname(require.main.filename);

        fs.mkdirSync(path.join(rootDir, 'public/uploads'), { recursive: true });

        callback(null, path.join(rootDir, 'public/uploads'));
    },
    filename: function (req, file, callback) {
        const extension = file.mimetype.split('/')[1];

        if (req.savedImages) req.savedImages = [];

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        const url = `image_${uniqueSuffix}.${extension}`;

        req.savedImages = [...req.savedImages, path.join(url)];

        callback(null, url);
    }
});

export const upload = multer({ storage, fileFilter }).array('images', 10);
