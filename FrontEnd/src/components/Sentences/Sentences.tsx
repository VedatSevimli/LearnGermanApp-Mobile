import React from 'react';
import './Sentences.scss';
import { Sentences } from '../modules/verbs/verbs.type';
export type SentencesComponentProps = {
    sentencesData: Sentences;
};

export const SentencesComponent: React.FC<SentencesComponentProps> = (
    props
): JSX.Element => {
    const { presens, pastTense, perfect } = props.sentencesData;

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
            <div className="quiz-section">
                <h2>Quiz Options</h2>
                <div className="quiz-options">
                    <div className="quiz-option">Quiz with Questions</div>
                    <div className="quiz-option">Drag and Drop</div>
                    <div className="quiz-option">Match the Words</div>
                </div>
            </div>
        </div>
    );
};
