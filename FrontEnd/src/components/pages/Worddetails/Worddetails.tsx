import React, { useEffect, useState } from 'react';

import './Worddetails.scss';
import { ConjugationTable } from '../../Table/Table';
import { getWord } from '../../../API/VerbList/verb';
import {
    SentencesAndConjugation,
    TensesE,
    Verb
} from '../../../modules/verbs/verbs.type';
import { useParams } from 'react-router-dom';
import { SentencesComponent, quizOptE } from '../../Sentences/Sentences';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
import { QuizSections } from './QuizSections/quizSections';
import {
    MultipleChoice,
    quizResult
} from '../../MultipleChoice/multipleChoice';
import { defaultConfig } from '../../../config/defaultConfig';
import Dialog from '../../Dialog/dialog';
import DialogHeader from '../../Dialog/DialogHeader/dialogHeader';
import DialogBody from '../../Dialog/DialogBody/dialogBody';
import { DraggQuiz } from '../../DraggDropp/dragDropp';
import MatchingWordQuiz from '../../matchingWordQuiz/MatchingWordQuiz';
import { Trivia } from '../../MultipleChoice/triva';
import { saveUserProccess } from '../../../API/Login/login';
import { useUser } from '../../../context/userContext/userContext';
import { setSeo } from '../../../utils/seo';

