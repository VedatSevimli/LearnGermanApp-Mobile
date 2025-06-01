import React, { useEffect, useState } from 'react';
import './Quiz.scss';
import MatchingWordQuiz, {
    MatchingWords
} from '../../matchingWordQuiz/MatchingWordQuiz';
import { useParams } from 'react-router-dom';
import { getWords } from '../../../API/VerbList/verb';
import {
    QuizKeys,
    Question,
    QuizSection,
    TensesE,
    Verb,
    VerbKeys
} from '../../../modules/verbs/verbs.type';

import { defaultConfig } from '../../../config/defaultConfig';
import { Quizoption } from '../../Quiz/QuizOptions/quizoption';
import { QuizOptions } from '../../../config/configProps';
import Dialog from '../../Dialog/dialog';
import DialogHeader from '../../Dialog/DialogHeader/dialogHeader';
import DialogBody from '../../Dialog/DialogBody/dialogBody';
import { useUser } from '../../../context/userContext/userContext';
import { setSeo } from '../../../utils/seo';
import { Trivia } from '../../MultipleChoice/triva';
import { Popup } from '../../Popup/popup';
import { QuizDetails } from './quizDetails';
import {
    generateDraggDroppQuiz,
    generateMatchWordQuiz,
    generateMultChoiceQuests,
    generateWriteQuiz
} from './quizUtils';
import { DraggQuiz } from '../../DraggDropp/dragDropp';
import { Timer } from '../../MultipleChoice/timer';
import { useMediaQuery } from 'react-responsive';
import { Button } from '../../Button/button';
import { useTranslation } from 'react-i18next';
import { quizResult } from '../../MultipleChoice/multipleChoice';
import { WritingQuiz } from '../../writingQuiz/writingQuiz';

type QuizProps = {
    verbList: Verb[];
};
export type WithoutConjugationAndSentences<T extends VerbKeys> = Omit<
    T,
    'conjugation' | 'sentences'
>;
export type QuestionType = 'conjugation' | 'sentences';

export type QuizDetailsOptions = {
    questionNumber: number;
    questionType: QuestionType;
    tense: keyof QuizSection;
    withTimer: boolean;
    timerCount?: number;
};

export type DragDroppQuestion = {
    question: string;
    definition: string;
    mixedConj?: string[];
};

const BIG_SCREEN_QUESTION_NUMBER = 10;
const MOBILE_QUESTION_NUMBER = 6;

