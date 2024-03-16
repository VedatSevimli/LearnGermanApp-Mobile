import {
    Option,
    Quiz,
    QuizSection,
    Sentence,
    SentencesQuestions,
    Verb
} from '../modules/verbs/verbs.type';

export const sortedVerbObjects = (
    verbObjects: Verb[],
    verbsForSorting: string[]
): Verb[] => {
    return verbObjects.sort((a, b) => {
        const indexA = verbsForSorting.indexOf(a.word);
        const indexB = verbsForSorting.indexOf(b.word);
        return indexA - indexB;
    });
};

export const sortVerbsOrderLerning = (verbs: Verb[]) => {
    //just sort array order to learning order.
    const verbIndexMap: { [key: string]: number } = {};
    verbsForSorting.forEach((verb, index) => {
        verbIndexMap[verb] = index;
    });

    // Sort the verbObjects array based on the order of verbs in verbsForSorting
    const sortedVerbObjects = verbs
        .filter((w) => verbsForSorting.includes(w.word))
        .sort((a, b) => {
            const indexA = verbIndexMap[a.word as string];
            const indexB = verbIndexMap[b.word];
            return indexA - indexB;
        });
    return sortedVerbObjects;
};

export const generateQuiz = (obj: Verb, verbdefintions: string[]): Verb => {
    const arrWithoutSelected = verbdefintions.filter(
        (verb) => verb !== obj.word
    );

    function shuffleOptions(options: Option[]) {
        if (!options) {
            console.log('Error! No Options');
        }
        //mix the question answers
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }

    function gt() {
        const num = Math.floor(Math.random() * arrWithoutSelected.length);
        const stc = arrWithoutSelected.splice(num, 1);
        return stc.toString();
    }

    // add word and definition to the quiz array
    const mainQuestion = {
        question: `${obj.word}`,
        options: shuffleOptions([
            { text: obj.def.tr, isCorrect: true },
            { text: gt(), isCorrect: false },
            { text: gt(), isCorrect: false },
            { text: gt(), isCorrect: false }
        ])
    };

    const conjugationQuestions: QuizSection = {
        presens: [],
        perfect: [],
        pastTense: []
    };

    function getConjugationOption(conjArr: string[]): string {
        const num = Math.floor(Math.random() * conjArr.length);
        const stc = conjArr.splice(num, 1);
        return stc.toString().split(' ').slice(1).join(' ');
    }

    // *add present tense question to the quiz array
    obj.conjugation.presens.forEach((conj, idx, arr) => {
        const arrWithoutSelected = arr.filter((c) => c !== conj);
        const splitSentence = conj.split(' ');

        const opt = [
            { text: splitSentence.slice(1).join(' '), isCorrect: true },
            {
                text: getConjugationOption(arrWithoutSelected),
                isCorrect: false
            },
            {
                text: getConjugationOption(arrWithoutSelected),
                isCorrect: false
            },
            { text: getConjugationOption(arrWithoutSelected), isCorrect: false }
        ];

        conjugationQuestions.presens.push({
            id: idx,
            question: `${splitSentence[0]} _____ (${obj.word})`,
            options: shuffleOptions(opt)
        });
    });

    // add pastTense tense question to the quiz array
    obj.conjugation.pastTense.forEach((conj, idx, arr) => {
        const arrWithoutSelected = arr.filter((c) => c !== conj);
        const splitSentence = conj.split(' ');

        const opt = [
            { text: splitSentence.slice(1).join(' '), isCorrect: true },
            {
                text: getConjugationOption(arrWithoutSelected),
                isCorrect: false
            },
            {
                text: getConjugationOption(arrWithoutSelected),
                isCorrect: false
            },
            { text: getConjugationOption(arrWithoutSelected), isCorrect: false }
        ];

        conjugationQuestions.pastTense.push({
            id: idx,
            question: `${splitSentence[0]} _____ (${obj.word})`,
            options: shuffleOptions(opt)
        });
    });

    // add perfect conj questions to the quiz array
    obj.conjugation.perfect.forEach((conj, idx, arr) => {
        const arrWithoutSelected = arr.filter((c) => c !== conj);
        const splitSentence = conj.split(' ');

        const opt = [
            { text: splitSentence.slice(1).join(' '), isCorrect: true },
            {
                text: getConjugationOption(arrWithoutSelected),
                isCorrect: false
            },
            {
                text: getConjugationOption(arrWithoutSelected),
                isCorrect: false
            },
            { text: getConjugationOption(arrWithoutSelected), isCorrect: false }
        ];
        conjugationQuestions.perfect.push({
            id: idx,
            question: `${splitSentence[0]} _____ (${obj.word})`,
            options: shuffleOptions(opt)
        });
    });

    const sentencesQuestions: SentencesQuestions = {
        presens: [],
        perfect: [],
        pastTense: []
    };

    function getSentenceMixOpt(sentenceAr: Sentence[]) {
        const num = Math.floor(Math.random() * sentenceAr.length);
        const stc = sentenceAr.splice(num, 1);
        if (!sentenceAr[0]?.def) {
            console.log('Error! Word has no definition', obj.word);
        }
        return stc[0] ?? { def: { tr: 'Alle sind richtig' } };
    }
    // *add sentence translation questions to the quiz array
    obj.sentences.presens.forEach((sentence, idx, arr) => {
        const arrWithoutSelected = arr.filter(
            (s) => s.sentence !== sentence.sentence
        );

        const opt = [
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            },
            { text: sentence.def.tr, isCorrect: true },
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            },
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            }
        ];
        sentencesQuestions.presens.push({
            id: idx,
            question: `${sentence.sentence}`,
            options: shuffleOptions(opt)
        });
    });

    obj.sentences.perfect.forEach((sentence, idx, arr) => {
        const arrWithoutSelected = arr.filter(
            (s) => s.sentence !== sentence.sentence
        );

        const opt = [
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            },
            { text: sentence.def.tr, isCorrect: true },
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            },
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            }
        ];
        sentencesQuestions.perfect.push({
            id: idx,
            question: `${sentence.sentence}`,
            options: shuffleOptions(opt)
        });
    });

    obj.sentences.pastTense.forEach((sentence, idx, arr) => {
        const arrWithoutSelected = arr.filter(
            (s) => s.sentence !== sentence.sentence
        );

        const opt = [
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            },
            { text: sentence.def.tr, isCorrect: true },
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            },
            {
                text: getSentenceMixOpt(arrWithoutSelected).def.tr,
                isCorrect: false
            }
        ];
        sentencesQuestions.pastTense.push({
            id: idx,
            question: `${sentence.sentence}`,
            options: shuffleOptions(opt)
        });
    });

    return {
        ...obj,
        quiz: {
            mainQuestion,
            conjugationQuestions,
            sentencesQuestions
        }
    };
};

