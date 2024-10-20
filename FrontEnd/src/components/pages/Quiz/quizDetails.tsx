import React, { useState } from 'react';
import './quizDetails.scss';
import { QuizKeys, QuizSection } from '../../../modules/verbs/verbs.type';
import { QuizOptions } from '../../../config/configProps';
import { QuestionType } from './Quiz';
import { Button } from '../../Button/button';

type QuizDetailsP = {
    activeQuiz: QuizOptions;
    onQuizDetailsClick: (
        questionNumber: number,
        questionType: QuizKeys,
        tense: keyof QuizSection,
        withTimer: boolean,
        timerCount: number
    ) => void;
};

export const QuizDetails: React.FC<QuizDetailsP> = ({
    onQuizDetailsClick
}: QuizDetailsP) => {
    const [questionNumber, setQuestionNumber] = useState(5); // default question number
    const [questionType, setQuestionType] = useState<QuestionType>('sentences'); // default question type
    const [withTimer, setWithTimer] = useState(false); // default timer setting

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const handleMinutesChange = (amount: number) => {
        setMinutes((prev) => Math.max(0, prev + amount));
    };

    // Function to handle increasing and decreasing seconds
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

    // Function to handle manual input for minutes
    const handleMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setMinutes(value);
    };

    // Function to handle manual input for seconds
    const handleSecondsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
        setSeconds(value);
    };

    const handleOptionChange = () => {
        // Update the options in parent component
        const timerCount = minutes * 60 + seconds;
        onQuizDetailsClick(
            questionNumber,
            questionType,
            'presens',
            withTimer,
            timerCount
        );
    };

    return (
        <div className="quiz-options">
            <h2 className="quiz-options__title">Quiz Settings</h2>

            <div className="quiz-options__group">
                <label htmlFor="question-number">Number of Questions:</label>
                <input
                    type="number"
                    id="question-number"
                    value={questionNumber}
                    onChange={(e) => setQuestionNumber(Number(e.target.value))}
                    className="quiz-options__input"
                />
            </div>

            <div className="quiz-options__group">
                <label>Question Type:</label>
                <select
                    value={questionType}
                    onChange={(e) =>
                        setQuestionType(e.target.value as QuestionType)
                    }
                    className="quiz-options__select"
                >
                    <option value="sentences">Sentence</option>
                    <option value="conjugation">Conjugation</option>
                    <option value="mixed">Mixed</option>
                </select>
            </div>

            <div className="quiz-options__group">
                <label>With Timer:</label>
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
                <div className="quiz-options__timer">
                    <label>Set Timer:</label>
                    <div className="quiz-options__timer-controls">
                        <div className="quiz-options__time-unit">
                            <button
                                className="quiz-options__btn"
                                onClick={() => handleMinutesChange(1)}
                            >
                                +
                            </button>
                            <input
                                type="number"
                                value={minutes}
                                onChange={handleMinutesInput}
                                className="quiz-options__input"
                            />
                            <button
                                className="quiz-options__btn"
                                onClick={() => handleMinutesChange(-1)}
                            >
                                -
                            </button>
                            <span>min</span>
                        </div>

                        <div className="quiz-options__time-unit">
                            <button
                                className="quiz-options__btn"
                                onClick={() => handleSecondsChange(1)}
                            >
                                +
                            </button>
                            <input
                                type="number"
                                value={seconds}
                                onChange={handleSecondsInput}
                                className="quiz-options__input"
                            />
                            <button
                                className="quiz-options__btn"
                                onClick={() => handleSecondsChange(-1)}
                            >
                                -
                            </button>
                            <span>sec</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="quiz-options__group">
                <label>With Timer:</label>
                <div className="quiz-options__accept">
                    <Button type="primary" onClick={handleOptionChange}>
                        Start Quiz
                    </Button>
                    <label
                        htmlFor="with-timer"
                        className="quiz-options__accept"
                    ></label>
                </div>
            </div>
        </div>
    );
};
