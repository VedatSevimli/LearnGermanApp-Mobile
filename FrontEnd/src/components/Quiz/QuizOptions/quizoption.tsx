import React from 'react';
import { QuizOptions } from '../../../config/configProps';
import { dragg_dropp } from '../../../images/image';

type QuizoptionP = {
    option: QuizOptions;
    imgSrc: string;
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
                <img src={props.imgSrc} alt="" />
                <span>{props.option}</span>
            </div>
        </>
    );
};
