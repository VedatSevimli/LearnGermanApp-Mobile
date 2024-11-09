import React, { useState } from 'react';
import './quizDetails.scss';
import { Button } from '../../Button/button';
import {
    Quiz,
    QuizKeys,
    QuizSection,
    TensesE
} from '../../../modules/verbs/verbs.type';
import { QuestionType } from './Quiz';
import { QuizOptions } from '../../../config/configProps';
import { useTranslation } from 'react-i18next';

type quizDetailsP = {
    activeQuiz: QuizOptions;
    onQuizDetailsClick: (
        questionNumber: number,
        questionType: QuestionType,
        tense: keyof QuizSection,
        withTimer: boolean,
        timerCount: number
    ) => void;
};
export const QuizDetails: React.FC<quizDetailsP> = ({
    onQuizDetailsClick,
    activeQuiz
}: quizDetailsP) => {
    const { t } = useTranslation();

    const [questionNumber, setQuestionNumber] = useState(5);
    const [questionType, setQuestionType] =
        useState<QuestionType>('conjugation');
    const [tense, setTense] = useState<keyof QuizSection>('presens');
    const [withTimer, setWithTimer] = useState<boolean>(false);

    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(30);

    const handleMinutesChange = (amount: number) => {
        setMinutes((prev) => Math.max(0, prev + amount));
    };

    const handleSecondsChange = (amount: number) => {
        setSeconds((prev) => {
            if (prev + amount >= 60) {
                handleMinutesChange(1);
                return 0;
            } else if (prev + amount < 0 && minutes > 0) {
                handleMinutesChange(-1);
                return 59;
            }
            return Math.max(0, prev + amount);
        });
    };

    const handleMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setMinutes(value);
    };

    const handleSecondsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
        setSeconds(value);
    };

    const handleOptionChange = () => {
        const time = minutes * 60 + seconds;
        onQuizDetailsClick(
            questionNumber,
            questionType,
            tense,
            withTimer,
            time
        );
    };

    return (
        <div className="quiz-options">
            <h2 className="quiz-options__title">
                {t('Page.Quiz.Quiz.QuizDetails.Settings.Header')}
            </h2>

            <div className="quiz-options__group">
                <label htmlFor="question-number">
                    {t('Page.Quiz.Quiz.QuizDetails.Settings.Question.Count')}
                </label>
                <button
                    className="quiz-options__btn"
                    onClick={() => setQuestionNumber((prev) => prev - 1)}
                >
                    -
                </button>
                <input
                    id="question-number"
                    type="number"
                    value={questionNumber}
                    onChange={(e) => setQuestionNumber(Number(e.target.value))}
                    className="quiz-options__input"
                />
                <button
                    className="quiz-options__btn"
                    onClick={() => setQuestionNumber((prev) => prev + 1)}
                >
                    +
                </button>
            </div>

            <div className="quiz-options__group">
                <label>
                    {t('Page.Quiz.Quiz.QuizDetails.Settings.QuestionType')}
                </label>
                <select
                    value={questionType}
                    onChange={(e) =>
                        setQuestionType(
                            e.target.value.toLowerCase() as QuizKeys
                        )
                    }
                    className="quiz-options__select"
                >
                    <option value="sentences">
                        {t('Page.Quiz.Quiz.QuizDetails.Settings.Sentences')}
                    </option>
                    <option value="conjugation">
                        {t('Page.Quiz.Quiz.QuizDetails.Settings.Conjugation')}
                    </option>
                    {activeQuiz !== 'Drag and Drop' && (
                        <option value="both">
                            {t('Page.Quiz.Quiz.QuizDetails.Settings.Mixed')}
                        </option>
                    )}
                </select>
            </div>

            <div className="quiz-options__group">
                <label>
                    Tensees:{t('Page.Quiz.Quiz.QuizDetails.Settings.Tense')}
                </label>
                <select
                    value={tense}
                    onChange={(e) => setTense(e.target.value as TensesE)}
                    className="quiz-options__select"
                >
                    <option value="presens">
                        {t('Page.Quiz.Quiz.QuizDetails.Tense.Presens')}
                    </option>
                    <option value="perfect">
                        {t('Page.Quiz.Quiz.QuizDetails.Tense.Perfect')}
                    </option>
                    <option value="pastTense">
                        {t('Page.Quiz.Quiz.QuizDetails.Tense.Past')}
                    </option>
                </select>
            </div>

            <div className="quiz-options__group">
                <label>{t('Page.Quiz.Quiz.QuizDetails.Settings.Timer')}</label>
                <div className="quiz-options__switch">
                    <input
                        type="checkbox"
                        id="with-timer"
                        checked={withTimer}
                        onChange={() => {
                            setWithTimer(!withTimer);
                        }}
                    />
                    <label
                        htmlFor="with-timer"
                        className="quiz-options__slider"
                    ></label>
                </div>
            </div>

            {withTimer && (
                <div className="quiz-options__group">
                    <div className="quiz-options__timer">
                        <label>
                            {t('Page.Quiz.Quiz.QuizDetails.Settings.SetTimer')}
                        </label>
                        <div className="quiz-options__timer-controls">
                            <div className="quiz-options__time-unit">
                                <button
                                    className="quiz-options__btn"
                                    onClick={() => handleMinutesChange(-1)}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={minutes}
                                    onChange={handleMinutesInput}
                                    className="quiz-options__input"
                                />
                                <button
                                    className="quiz-options__btn"
                                    onClick={() => handleMinutesChange(1)}
                                >
                                    +
                                </button>

                                <span>
                                    {t(
                                        'Page.Quiz.Quiz.QuizDetails.Settings.Timer.Min'
                                    )}
                                </span>
                            </div>

                            <div className="quiz-options__time-unit">
                                <button
                                    className="quiz-options__btn"
                                    onClick={() => handleSecondsChange(-1)}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={seconds}
                                    onChange={handleSecondsInput}
                                    className="quiz-options__input"
                                />
                                <button
                                    className="quiz-options__btn"
                                    onClick={() => handleSecondsChange(1)}
                                >
                                    +
                                </button>

                                <span>
                                    {t(
                                        'Page.Quiz.Quiz.QuizDetails.Settings.Timer.Secnd'
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="quiz-options__group">
                <div className="quiz-options__start">
                    <Button type="primary" onClick={handleOptionChange}>
                        {t('Page.Quiz.Quiz.QuizDetails.Settings.Button.Start')}{' '}
                        Start
                    </Button>
                </div>
            </div>
        </div>
    );
};
