import React, { useEffect, useState } from 'react';
import { Option, SentenceQuestion } from '../../modules/verbs/verbs.type';

type TrivaProps = {
    data: SentenceQuestion[];
    questionNumber: number;
    setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
    setTimeOut: React.Dispatch<React.SetStateAction<boolean>>;
    setQuizResult: React.Dispatch<
        React.SetStateAction<{
            correctAnswers: number[];
            wrongAnswers: number[];
            quizFinished: boolean;
        }>
    >;
};
export const Trivia: React.FC<TrivaProps> = ({
    data,
    questionNumber,
    setQuestionNumber,
    setTimeOut,
    ...props
}): JSX.Element => {
    const [question, setQuestion] = useState<SentenceQuestion>();
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [className, setClassName] = useState<string>('answer');
    const [quizResult, setQuizResult] = useState<{
        correctAnswers: number[];
        wrongAnswers: number[];
    }>({ correctAnswers: [], wrongAnswers: [] });

    useEffect(() => {
        if (data && data[questionNumber - 1]) {
            setQuestion(data[questionNumber - 1]);
        } else {
            props.setQuizResult(() => ({ ...quizResult, quizFinished: true }));
        }
    }, [data, questionNumber]);

    const delay = (duration: number, callback: () => void): void => {
        setTimeout(() => {
            callback();
        }, duration);
    };

    const handleClick = (question: { option: Option; id: number }) => {
        setSelectedAnswer(question.option.text);
        setClassName('answer active');
        delay(1000, () => {
            setClassName(
                question.option.isCorrect ? 'answer correct' : 'answer wrong'
            );
        });

        delay(1200, () => {
            if (question.option.isCorrect) {
                setQuizResult((prev) => ({
                    ...prev,
                    correctAnswers: [...prev.correctAnswers, question.id]
                }));
                delay(1400, () => {
                    setQuestionNumber((prev) => prev + 1);
                    setSelectedAnswer('');
                });
            } else {
                setQuizResult((prev) => ({
                    ...prev,
                    wrongAnswers: [...prev.wrongAnswers, question.id]
                }));
                delay(1400, () => {
                    setTimeOut(true);
                    setSelectedAnswer('');
                });
            }
        });
    };

    return (
        <div className="trivia">
            <div className="question">{question?.question}</div>
            <div className="answers">
                {question ? (
                    question?.options.map((option, idx) => (
                        <div
                            key={idx}
                            className={
                                selectedAnswer === option.text
                                    ? className
                                    : 'answer'
                            }
                            onClick={() =>
                                !selectedAnswer &&
                                handleClick({ option: option, id: question.id })
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
