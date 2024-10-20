import { Question, Sentence, Verb } from '../../../modules/verbs/verbs.type';
import {
    generateQuiz,
    getRandomElementsFromArray,
    groupItemsWithReduce
} from '../../../utils/util';
import { MatchingWords } from '../../matchingWordQuiz/MatchingWordQuiz';
import { DragDroppQuestion, QuizDetailsOptions } from './Quiz';

/**
 *
 * @param quizDetailsOpt
 * @param learnedVerbs
 * @param questonsCount
 * @returns
 */
export const generateMatchWordQuiz = (
    quizDetailsOpt: QuizDetailsOptions,
    learnedVerbs: Verb[],
    questonsCount = 7
): MatchingWords[][] => {
    const { questionType, questionNumber, tense } = quizDetailsOpt;
    const questions: MatchingWords[][] = [];

    function conjugationQuestions(conjugations: string[]): MatchingWords[] {
        return conjugations?.map((st) => {
            const [subj, verb, verb2] = (st as string).split(' ');
            const word = subj;
            const def = verb + ' ' + (verb2 ?? '');

            return {
                word,
                def
            };
        });
    }

    function sentencesQuestions(sentences: Sentence[]): MatchingWords[] {
        return sentences.map((st) => ({
            word: st.sentence,
            def: st.def.tr ?? ''
        }));
    }
    for (let i = 0; i < learnedVerbs.length; i++) {
        const conjugations = learnedVerbs[i].conjugation[tense];
        const sentences = learnedVerbs[i].sentences[tense];
        if (!sentences || !conjugations) break;

        if (questionType === 'conjugation') {
            questions.push(conjugationQuestions(conjugations));
        } else if (questionType === 'sentences') {
            questions.push(sentencesQuestions(sentences));
        } else {
            questions.push(sentencesQuestions(sentences));
            questions.push(conjugationQuestions(conjugations));
        }
    }
    const flattetQuestions = questions.flat();
    const groupedQuestions = getRandomElementsFromArray(
        groupItemsWithReduce(flattetQuestions, questonsCount),
        questionNumber
    );

    return groupedQuestions;
};

/**
 *
 * @param verbList
 * @param learnedVerbs
 * @param quizDetailsOpt
 * @returns Question[]
 */
export const generateMultChoiceQuests = (
    verbList: Verb[],
    learnedVerbs: Verb[],
    quizDetailsOpt: QuizDetailsOptions
): Question[] => {
    const { questionType, questionNumber, tense } = quizDetailsOpt;
    const _quizData = [];

    for (let i = 0; i < learnedVerbs.length; i++) {
        const definitions = verbList.map((verb) => verb.def.tr);
        const quiz = generateQuiz(
            learnedVerbs[i],
            definitions,
            4,
            questionType,
            tense
        );
        _quizData.push(quiz);
    }

    const questions: Question[] = _quizData
        .map((quiz) => {
            const {
                presens: p,
                perfect: pf,
                pastTense: pt
            } = quiz.quizQuestions.conjugation;
            const { presens, perfect, pastTense } =
                quiz.quizQuestions.sentences;
            return [...p, ...pf, ...pt, ...presens, ...perfect, ...pastTense];
        })
        .flat();

    return getRandomElementsFromArray(questions, questionNumber);
};

/**
 *
 * @param learnedVerbs
 * @param quizDetailsOpt
 * @returns DragDroppQuestion[]
 */
export const generateDraggDroppQuiz = (
    learnedVerbs: Verb[],
    quizDetailsOpt: QuizDetailsOptions
): DragDroppQuestion[] => {
    const { questionType, questionNumber, tense } = quizDetailsOpt;
    const questionsArray: {
        question: string;
        definition: string;
        mixedConj?: string[];
    }[] = [];

    for (let i = 0; i < learnedVerbs.length; i++) {
        if (questionType === 'sentences') {
            const sentences =
                learnedVerbs[i][questionType as 'sentences'][tense];
            if (sentences) {
                const questions = sentences?.map((st) => ({
                    question: st.sentence,
                    definition: st.def.tr
                }));
                questionsArray.push(...questions);
            }
        } else {
            const conjArr =
                learnedVerbs[i][questionType as 'conjugation'][tense];

            if (conjArr) {
                const mixedConj = conjArr?.map((w) => w.split(' ')[1]);
                conjArr.map((cnj) => {
                    questionsArray.push({
                        question: cnj,
                        mixedConj,
                        definition: ''
                    });
                });
            }
        }
    }

    return getRandomElementsFromArray(questionsArray, questionNumber);
};
