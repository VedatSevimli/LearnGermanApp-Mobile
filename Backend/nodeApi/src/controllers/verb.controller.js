import { VerbList } from '../models/verb.model.js';
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
