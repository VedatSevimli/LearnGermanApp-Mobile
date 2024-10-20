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
// import {
//     generateDraggDroppQuiz,
//     generateMatchWordQuiz,
//     generateMultChoiceQuests
// } from './quizUtils';
import { DraggQuiz } from '../../DraggDropp/dragDropp';
import { Timer } from '../../MultipleChoice/timer';
import { useMediaQuery } from 'react-responsive';
import { QuizDetails } from './quizDetails';

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

export const Quiz: React.FC<QuizProps> = (props): JSX.Element => {
    //#region MiscHook
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
    const [openQuizDetailsPopover, setOpenQuizDetailsPopover] =
        useState<boolean>(false);
    const [quizDetailsOpt, setQuizDetailsOpt] = useState<QuizDetailsOptions>();

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
                // setMultipleChoiceQustion(
                //     // generateMultChoiceQuests(
                //     //     props.verbList,
                //     //     learnedVerbs,
                //     //     quizDetailsOpt
                //     // )
                // );
            } else if (activeQuiz === 'Match the Words') {
                // const data = generateMatchWordQuiz(
                //     quizDetailsOpt,
                //     learnedVerbs,
                //     isTabletOrMobile ? 6 : 10
                // );
                // setMatchingWords(data);
            } else if (activeQuiz === 'Drag and Drop') {
                // setDragDroppQuestions(
                //      generateDraggDroppQuiz(learnedVerbs, quizDetailsOpt)
                // );
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

    //#region Render Helper
    const renderMultipleChoice = (): JSX.Element => {
        return (
            <>
                {showTimer()}
                <Trivia
                    question={multipleChoiceQustion[qNumber]}
                    setQuestionNumber={setQNumber}
                    setTimeOut={setTimeOut}
                ></Trivia>
            </>
        );
    };

    const renderMatchginWordQuiz = () => {
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
        }
    };

    const renderDraggDroppQuiz = () => {
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

    //#region Render
    return (
        <div className="quiz">
            {openDialog &&
            learnedWords?.length > 0 &&
            learnedVerbs?.length > 0 ? (
                <Dialog className="quiz-dialog">
                    <DialogHeader onDismiss={() => setOpenDialog(false)}>
                        <h3>{activeQuiz}</h3>
                    </DialogHeader>
                    <DialogBody>
                        {activeQuiz === 'Multiple Choice' &&
                            renderMultipleChoice()}
                        {activeQuiz === 'Match the Words' &&
                            renderMatchginWordQuiz()}
                        {activeQuiz === 'Drag and Drop' &&
                            renderDraggDroppQuiz()}
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
