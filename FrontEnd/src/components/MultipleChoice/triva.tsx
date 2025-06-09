import React, { useState } from 'react';
import { Option, Question } from '../../modules/verbs/verbs.type';
import { quizResult } from './multipleChoice';
import './triva.scss';

type TrivaProps = {
    setQuestionNumber?: React.Dispatch<React.SetStateAction<number>>;
    setTimeOut?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
    setQuizResult?: React.Dispatch<React.SetStateAction<quizResult>>;
    question: Question;
    enableClikEvent?: boolean;
    userAnswer?: number;
};
export const Trivia: React.FC<TrivaProps> = ({
    question,
    setQuestionNumber,
    setTimeOut,
    setQuizResult,
    ...props
}): JSX.Element => {
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [className, setClassName] = useState<string>('answer');

    const delay = (duration: number, callback: () => void): void => {
        setTimeout(() => {
            callback();
        }, duration);
    };

    const handleClick = (_question: {
        option: Option;
        id: number;
        optionId: number;
    }) => {
        setSelectedAnswer(_question.option.text);
        setClassName('answer active');
        delay(1000, () => {
            setClassName(
                _question.option.isCorrect ? 'answer correct' : 'answer wrong'
            );
        });

        delay(1200, () => {
            if (_question.option.isCorrect) {
                setQuizResult?.((prev) => ({
                    ...prev,
                    correctAnswers: [...prev.correctAnswers, _question.id]
                }));
                delay(1400, () => {
                    setQuestionNumber?.((prev) => prev + 1);
                    setSelectedAnswer('');
                });
            } else {
                setQuizResult?.((prev) => ({
                    ...prev,
                    wrongAnswers: [
                        ...prev.wrongAnswers,
                        { question: question, userAnswer: _question.optionId }
                    ]
                }));
                delay(1400, () => {
                    setTimeOut
                        ? setTimeOut(true)
                        : setQuestionNumber?.((prev) => prev + 1);
                    setSelectedAnswer('');
                });
            }
        });
    };

    if (!question?.question) {
        return <></>;
    }

    return (
        <div className="trivia">
            <div className="question">{question?.question}</div>
            <div className="answers">
                {question ? (
                    question?.options.map((option, idx) => (
                        <div
                            key={idx}
                            className={`${
                                selectedAnswer === option.text
                                    ? className
                                    : 'answer'
                            } ${
                                option.isCorrect && props.enableClikEvent
                                    ? 'answer correct'
                                    : ''
                            } ${props.userAnswer === idx ? 'wrong' : ''}`}
                            onClick={() =>
                                !selectedAnswer &&
                                !props.enableClikEvent &&
                                handleClick({
                                    option: option,
                                    id: question.id,
                                    optionId: idx
                                })
                            }
                        >
                            {option.text}
                        </div>
                    ))
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};
