import { quizOptE } from '../components/Sentences/Sentences';
import { SentencesAndConjugation, TensesE } from '../modules/verbs/verbs.type';

export type QuizOptions =
    | 'Multiple Choice'
    | 'Drag and Drop'
    | 'Fill the blanks'
    | 'Match the Words'
    | 'Speak'
    | 'Write';

export type defaultConfigProps = {
    siteBackground: string;
    options: { name: QuizOptions; image: string }[];
    learnMode: {
        QuestionType: SentencesAndConjugation;
        tense: TensesE;
        quizOpt: quizOptE;
    }[];
    learnedVerbsExample: string[];
    youTubeVideoCount?: number;
};
