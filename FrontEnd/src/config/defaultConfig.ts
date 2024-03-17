import { MultipleChoiceQuestion } from '../components/pages/TextDetails/TextDetails';
import {
    dragg_dropp,
    fillTheBlanks,
    match_words,
    multiple_choice_question,
    speaking_quiz,
    writing_quiz
} from '../images/image';
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
            { name: 'Fill the blanks', image: fillTheBlanks },
            { name: 'Match the Words', image: match_words },
            { name: 'Speak', image: speaking_quiz },
            { name: 'Write', image: writing_quiz }
        ],
        learnedWords: [
            'haben',
            'sein',
            'machen',
            'essen',
            'trinken',
            'gehen',
            'kommen',
            'fahren',
            'sagen',
            'sprechen',
            'sehen',
            'hören',
            'geben',
            'nehmen'
        ]
    };
};
