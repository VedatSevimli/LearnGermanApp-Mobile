import React from 'react';

import { Verb } from '../../../modules/verbs/verbs.type';
import { useNavigate } from 'react-router-dom';

type WordProps = {
    wordData: Verb;
};
export const WordCard: React.FC<WordProps> = ({ wordData }) => {
    const { word, def, isReflexiv, isSeparable, hasAkkObject, hasDativObject } =
        wordData;
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/wordDetails/${word}`);
    };

    return (
        <div className={`word-card`} onClick={handleCardClick}>
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
            </div>
        </div>
    );
};
