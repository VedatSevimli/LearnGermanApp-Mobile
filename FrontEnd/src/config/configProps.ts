export type QuizOptions =
    | 'Multiple Choice'
    | 'Drag and Drop'
    | 'Fill the blanks'
    | 'Match the Words'
    | 'Speak'
    | 'Write';

export type defaultConfigProps = {
    siteBackground: string;
    options: QuizOptions[];
    learnedWords: string[];
};
