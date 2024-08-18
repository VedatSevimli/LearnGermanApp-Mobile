import React, { ElementType, useEffect, useState } from 'react';
import './Quiz.scss';
import MatchingWordQuiz, {
    matchingWords
} from '../../matchingWordQuiz/MatchingWordQuiz';
import { useParams } from 'react-router-dom';
import { quizOptE } from '../../Sentences/Sentences';
import { getWord, getWords } from '../../../API/VerbList/verb';
import {
    Conjugation,
    TensesE,
    Verb,
    VerbKeys
} from '../../../modules/verbs/verbs.type';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
import { DraggQuiz } from '../../DraggDropp/dragDropp';
import { MultipleChoice } from '../../MultipleChoice/multipleChoice';
import { defaultConfig } from '../../../config/defaultConfig';
import { Quizoption } from '../../Quiz/QuizOptions/quizoption';
import { QuizOptions } from '../../../config/configProps';
import Dialog from '../../Dialog/dialog';
import DialogHeader from '../../Dialog/DialogHeader/dialogHeader';
import DialogBody from '../../Dialog/DialogBody/dialogBody';
import { shuffleArray } from '../../../utils/util';

type QuizProps = {
    verbList: Verb[];
};
export type WithoutConjugationAndSentences<T extends VerbKeys> = Omit<
    T,
    'conjugation' | 'sentences'
>;

