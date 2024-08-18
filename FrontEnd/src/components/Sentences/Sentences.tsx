import React from 'react';
import './Sentences.scss';
import { Sentences } from '../../modules/verbs/verbs.type';
import { useNavigate } from 'react-router-dom';
import { Sentence } from './sentence';

export type SentencesComponentProps = {
    sentencesData: Sentences;
    word: string;
};

export enum quizOptE {
    MultipleChoice = 'MultipleChoice',
    DragDrop = 'DragDrop',
    MatchWords = 'MatchWords',
    LearnMode = 'LearnMode'
}

export const SentencesComponent: React.FC<SentencesComponentProps> = ({
    sentencesData
}): JSX.Element => {
    const { presens, pastTense, perfect } = sentencesData;

    return (
        <div className="sentence-component">
            <div className="sentence-section">
                <h2>Sentences</h2>
                <div className="sentence-list">
                    {presens.map((sentence, index) => (
                        <Sentence key={index} sentence={sentence}></Sentence>
                    ))}
                    {pastTense.map((sentence, index) => (
                        <Sentence key={index} sentence={sentence}></Sentence>
                    ))}
                    {perfect.map((sentence, index) => (
                        <Sentence key={index} sentence={sentence}></Sentence>
                    ))}
                </div>
            </div>
        </div>
    );
};
