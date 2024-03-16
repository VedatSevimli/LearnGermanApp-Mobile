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
    const { word } = req.body;
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
    const { level } = req.body;
    const getWord = await VerbList.find({ level });

    if (!getWord) {
        return new Response(word, `${word} could't not found!`).err401(res);
    }
    return new Response(getWord, 'The word is founded').success(res);
};

export const getReadingTexts = async (req, res) => {
    const { textId } = req.query;
    console.log(textId);
    if (textId === 'all') {
        const readingTexts = await ReadingTexts.find({});
        new Response(readingTexts, 'The text is founded').success(res);
    } else {
        const readingText = await ReadingTexts.find({ textId: textId });
        new Response(readingText, 'The text is founded').success(res);
    }
};
