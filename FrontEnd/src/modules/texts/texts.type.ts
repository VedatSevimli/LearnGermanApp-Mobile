export interface ITextData {
    textId: number;
    usedVerbs: string[];
    text: string;
    tense: string;
    questions: TextDataQuestion[];
    fillTheBlank: FillTheBlank;
    image?: string;
}

export interface TextDataQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface FillTheBlank {
    sentences: Sentence[];
}

export interface Sentence {
    prefix: string;
    verb: string;
    suffix: string;
}
