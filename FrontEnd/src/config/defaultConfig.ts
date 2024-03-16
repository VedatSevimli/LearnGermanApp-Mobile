import { defaultConfigProps } from './configProps';

export const defaultConfig = (): defaultConfigProps => {
    return {
        siteBackground: '#ffffff',
        options: [
            'Multiple Choice',
            'Drag and Drop',
            'Fill the blanks',
            'Match the Words',
            'Speak',
            'Write'
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
