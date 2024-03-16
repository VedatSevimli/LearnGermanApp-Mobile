import mongoose from 'mongoose';
const verbListSchema = new mongoose.Schema(
    {
        word: { type: String, required: true, trim: true },
        konjugation: {
            presens: [{ type: String }],
            preteritum: [{ type: String }],
            perfekt: [{ type: String }],
            konjuktiv: [{ type: String }],
            imperativ: [{ type: String }]
        },
        isUnregelmessig: { type: Boolean },
        sentences: {
            presens: [
                {
                    sentnce: { type: String },
                    definiton: {
                        turkish: { type: String },
                        english: { type: String }
                    }
                }
            ],
            perfekt: [
                {
                    sentnce: { type: String },
                    definiton: {
                        turkish: { type: String },
                        english: { type: String }
                    }
                }
            ],
            preteritum: [
                {
                    sentnce: { type: String },
                    definiton: {
                        turkish: { type: String },
                        english: { type: String }
                    }
                }
            ]
        },
        isTrennbar: { type: Boolean, required: true },
        isReflexiv: { type: Boolean, required: true },
        preposition: { type: String, trim: true },
        imageUrl: { type: String },
        audio: { type: String },
        hasDativObject: { type: Boolean, required: true },
        hasAkkObject: { type: Boolean, required: true },
        definition: { type: String, required: true, trim: true },
        level: { type: String, required: true }
    },
    { collection: 'verbListA1' }
);

export const VerbList = mongoose.model('verbListA1', verbListSchema); //now just a1 list but after other levels are ready then it will be changed

const readingTexsSchema = new mongoose.Schema(
    {
        textId: { type: Number },
        usedVerbs: [{ type: String }],
        text: { type: String },
        tense: { type: String },
        questions: [
            {
                question: { type: String },
                options: [{ type: String }],
                correctAnswer: { type: String }
            }
        ],
        fillTheBlank: {
            sentences: [
                {
                    prefix: { type: String },
                    verb: { type: String },
                    suffix: { type: String }
                }
            ]
        }
    },

    { collection: 'readingTexts' }
);
export const ReadingTexts = mongoose.model('readingTexts', readingTexsSchema);
