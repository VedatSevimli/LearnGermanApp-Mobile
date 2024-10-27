import React, { useEffect, useState } from 'react';

import './multipleChoice.scss';
import { generateQuiz } from '../../utils/util';
import {
    SentencesAndConjugation,
    TensesE,
    Verb,
    Question,
    Quiz
} from '../../modules/verbs/verbs.type';
import { Timer } from './timer';
import { Trivia } from './triva';

export type MultipleChoiceProps = {
    verb?: Verb | undefined;
    verbList: Verb[];
    tense: TensesE;
    questionType: SentencesAndConjugation;
    showTimer?: boolean;
    mixedQuestions?: Question[];
    onQuizFinsih?: (quizResult?: quizResult) => void;
};
export type quizResult = {
    correctAnswers: number[];
    wrongAnswers: { question: Question; userAnswer: number }[];
    quizFinished: boolean;
};
export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
    questionType,
    tense,
    ...props
}): JSX.Element => {
    const [quiz] = useState<Quiz | undefined>(() => {
        if (!props.mixedQuestions) {
            const definitions = props.verbList?.map((verb) => verb.def.tr);
            const quiz = props.verb && generateQuiz(props.verb, definitions);
            return quiz?.quizQuestions;
        }
    });
    const [timeOut, setTimeOut] = useState<boolean>(false);
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [quizResult, setQuizResult] = useState<quizResult>({
        correctAnswers: [],
        wrongAnswers: [],
        quizFinished: false
    });

    useEffect(() => {
        if (timeOut) {
            setQuestionNumber(() => questionNumber + 1);
            setTimeOut(false);
        }
    }, [timeOut]);

    useEffect(() => {
        if (
            (quiz && !quiz?.[questionType]?.[tense]?.[questionNumber - 1]) ||
            (props.mixedQuestions && props.mixedQuestions?.[questionNumber - 1])
        ) {
            setQuizResult({ ...quizResult, quizFinished: true });
            props.onQuizFinsih?.(quizResult);
        }
    }, [questionNumber]);

    return (
        <div className="question-quiz">
            <div className="top">
                {!quizResult.quizFinished && (
                    <Timer
                        setTimeOut={setTimeOut}
                        questionNumber={questionNumber}
                    />
                )}
            </div>
            <div className="bottom">
                {quiz?.[questionType][tense]?.[questionNumber - 1] &&
                    !quizResult.quizFinished && (
                        <Trivia
                            question={
                                quiz[questionType][tense]?.[
                                    questionNumber - 1
                                ] as Question
                            }
                            setQuestionNumber={setQuestionNumber}
                            setTimeOut={setTimeOut}
                            setQuizResult={setQuizResult}
                        />
                    )}
                {props.mixedQuestions && (
                    <Trivia
                        setQuestionNumber={setQuestionNumber}
                        question={props.mixedQuestions[questionNumber - 1]}
                    ></Trivia>
                )}
                {quizResult.quizFinished && (
                    <div className="quizResult">
                        <span>
                            Richtig geantwortete Fragen :
                            {quizResult.correctAnswers.length}
                        </span>
                        <span>
                            Falsch geantwortete Fragen :
                            {quizResult.wrongAnswers.length}
                        </span>
                        <div
                            className="wrong-answer-review"
                            style={{ display: 'flex' }}
                        >
                            {quizResult.wrongAnswers.map((wa) => (
                                <Trivia
                                    key={wa.question.id}
                                    question={wa.question}
                                    enableClikEvent={true}
                                    userAnswer={wa.userAnswer}
                                ></Trivia>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
