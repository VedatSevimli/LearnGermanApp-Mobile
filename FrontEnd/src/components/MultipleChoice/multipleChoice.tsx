import React, { useEffect, useState } from 'react';

import './multipleChoice.scss';
import { generateQuiz } from '../../utils/util';
import {
    QuizKeys,
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
};

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
    questionType,
    tense,
    ...props
}): JSX.Element => {
    const [questions, setQuestion] = useState<Verb>();
    const [timeOut, setTimeOut] = useState<boolean>(false);
    const [questionNumber, setQuestionNumber] = useState<number>(1); //TODO if the last question is answered then should be shwon istatistic

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

    return (
        <div className="question-quiz">
            <div className="top">
                <Timer
                    setTimeOut={setTimeOut}
                    questionNumber={questionNumber}
                />
            </div>
            <div className="bottom">
                {questions?.quiz && (
                    <Trivia
                        data={
                            questions?.quiz[`${questionType}Questions`][tense]
                        }
                        questionNumber={questionNumber}
                        setQuestionNumber={setQuestionNumber}
                        setTimeOut={setTimeOut}
                    />
                )}
            </div>
        </div>
    );
};
