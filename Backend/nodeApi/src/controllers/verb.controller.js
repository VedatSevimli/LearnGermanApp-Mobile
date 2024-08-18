import { query } from 'express';
import { ReadingTexts, VerbList } from '../models/verb.model.js';
import { APIError } from '../utils/error.js';
import { Response } from '../utils/response.js';

export const AddVerb = async (req, res) => {
    const { word } = req.body;
    const hasSameWord = await VerbList.findOne({ word });

    if (hasSameWord) {
        return res.status(401).json({
            success: false
            // message: "you have same word in list",
        });
    }
    const saveVerb = new VerbList(req.body);

    await saveVerb
        .save()
        .then((data) =>
            new Response(data, 'the verb is added in the list').created(res)
        )
        .catch((err) => {
            return res.status(401).json({
                success: false,
                message: err.message
            });
            // throw new APIError("the verb could not add to list", 400);
        });
};

export const findAndUpdateVerb = async (req, res) => {
    const {
        word,
        isTrennbar,
        isReflexiv,
        hasDativObject,
        hasAkkObject,
        definition,
        konjugation,
        isUnregelmessig,
        sentences,
        level,
        imageUrl,
        preposition,
        audio
    } = req.body;

    await VerbList.findOneAndUpdate(
        { word: req.body.word },
        {
            word,
            isTrennbar,
            isReflexiv,
            hasDativObject,
            hasAkkObject,
            definition,
            konjugation,
            isUnregelmessig,
            sentences,
            level,
            imageUrl,
            preposition,
            audio
        }
    );

    return new Response(word, 'the verb changing is successfully').success(res);
};

export const findVerb = async (req, res) => {
    const { word } = req.query;
    const getWord = await VerbList.findOne({ word });
    if (!getWord) {
        return new Response(word, `${word} could't not found!`).err401(res);
    }
    return new Response(getWord, 'The word is founded').success(res);
};

export const findVerbs = async (req, res) => {
    try {
        const { words } = req.body;

        // Use $in operator to find documents where the 'word' field matches any value in the array
        const foundVerbs = await VerbList.find({ word: { $in: words } });

        if (foundVerbs.length === 0) {
            return new Response(null, 'No words found').err404(res);
        }

        return new Response(foundVerbs, 'Words found').success(res);
    } catch (error) {
        console.error(error);
        return new Response(null, 'Internal Server Error').erro500(res);
    }
};

export const getVerbList = async (req, res) => {
    const { level } = req.query;
    const getWord = await VerbList.find({ level });

    if (!getWord) {
        return new Response(word, `${word} could't not found!`).err401(res);
    }
    return new Response(getWord, 'The word is founded').success(res);
};

export const getReadingTexts = async (req, res) => {
    const { textId } = req.query;
    if (textId === 'all') {
        const readingTexts = await ReadingTexts.find({});
        return new Response(readingTexts, 'The text is founded').success(res);
    } else {
        const readingText = await ReadingTexts.find({ textId: textId });
        return new Response(readingText, 'The text is founded').success(res);
    }
};

export const updateVerbImageUrl = async (req, res) => {
    try {
        // Extract data from the request
        const { word } = req.query;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const base64Image = file.buffer.toString('base64');
        const imageUrl = `data:image/png;base64,${base64Image}`;

        // Update imageUrl for the verb
        const updatedVerb = await VerbList.findOneAndUpdate(
            { word },
            { $set: { imageUrl: imageUrl } },
            { new: true, projection: { _id: 0 } }
        );

        if (!updatedVerb) {
            return new Response(null, 'No verb found').err404(res);
        }

        return new Response(
            file.originalname,
            'Verb imageUrl updated successfully'
        ).success(res);
    } catch (error) {
        console.error('Error updating verb imageUrl:', error);
        return new Response(null, 'Internal Server Error').erro500(res);
    }
};

export const addReadingTexts = async (req, res) => {
    const { text } = req.body;

    const hasSameWord = await ReadingTexts.findOne({ text });

    if (hasSameWord) {
        return res.status(401).json({
            success: false,
            message: 'you have same text in list'
        });
    }
    const saveText = new ReadingTexts(req.body);

    await saveText
        .save()
        .then((data) =>
            new Response(data.textId, 'the verb is added in the list').created(
                res
            )
        )
        .catch((err) => {
            return res.status(401).json({
                success: false,
                message: err.message
            });
            // throw new APIError("the verb could not add to list", 400);
        });
};