type VerbDetailsP = {
    verbList: Verb[];
};
export const VerbDetails: React.FC<VerbDetailsP> = ({
    verbList
}): JSX.Element => {
    const { userData } = useUser();

    const { word } = useParams();
    const { learnMode } = defaultConfig();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [activeQuiz, setActiveQuiz] = useState<quizOptE>(
        quizOptE.MultipleChoice
    );
    const [verb, setVerb] = useState<Verb>({} as Verb);
    const [isLoading, setIsLoading] = useState(true);
    const [showSentences, setShowSentences] = useState(() => {
        return !!userData?.progress.find((p) => p.word === word);
    });
    const [options, setOptions] = useState<{
        QuestionType: SentencesAndConjugation;
        tense: TensesE;
        quizOpt: quizOptE;
    }>({
        QuestionType: 'conjugation',
        quizOpt: quizOptE.MultipleChoice,
        tense: TensesE.presens
    });
    const [qnumber, setQNumber] = useState<number>(0);

    const [isLearnModeActive, setIsLearnModeActive] = useState<boolean>(false);
    const [learnModeQnumber, setLearnModeQnumber] = useState<number>(0);
    const [quizResult, setQuizResult] = useState<quizResult[]>([]);
    const [isQuizFinsihed, setIsQuizFinsihed] = useState<boolean>();

    useEffect(() => {
        const getVerbList = async (): Promise<void> => {
            try {
                setIsLoading(true);
                const verb = await getWord({ word: word as string });
                setVerb(verb);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        void getVerbList();
    }, [word]);

    useEffect(() => {
        setSeo(
            `Deutsch-Turkish App - ${verb.word}`,
            `${verb.word} Konjugation Übungen`
        );
    }, [verb]);

    useEffect(() => {
        if (quizResult && isQuizFinsihed) {
            const updateVerbLearnProgress = async (
                word: string,
                quizResult: quizResult[]
            ) => {
                const correctAnswers = quizResult
                    .map((q) => q.correctAnswers)
                    .flat().length;
                const wrongAnswers = quizResult
                    .map((q) => q.wrongAnswers)
                    .flat()
                    .map((_, i) => i).length;

                const totalUniqueQuestions = correctAnswers + wrongAnswers;
                const wrongScore = wrongAnswers * 0.34;
                const weightedScore = correctAnswers + wrongScore;
                const progressPercentage =
                    (weightedScore / totalUniqueQuestions) * 100;

                await saveUserProccess({
                    email: userData?.email ?? '',
                    word,
                    progressValue: progressPercentage.toFixed(1),
                    wrongAnswers: quizResult.map((q) => q.wrongAnswers).flat()
                });
            };
            userData && void updateVerbLearnProgress(verb.word, quizResult);
        }
    }, [isQuizFinsihed]);

    const handleQuizoptClick = (
        QuestionType: SentencesAndConjugation,
        tense: TensesE,
        quizOpt: quizOptE
    ) => {
        setOptions({ QuestionType, quizOpt, tense });
        handleOptionClick(quizOpt);
    };

    const generateMatchingWords = () => {
        return verb.conjugation[options.tense]?.map((c) => {
            const [word, def, def2] = c.split(' ');
            return {
                word,
                def: `${def ?? ''} ${def2 ?? ''}`
            };
        });
    };

    const handleQuizFinsih = (quizResult?: quizResult) => {
        if (isLearnModeActive && learnMode[learnModeQnumber + 1]) {
            setActiveQuiz(learnMode[learnModeQnumber + 1].quizOpt);
            setOptions({ ...learnMode[learnModeQnumber + 1] });
            setLearnModeQnumber((prev) => ++prev);
        } else {
            setIsQuizFinsihed(true);
        }
        if (quizResult) {
            setQuizResult((prev) => [
                ...prev,
                {
                    ...quizResult,
                    questionType: options.QuestionType,
                    tense: options.tense
                }
            ]);
        }
    };

    const renderActiveQuiz = (activeQuiz: quizOptE) => {
        if (activeQuiz === quizOptE.MultipleChoice) {
            return (
                <MultipleChoice
                    verb={verb}
                    verbList={verbList}
                    tense={options.tense}
                    questionType={options.QuestionType}
                    onQuizFinsih={handleQuizFinsih}
                    showTimer={false}
                />
            );
        } else if (activeQuiz === quizOptE.MatchWords) {
            return (
                <MatchingWordQuiz
                    matchingWords={generateMatchingWords() ?? []}
                    tense={options.tense}
                    onQuizFinish={() => handleQuizFinsih()}
                ></MatchingWordQuiz>
            );
        } else if (activeQuiz === quizOptE.DragDrop) {
            if (options.QuestionType === 'conjugation') {
                const question =
                    verb[options.QuestionType][options.tense]?.[qnumber];
                const mixedConjuction =
                    verb[options.QuestionType][options.tense]?.map(
                        (w: string) => w.split(' ')[1]
                    ) ?? [];
                if (!question) {
                    handleQuizFinsih();
                    setQNumber(0);
                }
                return (
                    question && (
                        <DraggQuiz
                            key={qnumber}
                            question={question ?? ''}
                            mixConj={mixedConjuction ?? []}
                            definition={verb.def.tr}
                            setNext={setQNumber}
                        ></DraggQuiz>
                    )
                );
            }
            const sentence =
                verb[options.QuestionType][options.tense]?.[qnumber];
            if (!sentence) {
                handleQuizFinsih();
                setQNumber(0);
            }
            return (
                sentence && (
                    <DraggQuiz
                        key={qnumber}
                        question={sentence.sentence ?? ''}
                        definition={sentence.def?.tr ?? ''}
                        mixConj={[]}
                        setNext={setQNumber}
                    ></DraggQuiz>
                )
            );
        }

        return <></>;
    };

    const handleOptionClick = (option: quizOptE) => {
        setActiveQuiz(option);
        setOpenDialog(true);
    };

    const handleLearnModeClick = () => {
        setIsLearnModeActive(true);
        setActiveQuiz(learnMode[learnModeQnumber].quizOpt);
        setOptions({
            ...learnMode[learnModeQnumber]
        });
        setOpenDialog(true);
    };

    if (isLoading && !verb) {
        return <LoadingOverlay />;
    }

    const renderLearnedResult = (): JSX.Element => {
        return (
            <div className="result">
                <div className="result-content">
                    Sie haben den Verb gelernt. Gratulation!!!!
                </div>
                <span>weiter lernen</span>
                <div className="wrong-answer-review">
                    {quizResult
                        .map((qr) => ({ wrongAnswers: qr.wrongAnswers }))
                        .map((wa) => {
                            return wa.wrongAnswers.map((w) => (
                                <Trivia
                                    key={w.question.id}
                                    question={w.question}
                                    enableClikEvent={true}
                                    userAnswer={w.userAnswer}
                                ></Trivia>
                            ));
                        })}
                </div>
            </div>
        );
    };

    return (
        <div className="verb-details">
            <h2>Verb Details</h2>
            <div className="conjugation-section">
                <h3>Konjugationen</h3>
                <div className="conjugation-content">
                    <ConjugationTable
                        tense="Präsens"
                        conjugations={verb?.conjugation?.presens}
                        isSeparable={verb?.isSeparable}
                    />
                    {verb?.word === 'sein' || verb?.word === 'haben' ? (
                        <ConjugationTable
                            tense="Präteritum"
                            conjugations={verb?.conjugation?.pastTense}
                            isSeparable={verb?.isSeparable}
                        />
                    ) : (
                        <ConjugationTable
                            tense="Perfekt"
                            conjugations={verb?.conjugation?.perfect}
                            isSeparable={true}
                        />
                    )}
                </div>
            </div>
            {showSentences && (
                <div className="sentences-section">
                    <h3>Sätze</h3>
                    <div className="sentences">
                        <div className="sentence">
                            {verb.sentences && (
                                <SentencesComponent
                                    sentencesData={verb.sentences}
                                    word={verb.word}
                                ></SentencesComponent>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {
                <div className="bottom-container">
                    <QuizSections
                        onQuizoptClick={handleQuizoptClick}
                        onLearnModeClick={handleLearnModeClick}
                        showQuizOptions={showSentences}
                    />
                </div>
            }
            {openDialog && (
                <Dialog className="quiz-dialog">
                    <DialogHeader onDismiss={() => setOpenDialog(false)}>
                        <h3>{activeQuiz}</h3>
                    </DialogHeader>
                    <DialogBody>
                        {isQuizFinsihed && isLearnModeActive
                            ? renderLearnedResult()
                            : renderActiveQuiz(activeQuiz)}
                    </DialogBody>
                </Dialog>
            )}
        </div>
    );
};