export const verbsForSorting = [
    'haben',
    'sein',
    'arbeiten',
    'machen',
    'essen',
    'trinken',
    'gehen',
    'kommen',
    'fahren',
    'fliegen',
    'sagen',
    'sprechen',
    'sehen',
    'hören',
    'geben',
    'nehmen',
    'finden',
    'fragen',
    'antworten',
    'schreiben',
    'lesen',
    'bedeuten',
    'beginnen',
    'bekommen',
    'benutzen',
    'bestellen',
    'besuchen',
    'zahlen',
    'bezahlen',
    'bitten',
    'bleiben',
    'brauchen',
    'bringen',
    'buchstabieren',
    'danken',
    'denken',
    'heiraten',
    'heißen',
    'helfen',
    'kaufen',
    'kennen',
    'kennenlernen',
    'kochen',
    'verstehen',
    'laufen',
    'herumlaufen',
    'rennen',
    'leben',
    'legen',
    'lernen',
    'wiederholen',
    'lieben',
    'schicken',
    'schlafen',
    'suchen',
    'wissen',
    'wohnen',
    'warten',
    'unterschreiben',
    'waschen',
    'verdienen',
    'verkaufen',
    'vermieten',
    'sitzen',
    'stehen',
    'öffnen',
    'möchten',
    'wollen',
    'können',
    'dürfen',
    'müssen',
    'sollen',
    'werden',
    //2. level
    'mögen',
    'riechen',
    'rauchen',
    'regnen',
    'reisen',
    'reparieren',
    'schwimmen',
    'spazieren',
    'spielen',
    'holen',
    'kriegen',
    'kümmern',
    'lachen',
    'laden',
    'mieten',
    'frühstücken',
    'erzählen',
    'telefonieren',
    'empfehlen',
    'entschuldigen',
    'studieren',
    'erklären',
    'erlauben',
    //trennbare
    'anrufen',
    'abholen',
    'anfangen',
    'aufhören',
    'aufstehen',
    'aussehen',
    'einsteigen',
    'aussteigen',
    'anmelden',
    'umziehen',
    'ausziehen',
    'anziehen',
    'einkaufen',
    'einladen',
    'vorstellen',
    'anbieten',
    'aufwachsen',
    //3.l3v3l
    'gefallen',
    'gehören',
    'schmecken',
    'weg sein',
    'an sein',
    'zu sein',
    'auf sein',
    'stellen',
    'gewinnen',
    'gratulieren',
    'grillen',
    'tanzen',
    'treffen',
    'tun',
    'umarmen',
    'kosten',
    'großschreiben',
    'halten',
    'scheinen',
    'schließen',
    'freuen',
    'fehlen',
    'feiern',
    'besichtigen',
    'drucken',
    'wandern',
    'fernsehen',
    'ausfüllen',
    'ankommen',
    'hereinkommen',
    'wiederkommen',
    'wiedersehen',
    'mitkommen',
    'mitbringen',
    'mitmachen',
    'mitnehmen',
    'mitsingen',
    'mitsprechen',
    'ankreuzen',
    'einschlafen',
    'anklicken',
    'anmachen',
    'ausmachen',
    'abgeben',
    'angehen',
    'durchlesen',
    'aufschreiben',
    'abfahren',
    'abfliegen',
    'ausschneiden'
];
