import React, { useEffect, useState } from 'react';
import './Quiz.scss';
import MatchingWordQuiz, {
    matchingWords
} from '../../matchingWordQuiz/MatchingWordQuiz';
import { useParams } from 'react-router-dom';
import { quizOptE } from '../../Sentences/Sentences';
import { getWord, getWords } from '../../../API/VerbList/verb';
import {
    Conjugation,
    ConjugationKeys,
    SentencesAndConjugation,
    TensesE,
    Verb
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

type QuizProps = {
    verbList: Verb[];
};
export const Quiz: React.FC<QuizProps> = (props): JSX.Element => {
    const { word, qtype, tense, quizOpt } = useParams();
    const { learnedWords, options } = defaultConfig();

    const [isLoading, setIsLoading] = useState(false);
    const [activeQuiz, setActiveQuiz] =
        useState<QuizOptions>('Multiple Choice');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [verb, setVerb] = useState<Verb>({} as Verb);
    const [verbs, setVerbs] = useState<Verb[]>([]);
    const [matchingWords, setMatchingWords] = useState<matchingWords[]>([]);
    const [selectedConj, setSelectedConj] = useState<TensesE>(
        TensesE[tense as TensesE]
    );

    useEffect(() => {
        const getLearnedWords = async () => {
            const verbs = await getWords({
                words: learnedWords
            });
            setVerbs(verbs);
            const mw = (
                verbs[Math.round(Math.random() * verbs?.length - 1)]
                    .conjugation as Conjugation
            )['presens'].map((pc) => {
                const [subj, verb, verb2] = pc.split(' ');
                return {
                    word: subj,
                    def: verb + ' ' + (verb2 ?? '')
                };
            });
            setMatchingWords(mw);
        };
        void getLearnedWords();
    }, []);

    useEffect(() => {
        const getVerbListA = async (): Promise<void> => {
            try {
                setIsLoading(true);
                const verb = await getWord({
                    word: word as string
                });
                setVerb(verb);
                const mw = (verb.conjugation as Conjugation)[
                    (tense as ConjugationKeys) ?? 'presens'
                ].map((pc) => {
                    const [subj, verb, verb2] = pc.split(' ');
                    return {
                        word: subj,
                        def: verb + ' ' + (verb2 ?? '')
                    };
                });
                setMatchingWords(mw);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        word && void getVerbListA();
    }, [word]);

    const handleOptionClick = (option: QuizOptions) => {
        setActiveQuiz(option);
        setOpenDialog(true);
    };

    const renderActiveQuiz = (activeQuiz: QuizOptions) => {
        if (activeQuiz === 'Multiple Choice') {
            return (
                <MultipleChoice
                    verb={verbs[Math.round(Math.random() * verbs?.length - 1)]}
                    verbList={props.verbList}
                    tense={TensesE.presens}
                    questionType={'sentences'}
                />
            );
        } else if (activeQuiz === 'Match the Words') {
            return (
                <MatchingWordQuiz
                    verb={verbs[Math.round(Math.random() * verbs?.length - 1)]}
                    key={matchingWords.length}
                    tense={TensesE.presens}
                ></MatchingWordQuiz>
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

            {quizOpt === quizOptE.MatchWords && matchingWords && (
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

            {quizOpt === quizOptE.DragDrop &&
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
                )}
        </div>
    );
};
