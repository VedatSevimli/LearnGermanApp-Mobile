import { quizOptE } from '../components/Sentences/Sentences';
import {
    dragg_dropp,
    fillTheBlanks,
    match_words,
    multiple_choice_question,
    speaking_quiz,
    writing_quiz
} from '../images/image';
import { TensesE } from '../modules/verbs/verbs.type';
import { defaultConfigProps } from './configProps';

export const defaultConfig = (): defaultConfigProps => {
    return {
        siteBackground: '#ffffff',
        options: [
            {
                name: 'Multiple Choice',
                image: multiple_choice_question
            },
            { name: 'Drag and Drop', image: dragg_dropp },
            { name: 'Match the Words', image: match_words }
            // { name: 'Fill the blanks', image: fillTheBlanks },
            // { name: 'Speak', image: speaking_quiz },
            // { name: 'Write', image: writing_quiz }
        ],

        learnMode: [
            //first presens tense
            {
                quizOpt: quizOptE.MatchWords,
                QuestionType: 'conjugation',
                tense: TensesE.presens
            },
            {
                quizOpt: quizOptE.DragDrop,
                QuestionType: 'conjugation',
                tense: TensesE.presens
            },
            {
                quizOpt: quizOptE.MultipleChoice,
                QuestionType: 'conjugation',
                tense: TensesE.presens
            },
            {
                quizOpt: quizOptE.DragDrop,
                QuestionType: 'sentences',
                tense: TensesE.presens
            },
            {
                quizOpt: quizOptE.MultipleChoice,
                QuestionType: 'sentences',
                tense: TensesE.presens
            },
            //perfect tense
            {
                quizOpt: quizOptE.MatchWords,
                QuestionType: 'conjugation',
                tense: TensesE.perfect
            },
            {
                quizOpt: quizOptE.DragDrop,
                QuestionType: 'conjugation',
                tense: TensesE.perfect
            },
            {
                quizOpt: quizOptE.MultipleChoice,
                QuestionType: 'conjugation',
                tense: TensesE.perfect
            },
            {
                quizOpt: quizOptE.DragDrop,
                QuestionType: 'sentences',
                tense: TensesE.perfect
            },
            {
                quizOpt: quizOptE.MultipleChoice,
                QuestionType: 'sentences',
                tense: TensesE.perfect
            }
        ],
        learnedVerbsExample: [
            'haben',
            'sein',
            'essen',
            'kommen',
            'gehen',
            'nehmen',
            'geben',
            'sagen',
            'sprechen',
            'höre'
        ]
    };
};
