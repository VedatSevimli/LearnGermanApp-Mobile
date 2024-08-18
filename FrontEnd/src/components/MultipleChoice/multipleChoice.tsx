import React, { useEffect, useState } from 'react';

import './multipleChoice.scss';
import { generateQuiz } from '../../utils/util';
import {
    SentencesAndConjugation,
    TensesE,
    Verb
} from '../../modules/verbs/verbs.type';
import { Timer } from './timer';
import { Trivia } from './triva';

export type MultipleChoiceProps = {
    verb: Verb;
    verbList: Verb[];
    tense: TensesE;
    questionType: SentencesAndConjugation;
    onQuizFinsih?: (quizResult?: quizResult) => void;
};
export type quizResult = {
    correctAnswers: number[];
    wrongAnswers: number[];
    quizFinished: boolean;
};
export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
    questionType,
    tense,
    ...props
}): JSX.Element => {
    const [questions, setQuestion] = useState<Verb>();
    const [timeOut, setTimeOut] = useState<boolean>(false);
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [quizResult, setQuizResult] = useState<{
        correctAnswers: number[];
        wrongAnswers: number[];
        quizFinished: boolean;
    }>({ correctAnswers: [], wrongAnswers: [], quizFinished: false });

    useEffect(() => {
        if (props.verb) {
            const definitions = props?.verbList?.map((w) => {
                return w.def.tr;
            });
            const quiz = generateQuiz(props.verb, definitions);
            setQuestion(quiz);
        }
    }, [props.verb]);

    useEffect(() => {
        if (timeOut) {
            setQuestionNumber(() => questionNumber + 1);
            setTimeOut(false);
        }
    }, [timeOut]);

    useEffect(() => {
        if (quizResult.quizFinished) {
            props.onQuizFinsih?.(quizResult);
        }
    }, [quizResult.quizFinished]);

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
                {questions?.quiz?.[questionType][tense] &&
                    !quizResult.quizFinished && (
                        <Trivia
                            data={questions.quiz[questionType][tense] ?? []}
                            questionNumber={questionNumber}
                            setQuestionNumber={setQuestionNumber}
                            setTimeOut={setTimeOut}
                            setQuizResult={setQuizResult}
                        />
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
                    </div>
                )}
            </div>
        </div>
    );
};
