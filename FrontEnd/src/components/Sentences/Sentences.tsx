import React from 'react';
import './Sentences.scss';
import { Sentences } from '../../modules/verbs/verbs.type';
import { useNavigate } from 'react-router-dom';

export type SentencesComponentProps = {
    sentencesData: Sentences;
    word: string;
};

export enum quizOptE {
    Question = 'Question',
    DragDrop = 'DragDrop',
    MatchWords = 'MatchWords'
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
                        <div key={index} className="sentence-item">
                            <p>{sentence.sentence}</p>
                            <p>{sentence.def.tr}</p>
                        </div>
                    ))}
                    {pastTense.map((sentence, index) => (
                        <div key={index} className="sentence-item">
                            <p>{sentence.sentence}</p>
                            <p>{sentence.def.tr}</p>
                        </div>
                    ))}
                    {perfect.map((sentence, index) => (
                        <div key={index} className="sentence-item">
                            <p>{sentence.sentence}</p>
                            <p>{sentence.def.tr}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
