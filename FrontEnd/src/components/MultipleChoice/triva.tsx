import React, { useEffect, useState } from 'react';
import { SentenceQuestion } from '../../modules/verbs/verbs.type';

type TrivaProps = {
    data: SentenceQuestion[];
    questionNumber: number;
    setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
    setTimeOut: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Trivia: React.FC<TrivaProps> = ({
    data,
    questionNumber,
    setQuestionNumber,
    setTimeOut
}): JSX.Element => {
    const [questions, setQuestions] = useState<SentenceQuestion>();
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [className, setClassName] = useState('answer');

    useEffect(() => {
        if (data) {
            setQuestions(data[questionNumber - 1]);
        }
    }, [data, questionNumber]);

    const delay = (duration: number, callback: any): void => {
        setTimeout(() => {
            callback();
        }, duration);
    };

    const handleClick = (a: any) => {
        setSelectedAnswer(a);
        setClassName('answer active');
        delay(1000, () => {
            setClassName(a.isCorrect ? 'answer correct' : 'answer wrong');
        });

        delay(1200, () => {
            if (a.isCorrect) {
                delay(1400, () => {
                    setQuestionNumber((prev) => prev + 1);
                    setSelectedAnswer(null);
                });
            } else {
                delay(1400, () => {
                    setTimeOut(true);
                });
            }
        });
    };
    return (
        <div className="trivia">
            <div className="question">{questions?.question}</div>
            <div className="answers">
                {questions?.options.map((question, idx) => (
                    <div
                        key={idx}
                        className={
                            selectedAnswer === question ? className : 'answer'
                        }
                        onClick={() => !selectedAnswer && handleClick(question)}
                    >
                        {question.text}
                    </div>
                ))}
            </div>
        </div>
    );
};