export const Quiz: React.FC<QuizProps> = (props): JSX.Element => {
    //#region MiscHook
    const { t } = useTranslation();
    const { word } = useParams();
    const { userData } = useUser();
    const { options, learnedVerbsExample } = defaultConfig();
    const learnedWords =
        userData?.progress.map((p) => p.word) ?? learnedVerbsExample;
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    //#region useState Hook
    const [timeOut, setTimeOut] = useState<boolean>(false);
    const [activeQuiz, setActiveQuiz] = useState<QuizOptions>();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [learnedVerbs, setLearnedVerbs] = useState<Verb[]>([]);
    const [multipleChoiceQustion, setMultipleChoiceQustion] = useState<
        Question[]
    >([]);
    const [qNumber, setQNumber] = useState<number>(0);
    const [matchingWords, setMatchingWords] = useState<MatchingWords[][]>([]);
    const [dragDroppQuestions, setDragDroppQuestions] = useState<
        DragDroppQuestion[]
    >([]);
    const [writeQuestions, setWriteQuestions] = useState<
        { sentence: string; tense: keyof QuizSection }[][]
    >([]);

    const [openQuizDetailsPopover, setOpenQuizDetailsPopover] =
        useState<boolean>(false);
    const [quizDetailsOpt, setQuizDetailsOpt] = useState<QuizDetailsOptions>();
    const [quizResult, setQuizResult] = useState<quizResult>({
        correctAnswers: [],
        wrongAnswers: [],
        quizFinished: false
    });

    //#region UseEffect Hook
    useEffect(() => {
        const getLearnedWords = async () => {
            const learnedVerbs = await getWords({
                words: learnedWords
            });
            setLearnedVerbs(learnedVerbs);
        };
        learnedWords?.length && void getLearnedWords();

        setSeo('Deutsch-Turkish App - Quiz', 'Verben Übunen , Verben Übungen');
    }, []);

    useEffect(() => {
        if (learnedVerbs?.length && activeQuiz && quizDetailsOpt) {
            if (activeQuiz === 'Multiple Choice') {
                setMultipleChoiceQustion(
                    generateMultChoiceQuests(
                        props.verbList,
                        learnedVerbs,
                        quizDetailsOpt
                    )
                );
            } else if (activeQuiz === 'Match the Words') {
                const data = generateMatchWordQuiz(
                    quizDetailsOpt,
                    learnedVerbs,
                    isTabletOrMobile
                        ? MOBILE_QUESTION_NUMBER
                        : BIG_SCREEN_QUESTION_NUMBER
                );
                setMatchingWords(data);
            } else if (activeQuiz === 'Drag and Drop') {
                setDragDroppQuestions(
                    generateDraggDroppQuiz(learnedVerbs, quizDetailsOpt)
                );
            } else if (activeQuiz === 'Fill the blanks') {
                setWriteQuestions(
                    generateWriteQuiz(
                        learnedVerbs,
                        quizDetailsOpt,
                        isTabletOrMobile
                            ? MOBILE_QUESTION_NUMBER
                            : BIG_SCREEN_QUESTION_NUMBER
                    )
                );
            }
        }
    }, [learnedVerbs, quizDetailsOpt]);

    useEffect(() => {
        if (timeOut && quizDetailsOpt?.withTimer) {
            setQNumber(() => qNumber + 1);
            setTimeOut(false);
        }
    }, [timeOut]);

    //#region Event Handler
    const handleOptionClick = (option: QuizOptions) => {
        setOpenQuizDetailsPopover(true);
        setActiveQuiz(option);
    };

    const handleQuizDetailsClick = (
        questionNumber: number,
        questionType: QuizKeys,
        tense: keyof QuizSection,
        withTimer: boolean,
        timerCount: number
    ) => {
        setQuizDetailsOpt({
            questionNumber,
            questionType,
            withTimer,
            tense,
            timerCount
        });
        setOpenQuizDetailsPopover(false);
        setOpenDialog(true);
    };

    const hanldeDialogClose = () => {
        setOpenDialog(false);
        setQNumber(0);
        setQuizResult({
            correctAnswers: [],
            quizFinished: false,
            wrongAnswers: []
        });
    };

    //#region Render Helper
    const renderMultipleChoice = (): JSX.Element => {
        if (multipleChoiceQustion[qNumber]) {
            return (
                <>
                    {showTimer()}

                    <Trivia
                        question={multipleChoiceQustion[qNumber]}
                        setQuestionNumber={setQNumber}
                        setTimeOut={
                            quizDetailsOpt?.withTimer ? setTimeOut : undefined
                        }
                        setQuizResult={setQuizResult}
                    ></Trivia>
                </>
            );
        } else {
            return renderQuizEnd(quizResult);
        }
    };

    const renderMatchginWordQuiz = (): JSX.Element => {
        if (matchingWords[qNumber]) {
            return (
                <>
                    {showTimer()}

                    <MatchingWordQuiz
                        matchingWords={matchingWords[qNumber]}
                        onQuizFinish={setQNumber}
                        tense={TensesE.presens}
                    ></MatchingWordQuiz>
                </>
            );
        } else {
            return renderQuizEnd();
        }
    };

    const renderDraggDroppQuiz = (): JSX.Element => {
        if (
            dragDroppQuestions[qNumber]?.question &&
            dragDroppQuestions.length
        ) {
            return (
                <>
                    {showTimer()}

                    <DraggQuiz
                        question={dragDroppQuestions[qNumber].question ?? []}
                        definition={dragDroppQuestions[qNumber].question ?? []}
                        mixConj={dragDroppQuestions[qNumber].mixedConj ?? []}
                        setNext={setQNumber}
                    ></DraggQuiz>
                </>
            );
        } else {
            return renderQuizEnd();
        }
    };

    const renderFillTheBlankQuiz = (): JSX.Element => {
        if (writeQuestions[qNumber]) {
            return (
                <>
                    {showTimer()}
                    <WritingQuiz
                        verbList={props.verbList}
                        data={writeQuestions[qNumber]}
                        onQuizFinish={setQNumber}
                    ></WritingQuiz>
                </>
            );
        } else {
            return renderQuizEnd();
        }
    };
    const showTimer = () => {
        if (quizDetailsOpt?.withTimer) {
            return (
                <Timer
                    setTimeOut={setTimeOut}
                    questionNumber={qNumber}
                    timerCount={quizDetailsOpt.timerCount ?? 30}
                />
            );
        }
    };

    const renderQuizEnd = (quizResult?: quizResult): JSX.Element => {
        const handleNewQuizClick = () => {
            setOpenDialog(false);
            setQNumber(0);
            handleOptionClick(activeQuiz ?? 'Multiple Choice');
            setQuizResult({
                correctAnswers: [],
                quizFinished: false,
                wrongAnswers: []
            });
        };

        const handleCloseClick = () => {
            setOpenDialog(false);
            setQuizResult({
                correctAnswers: [],
                quizFinished: false,
                wrongAnswers: []
            });
            setQNumber(0);
            setActiveQuiz(undefined);
        };

        return (
            <div className="quiz-end">
                <span>{t('Page.Quiz.Quiz.End.Txt')}</span>
                <p>
                    {activeQuiz === 'Multiple Choice' &&
                        quizResult?.wrongAnswers?.length &&
                        t('Page.Quiz.Quiz.End.Wrong.Answers.Txt')}
                </p>
                <div className="wrong-answers">
                    {quizResult?.wrongAnswers.map((w) => (
                        <Trivia
                            key={w.question.id}
                            question={w.question}
                            enableClikEvent={true}
                            userAnswer={w.userAnswer}
                        ></Trivia>
                    ))}
                </div>
                <div className="btn-wrapper">
                    <Button type="secondary" onClick={handleCloseClick}>
                        {t('Page.Quiz.Quiz.End.Btn.Close')}
                    </Button>
                    <Button type="primary" onClick={handleNewQuizClick}>
                        {t('Page.Quiz.Quiz.End.Btn.NewQuiz')}
                    </Button>
                </div>
            </div>
        );
    };

    //#region Render
    return (
        <div className="quiz">
            {openDialog &&
            learnedWords?.length > 0 &&
            learnedVerbs?.length > 0 ? (
                <Dialog className="quiz-dialog">
                    <DialogHeader onDismiss={hanldeDialogClose}>
                        <h3>{activeQuiz}</h3>
                    </DialogHeader>
                    <DialogBody>
                        {activeQuiz === 'Multiple Choice' &&
                            renderMultipleChoice()}
                        {activeQuiz === 'Match the Words' &&
                            renderMatchginWordQuiz()}
                        {activeQuiz === 'Drag and Drop' &&
                            renderDraggDroppQuiz()}
                        {activeQuiz === 'Fill the blanks' &&
                            renderFillTheBlankQuiz()}
                    </DialogBody>
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
                    <Popup
                        isOpen={openQuizDetailsPopover}
                        onClose={() => setOpenQuizDetailsPopover(false)}
                    >
                        {activeQuiz && (
                            <QuizDetails
                                activeQuiz={activeQuiz}
                                onQuizDetailsClick={handleQuizDetailsClick}
                            ></QuizDetails>
                        )}
                    </Popup>
                </div>
            )}
        </div>
    );
};
