import React from 'react';

import { Verb } from '../../../../modules/verbs/verbs.type';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../ProgressBar/progressBar';

type WordProps = {
    wordData: Verb;
    classes: string[];
};
export const WordCard: React.FC<WordProps> = ({ wordData, classes }) => {
    const {
        word,
        def,
        isReflexiv,
        isSeparable,
        hasAkkObject,
        hasDativObject,
        isModalVerb
    } = wordData;
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/wordDetails/${word}`);
    };

    return (
        <div
            className={`word-card ${
                isModalVerb ? 'modal-verb' : ''
            } ${classes.join(' ')}`}
            onClick={handleCardClick}
        >
            <h2>{word}</h2>
            <p>{def?.tr}</p>
            <p>{def?.en}</p>
            <div className="bottom-section">
                {hasAkkObject && (
                    <div className="info-label info-label-akk">
                        Has Akk Object
                    </div>
                )}
                {hasDativObject && (
                    <div className="info-label info-label-dativ">
                        Has Dativ Object
                    </div>
                )}
                {isReflexiv && (
                    <div className="info-label info-label-reflexiv">
                        Reflexiv
                    </div>
                )}
                {isSeparable && (
                    <div className="info-label info-label-separable">
                        Separable
                    </div>
                )}
                {isModalVerb && (
                    <div className="info-label info-label-modal">
                        Modal Verb
                    </div>
                )}
            </div>
            <div className="progress-bar-wrapper">
                <ProgressBar
                    percentage={classes.includes('disable') ? 0 : 80}
                />
            </div>
        </div>
    );
};
