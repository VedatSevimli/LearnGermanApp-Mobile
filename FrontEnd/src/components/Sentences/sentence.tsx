import React from 'react';
import { Sentence as SentenceI } from '../../modules/verbs/verbs.type';

type SetenceProps = {
    sentence: SentenceI;
};

export const Sentence: React.FC<SetenceProps> = ({ sentence }) => {
    return (
        <div className="sentence-item">
            <p>{sentence.sentence}</p>
            <p>{sentence.def.tr}</p>
        </div>
    );
};
