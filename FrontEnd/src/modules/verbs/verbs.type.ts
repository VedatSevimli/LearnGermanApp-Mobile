export interface Verb {
    _id: Id;
    word: string;
    def: Def;
    level: string;
    isIrregular: boolean;
    conjugation: Conjugation;
    sentences: Sentences;
    isSeparable: boolean;
    isReflexiv: boolean;
    isModalVerb: boolean;
    preposition: string;
    audio: string;
    hasAkkObject: boolean;
    hasDativObject: boolean;
    imageUrl: string;
    quiz?: Quiz;
}

export type VerbKeys = keyof Verb;

export type SentencesAndConjugation = 'sentences' | 'conjugation';

export interface Id {
    $oid: string;
}

export interface Def {
    tr: string;
    en: string;
}

export interface Conjugation {
    presens: string[];
    pastTense: string[];
    perfect: string[];
    konjuktiv?: string[];
    imperativ?: string[];
}

export type ConjugationKeys = keyof Conjugation;

export interface Sentences {
    presens: Sentence[];
    perfect: Sentence[];
    pastTense: Sentence[];
    konjuktiv?: Sentence[];
    imperativ?: Sentence[];
}

export interface Sentence {
    sentence: string;
    def: Def;
}

export interface Perfect {
    sentence: string;
    def: Def;
}

export interface PastTense {
    sentence: string;
    def: Def;
}

export enum TensesE {
    presens = 'presens',
    pastTense = 'pastTense',
    perfect = 'perfect',
    konjuktiv = 'konjuktiv',
    imperativ = 'imperativ'
}

export type Option = {
    text: string;
    isCorrect: boolean;
};

export type Question = {
    id: number;
    question: string;
    options: Option[];
};

export type QuizSection = {
    presens: Question[];
    perfect: Question[];
    pastTense: Question[];
    konjuktiv?: Question[];
    imperativ?: Question[];
};

export type SentenceQuestion = {
    id: number;
    question: string;
    options: Option[];
};

export type SentencesQuestions = {
    presens: SentenceQuestion[];
    perfect: SentenceQuestion[];
    pastTense: SentenceQuestion[];
    konjuktiv?: SentenceQuestion[];
    imperativ?: SentenceQuestion[];
};

export type MainQuestion = {
    question: string;
    options: Option[];
};

export type Quiz = {
    mainQuestion: MainQuestion;
    conjugation: QuizSection;
    sentences: SentencesQuestions;
};

export type QuizKeys = keyof Quiz;
