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
    preposition: string;
    audio: string;
    hasAkkObject: boolean;
    hasDativObject: boolean;
    imageUrl: string;
}

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
    konjuktiv: any[];
    imperativ: any[];
}

export interface Sentences {
    presens: Presens[];
    perfect: Perfect[];
    pastTense: PastTense[];
}

export interface Presens {
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
