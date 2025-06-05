import { ElementType } from 'react';
import {
    Option,
    Quiz,
    QuizKeys,
    QuizSection,
    Sentence,
    TensesE,
    Verb
} from '../modules/verbs/verbs.type';
import { getCustomConfig } from '../App';

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

type QuizQuestions = { verb: Verb; quizQuestions: Quiz };
export const generateQuiz = (
    obj: Verb,
    verbdefintions: string[],
    numberOfOptions = 4,
    questionType: QuizKeys | 'both' = 'both',
    specificTense?: keyof QuizSection
): QuizQuestions => {
    const arrWithoutSelected = verbdefintions.filter(
        (verb) => verb !== obj.word
    );

    function shuffleOptions(options: Option[]) {
        if (!options) {
            // eslint-disable-next-line no-console
            console.log('Error! No Options');
        }
        //mix the question answers
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }

    function getVerbs() {
        const num = Math.floor(Math.random() * arrWithoutSelected.length);
        const stc = arrWithoutSelected.splice(num, 1);
        return stc.toString();
    }

    // add word and definition to the quiz array
    const mainQuestion = {
        question: `${obj.word}`,
        options: shuffleOptions([
            { text: obj.def.tr, isCorrect: true },
            { text: getVerbs(), isCorrect: false },
            { text: getVerbs(), isCorrect: false },
            { text: getVerbs(), isCorrect: false }
        ])
    };

    const conjugationQuestions: QuizSection = {
        presens: [],
        perfect: [],
        pastTense: []
    };

    const getConjugationOptions = (conjArr: string[]): string[] => {
        const uniqueOptions: Set<string> = new Set();

        for (let i = 0; i < conjArr.length; i++) {
            uniqueOptions.add(conjArr[i].split(' ').slice(1).join(' '));
        }
        return Array.from(uniqueOptions);
    };

    const generateConjunctionQuestion = (
        conj: string,
        idx: number,
        arr: string[],
        tense: TensesE
    ) => {
        const arrWithoutSelected = arr.filter((c) => c !== conj);
        const splitSentence = conj.split(' ');
        const options = getConjugationOptions(arrWithoutSelected)
            .filter((opt) => opt !== splitSentence.slice(1).join(' '))
            .sort(() => Math.random() - 0.5)
            .slice(0, numberOfOptions - 1);

        const correctOption = {
            text: splitSentence.slice(1).join(' '),
            isCorrect: true
        };

        const allOptions = [
            correctOption,
            ...options.map((opt) => ({ text: opt, isCorrect: false }))
        ];

        conjugationQuestions[tense]?.push({
            id: idx,
            question: `${splitSentence[0]} _____ (${obj.word})`,
            options: shuffleOptions(allOptions)
        });
    };

    if (questionType === 'both' || questionType === 'conjugation') {
        // *add present tense question to the quiz array
        obj.conjugation[specificTense ?? 'presens']?.forEach((...p) =>
            generateConjunctionQuestion(...p, TensesE.presens)
        );

        // add pastTense tense question to the quiz array
        obj.conjugation[specificTense ?? 'pastTense']?.forEach((...p) =>
            generateConjunctionQuestion(...p, TensesE.pastTense)
        );

        // add perfect conj questions to the quiz array
        obj.conjugation[specificTense ?? 'perfect']?.forEach((...p) =>
            generateConjunctionQuestion(...p, TensesE.perfect)
        );
    }

    const sentencesQuestions: QuizSection = {
        presens: [],
        perfect: [],
        pastTense: []
    };

    function getSentenceMixOpt(sentenceAr: Sentence[]) {
        const num = Math.floor(Math.random() * sentenceAr.length);
        const stc = sentenceAr.splice(num, 1);
        if (!sentenceAr[0]?.def) {
            // eslint-disable-next-line no-console
            console.warn('Error! Word has no definition', obj.word);
        }
        return stc[0] ?? { def: { tr: 'Alle sind richtig' } };
    }

    const generateSentenceQuestion = (
        sentence: Sentence,
        idx: number,
        arr: Sentence[],
        tense: TensesE
    ) => {
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
        sentencesQuestions[tense]?.push({
            id: idx,
            question: `${sentence.sentence}`,
            options: shuffleOptions(opt)
        });
    };

    if (questionType === 'both' || questionType === 'sentences') {
        // *add sentence translation questions to the quiz array
        obj.sentences[specificTense ?? 'presens']?.forEach((...p) =>
            generateSentenceQuestion(...p, TensesE.presens)
        );

        obj.sentences[specificTense ?? 'perfect']?.forEach((...p) =>
            generateSentenceQuestion(...p, TensesE.perfect)
        );

        obj.sentences[specificTense ?? 'pastTense']?.forEach((...p) =>
            generateSentenceQuestion(...p, TensesE.pastTense)
        );
    }

    return {
        verb: obj,
        quizQuestions: {
            conjugation: conjugationQuestions,
            sentences: sentencesQuestions
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

export function shuffleArray<T>(array: ElementType<T>[]): ElementType<T>[] {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]
        ];
    }

    return array;
}

export function getRandomElementsFromArray<T>(arr: T[], count: number): T[] {
    // Handle cases where count is greater than the length of the array
    if (count > arr.length) {
        return [];
    }

    // Create a shallow copy of the array to avoid modifying the original array
    const arrCopy = [...arr];

    // Randomly pick elements
    const result: T[] = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * arrCopy.length);
        result.push(arrCopy[randomIndex]);

        // Remove the selected element to avoid picking it again
        arrCopy.splice(randomIndex, 1);
    }

    return result;
}

export function groupItemsWithReduce<T>(array: T[], groupSize: number): T[][] {
    return array.reduce((result: T[][], item, index) => {
        const groupIndex = Math.floor(index / groupSize);
        if (!result[groupIndex]) {
            result[groupIndex] = [];
        }
        result[groupIndex].push(item);
        return result;
    }, []);
}

const languageMap: { [key: string]: string } = {
    en: 'English',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    zh: 'Chinese',
    ar: 'Arabic',
    ko: 'Korean',
    hi: 'Hindi',
    nl: 'Dutch',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    fi: 'Finnish',
    el: 'Greek',
    tr: 'Turkish',
    pl: 'Polish',
    cs: 'Czech',
    th: 'Thai',
    hu: 'Hungarian',
    ro: 'Romanian',
    he: 'Hebrew'
};
export const getLanguageFromISO = (lang: string): string => {
    const languageName = languageMap[lang.toLowerCase()];

    return languageName || 'de';
};

export const seperableVerbEndings = [
    'ein',
    'aus',
    'mit',
    'zu',
    'an',
    'über',
    'auf',
    'fern',
    'ab',
    'bei',
    'los',
    'her',
    'hin',
    'zu',
    'um',
    'über',
    'unter',
    'dursch',
    'hinein',
    'vor',
    'weg',
    'zurück'
];

export const getApiBasePath = () => {
    const { baseApiPath } = getCustomConfig();
    return baseApiPath ?? '';
};

export const getApiKey = () => {
    const { apiKey } = getCustomConfig();
    return apiKey ?? '';
};