export const Quiz: React.FC<QuizProps> = (props): JSX.Element => {
    const { word, qtype, tense, quizOpt } = useParams();
    const { learnedWords, options } = defaultConfig();

    const [isLoading, setIsLoading] = useState(false);
    const [activeQuiz, setActiveQuiz] =
        useState<QuizOptions>('Multiple Choice');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [verb, setVerb] = useState<Verb>({} as Verb);
    const [learnedVerbs, setLearnedVerbs] = useState<Verb[]>([]);
    const [matchingWords, setMatchingWords] = useState<matchingWords[]>([]);
    const [selectedConj, setSelectedConj] = useState<TensesE>(
        TensesE[tense as TensesE]
    );
    const [qnumber, setQNumber] = useState<number>(0);
    const [questionsArr, setQuestionsArr] = useState();
    const [matchingWordsArr, setMatchingWordsArr] = useState();

    useEffect(() => {
        const getLearnedWords = async () => {
            const learnedVerbs = await getWords({
                words: learnedWords
            });
            setLearnedVerbs(learnedVerbs);
            const matchingVerbs = learnedVerbs[
                Math.round(Math.random() * learnedVerbs?.length - 1)
            ].conjugation['presens'].map((pc) => {
                const [subj, verb, verb2] = pc.split(' ');
                return {
                    word: subj,
                    def: verb + ' ' + (verb2 ?? '')
                };
            });
            setMatchingWords(matchingVerbs);
        };
        void getLearnedWords();
    }, []);

    useEffect(() => {
        const getVerbListA1 = async (): Promise<void> => {
            try {
                setIsLoading(true);
                const verb = await getWord({
                    word: word as string
                });
                setVerb(verb);

                const mw = (verb?.conjugation as Conjugation)?.presens?.map(
                    (pc) => {
                        const [subj, verb, verb2] = pc.split(' ');
                        return {
                            word: subj,
                            def: verb + ' ' + (verb2 ?? '')
                        };
                    }
                );
                setMatchingWords(mw);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        word && void getVerbListA1();
    }, [word]);

    {
        /*useEffect(() => {
        if (learnedVerbs.length) {
            //this code is just to test
            const tenses: ConjugationKeys[] = [
                'presens',
                'pastTense',
                'perfect'
            ];
            const tense = tenses[Math.round(Math.random() * 2)];
            const conjorSentence: WithoutConjugationAndSentences<VerbKeys> = [
                'conjugation',
                'sentences'
            ][Math.round(Math.random() * 1)];

            const randomSelected10Versb = new Array(10)
                .fill(0)
                .map(
                    (_) =>
                        learnedVerbs[Math.round(Math.random() * (learnedVerbs?.length - 2))]
                )
                .map((verb) => {
                    if (conjorSentence === 'conjugation') {
                        return verb.conjugation[tense]?.map((c, _, arr) => ({
                            sentence: c,
                            mixConj: arr.map((w) => w.split(' ')[1])
                        }));
                    }
                    return verb.sentences[tense];
                })
                .flat();
            setQuestionsArr(shuffleArray(randomSelected10Versb));

            const randomSelected10VersbMQ = new Array(10)
                .fill(0)
                .map(
                    () => learnedVerbs[Math.round(Math.random() * (learnedVerbs?.length - 1))]
                )
                .map((verb) => {
                    return verb.conjugation[tense]?.map((c) => ({
                        word: c.split(' ')[0],
                        def: c.split(' ')[1]
                    }));
                });

            setMatchingWordsArr(randomSelected10VersbMQ);
        }
    }, [learnedVerbs]);*/
    }

    const handleOptionClick = (option: QuizOptions) => {
        setActiveQuiz(option);
        setOpenDialog(true);
    };

    const renderActiveQuiz = (activeQuiz: QuizOptions) => {
        if (activeQuiz === 'Multiple Choice') {
            return (
                <MultipleChoice
                    verb={
                        learnedVerbs[
                            Math.round(Math.random() * learnedVerbs?.length - 1)
                        ]
                    }
                    verbList={props.verbList}
                    tense={TensesE.presens}
                    questionType={'sentences'}
                />
            );
        } else if (activeQuiz === 'Match the Words') {
            //the learned learnedVerbs question should come from API then
            //i will give the component the one by one matchingWords={matchingWordsArr?.[qnumber]}
            return (
                <MatchingWordQuiz
                    key={matchingWords.length}
                    // matchingWords={matchingWordsArr?.[qnumber]}
                    matchingWords={matchingWords}
                    setNext={setQNumber}
                    tense={TensesE.presens}
                ></MatchingWordQuiz>
            );
        } else if (activeQuiz === 'Drag and Drop') {
            //same here
            return (
                <></>
                // <DraggQuiz
                //     key={qnumber}
                //     question={questionsArr?.[qnumber]?.sentence ?? ''}
                //     definition={questionsArr?.[qnumber]?.def?.tr ?? ''}
                //     mixConj={questionsArr?.[qnumber]?.mixConj ?? []}
                //     setNext={setQNumber}
                // ></DraggQuiz>
            );
        }

        return <></>;
    };

    if (isLoading) {
        return <LoadingOverlay></LoadingOverlay>;
    }

    return (
        <div className="quiz">
            {openDialog && learnedWords.length > 0 ? (
                <Dialog className="quiz-dialog">
                    <DialogHeader onDismiss={() => setOpenDialog(false)}>
                        <h3>{activeQuiz}</h3>
                    </DialogHeader>
                    <DialogBody>{renderActiveQuiz(activeQuiz)}</DialogBody>
                </Dialog>
            ) : (
                <div className="quiz-section-wrapper">
                    {!word &&
                        options.map((opt, i) => {
                            return (
                                <Quizoption
                                    key={i}
                                    option={opt.name}
                                    onClick={handleOptionClick}
                                    imgSrc={opt.image}
                                ></Quizoption>
                            );
                        })}
                </div>
            )}

            {/* {quizOpt === quizOptE.MatchWords && matchingWords && (
                <MatchingWordQuiz
                    words={matchingWords}
                    verb={verb}
                    tense={TensesE[tense as TensesE]}
                    key={matchingWords.length}
                ></MatchingWordQuiz>
            )}

            {quizOpt === quizOptE.MultipleChoice && verb && (
                <MultipleChoice
                    verb={verb}
                    verbList={props.verbList}
                    tense={TensesE[tense as TensesE]}
                    questionType={qtype as SentencesAndConjugation}
                />
            )}

            {/*{quizOpt === quizOptE.DragDrop &&
                qtype &&
                verb &&
                verb[qtype as SentencesAndConjugation][selectedConj].map(
                    (question: any, index: number, arr: any) => {
                        if (qtype === 'sentences') {
                            return (
                                <DraggQuiz
                                    key={index}
                                    question={question.sentence}
                                    definition={question.def.tr}
                                    mixConj={[]}
                                ></DraggQuiz>
                            );
                        } else {
                            return (
                                <DraggQuiz
                                    key={index}
                                    question={question}
                                    mixConj={arr.map(
                                        (w: string) => w.split(' ')[1]
                                    )}
                                    definition={verb.def.tr}
                                ></DraggQuiz>
                            );
                        }
                    }
                )}*/}
        </div>
    );
};
