import React from 'react';
import { QuizOptions } from '../../../config/configProps';

type QuizoptionP = {
    option: QuizOptions;
    onClick: (option: QuizOptions) => void;
};
export const Quizoption: React.FC<QuizoptionP> = (
    props: QuizoptionP
): JSX.Element => {
    return (
        <>
            <div
                className="quiz-opt"
                onClick={() => props.onClick(props.option)}
            >
                <span>{props.option}</span>
            </div>
        </>
    );
};
